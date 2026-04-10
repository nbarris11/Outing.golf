import { Card } from "@/components/ui/card";

const steps = [
  {
    number: "01",
    title: "Set the trip frame",
    body: "Create an outing with budget target, preferred date windows, destination type, lodging lean, and trip style."
  },
  {
    number: "02",
    title: "Invite the group",
    body: "Send invites by email or shareable link, then track who has responded and who still needs a nudge."
  },
  {
    number: "03",
    title: "Collect preferences",
    body: "Each invitee submits budget range, availability, destination lean, course quality preference, and comments."
  },
  {
    number: "04",
    title: "Compare and decide",
    body: "See overlap, ranked options, and the running group chat in one place so the organizer can move the group to a decision."
  }
];

export function ProcessSteps() {
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {steps.map((step) => (
        <Card key={step.number} className="bg-forest-950 text-cream">
          <p className="text-sm text-cream/60">{step.number}</p>
          <h3 className="mt-8 text-xl font-semibold tracking-[-0.03em]">{step.title}</h3>
          <p className="mt-3 text-sm leading-6 text-cream/72">{step.body}</p>
        </Card>
      ))}
    </div>
  );
}
