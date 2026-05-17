import type { ParadoxSignal } from "@/lib/paradox";
import { paradoxTitle } from "@/lib/paradox";
import type { AiContentRecord } from "@/lib/ai-content";
import { AiContentBlock } from "./AiContentBlock";

export interface ParadoxItemContext {
  signal: ParadoxSignal;
  aiContent?: AiContentRecord | null;
  examples?: Array<{ id: number; statement: string }>;
}

interface ParadoxListProps {
  items: ParadoxItemContext[];
  emptyText?: string;
}

export function ParadoxList({ items, emptyText }: ParadoxListProps) {
  if (items.length === 0) {
    return (
      <div className="border border-rule p-5 md:p-7 bg-paper-100">
        <p className="kicker mb-2">Geen paradoxen gedetecteerd</p>
        <p className="text-ink-2 text-sm leading-relaxed">
          {emptyText ??
            "Je antwoorden zijn intern consistent. Dat kan betekenen dat je een sterk profiel hebt op deze quiz, of dat we te weinig sterke antwoorden hebben om spanningen op te merken."}
        </p>
      </div>
    );
  }

  return (
    <ol className="space-y-10">
      {items.map((ctx, i) => (
        <li
          key={ctx.signal.type}
          className="border-t border-rule pt-7 first:border-t-0 first:pt-0"
        >
          <div className="flex items-baseline gap-5">
            <span className="mono text-xs tabular-nums text-ink-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <p className="kicker mb-2">
                Severity {ctx.signal.severity}/100
              </p>
              <h3 className="display text-xl md:text-2xl leading-tight text-ink wrap-break-word [hyphens:auto]">
                {paradoxTitle(ctx.signal.type)}
              </h3>
              <div className="mt-4">
                <AiContentBlock
                  content={ctx.aiContent}
                  fallback={ctx.signal.description}
                  variant="compact"
                />
              </div>
              {ctx.examples && ctx.examples.length > 0 && (
                <div className="mt-5 border-l-2 border-rule pl-4">
                  <p className="kicker mb-3">Antwoorden die hier op wezen</p>
                  <ul className="space-y-2 text-sm text-ink-muted italic">
                    {ctx.examples.map((ex) => (
                      <li key={ex.id} className="wrap-break-word">
                        &ldquo;{ex.statement}&rdquo;
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
