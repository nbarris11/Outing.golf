import { createHmac } from "node:crypto";

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

import { env } from "@/lib/env";
import { logError } from "@/lib/logger";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const optionalAnswer = z.string().trim().max(2000).default("");
const feedbackSchema = z.object({
  id: z.string().uuid(),
  rating: z.number().int().min(1).max(10),
  likedMost: optionalAnswer,
  frustrations: optionalAnswer,
  requestedChange: z.string().trim().min(1).max(2000),
  likelihoodToReturn: z.enum(["Definitely", "Probably", "Maybe", "Probably not", "Definitely not"]),
  additionalComments: optionalAnswer,
  willingToTalk: z.boolean(),
  contactEmail: z.union([z.literal(""), z.string().trim().email().max(254)]).default(""),
  website: z.string().max(200).default("")
});

export async function POST(request: Request) {
  const parsed = feedbackSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the required answers and try again." }, { status: 400 });
  }

  // A hidden field catches simple automated submissions without interrupting people.
  if (parsed.data.website) return NextResponse.json({ ok: true });

  const admin = createSupabaseAdminClient();
  if (!admin || !env.SUPABASE_SERVICE_ROLE_KEY || !env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    return NextResponse.json({ error: "Feedback is temporarily unavailable. Please try again later." }, { status: 503 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: userData } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const submitter = userData.user?.id
    ? `user:${userData.user.id}`
    : `guest:${ip}:${request.headers.get("user-agent") ?? "unknown"}`;
  const fingerprint = createHmac("sha256", env.SUPABASE_SERVICE_ROLE_KEY)
    .update(submitter)
    .digest("hex");

  const answer = parsed.data;
  const { data: inserted, error } = await admin.from("feedback_responses").insert({
    id: answer.id,
    rating: answer.rating,
    liked_most: answer.likedMost || null,
    frustrations: answer.frustrations || null,
    requested_change: answer.requestedChange,
    likelihood_to_return: answer.likelihoodToReturn,
    additional_comments: answer.additionalComments || null,
    willing_to_talk: answer.willingToTalk,
    contact_email: answer.contactEmail.trim().toLowerCase() || null,
    user_id: userData.user?.id ?? null,
    submission_fingerprint: fingerprint,
    submission_window: Math.floor(Date.now() / 60_000)
  }).select("*").single();

  if (error && error.code !== "23505") {
    logError("Feedback submission failed", error);
    return NextResponse.json({ error: "Feedback could not be saved. Please try again." }, { status: 500 });
  }

  // The same response ID is safe to retry if saving worked but the email failed.
  const existing = error?.code === "23505"
    ? await admin.from("feedback_responses").select("*").eq("id", answer.id).maybeSingle()
    : null;
  const row = inserted ?? existing?.data;
  if (!row) {
    return NextResponse.json({ error: "We already received feedback from this connection. Please try again in a minute." }, { status: 429 });
  }
  if (row.notification_sent_at) return NextResponse.json({ ok: true });

  const resend = new Resend(env.RESEND_API_KEY);
  const text = [
    `Response ID: ${row.id}`,
    `Submitted: ${row.submitted_at}`,
    `User ID: ${row.user_id ?? "Not signed in"}`,
    "",
    `Overall rating: ${row.rating}/10`,
    `What they like most: ${row.liked_most || "No answer"}`,
    `Confusing or frustrating: ${row.frustrations || "No answer"}`,
    `One thing to add or change: ${row.requested_change}`,
    `Likelihood to return: ${row.likelihood_to_return}`,
    `Additional comments: ${row.additional_comments || "No answer"}`,
    `Open to a 15-minute conversation: ${row.willing_to_talk ? "Yes" : "No"}`,
    `Respondent email: ${row.contact_email || "Not provided"}`
  ].join("\n");

  try {
    const { data: email, error: emailError } = await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to: "hello@outing.golf",
      subject: `New Outing.golf feedback (${row.rating}/10)`,
      text,
      ...(row.willing_to_talk && row.contact_email ? { replyTo: row.contact_email } : {})
    }, { idempotencyKey: `feedback/${row.id}` });

    if (emailError || !email?.id) {
      logError("Feedback notification failed", emailError ?? "Missing email ID", { responseId: row.id });
      return NextResponse.json({ error: "Your feedback was saved, but we couldn't notify our team. Please try again." }, { status: 502 });
    }
  } catch (emailError) {
    logError("Feedback notification failed", emailError, { responseId: row.id });
    return NextResponse.json({ error: "Your feedback was saved, but we couldn't notify our team. Please try again." }, { status: 502 });
  }

  const { error: updateError } = await admin.from("feedback_responses")
    .update({ notification_sent_at: new Date().toISOString() })
    .eq("id", row.id);
  if (updateError) {
    logError("Feedback notification tracking failed", updateError, { responseId: row.id });
    return NextResponse.json({ error: "Your feedback was saved, but we couldn't confirm the notification. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
