import { JsonLd } from "@/components/seo/json-ld";
import { Card } from "@/components/ui/card";
import { faqSchema } from "@/lib/schema";

export interface Faq {
  question: string;
  answer: string;
}

// Visible FAQ section + matching FAQPage JSON-LD in one component so the
// schema can never drift from the on-page content.
export function FaqSection({ title = "Frequently asked questions", faqs }: { title?: string; faqs: Faq[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
      <JsonLd data={faqSchema(faqs)} />
      <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">FAQ</p>
      <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">{title}</h2>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {faqs.map((faq) => (
          <Card key={faq.question} className="p-6">
            <h3 className="text-lg font-semibold tracking-[-0.03em] text-charcoal">{faq.question}</h3>
            <p className="mt-3 text-[15.5px] leading-[1.6] text-charcoal/68">{faq.answer}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
