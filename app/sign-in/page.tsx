import { AuthCard } from "@/components/auth/auth-card";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { RecaptchaForm } from "@/components/auth/recaptcha-form";
import { PageShell } from "@/components/layout/page-shell";
import { FieldLabel, Input } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { signInAction } from "@/lib/actions/auth";
import { isDemoMode, recaptchaSiteKey } from "@/lib/env";
import { logInfo } from "@/lib/logger";

export default async function SignInPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; notice?: string; next?: string }>;
}) {
  const params = await searchParams;
  const next = params.next?.startsWith("/") ? params.next : "/dashboard";

  if (params.error || params.notice) {
    logInfo("Sign-in page loaded with auth state", {
      error: params.error ?? null,
      notice: params.notice ?? null,
      next
    });
  }

  const formContents = (
    <>
      <input type="hidden" name="next" value={next} />
      {params.notice ? (
        <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{params.notice}</p>
      ) : null}
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
          placeholder="Your password"
          required
        />
      </div>
      {params.error ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{params.error}</p>
      ) : null}
      <SubmitButton label="Sign in" pendingLabel="Signing in..." className="w-full" />
    </>
  );

  return (
    <PageShell>
      <AuthCard
        title="Sign in"
        subtitle="Jump back into the outing, check votes, and keep the group moving."
        helper={{ text: "Need an account?", label: "Create one", href: `/sign-up?next=${encodeURIComponent(next)}` }}
      >
        {!isDemoMode ? (
          <>
            <GoogleAuthButton label="Continue with Google" next={next} />
            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-charcoal/34">
              <span className="h-px flex-1 bg-charcoal/10" />
              <span>Email instead</span>
              <span className="h-px flex-1 bg-charcoal/10" />
            </div>
          </>
        ) : null}

        {isDemoMode ? (
          <form action="/api/demo/auth/sign-in" method="post" className="space-y-4">
            {formContents}
          </form>
        ) : (
          <RecaptchaForm
            action={signInAction}
            recaptchaAction="sign_in"
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
