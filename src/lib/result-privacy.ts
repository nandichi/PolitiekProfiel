import type { Metadata } from "next";

export const PRIVATE_RESULT_QUERY_ROBOTS = {
  index: false,
  follow: false,
  noarchive: true,
  nocache: true,
  googleBot: {
    index: false,
    follow: false,
    noarchive: true,
    noimageindex: true,
  },
} satisfies NonNullable<Metadata["robots"]>;
