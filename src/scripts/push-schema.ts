import "dotenv/config";
import { getPayload } from "payload";
import config from "../payload.config";

async function main() {
  if (process.env.PAYLOAD_PUSH !== "true") {
    console.error(
      "PAYLOAD_PUSH=true is required to sync the schema. Aborting to prevent accidental DROP COLUMNs.",
    );
    process.exit(1);
  }

  process.env.PAYLOAD_DISABLE_ADMIN ??= "true";
  console.log("[push-schema] initialising Payload with push=true ...");
  const payload = await getPayload({ config });
  console.log(
    `[push-schema] connected. registered collections: ${payload.collections ? Object.keys(payload.collections).length : "?"}`,
  );
  console.log("[push-schema] done. schema synced.");
  process.exit(0);
}

main().catch((err) => {
  console.error("[push-schema] failed:", err);
  process.exit(1);
});
