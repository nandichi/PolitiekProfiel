"use client";

import { useCallback, useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* negeer */
    }
  }, [code]);

  return (
    <div className="relative border border-rule bg-canvas-raised">
      <div className="flex min-h-11 items-center justify-between border-b border-rule px-3">
        <span className="mono text-[0.62rem] uppercase tracking-wider text-text-muted">
          {language ?? "code"}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex min-h-11 items-center gap-2 px-2 text-xs font-semibold text-ink-raised transition-colors hover:text-signal focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-focus"
        >
          {copied ? (
            <>
              <Check size={14} strokeWidth={1.8} aria-hidden /> Gekopieerd
            </>
          ) : (
            <>
              <Copy size={14} strokeWidth={1.8} aria-hidden /> Kopieer
            </>
          )}
        </button>
        <span role="status" aria-live="polite" className="sr-only">
          {copied ? "Code gekopieerd" : ""}
        </span>
      </div>
      <pre className="mono overflow-x-auto px-3 py-4 text-xs leading-relaxed text-ink whitespace-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}
