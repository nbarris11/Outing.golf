"use client";

import { type FormHTMLAttributes, useRef } from "react";

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

interface RecaptchaFormProps extends FormHTMLAttributes<HTMLFormElement> {
  action: string | ((formData: FormData) => void | Promise<void>);
  recaptchaAction: string;
  siteKey: string;
}

export function RecaptchaForm({
  action,
  recaptchaAction,
  siteKey,
  children,
  ...props
}: RecaptchaFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    try {
      await new Promise<void>((resolve) => window.grecaptcha.ready(resolve));
      const token = await window.grecaptcha.execute(siteKey, { action: recaptchaAction });

      // Set or create the recaptcha token hidden input
      let tokenInput = form.querySelector<HTMLInputElement>('input[name="recaptchaToken"]');
      if (!tokenInput) {
        tokenInput = document.createElement("input");
        tokenInput.type = "hidden";
        tokenInput.name = "recaptchaToken";
        form.appendChild(tokenInput);
      }
      tokenInput.value = token;
    } catch {
      // If reCAPTCHA fails (e.g. not configured), proceed anyway
    }

    if (typeof action === "function") {
      const formData = new FormData(form);
      await action(formData);
    } else {
      form.submit();
    }
  }

  return (
    <>
      <script
        src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
        async
        defer
      />
      <form ref={formRef} onSubmit={handleSubmit} {...props}>
        {children}
      </form>
    </>
  );
}
