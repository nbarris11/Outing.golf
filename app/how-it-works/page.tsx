import { PageShell } from "@/components/layout/page-shell";
import { ProcessSteps } from "@/components/marketing/process-steps";
import { Card } from "@/components/ui/card";

export default async function HowItWorksPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">How it works</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            A cleaner flow for messy group planning
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            Outing.golf gives the organizer a structured workflow and gives invitees one place to
            respond. No spreadsheets. No copy-pasted notes. No wondering which text thread has the
            latest answer.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <ProcessSteps />
      </section>
      <section className="mx-auto grid max-w-6xl gap-5 px-4 pb-24 sm:px-6 lg:grid-cols-3 lg:px-8">
        {[
          {
            title: "Organizer control",
            body: "Set the frame, invite people, manage status, and guide the final decision with weighted preferences."
          },
          {
            title: "Invitee simplicity",
            body: "Submit availability, budget, and preferences in one short flow instead of replying piecemeal."
          },
          {
            title: "Decision support",
            body: "Use ranked recommendations and comparison views powered by rules-based scoring that can later be upgraded."
          }
        ].map((item) => (
          <Card key={item.title}>
            <h2 className="text-xl font-semibold tracking-[-0.03em]">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-charcoal/68">{item.body}</p>
          </Card>
        ))}
      </section>
    </PageShell>
  );
}
