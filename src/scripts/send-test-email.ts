import "dotenv/config";
import { nanoid } from "nanoid";
import { Resend } from "resend";
import { ResultLinkEmail, resultLinkEmailText } from "../emails/ResultLinkEmail";

async function main() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey) throw new Error("RESEND_API_KEY ontbreekt.");
  if (!from) throw new Error("RESEND_FROM_EMAIL ontbreekt.");

  const to = "naoufal.exe@gmail.com";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://politiekprofiel.nl";

  const shareId = nanoid(10);
  const resultUrl = `${siteUrl}/r/${shareId}`;
  const tierLabel = "Standaard";

  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from,
    to,
    subject: "[TEST] Jouw PolitiekProfiel-resultaat",
    react: ResultLinkEmail({ resultUrl, tierLabel }),
    text: resultLinkEmailText({ resultUrl, tierLabel }),
    replyTo: process.env.RESEND_REPLY_TO,
    tags: [
      { name: "type", value: "test-result-link" },
      { name: "tier", value: "standard" },
    ],
  });

  if (result.error) {
    console.error("Resend error:", result.error);
    process.exit(1);
  }
  console.log("Verzonden.");
  console.log(`  id:      ${result.data?.id}`);
  console.log(`  to:      ${to}`);
  console.log(`  shareId: ${shareId} (random, niet in DB)`);
  console.log(`  url:     ${resultUrl}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
