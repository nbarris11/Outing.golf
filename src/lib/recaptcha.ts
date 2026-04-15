import { isRecaptchaConfigured, recaptchaSecretKey } from "@/lib/env";
import { logError } from "@/lib/logger";

const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const MINIMUM_SCORE = 0.5;

/**
 * Verifies a reCAPTCHA v3 token server-side.
 * Returns true if the token passes (score >= threshold) or if reCAPTCHA is not configured.
 * Returns false if the token is missing, invalid, or the score is too low.
 */
export async function verifyRecaptcha(token: string | null | undefined): Promise<boolean> {
  if (!isRecaptchaConfigured || !recaptchaSecretKey) {
    // reCAPTCHA not set up — skip verification
    return true;
  }

  if (!token) {
    return false;
  }

  try {
    const res = await fetch(RECAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: recaptchaSecretKey,
        response: token
      })
    });

    if (!res.ok) return false;

    const data = (await res.json()) as { success: boolean; score?: number; "error-codes"?: string[] };

    if (!data.success) return false;
    if (typeof data.score === "number" && data.score < MINIMUM_SCORE) return false;

    return true;
  } catch (err) {
    logError("reCAPTCHA verification failed", err);
    return false;
  }
}
