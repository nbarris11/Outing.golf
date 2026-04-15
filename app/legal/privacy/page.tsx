import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Privacy Policy | Outing.golf",
  description: "Privacy Policy for Outing.golf"
};

export default async function PrivacyPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Card className="prose prose-sm max-w-none px-8 py-10 text-charcoal/80 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-charcoal [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:leading-7 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:pl-5 [&_li]:mb-1">
          <h1 className="font-serif text-4xl font-semibold tracking-[-0.04em] text-charcoal">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-charcoal/45">Effective date: April 15, 2026</p>

          <p className="mt-8">
            This Privacy Policy explains how Outing.golf (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
            collects, uses, and protects information about you when you use our website and service. By using
            Outing.golf, you agree to the practices described in this policy.
          </p>

          <h2>1. Information We Collect</h2>
          <p>We collect the following types of information:</p>
          <ul>
            <li>
              <strong>Account information</strong> — your name and email address when you create an account or sign
              in with Google.
            </li>
            <li>
              <strong>Trip and outing data</strong> — information you enter while planning a trip, including
              destination preferences, budget ranges, available dates, course and lodging preferences, and group
              responses.
            </li>
            <li>
              <strong>Usage data</strong> — how you interact with the service, including pages visited, features
              used, and actions taken, collected through analytics tools.
            </li>
            <li>
              <strong>Device and browser information</strong> — IP address, browser type, operating system, and
              referring URLs, collected automatically when you use the service.
            </li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, operate, and improve the Outing.golf service</li>
            <li>Send you transactional emails such as invite notifications and trip updates</li>
            <li>Respond to your questions or support requests</li>
            <li>Monitor and analyze usage patterns to improve the product</li>
            <li>Detect and prevent fraud, abuse, or security incidents</li>
            <li>Comply with legal obligations</li>
          </ul>
          <p>We do not sell your personal information to third parties.</p>

          <h2>3. Information Sharing</h2>
          <p>
            We share your information only in the following circumstances:
          </p>
          <ul>
            <li>
              <strong>With other trip members</strong> — when you create or join an outing, certain information
              (such as your name and preferences) is visible to other members of that outing.
            </li>
            <li>
              <strong>With service providers</strong> — we use third-party vendors to help operate the service,
              including hosting, email delivery, and analytics. These providers only access your data to perform
              services on our behalf and are bound by confidentiality obligations.
            </li>
            <li>
              <strong>For legal reasons</strong> — we may disclose your information if required by law, court
              order, or government request, or to protect the rights, property, or safety of Outing.golf, our
              users, or the public.
            </li>
            <li>
              <strong>In a business transfer</strong> — if Outing.golf is acquired or merges with another company,
              your information may be transferred as part of that transaction. We will notify you before your
              information is transferred and becomes subject to a different privacy policy.
            </li>
          </ul>

          <h2>4. Cookies and Tracking</h2>
          <p>
            Outing.golf uses cookies and similar technologies to keep you signed in, remember your preferences,
            and understand how the service is used. You can control cookies through your browser settings, but
            disabling them may affect your ability to use certain features.
          </p>
          <p>
            We use session monitoring tools (such as LogRocket) to record anonymized session activity for
            debugging and product improvement purposes. This data does not include passwords or payment information.
          </p>

          <h2>5. Data Retention</h2>
          <p>
            We retain your account information and trip data for as long as your account is active or as needed
            to provide the service. If you delete your account, we will delete or anonymize your personal
            information within a reasonable time, except where we are required to retain it for legal or
            compliance purposes.
          </p>

          <h2>6. Security</h2>
          <p>
            We take reasonable technical and organizational measures to protect your information from unauthorized
            access, loss, or disclosure. However, no method of transmission over the internet or electronic
            storage is 100% secure. We cannot guarantee absolute security.
          </p>

          <h2>7. Third-Party Services</h2>
          <p>
            Outing.golf may display links to or content from third-party services such as golf courses, hotels,
            and tee time booking platforms. This Privacy Policy does not apply to those third parties. We
            encourage you to review their privacy policies before sharing any information with them.
          </p>

          <h2>8. Children&rsquo;s Privacy</h2>
          <p>
            Outing.golf is not directed to children under 18. We do not knowingly collect personal information
            from anyone under 18. If you believe a minor has provided us with personal information, please
            contact us and we will delete it promptly.
          </p>

          <h2>9. Your Choices</h2>
          <p>You may:</p>
          <ul>
            <li>Update your account information through your account settings</li>
            <li>Request deletion of your account and associated data by emailing us</li>
            <li>Opt out of non-transactional emails by following the unsubscribe link in any email we send</li>
          </ul>

          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. When we do, we will update the effective date
            at the top of this page. Your continued use of the service after changes are posted constitutes your
            acceptance of the updated policy. For material changes, we will make reasonable efforts to notify you.
          </p>

          <h2>11. Contact</h2>
          <p>
            If you have questions or concerns about this Privacy Policy, please contact us at{" "}
            <a href="mailto:hello@outing.golf" className="text-forest-900 underline">
              hello@outing.golf
            </a>
            .
          </p>
        </Card>
      </section>
    </PageShell>
  );
}
