import { redirect } from "next/navigation";

import { PageShell } from "@/components/layout/page-shell";
import { DateWindowsPicker } from "@/components/outings/date-windows-picker";
import { DestinationPicker } from "@/components/outings/destination-picker";
import { GroupSizeInput } from "@/components/outings/group-size-input";
import { Card } from "@/components/ui/card";
import { BudgetSlider } from "@/components/ui/budget-slider";
import { FieldLabel, Input, Select, Textarea } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { Button } from "@/components/ui/button";
import { updateOutingAction } from "@/lib/actions/outings";
import { requireProfile } from "@/lib/auth";
import { getOutingDetail } from "@/modules/outings/service";

export default async function EditOutingPage({
  params,
  searchParams
}: {
  params: Promise<{ outingId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const profile = await requireProfile();
  const { outingId } = await params;
  const notices = await searchParams;

  const detail = await getOutingDetail(outingId, profile.id);

  if (!detail) {
    redirect("/dashboard?error=Outing%20not%20found");
  }

  if (detail.outing.organizerId !== profile.id) {
    redirect(`/outings/${outingId}?error=Only%20the%20organizer%20can%20edit%20this%20trip`);
  }

  const { outing } = detail;

  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Edit trip</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            {outing.name}
          </h1>
          <p className="mt-4 text-base leading-7 text-charcoal/68">
            Update the trip details. Changes will be visible to the whole group.
          </p>
        </div>

        {notices.error ? (
          <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{notices.error}</p>
        ) : null}

        <div className="mt-8 max-w-3xl">
          <Card>
            <form action={updateOutingAction} className="space-y-8">
              <input type="hidden" name="outingId" value={outing.id} />

              <section className="space-y-5">
                <div>
                  <FieldLabel htmlFor="tripName">Trip name</FieldLabel>
                  <Input
                    id="tripName"
                    name="name"
                    defaultValue={outing.name}
                    autoComplete="off"
                    required
                  />
                </div>

                <DestinationPicker
                  defaultType={outing.destinationType}
                  defaultLabel={outing.destinationLabel === "Flexible location" ? "" : outing.destinationLabel}
                />

                <GroupSizeInput defaultValue={outing.numberOfPlayers} />
              </section>

              <section className="space-y-5">
                <div>
                  <FieldLabel htmlFor="budgetTarget">Budget per person</FieldLabel>
                  <BudgetSlider id="budgetTarget" name="budgetTarget" defaultValue={outing.budgetTarget} />
                </div>

                <DateWindowsPicker initialWindows={outing.preferredDateWindows} />

                <div>
                  <FieldLabel htmlFor="lodgingPreference">Lodging preference</FieldLabel>
                  <Select id="lodgingPreference" name="lodgingPreference" defaultValue={outing.lodgingPreference}>
                    <option value="hotel">Hotel</option>
                    <option value="resort">Resort</option>
                    <option value="house">House / rental</option>
                    <option value="mixed">Mixed / flexible</option>
                  </Select>
                </div>

                <div>
                  <FieldLabel htmlFor="notes">Notes (optional)</FieldLabel>
                  <Textarea
                    id="notes"
                    name="notes"
                    defaultValue={outing.notes ?? ""}
                    placeholder="Anything else the group should know..."
                    rows={3}
                  />
                </div>
              </section>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
                <Button href={`/outings/${outingId}`} variant="secondary">
                  Cancel
                </Button>
                <SubmitButton label="Save changes" pendingLabel="Saving…" />
              </div>
            </form>
          </Card>
        </div>
      </section>
    </PageShell>
  );
}
