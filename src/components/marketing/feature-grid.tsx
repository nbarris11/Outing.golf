import { CalendarRange, CircleDollarSign, MessagesSquare, Trophy, BedDouble, MapPinned } from "lucide-react";

import { Card } from "@/components/ui/card";

const features = [
  {
    title: "Collect budgets in one pass",
    body: "See the group budget picture without chasing replies or updating a spreadsheet by hand.",
    icon: CircleDollarSign
  },
  {
    title: "Spot date overlap instantly",
    body: "Compare windows across the group and find the easiest dates to lock in first.",
    icon: CalendarRange
  },
  {
    title: "Compare golf and lodging together",
    body: "Put destination, course, and stay options next to each other with the context the group actually cares about.",
    icon: MapPinned
  },
  {
    title: "Keep the decision inside one chat",
    body: "One outing, one conversation, one place for everyone to weigh in without losing the thread.",
    icon: MessagesSquare
  },
  {
    title: "Vote and favorite as a group",
    body: "Let strong options rise naturally while the organizer still guides the final call.",
    icon: Trophy
  },
  {
    title: "Make lodging fit the group",
    body: "Balance nightly cost, sleeping capacity, and shared-space preferences without bouncing between tabs.",
    icon: BedDouble
  }
];

export function FeatureGrid() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {features.map((feature) => (
        <Card key={feature.title} className="relative overflow-hidden">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-900/8 text-forest-900">
            <feature.icon className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold tracking-[-0.03em]">{feature.title}</h3>
          <p className="mt-3 text-sm leading-6 text-charcoal/70">{feature.body}</p>
        </Card>
      ))}
    </div>
  );
}
