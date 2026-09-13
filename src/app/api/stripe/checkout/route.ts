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
import type { Tier } from "@/lib/dimensions";

interface Body {
  tier?: Tier;
  /** Expliciete verklaring dat de klant direct toegang wil (afstand herroepingsrecht). */
  immediateAccessConsent?: boolean;
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

  // Zonder expliciete verklaring geen betaalde levering: de klant moet vooraf
  // instemmen met directe levering en daarmee afstand doen van het
  // herroepingsrecht (zie /herroepingsrecht).
  if (body.immediateAccessConsent !== true) {
    return NextResponse.json(
      {
        error:
          "Bevestig eerst dat je direct toegang wil en afstand doet van je herroepingsrecht.",
      },
      { status: 400 },
    );
  }

  const tier: PaidTier = body.tier;

  try {
    const priceId = priceIdForTier(tier);
    const { token } = await createPendingEntitlement({
      tier,
      stripePriceId: priceId,
    });
    const siteUrl = getSiteUrl();

    // Prijzen in Stripe zijn exclusief btw. De btw wordt als aparte regel
    // bovenop het bedrag gezet, zodat de klant precies ziet wat hij betaalt
    // en de btw op de bon/factuur gespecificeerd staat.
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
      submit_type: "pay",
      line_items: lineItems,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      phone_number_collection: { enabled: false },
      customer_creation: "always",
      success_url: `${siteUrl}/quiz/${tier}?entitlement=${token}&checkout=success`,
      cancel_url: `${siteUrl}/?checkout=cancelled&tier=${tier}`,
      metadata: {
        entitlementToken: token,
        tier,
        product: "politiekprofiel-quiz",
        waiverAccepted: "true",
        waiverAcceptedAt: new Date().toISOString(),
      },
      payment_intent_data: {
        description: `PolitiekProfiel ${paidTierLabel(tier)}`,
        statement_descriptor_suffix: tier === "standard" ? "QUIZ STD" : "QUIZ EXT",
      },
      custom_text: {
        submit: {
          message: `${paidTierLabel(tier)} van PolitiekProfiel. Je krijgt direct na betaling toegang, zonder PolitiekProfiel-account. Je hebt afstand gedaan van je herroepingsrecht, zie politiekprofiel.nl/herroepingsrecht.`,
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
