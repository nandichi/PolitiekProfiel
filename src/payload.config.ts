import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Questions } from "./collections/Questions";
import { Ideologies } from "./collections/Ideologies";
import { Politicians } from "./collections/Politicians";
import { Parties } from "./collections/Parties";
import { Countries } from "./collections/Countries";
import { Results } from "./collections/Results";
import { AiContent } from "./collections/AiContent";

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
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || "dev-secret-replace-me",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db,
  sharp,
  serverURL:
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  cors: [process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"],
  csrf: [process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"],
});
