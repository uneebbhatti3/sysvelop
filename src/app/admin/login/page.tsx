import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <div className="flex w-full max-w-sm flex-col gap-8">
        <p className="font-display text-[26px] leading-none font-medium tracking-[-0.05em]">
          sys<span className="text-signal-text">v</span>elop{" "}
          <span className="font-sans text-sm font-medium tracking-normal text-muted-foreground">Admin</span>
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
