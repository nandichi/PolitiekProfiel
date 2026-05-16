import path from "node:path";
import { fileURLToPath } from "node:url";
import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const LINK_HEADER_HOMEPAGE = [
  '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
  '</api/docs/openapi.json>; rel="service-desc"; type="application/openapi+json"',
  '</docs/api>; rel="service-doc"; type="text/html"',
  '</sitemap.xml>; rel="sitemap"; type="application/xml"',
  '</methodiek>; rel="describedby"; type="text/html"',
].join(", ");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["payload", "@payloadcms/db-postgres", "@payloadcms/db-sqlite"],
  turbopack: {
    root: dirname,
  },
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Link",
            value: LINK_HEADER_HOMEPAGE,
          },
          {
            key: "Vary",
            value: "Accept",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/favicon.ico",
        destination: "/icon",
      },
    ];
  },
};

export default withPayload(nextConfig, {
  devBundleServerPackages: false,
});
