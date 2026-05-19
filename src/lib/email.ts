import "server-only";

import { Resend } from "resend";
import type { ReactElement } from "react";

let resendClient: Resend | null = null;

function resend(): Resend {
  if (resendClient) return resendClient;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY ontbreekt in de omgeving.");
  }
  resendClient = new Resend(apiKey);
  return resendClient;
}

function fromAddress(): string {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) {
    throw new Error(
      'RESEND_FROM_EMAIL ontbreekt. Gebruik formaat "Naam <adres@domein.nl>".',
    );
  }
  return from;
}

function replyTo(): string | undefined {
  return process.env.RESEND_REPLY_TO || undefined;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && EMAIL_REGEX.test(value.trim());
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

export interface SendEmailInput {
  to: string;
  subject: string;
  react: ReactElement;
  // Falt-back tekstversie (toegankelijkheid + spam-score).
  text: string;
  // Tags helpen filteren in het Resend-dashboard.
  tags?: Array<{ name: string; value: string }>;
}

export interface SendEmailResult {
  ok: boolean;
  id?: string;
  error?: string;
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  if (!isValidEmail(input.to)) {
    return { ok: false, error: "Ongeldig e-mailadres." };
  }

  try {
    const client = resend();
    const result = await client.emails.send({
      from: fromAddress(),
      to: input.to.trim(),
      subject: input.subject,
      react: input.react,
      text: input.text,
      replyTo: replyTo(),
      tags: input.tags,
    });

    if (result.error) {
      console.error("[email] Resend error", result.error);
      return { ok: false, error: result.error.message ?? "Verzenden mislukt." };
    }

    return { ok: true, id: result.data?.id };
  } catch (err) {
    console.error("[email] Onverwachte fout", err);
    const message = err instanceof Error ? err.message : "Onbekende fout.";
    return { ok: false, error: message };
  }
}
