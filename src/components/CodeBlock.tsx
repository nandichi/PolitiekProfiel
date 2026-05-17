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
    <div className="border border-rule bg-paper-50 relative">
      <div className="flex items-center justify-between border-b border-rule px-3 py-2">
        <span className="mono text-[0.62rem] tracking-wider text-ink-subtle uppercase">
          {language ?? "code"}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 text-xs text-ink-2 hover:text-navy"
        >
          {copied ? (
            <>
              <Check size={12} strokeWidth={1.8} /> Gekopieerd
            </>
          ) : (
            <>
              <Copy size={12} strokeWidth={1.8} /> Kopieer
            </>
          )}
        </button>
      </div>
      <pre className="mono text-xs leading-relaxed overflow-x-auto px-3 py-3 text-ink whitespace-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}
