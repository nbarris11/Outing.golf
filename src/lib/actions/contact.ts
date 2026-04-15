"use server";

import { Resend } from "resend";

import { env } from "@/lib/env";
import { logError, logInfo } from "@/lib/logger";

export async function sendContactMessage(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { success: false, error: "Please fill out all fields." };
  }

  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    logError("Contact form: Resend not configured", {});
    return { success: false, error: "Message could not be sent. Please email us directly at hello@outing.golf." };
  }

  const resend = new Resend(env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: "hello@outing.golf",
    replyTo: email,
    subject: `Outing.golf feedback from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`
  });

  if (error) {
    logError("Contact form: failed to send", { error: error.message });
    return { success: false, error: "Something went wrong. Please try again or email hello@outing.golf directly." };
  }

  logInfo("Contact form message sent", { name, email });
  return { success: true };
}

export async function sendAdvertiseInquiry(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const name = String(formData.get("name") ?? "").trim();
  const organization = String(formData.get("organization") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const website = String(formData.get("website") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !organization || !email || !message) {
    return { success: false, error: "Please fill out all required fields." };
  }

  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    logError("Advertise form: Resend not configured", {});
    return { success: false, error: "Message could not be sent. Please email us directly at hello@outing.golf." };
  }

  const resend = new Resend(env.RESEND_API_KEY);

  const body = [
    `Name: ${name}`,
    `Organization: ${organization}`,
    `Email: ${email}`,
    website ? `Website: ${website}` : null,
    ``,
    message
  ]
    .filter((line) => line !== null)
    .join("\n");

  const { error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: "hello@outing.golf",
    replyTo: email,
    subject: `Advertising inquiry from ${name} at ${organization}`,
    text: body
  });

  if (error) {
    logError("Advertise form: failed to send", { error: error.message });
    return { success: false, error: "Something went wrong. Please try again or email hello@outing.golf directly." };
  }

  logInfo("Advertise inquiry sent", { name, organization, email });
  return { success: true };
}
