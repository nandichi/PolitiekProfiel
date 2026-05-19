import { NextResponse } from "next/server";
import {
  attachCheckoutSession,
  createPendingEntitlement,
} from "@/lib/entitlements";
import {
  getSiteUrl,
  isPaidTier,
  paidTierLabel,
  priceIdForTier,
  stripe,
  type PaidTier,
} from "@/lib/stripe";
import type { Tier } from "@/lib/dimensions";

interface Body {
  tier?: Tier;
}

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Ongeldige JSON." }, { status: 400 });
  }

  if (!body.tier || !isPaidTier(body.tier)) {
    return NextResponse.json(
      { error: "Deze quiz heeft geen betaling nodig." },
      { status: 400 },
    );
  }

  const tier: PaidTier = body.tier;
  const priceId = priceIdForTier(tier);
  const { token } = await createPendingEntitlement({
    tier,
    stripePriceId: priceId,
  });
  const siteUrl = getSiteUrl();

  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${siteUrl}/quiz/${tier}?entitlement=${token}&checkout=success`,
    cancel_url: `${siteUrl}/?checkout=cancelled&tier=${tier}`,
    metadata: {
      entitlementToken: token,
      tier,
      product: "politiekprofiel-quiz",
    },
    custom_text: {
      submit: {
        message: `${paidTierLabel(tier)} voor PolitiekProfiel. Je krijgt na betaling toegang zonder PolitiekProfiel-account.`,
      },
    },
  });

  if (!session.url) {
    return NextResponse.json(
      { error: "Stripe checkout kon niet worden gestart." },
      { status: 500 },
    );
  }

  await attachCheckoutSession({
    token,
    stripeCheckoutSessionId: session.id,
  });

  return NextResponse.json({ url: session.url });
}
