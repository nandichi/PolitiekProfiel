import "dotenv/config";
import { getPayload } from "payload";
import config from "../payload.config";

async function main() {
  process.env.PAYLOAD_DISABLE_ADMIN ??= "true";
  const payload = await getPayload({ config });
  try {
    console.log("[test-entitlement] creating ...");
    const doc = await payload.create({
      collection: "entitlements",
      data: {
        token: `test-${Date.now().toString(36)}-${Math.random()
          .toString(36)
          .slice(2, 10)}`,
        tier: "standard",
        status: "pending",
        stripePriceId: "price_test",
      },
    });
    console.log("[test-entitlement] created id:", doc.id);
  } catch (err) {
    console.error("[test-entitlement] FAILED");
    console.error("error:", err);
    if (err && typeof err === "object" && "cause" in err) {
      const cause = (err as { cause: unknown }).cause;
      console.error("cause:", cause);
      if (cause && typeof cause === "object" && "cause" in cause) {
        console.error("cause.cause:", (cause as { cause: unknown }).cause);
      }
    }
    process.exit(1);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error("[test-entitlement] outer:", err);
  process.exit(1);
});
