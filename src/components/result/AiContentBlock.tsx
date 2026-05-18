import type { AiContentRecord } from "@/lib/ai-content";
import { LexicalRenderer } from "@/components/LexicalRenderer";
import { ArrowUpRight } from "lucide-react";

interface AiContentBlockProps {
  content?: AiContentRecord | null;
  fallback?: string;
  variant?: "prose" | "compact";
  showSourceNote?: boolean;
}

export function AiContentBlock({
  content,
  fallback,
  variant = "prose",
  showSourceNote = false,
}: AiContentBlockProps) {
  if (!content) {
    if (!fallback) return null;
    return (
      <p className="text-ink-2 leading-relaxed text-base">{fallback}</p>
    );
  }

  return (
    <div>
      <div
        className={
          variant === "prose"
            ? "editorial-prose"
            : "text-ink-2 leading-relaxed text-sm md:text-base [&>p]:mt-3 [&>p:first-child]:mt-0"
        }
      >
        <LexicalRenderer value={content.bodyLexical} />
      </div>
      {showSourceNote && (
        <p className="mt-4 mono text-[0.65rem] tracking-wider text-ink-subtle">
          TEKST VOORAF GEGENEREERD MET {content.model.toUpperCase()} · GEEN PERSOONLIJKE
          DATA NAAR AI
          {content.humanEdited ? " · REDACTIONEEL BEWERKT" : ""}
        </p>
      )}
    </div>
  );
}

export function AiContentItemList({
  content,
  emptyText,
}: {
  content?: AiContentRecord | null;
  emptyText?: string;
}) {
  if (!content || content.items.length === 0) {
    if (!emptyText) return null;
    return <p className="text-ink-muted text-sm">{emptyText}</p>;
  }
  return (
    <ul className="space-y-4">
      {content.items.map((item, i) => (
        <li
          key={i}
          className="border-l-2 border-rule pl-4 text-sm md:text-base text-ink-2 leading-relaxed"
        >
          {item.link ? (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="group inline-flex items-start gap-1.5 text-ink hover:text-navy underline decoration-rule-strong underline-offset-4 decoration-1 hover:decoration-navy transition-colors"
            >
              <span>{item.text}</span>
              <ArrowUpRight
                size={14}
                strokeWidth={1.6}
                className="mt-1 shrink-0 text-ink-subtle group-hover:text-navy transition-colors"
                aria-hidden
              />
            </a>
          ) : (
            <p>{item.text}</p>
          )}
          {item.meta && (
            <p className="mono text-[0.62rem] tracking-wider text-ink-subtle mt-1">
              {item.meta.toUpperCase()}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
