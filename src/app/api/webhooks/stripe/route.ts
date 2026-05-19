import { NextResponse } from "next/server";
import Stripe from "stripe";
import { markEntitlementPaid } from "@/lib/entitlements";
import { getSiteUrl, isPaidTier, paidTierLabel, stripe } from "@/lib/stripe";
import { isValidEmail, sendEmail } from "@/lib/email";
import {
  EntitlementBackupEmail,
  entitlementBackupEmailText,
} from "@/emails/EntitlementBackupEmail";
import type { PaidTier } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error("[stripe-webhook] missing signature or STRIPE_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Webhook signature ontbreekt." },
      { status: 400 },
    );
  }

  const rawBody = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    console.error("[stripe-webhook] signature verification failed:", message);
    return NextResponse.json(
      { error: "Webhook signature ongeldig." },
      { status: 400 },
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const token = session.metadata?.entitlementToken;
      const tier = session.metadata?.tier;

      if (typeof token === "string" && tier && isPaidTier(tier)) {
        const { firstPaidTransition } = await markEntitlementPaid({
          token,
          tier,
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: paymentIntentId(session.payment_intent),
          amountTotal: session.amount_total ?? undefined,
          currency: session.currency ?? undefined,
        });

        if (firstPaidTransition) {
          // Best-effort: een fout hier mag de webhook nooit laten falen,
          // anders zou Stripe blijven retryen en zou de gebruiker meerdere
          // mails kunnen krijgen.
          await sendEntitlementBackupEmail({ session, token, tier });
        }
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    console.error(
      `[stripe-webhook] handler error for ${event.type}:`,
      message,
    );
    return NextResponse.json(
      { error: "Webhook handler failed." },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}

function paymentIntentId(
  paymentIntent: string | Stripe.PaymentIntent | null,
): string | undefined {
  if (!paymentIntent) return undefined;
  return typeof paymentIntent === "string" ? paymentIntent : paymentIntent.id;
}

async function sendEntitlementBackupEmail(input: {
  session: Stripe.Checkout.Session;
  token: string;
  tier: PaidTier;
}): Promise<void> {
  const email =
    input.session.customer_details?.email ?? input.session.customer_email ?? null;

  if (!email || !isValidEmail(email)) {
    return;
  }

  const quizUrl = `${getSiteUrl()}/quiz/${input.tier}?entitlement=${input.token}`;
  const tierLabel = paidTierLabel(input.tier);

  const result = await sendEmail({
    to: email,
    subject: `Toegangslink voor de ${tierLabel}`,
    react: EntitlementBackupEmail({ quizUrl, tierLabel }),
    text: entitlementBackupEmailText({ quizUrl, tierLabel }),
    tags: [
      { name: "type", value: "entitlement-backup" },
      { name: "tier", value: input.tier },
    ],
  });

  if (!result.ok) {
    console.error(
      "[stripe-webhook] entitlement backup mail mislukt:",
      result.error,
    );
  }
}
