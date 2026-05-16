import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PolitiekProfiel — een onafhankelijk politiek kompas",
    short_name: "PolitiekProfiel",
    description:
      "Een Nederlandstalig politiek kompas op vijf onafhankelijke dimensies. Geen tracking, geen account, anonieme deelbare resultaten.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fafaf7",
    theme_color: "#0e1014",
    lang: "nl-NL",
    dir: "ltr",
    orientation: "portrait-primary",
    categories: ["education", "politics", "news"],
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
