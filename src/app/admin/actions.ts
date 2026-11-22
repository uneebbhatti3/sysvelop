"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth, requireAdmin } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { enquiryStatuses } from "@/lib/schema";

const UNAVAILABLE = "Sign-in is unavailable right now. Try again shortly.";

// `email` is echoed back so the field keeps its value: React resets action forms after submit.
export type LoginState = { error?: string; email?: string };

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "").trim().slice(0, 254);
  const password = String(form.get("password") ?? "").slice(0, 200);
  const fail = (error: string): LoginState => ({ error, email });
  if (!email || !password) return fail("Enter your email and password.");

  // 5 attempts per 15 minutes per visitor. Better Auth's own limiter doesn't cover server-side
  // calls like ours, so this is what stops password guessing.
  try {
    if (!(await rateLimit("admin-login", 5, 900))) return fail("Too many attempts. Try again in a few minutes.");
  } catch {
    console.error("admin: login_check_failed");
    return fail(UNAVAILABLE);
  }

  try {
    await auth().api.signInEmail({ body: { email, password }, headers: await headers() });
  } catch (e) {
    if (isAuthError(e)) return fail("Incorrect email or password.");
    console.error("admin: sign_in_failed");
    return fail(UNAVAILABLE);
  }
  redirect("/admin");
}

export async function logout() {
  try {
    await auth().api.signOut({ headers: await headers() });
  } catch {
    console.error("admin: sign_out_failed");
  }
  redirect("/admin/login");
}

const id = z.uuid();

export async function setStatus(enquiryId: string, status: string) {
  await requireAdmin();
  const parsed = z.object({ id, status: z.enum(enquiryStatuses) }).safeParse({ id: enquiryId, status });
  if (!parsed.success) return { ok: false };
  try {
    await db()`update enquiries set status = ${parsed.data.status} where id = ${parsed.data.id}`;
  } catch {
    console.error("admin: set_status_failed");
    return { ok: false };
  }
  refresh();
  return { ok: true };
}

export async function deleteEnquiry(enquiryId: string) {
  await requireAdmin();
  const parsed = id.safeParse(enquiryId);
  if (!parsed.success) return { ok: false };
  try {
    await db()`delete from enquiries where id = ${parsed.data}`;
  } catch {
    console.error("admin: delete_failed");
    return { ok: false };
  }
  refresh();
  return { ok: true };
}

/** Better Auth rejects bad credentials with a 4xx APIError; anything else is an outage. */
function isAuthError(e: unknown) {
  const status = (e as { statusCode?: unknown } | null)?.statusCode;
  return typeof status === "number" && status >= 400 && status < 500;
}
