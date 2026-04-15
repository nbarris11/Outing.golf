import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Terms of Service | Outing.golf",
  description: "Terms of Service for Outing.golf"
};

export default async function TermsPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Card className="prose prose-sm max-w-none px-8 py-10 text-charcoal/80 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-charcoal [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:leading-7 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:pl-5 [&_li]:mb-1">
          <h1 className="font-serif text-4xl font-semibold tracking-[-0.04em] text-charcoal">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-charcoal/45">Effective date: April 15, 2026</p>

          <p className="mt-8">
            Please read these Terms of Service (&ldquo;Terms&rdquo;) carefully before using Outing.golf. By creating an
            account or using the service in any way, you agree to be bound by these Terms. If you do not agree, do not
            use the service.
          </p>

          <h2>1. The Service</h2>
          <p>
            Outing.golf is a golf trip planning tool that helps groups organize trips by collecting preferences,
            comparing courses and lodging, and coordinating decisions. Outing.golf is operated by Outing.golf
            (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;).
          </p>
          <p>
            Outing.golf is a planning and coordination tool only. We do not book golf tee times, hotel rooms, or any
            other reservations on your behalf. Any bookings made through third-party links are governed by those
            third parties&rsquo; own terms and policies.
          </p>

          <h2>2. Accounts</h2>
          <p>
            You must create an account to use most features of Outing.golf. You agree to provide accurate information
            when registering and to keep your account credentials secure. You are responsible for all activity that
            occurs under your account.
          </p>
          <p>
            You must be at least 18 years old to create an account. By registering, you represent that you meet this
            requirement.
          </p>

          <h2>3. Acceptable Use</h2>
          <p>You agree not to use Outing.golf to:</p>
          <ul>
            <li>Violate any applicable law or regulation</li>
            <li>Harass, threaten, or harm other users</li>
            <li>Post or transmit spam, malware, or any harmful content</li>
            <li>Attempt to gain unauthorized access to any part of the service or other users&rsquo; accounts</li>
            <li>Scrape, reverse-engineer, or copy any part of the service without our written permission</li>
            <li>Use the service for any commercial purpose without our prior written consent</li>
          </ul>
          <p>
            We reserve the right to suspend or terminate accounts that violate these rules, with or without notice.
          </p>

          <h2>4. User Content</h2>
          <p>
            You retain ownership of any content you submit to Outing.golf, such as outing names, notes, and
            preferences. By submitting content, you grant us a limited license to store, display, and use that
            content solely to operate and improve the service.
          </p>
          <p>
            You are solely responsible for the content you submit. You represent that you have the right to share
            any content you post and that it does not violate any third-party rights.
          </p>

          <h2>5. Privacy</h2>
          <p>
            Our Privacy Policy describes how we collect, use, and protect your information. By using Outing.golf,
            you agree to the collection and use of information as described in the Privacy Policy.
          </p>

          <h2>6. Intellectual Property</h2>
          <p>
            All content, features, and functionality of Outing.golf — including the name, logo, design, text,
            graphics, and code — are owned by us or our licensors and are protected by applicable intellectual
            property laws. You may not reproduce, distribute, or create derivative works without our express
            written permission.
          </p>

          <h2>7. Third-Party Services</h2>
          <p>
            Outing.golf may display or link to third-party content, including golf courses, hotels, and tee time
            booking platforms. We do not endorse and are not responsible for any third-party content, services,
            or websites. Your interactions with third parties are solely between you and them.
          </p>

          <h2>8. Disclaimers</h2>
          <p>
            Outing.golf is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any
            kind, either express or implied. We do not warrant that the service will be uninterrupted, error-free,
            or free of viruses or other harmful components. We make no guarantees regarding the accuracy or
            completeness of any course listings, pricing, or availability information displayed through the service.
          </p>

          <h2>9. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Outing.golf and its affiliates, officers, employees, and agents
            will not be liable for any indirect, incidental, special, consequential, or punitive damages, including
            loss of profits, data, or goodwill, arising out of or in connection with your use of the service.
          </p>
          <p>
            Our total liability to you for any claims arising from these Terms or your use of the service will not
            exceed the greater of (a) the amount you paid us in the twelve months prior to the claim, or (b) $100.
          </p>

          <h2>10. Termination</h2>
          <p>
            You may stop using the service and delete your account at any time. We may suspend or terminate your
            access to the service at any time, for any reason, with or without notice. Upon termination, your right
            to use the service ceases immediately.
          </p>

          <h2>11. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. When we do, we will update the effective date at the top
            of this page. Your continued use of the service after changes are posted constitutes your acceptance of
            the updated Terms. If we make material changes, we will make reasonable efforts to notify you.
          </p>

          <h2>12. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the United States. Any disputes arising under these Terms will
            be resolved in a court of competent jurisdiction.
          </p>

          <h2>13. Contact</h2>
          <p>
            If you have questions about these Terms, please contact us at{" "}
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
