import { NextResponse } from "next/server";

const BASE_URL = "https://politiekprofiel.nl";

export const dynamic = "force-static";

export function GET() {
  const linkset = {
    linkset: [
      {
        anchor: `${BASE_URL}/api/results`,
        "service-desc": [
          {
            href: `${BASE_URL}/api/docs/openapi.json`,
            type: "application/openapi+json",
          },
        ],
        "service-doc": [
          {
            href: `${BASE_URL}/docs/api`,
            type: "text/html",
            hreflang: ["nl"],
          },
        ],
        describedby: [
          {
            href: `${BASE_URL}/methodiek`,
            type: "text/html",
            hreflang: ["nl"],
          },
        ],
      },
    ],
  };

  return new NextResponse(JSON.stringify(linkset, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/linkset+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
