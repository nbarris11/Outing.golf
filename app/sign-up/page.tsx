import { AuthCard } from "@/components/auth/auth-card";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { RecaptchaForm } from "@/components/auth/recaptcha-form";
import { PageShell } from "@/components/layout/page-shell";
import { FieldLabel, Input } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { signUpAction } from "@/lib/actions/auth";
import { isDemoMode, recaptchaSiteKey } from "@/lib/env";

export default async function SignUpPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const next = params.next?.startsWith("/") ? params.next : "/dashboard";

  const formContents = (
    <>
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
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Create a password"
          required
          minLength={8}
        />
        <p className="mt-1.5 text-xs text-charcoal/45">
          At least 8 characters, including a number and a special character.
        </p>
      </div>
      {params.error ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{params.error}</p>
      ) : null}
      <SubmitButton label="Create account" pendingLabel="Creating..." className="w-full" />
    </>
  );

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

        {isDemoMode ? (
          <form action="/api/demo/auth/sign-up" method="post" className="space-y-4">
            {formContents}
          </form>
        ) : (
          <RecaptchaForm
            action={signUpAction}
            recaptchaAction="sign_up"
            siteKey={recaptchaSiteKey ?? ""}
            className="space-y-4"
          >
            {formContents}
          </RecaptchaForm>
        )}
      </AuthCard>
    </PageShell>
  );
}
