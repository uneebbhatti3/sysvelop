import { site } from "@/content/site";
import { LogoImage } from "@/components/shared/logo";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <div className="flex w-full max-w-sm flex-col gap-8">
        <p className="flex items-center gap-2.5">
          <LogoImage />
          <span className="sr-only">{site.name}</span>
          <span className="text-sm font-medium text-muted-foreground">Admin</span>
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
