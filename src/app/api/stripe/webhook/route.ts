import { NextResponse } from "next/server";
import Stripe from "stripe";
import { markEntitlementPaid } from "@/lib/entitlements";
import { isPaidTier, stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Webhook signature ontbreekt." },
      { status: 400 },
    );
  }

  const rawBody = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json(
      { error: "Webhook signature ongeldig." },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const token = session.metadata?.entitlementToken;
    const tier = session.metadata?.tier;

    if (typeof token === "string" && tier && isPaidTier(tier)) {
      await markEntitlementPaid({
        token,
        tier,
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: paymentIntentId(session.payment_intent),
        amountTotal: session.amount_total ?? undefined,
        currency: session.currency ?? undefined,
      });
    }
  }

  return NextResponse.json({ received: true });
}

function paymentIntentId(
  paymentIntent: string | Stripe.PaymentIntent | null,
): string | undefined {
  if (!paymentIntent) return undefined;
  return typeof paymentIntent === "string" ? paymentIntent : paymentIntent.id;
}
