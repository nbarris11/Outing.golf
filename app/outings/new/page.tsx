import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { BudgetSlider } from "@/components/ui/budget-slider";
import { FieldLabel, Input, Select, Textarea } from "@/components/ui/field";
import { RadioCardGroup } from "@/components/ui/radio-card-group";
import { SubmitButton } from "@/components/ui/submit-button";
import { createOutingAction } from "@/lib/actions/outings";
import { requireProfile } from "@/lib/auth";

export default async function NewOutingPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireProfile();
  const params = await searchParams;

  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Create outing</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            Set the trip up in under a minute
          </h1>
          <p className="mt-4 text-base leading-7 text-charcoal/68">
            Start with the basics, set the vibe, and invite the group. Anything more detailed can come later.
          </p>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_320px]">
          <Card className="order-2 xl:order-1">
            <form action={createOutingAction} className="space-y-8">
              <input type="hidden" name="organizerWeighting" value="7" />

              <section className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest-900 text-sm font-semibold text-cream">
                    1
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-charcoal/42">Basic info</p>
                    <h2 className="text-2xl font-semibold tracking-[-0.03em]">What trip are we talking about?</h2>
                  </div>
                </div>

                <div>
                  <FieldLabel htmlFor="tripName">Trip name</FieldLabel>
                  <Input id="tripName" name="name" placeholder="Summer friends trip" required />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor="destinationLabel">Rough location</FieldLabel>
                    <Input
                      id="destinationLabel"
                      name="destinationLabel"
                      placeholder="Driveable golf weekend"
                    />
                    <p className="mt-2 text-xs text-charcoal/48">Optional. Keep it broad if you want.</p>
                  </div>
                  <div>
                    <FieldLabel htmlFor="groupSize">Group size</FieldLabel>
                    <Input
                      id="groupSize"
                      name="numberOfPlayers"
                      type="number"
                      min="2"
                      max="24"
                      defaultValue="8"
                      required
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest-900 text-sm font-semibold text-cream">
                    2
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-charcoal/42">Preferences</p>
                    <h2 className="text-2xl font-semibold tracking-[-0.03em]">Give the group a simple frame</h2>
                  </div>
                </div>

                <div>
                  <FieldLabel htmlFor="budgetTarget">Budget</FieldLabel>
                  <BudgetSlider id="budgetTarget" name="budgetTarget" defaultValue={1200} />
                </div>

                <div className="rounded-[28px] bg-cream p-5">
                  <p className="mb-4 text-sm font-medium text-charcoal">Date range</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <FieldLabel htmlFor="dateStart">Date start</FieldLabel>
                      <Input id="dateStart" name="dateStart" type="date" required />
                    </div>
                    <div>
                      <FieldLabel htmlFor="dateEnd">Date end</FieldLabel>
                      <Input id="dateEnd" name="dateEnd" type="date" required />
                    </div>
                  </div>
                </div>

                <RadioCardGroup
                  name="tripVibe"
                  label="Trip vibe"
                  defaultValue="mixed"
                  options={[
                    {
                      value: "casual",
                      label: "Casual",
                      description: "Lower-pressure trip, simpler logistics, and a broad budget fit."
                    },
                    {
                      value: "serious_golf",
                      label: "Serious golf",
                      description: "The golf itself leads the decision and the group is fine building around it."
                    },
                    {
                      value: "mixed",
                      label: "Mixed",
                      description: "Strong golf, good stay, and an easy yes for the widest part of the group."
                    }
                  ]}
                />
              </section>

              <section className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest-900 text-sm font-semibold text-cream">
                    3
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-charcoal/42">Invite</p>
                    <h2 className="text-2xl font-semibold tracking-[-0.03em]">Bring someone in now, or do it next</h2>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                  <div>
                    <FieldLabel htmlFor="initialInviteEmail">Invite by email</FieldLabel>
                    <Input
                      id="initialInviteEmail"
                      name="initialInviteEmail"
                      type="email"
                      placeholder="friend@example.com"
                    />
                    <p className="mt-2 text-xs text-charcoal/48">Optional. You can skip this and invite the group right after creation.</p>
                  </div>
                  <div className="rounded-[24px] bg-cream p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-charcoal/40">Share link</p>
                    <p className="mt-3 text-sm leading-6 text-charcoal/64">
                      Create the outing first, then copy a shareable link from the next screen.
                    </p>
                  </div>
                </div>
              </section>

              <details className="rounded-[28px] bg-cream p-5">
                <summary className="cursor-pointer list-none text-sm font-semibold text-forest-900">
                  Optional details
                </summary>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor="destinationType">Location precision</FieldLabel>
                    <Select id="destinationType" name="destinationType" defaultValue="open">
                      <option value="open">Flexible</option>
                      <option value="city">Specific city</option>
                      <option value="state">State</option>
                      <option value="region">Region</option>
                    </Select>
                  </div>
                  <div>
                    <FieldLabel htmlFor="lodgingPreference">Stay preference</FieldLabel>
                    <Select id="lodgingPreference" name="lodgingPreference" defaultValue="mixed">
                      <option value="mixed">Let the group decide later</option>
                      <option value="house">House</option>
                      <option value="hotel">Hotel</option>
                      <option value="resort">Resort</option>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <FieldLabel htmlFor="notes">Notes</FieldLabel>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Anything the group should know early, like direct flights preferred or one marquee round."
                    />
                  </div>
                </div>
              </details>

              {params.error ? (
                <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {params.error}
                </p>
              ) : null}

              <div className="flex flex-col gap-3 border-t border-charcoal/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-charcoal/60">This should feel faster than starting a group text.</p>
                <SubmitButton label="Create outing" pendingLabel="Creating outing..." />
              </div>
            </form>
          </Card>

          <div className="order-1 space-y-4 xl:order-2">
            <Card className="bg-forest-950 text-cream">
              <p className="text-sm uppercase tracking-[0.2em] text-cream/50">Why this is short</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">Momentum beats detail</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-cream/76">
                <li>Set the frame now</li>
                <li>Let participants fill in the nuance</li>
                <li>Narrow the trip after real input comes in</li>
              </ul>
            </Card>

            <Card>
              <p className="text-sm uppercase tracking-[0.2em] text-charcoal/45">What happens next</p>
              <div className="mt-4 space-y-3 text-sm leading-6 text-charcoal/66">
                <p>The outing page will show your shortlist, response progress, and invite tools right away.</p>
                <p>Budgets, dates, courses, and lodging get clearer as the group weighs in.</p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
