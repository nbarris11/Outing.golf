import { AuthCard } from "@/components/auth/auth-card";
import { PageShell } from "@/components/layout/page-shell";
import { FieldLabel, Input } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { signInAction } from "@/lib/actions/auth";
import { isDemoMode } from "@/lib/env";

export default async function SignInPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  const formAction = isDemoMode ? "/api/demo/auth/sign-in" : signInAction;

  return (
    <PageShell>
      <AuthCard
        title="Sign in"
        subtitle="Jump back into the outing, check votes, and keep the group moving."
        helper={{ text: "Need an account?", label: "Create one", href: "/sign-up" }}
      >
        <form action={formAction} method={isDemoMode ? "post" : undefined} className="space-y-4">
          <div>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" name="email" type="email" placeholder="host@outing.golf" required />
          </div>
          <div>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Use any password in demo mode"
              required
            />
          </div>
          {params.error ? (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{params.error}</p>
          ) : null}
          <SubmitButton label="Sign in" pendingLabel="Signing in..." className="w-full" />
        </form>
      </AuthCard>
    </PageShell>
  );
}
