import type { AiContentRecord } from "@/lib/ai-content";
import { LexicalRenderer } from "@/components/LexicalRenderer";

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
          <p>{item.text}</p>
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
