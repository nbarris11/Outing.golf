import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { currency } from "@/lib/utils";
import type {
  DestinationOption,
  GolfCourseOption,
  LodgingOption,
  RecommendationScore
} from "@/types/domain";

type OptionItem = DestinationOption | GolfCourseOption | LodgingOption;

export function ScoreList({
  title,
  options,
  scores,
  costLabel
}: {
  title: string;
  options: OptionItem[];
  scores: RecommendationScore[];
  costLabel: (option: OptionItem) => string;
}) {
  const top = scores.slice(0, 3);

  return (
    <Card>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold tracking-[-0.03em]">{title}</h3>
        <Badge>Ranked</Badge>
      </div>
      {top.length ? <div className="space-y-4">
        {top.map((score) => {
          const option = options.find((item) => item.id === score.id);

          if (!option) {
            return null;
          }

          return (
            <div
              key={score.id}
              className="rounded-3xl border border-charcoal/8 bg-cream p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-medium text-charcoal">{option.name}</h4>
                  <p className="mt-1 text-sm text-charcoal/65">
                    {"summary" in option ? option.summary : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-forest-900">{score.score} fit</p>
                  <p className="text-xs text-charcoal/60">{costLabel(option)}</p>
                </div>
              </div>
              <ul className="mt-3 space-y-1 text-xs text-charcoal/60">
                {score.reasons.slice(0, 2).map((reason) => (
                  <li key={reason}>• {reason}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div> : (
        <div className="rounded-[24px] bg-cream p-5 text-sm leading-6 text-charcoal/62">
          No scored options yet. Once the outing has preferences and seeded provider data, the strongest
          matches will show up here.
        </div>
      )}
    </Card>
  );
}

export function destinationCostLabel(option: OptionItem) {
  if ("averageNightlyRate" in option) {
    return `${currency(option.averageNightlyRate)}/night`;
  }

  if ("averageGreensFee" in option) {
    return `${currency(option.averageGreensFee)}/round`;
  }

  return `${currency(option.nightlyRate)}/night`;
}
