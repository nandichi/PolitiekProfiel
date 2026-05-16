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
import { Countries } from "./collections/Countries";
import { Results } from "./collections/Results";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const databaseUrl =
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.DATABASE_URL;

const db = databaseUrl
  ? postgresAdapter({ pool: { connectionString: databaseUrl } })
  : sqliteAdapter({
      client: {
        url: `file:${path.resolve(dirname, "..", "payload-dev.db")}`,
      },
      push: false,
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
  collections: [Users, Questions, Ideologies, Politicians, Countries, Results],
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
