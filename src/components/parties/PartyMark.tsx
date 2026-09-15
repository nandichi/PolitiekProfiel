const PARTY_COLORS: Record<string, { background: string; foreground: string }> = {
  d66: { background: "#8f1d54", foreground: "#fffaf3" },
  pvv: { background: "#173f72", foreground: "#fffaf3" },
  vvd: { background: "#e98300", foreground: "#1f1c18" },
  "progressief-nederland": { background: "#e94d35", foreground: "#fffaf3" },
  cda: { background: "#2f8a52", foreground: "#fffaf3" },
  ja21: { background: "#102c4d", foreground: "#fffaf3" },
  fvd: { background: "#8a6a32", foreground: "#fffaf3" },
  bbb: { background: "#5b8e3d", foreground: "#fffaf3" },
  denk: { background: "#0a8d91", foreground: "#fffaf3" },
  sp: { background: "#c82f35", foreground: "#fffaf3" },
  sgp: { background: "#1d4d8f", foreground: "#fffaf3" },
  pvdd: { background: "#168d45", foreground: "#fffaf3" },
  volt: { background: "#502c83", foreground: "#fffaf3" },
  "50plus": { background: "#c68a16", foreground: "#1f1c18" },
  "groep-markuszower": { background: "#262626", foreground: "#fffaf3" },
  "lid-keijzer": { background: "#4a6f7e", foreground: "#fffaf3" },
};

function shortMark(abbreviation: string): string {
  const cleaned = abbreviation.replace(/[^A-Za-z0-9]/g, "");
  return cleaned.slice(0, 4).toUpperCase() || "PP";
}

export function PartyMark({
  slug,
  abbreviation,
  size = "normal",
}: {
  slug: string;
  abbreviation: string;
  size?: "normal" | "small";
}) {
  const color = PARTY_COLORS[slug] ?? {
    background: "#263b65",
    foreground: "#fffaf3",
  };
  const dimensions = size === "small" ? "h-8 w-8 text-[0.55rem]" : "h-11 w-11 text-[0.62rem]";

  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-sm font-semibold tracking-[0.08em] ${dimensions}`}
      style={{ backgroundColor: color.background, color: color.foreground }}
    >
      {shortMark(abbreviation)}
    </span>
  );
}
