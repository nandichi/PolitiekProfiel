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

const PRIVATE_RESULT_HEADERS = [
  { key: "Cache-Control", value: "private, no-store" },
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
  { key: "Referrer-Policy", value: "no-referrer" },
];

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
      {
        source: "/r/:path*",
        headers: PRIVATE_RESULT_HEADERS,
      },
      {
        source: "/embed/:path*",
        headers: PRIVATE_RESULT_HEADERS,
      },
      {
        source: "/widget/profiel/:path*",
        headers: PRIVATE_RESULT_HEADERS,
      },
      {
        source: "/api/r/:path*/export.md",
        headers: PRIVATE_RESULT_HEADERS,
      },
      {
        source: "/api/og/:path*",
        headers: PRIVATE_RESULT_HEADERS,
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
