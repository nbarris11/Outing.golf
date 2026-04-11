import { AuthCard } from "@/components/auth/auth-card";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { PageShell } from "@/components/layout/page-shell";
import { FieldLabel, Input } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { signUpAction } from "@/lib/actions/auth";
import { isDemoMode } from "@/lib/env";

export default async function SignUpPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const next = params.next?.startsWith("/") ? params.next : "/dashboard";

  const formAction = isDemoMode ? "/api/demo/auth/sign-up" : signUpAction;

  return (
    <PageShell>
      <AuthCard
        title="Create your account"
        subtitle="Start an outing, invite the group, and get the plan out of your texts."
        helper={{ text: "Already have an account?", label: "Sign in", href: `/sign-in?next=${encodeURIComponent(next)}` }}
      >
        {!isDemoMode ? (
          <>
            <GoogleAuthButton label="Continue with Google" next={next} />
            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-charcoal/34">
              <span className="h-px flex-1 bg-charcoal/10" />
              <span>Or use email</span>
              <span className="h-px flex-1 bg-charcoal/10" />
            </div>
          </>
        ) : null}
        <form action={formAction} method={isDemoMode ? "post" : undefined} className="space-y-4">
          <input type="hidden" name="next" value={next} />
          <div>
            <FieldLabel htmlFor="fullName">Full name</FieldLabel>
            <Input id="fullName" name="fullName" placeholder="Taylor Brooks" required />
          </div>
          <div>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" name="email" type="email" placeholder="taylor@example.com" required />
          </div>
          <div>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input id="password" name="password" type="password" placeholder="Create a password" required />
          </div>
          {params.error ? (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{params.error}</p>
          ) : null}
          <SubmitButton label="Create account" pendingLabel="Creating..." className="w-full" />
        </form>
      </AuthCard>
    </PageShell>
  );
}
