import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { resendAdapter } from "@payloadcms/email-resend";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Questions } from "./collections/Questions";
import { Ideologies } from "./collections/Ideologies";
import { Politicians } from "./collections/Politicians";
import { Parties } from "./collections/Parties";
import { Countries } from "./collections/Countries";
import { Results } from "./collections/Results";
import { AiContent } from "./collections/AiContent";
import { QuizAttempts } from "./collections/QuizAttempts";
import { QuizEvents } from "./collections/QuizEvents";
import { Entitlements } from "./collections/Entitlements";
import { StripePromotionCodes } from "./collections/StripePromotionCodes";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const databaseUrl =
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.DATABASE_URL;

// Postgres push-mode tijdens schema-migraties: zet `PAYLOAD_PUSH=true` in de
// env wanneer je éénmalig schema-changes naar Neon wilt synchroniseren via
// `pnpm seed`. Laat dit standaard uitstaan in productie/runtime om
// accidentele DROP COLUMNs te voorkomen.
const allowPush = process.env.PAYLOAD_PUSH === "true";

const db = databaseUrl
  ? postgresAdapter({
      pool: { connectionString: databaseUrl },
      push: allowPush,
    })
  : sqliteAdapter({
      client: {
        url: `file:${path.resolve(dirname, "..", "payload-dev.db")}`,
      },
      push: true,
    });

// Parse "Display Name <address@domain.tld>" of een kaal adres uit RESEND_FROM_EMAIL.
function parseFromEnv(value: string | undefined): { name: string; address: string } | null {
  if (!value) return null;
  const trimmed = value.trim();
  const match = trimmed.match(/^(.*)<([^>]+)>$/);
  if (match) {
    const name = match[1].trim().replace(/^"|"$/g, "");
    const address = match[2].trim();
    if (!address) return null;
    return { name: name || "PolitiekProfiel", address };
  }
  if (trimmed.includes("@")) {
    return { name: "PolitiekProfiel", address: trimmed };
  }
  return null;
}

const resendFrom = parseFromEnv(process.env.RESEND_FROM_EMAIL);
const resendApiKey = process.env.RESEND_API_KEY;
// Alleen activeren als zowel API key als afzender geconfigureerd zijn. Anders
// laat Payload e-mails terugvallen op de console-logger (handig in dev).
const email =
  resendApiKey && resendFrom
    ? resendAdapter({
        apiKey: resendApiKey,
        defaultFromAddress: resendFrom.address,
        defaultFromName: resendFrom.name,
      })
    : undefined;

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " · PolitiekProfiel CMS",
      description:
        "Redactionele content beheren voor PolitiekProfiel: stellingen, ideologieën, politici en landen.",
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      views: {
        dashboard: {
          Component: "@/admin-tracking/TrackingDashboardView",
        },
        trackingAttempt: {
          Component: "@/admin-tracking/AttemptDetailView",
          path: "/tracking/attempt/:attemptId",
        },
        trackingVisitor: {
          Component: "@/admin-tracking/VisitorDetailView",
          path: "/tracking/visitor/:trackingId",
        },
        trackingQuestion: {
          Component: "@/admin-tracking/QuestionDetailView",
          path: "/tracking/question/:questionId",
        },
        couponGenerator: {
          Component: "@/admin-coupons/CouponGeneratorView",
          path: "/coupons",
        },
      },
    },
  },
  collections: [
    Users,
    Questions,
    Ideologies,
    Politicians,
    Parties,
    Countries,
    Results,
    AiContent,
    QuizAttempts,
    QuizEvents,
    Entitlements,
    StripePromotionCodes,
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || "dev-secret-replace-me",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db,
  email,
  sharp,
  serverURL:
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  cors: [process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"],
  csrf: [process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"],
});
