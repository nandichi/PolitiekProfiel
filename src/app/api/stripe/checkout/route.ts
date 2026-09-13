import { NextResponse } from "next/server";
import Stripe from "stripe";
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
import {
  buildPromotionCheckoutOptions,
  normalizePromotionCode,
} from "@/lib/checkout-promotion";
import type { Tier } from "@/lib/dimensions";

interface Body {
  tier?: Tier;
  /** Private owner links pre-apply a verified 100% Stripe promotion. */
  promotionCode?: unknown;
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
  const promotionCode = normalizePromotionCode(body.promotionCode);
  if (body.promotionCode !== undefined && !promotionCode) {
    return NextResponse.json(
      { error: "Ongeldige promotiecode." },
      { status: 400 },
    );
  }

  try {
    const promotionCheckout = await resolveFullPromotion(promotionCode);
    const priceId = priceIdForTier(tier);
    const { token } = await createPendingEntitlement({
      tier,
      stripePriceId: priceId,
    });
    const siteUrl = getSiteUrl();

    // De Stripe-prijzen zijn vaste brutoprijzen. De gekoppelde Nederlandse
    // btw-rate is inclusief, zodat Stripe de 21% afzonderlijk toont zonder
    // boven op 5 of 10 euro te rekenen.
    const vatRate = process.env.STRIPE_TAX_RATE_VAT;
    const lineItems = [
      {
        price: priceId,
        quantity: 1,
        ...(vatRate ? { tax_rates: [vatRate] } : {}),
      },
    ];

    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      locale: "nl",
      line_items: lineItems,
      ...(promotionCheckout.allowPromotionCodes
        ? { allow_promotion_codes: true }
        : {}),
      ...(promotionCheckout.discounts
        ? { discounts: promotionCheckout.discounts }
        : {}),
      ...(promotionCheckout.paymentMethodCollection
        ? { payment_method_collection: promotionCheckout.paymentMethodCollection }
        : { submit_type: "pay" }),
      billing_address_collection: "auto",
      phone_number_collection: { enabled: false },
      customer_creation: "always",
      success_url: `${siteUrl}/quiz/${tier}?entitlement=${token}&checkout=success`,
      cancel_url: `${siteUrl}/?checkout=cancelled&tier=${tier}`,
      metadata: {
        entitlementToken: token,
        tier,
        product: "politiekprofiel-quiz",
      },
      ...(promotionCheckout.discounts
        ? {}
        : {
            payment_intent_data: {
              description: `PolitiekProfiel ${paidTierLabel(tier)}`,
              statement_descriptor_suffix:
                tier === "standard" ? "QUIZ STD" : "QUIZ EXT",
            },
          }),
      custom_text: {
        submit: {
          message: `${paidTierLabel(tier)} van PolitiekProfiel. Je krijgt direct na betaling toegang, zonder PolitiekProfiel-account.`,
        },
      },
    });

    if (!session.url) {
      console.error("[stripe-checkout] Stripe session returned no url", {
        tier,
        sessionId: session.id,
      });
      return NextResponse.json(
        { error: "Stripe checkout kon niet worden gestart (geen URL)." },
        { status: 500 },
      );
    }

    await attachCheckoutSession({
      token,
      stripeCheckoutSessionId: session.id,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const summary = describeError(err);
    console.error("[stripe-checkout] failed:", summary);
    return NextResponse.json(
      { error: `Checkout-fout: ${summary.message}` },
      { status: 500 },
    );
  }
}

/**
 * Stripe requires a no-cost checkout to receive the discount while the
 * Checkout Session is created. The coupon and redemption remain in Stripe.
 */
async function resolveFullPromotion(code: string | null) {
  if (!code) return buildPromotionCheckoutOptions(null);

  const matches = await stripe().promotionCodes.list({
    active: true,
    code,
    limit: 1,
  });
  const promotion = matches.data[0];
  if (!promotion) {
    throw new Error("Promotiecode is niet beschikbaar.");
  }

  const couponRef = promotion.promotion.coupon;
  if (!couponRef) {
    throw new Error("Promotiecode heeft geen geldige coupon.");
  }
  const couponId = typeof couponRef === "string" ? couponRef : couponRef.id;
  const coupon = await stripe().coupons.retrieve(couponId);

  if (!coupon.valid || coupon.percent_off !== 100) {
    throw new Error("Deze promotiecode geeft geen volledige testtoegang.");
  }

  return buildPromotionCheckoutOptions(promotion.id);
}

interface ErrorSummary {
  message: string;
  type?: string;
  code?: string;
  requestId?: string;
  causeMessage?: string;
  causeCode?: string;
  causeDetail?: string;
  causeHint?: string;
  causeWhere?: string;
}

function describeError(err: unknown): ErrorSummary {
  if (err instanceof Stripe.errors.StripeError) {
    return {
      message: err.message,
      type: err.type,
      code: err.code,
      requestId: err.requestId,
    };
  }
  if (err instanceof Error) {
    const summary: ErrorSummary = { message: err.message, type: err.name };
    const cause = (err as { cause?: unknown }).cause;
    if (cause && typeof cause === "object") {
      const c = cause as Record<string, unknown>;
      summary.causeMessage = typeof c.message === "string" ? c.message : undefined;
      summary.causeCode = typeof c.code === "string" ? c.code : undefined;
      summary.causeDetail = typeof c.detail === "string" ? c.detail : undefined;
      summary.causeHint = typeof c.hint === "string" ? c.hint : undefined;
      summary.causeWhere = typeof c.where === "string" ? c.where : undefined;
    }
    return summary;
  }
  return { message: String(err) };
}
