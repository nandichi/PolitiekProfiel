import path from "node:path";
import { fileURLToPath } from "node:url";
import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["payload", "@payloadcms/db-postgres", "@payloadcms/db-sqlite"],
  turbopack: {
    root: dirname,
  },
};

export default withPayload(nextConfig, {
  devBundleServerPackages: false,
});
