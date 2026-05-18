"use client";

import { Download } from "lucide-react";
import { motion } from "motion/react";

interface ImageDownloadsProps {
  shareId: string;
  ideologyName: string;
}

interface FormatDef {
  id: "story" | "square" | "wide";
  label: string;
  caption: string;
  ratio: string;
  size: string;
  filename: string;
}

const FORMATS: FormatDef[] = [
  {
    id: "story",
    label: "Story",
    caption: "Verticaal · voor Instagram/Snapchat verhalen",
    ratio: "9 / 16",
    size: "1080 × 1920",
    filename: "story",
  },
  {
    id: "square",
    label: "Vierkant",
    caption: "1:1 · voor Instagram-feed en LinkedIn-post",
    ratio: "1 / 1",
    size: "1080 × 1080",
    filename: "square",
  },
  {
    id: "wide",
    label: "Link-preview",
    caption: "16:9 · OG-image / Twitter-card formaat",
    ratio: "16 / 9",
    size: "1200 × 630",
    filename: "wide",
  },
];

export function ImageDownloads({ shareId, ideologyName }: ImageDownloadsProps) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {FORMATS.map((f, index) => {
          const src = `/api/og/${shareId}?format=${f.id}`;
          const downloadName = `politiekprofiel-${shareId}-${f.filename}.png`;
          return (
            <FormatCard
              key={f.id}
              index={index}
              format={f}
              src={src}
              downloadName={downloadName}
              ideologyName={ideologyName}
            />
          );
        })}
      </div>
      <p className="mt-6 text-xs text-ink-muted">
        Afbeeldingen worden server-side gerenderd op het moment dat je
        downloadt. PNG, geen tracking, geen watermerk.
      </p>
    </div>
  );
}

interface FormatCardProps {
  index: number;
  format: FormatDef;
  src: string;
  downloadName: string;
  ideologyName: string;
}

function FormatCard({
  index,
  format,
  src,
  downloadName,
  ideologyName,
}: FormatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group flex flex-col border border-rule bg-paper hover:border-ink transition-colors"
    >
      {/* Preview frame */}
      <div className="relative flex items-center justify-center bg-paper-50 border-b border-rule p-4 md:p-6 min-h-[200px]">
        <div
          className="relative max-h-[280px] w-auto max-w-full border border-rule-strong shadow-sm overflow-hidden bg-paper"
          style={{
            aspectRatio: format.ratio,
            height:
              format.id === "story"
                ? 280
                : format.id === "square"
                ? 240
                : undefined,
            width: format.id === "wide" ? "100%" : undefined,
            maxWidth: format.id === "wide" ? 360 : undefined,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`${format.label}-kaart van ${ideologyName}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <span className="absolute top-3 left-3 mono text-[0.6rem] tracking-wider text-ink-subtle">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="absolute top-3 right-3 mono text-[0.6rem] tracking-wider text-ink-subtle">
          {format.size}
        </span>
      </div>

      {/* Meta + action */}
      <div className="flex-1 flex flex-col p-5">
        <p className="kicker mb-2">{format.label}</p>
        <p className="text-sm text-ink-2 leading-relaxed mb-5 flex-1">
          {format.caption}
        </p>
        <a
          href={src}
          download={downloadName}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium border border-ink text-ink hover:bg-ink hover:text-paper transition-colors"
        >
          <Download size={14} strokeWidth={1.8} />
          Download PNG
        </a>
      </div>
    </motion.div>
  );
}
