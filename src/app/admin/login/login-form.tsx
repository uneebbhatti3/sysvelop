"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  const errorProps = state.error ? { "aria-invalid": true, "aria-describedby": "login-error" } : {};

  return (
    <Card>
      <CardHeader>
        <h1 className="sr-only">Admin sign-in</h1>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Sign in to view enquiries.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required maxLength={254} autoComplete="username" defaultValue={state.email} key={state.email} autoFocus={!state.email} {...errorProps} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required maxLength={200} autoComplete="current-password" autoFocus={Boolean(state.email)} {...errorProps} />
          </div>
          {state.error ? (
            <p id="login-error" role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          ) : null}
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? "Checking…" : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
