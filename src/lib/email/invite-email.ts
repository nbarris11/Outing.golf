import { Resend } from "resend";

import { env, publicAppUrl } from "@/lib/env";
import { logInfo } from "@/lib/logger";

function getResendClient() {
  if (!env.RESEND_API_KEY) {
    return null;
  }

  return new Resend(env.RESEND_API_KEY);
}

export function isInviteEmailConfigured() {
  return Boolean(env.RESEND_API_KEY && env.RESEND_FROM_EMAIL);
}

export async function sendInviteEmail(input: {
  inviteeEmail: string;
  outingName: string;
  organizerName: string;
  inviteLink: string;
}) {
  const resend = getResendClient();

  if (!resend || !env.RESEND_FROM_EMAIL) {
    throw new Error("Invite email is not configured");
  }

  const subject = `${input.organizerName} invited you to join ${input.outingName} on Outing.golf`;
  const previewLink = input.inviteLink.startsWith("http") ? input.inviteLink : `${publicAppUrl}${input.inviteLink}`;
  const text = [
    `${input.organizerName} invited you to join ${input.outingName} on Outing.golf.`,
    "",
    `Open your invite: ${previewLink}`,
    "",
    "If you do not have an account yet, create one using the same email address that received this invite.",
    "",
    "Outing.golf"
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2423; max-width: 620px; margin: 0 auto; padding: 24px;">
      <p style="font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #6b726d;">Outing.golf invite</p>
      <h1 style="font-size: 28px; line-height: 1.15; margin: 12px 0 16px;">${input.organizerName} invited you to join ${input.outingName}</h1>
      <p style="font-size: 16px; color: #45504b;">
        Open the invite below to join the outing, share your preferences, and keep the planning in one place.
      </p>
      <p style="margin: 28px 0;">
        <a href="${previewLink}" style="display: inline-block; background: #143a2c; color: #f7f4ee; text-decoration: none; padding: 14px 22px; border-radius: 999px; font-weight: 600;">
          Open invite
        </a>
      </p>
      <p style="font-size: 14px; color: #5f6964;">
        If you do not have an account yet, create one with <strong>${input.inviteeEmail}</strong> and then open the invite link again.
      </p>
      <p style="font-size: 13px; color: #7a837e; margin-top: 24px;">
        If the button does not work, copy and paste this link into your browser:<br />
        <a href="${previewLink}" style="color: #143a2c;">${previewLink}</a>
      </p>
    </div>
  `;

  const response = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: input.inviteeEmail,
    replyTo: env.RESEND_REPLY_TO_EMAIL || undefined,
    subject,
    html,
    text
  });

  if (response.error) {
    throw new Error(response.error.message || "Resend rejected the invite email");
  }

  logInfo("Invite email sent", {
    inviteeEmail: input.inviteeEmail,
    outingName: input.outingName,
    resendId: response.data?.id ?? null
  });

  return response;
}

export async function sendBookingConfirmedEmail(input: {
  memberEmail: string;
  memberName: string;
  outingName: string;
  destination: string;
  tripHqUrl: string;
}) {
  const resend = getResendClient();
  if (!resend || !env.RESEND_FROM_EMAIL) return; // silently skip if not configured

  const subject = `${input.outingName} is officially booked! 🏌️`;
  const text = [
    `Great news — ${input.outingName} is booked!`,
    "",
    `Destination: ${input.destination}`,
    "",
    `Open your Trip HQ to see the countdown, packing list, and full trip details:`,
    input.tripHqUrl,
    "",
    "Outing.golf"
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2423; max-width: 620px; margin: 0 auto; padding: 24px;">
      <p style="font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #6b726d;">Outing.golf · Trip confirmed</p>
      <h1 style="font-size: 28px; line-height: 1.15; margin: 12px 0 8px; font-family: Georgia, serif;">${input.outingName} is officially booked! 🏌️</h1>
      <p style="font-size: 16px; color: #45504b; margin-bottom: 4px;">Hey ${input.memberName},</p>
      <p style="font-size: 16px; color: #45504b;">Your golf trip to <strong>${input.destination}</strong> is locked in. Open Trip HQ for the countdown clock, shared packing list, and all the details.</p>
      <p style="margin: 28px 0;">
        <a href="${input.tripHqUrl}" style="display: inline-block; background: #143a2c; color: #f7f4ee; text-decoration: none; padding: 14px 22px; border-radius: 999px; font-weight: 600;">
          Open Trip HQ →
        </a>
      </p>
      <p style="font-size: 13px; color: #7a837e; margin-top: 24px;">
        If the button does not work, copy and paste this link:<br />
        <a href="${input.tripHqUrl}" style="color: #143a2c;">${input.tripHqUrl}</a>
      </p>
    </div>
  `;

  await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: input.memberEmail,
    replyTo: env.RESEND_REPLY_TO_EMAIL || undefined,
    subject,
    html,
    text
  });
}
