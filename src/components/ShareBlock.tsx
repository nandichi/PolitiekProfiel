"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";

export function ShareBlock({
  shareId,
  ideologyName,
}: {
  shareId: string;
  ideologyName: string;
}) {
  const [url, setUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setUrl(`${window.location.origin}/r/${shareId}`);
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      setCanShare(true);
    }
  }, [shareId]);

  const copy = useCallback(async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // negeer
    }
  }, [url]);

  const share = useCallback(async () => {
    if (!url) return;
    try {
      await navigator.share({
        title: "Mijn PolitiekProfiel",
        text: `Mijn politieke profiel: ${ideologyName}`,
        url,
      });
    } catch {
      // genegeerd: gebruiker annuleerde
    }
  }, [url, ideologyName]);

  return (
    <div className="border border-rule p-5 max-w-2xl">
      <p className="kicker mb-3">Jouw deelbare link</p>
      <div className="flex items-center gap-3">
        <code className="flex-1 min-w-0 truncate text-sm text-ink-soft bg-paper-100 border border-rule px-3 py-2 font-mono">
          {url || "…"}
        </code>
        <button
          type="button"
          onClick={copy}
          className="btn-secondary"
          disabled={!url}
        >
          {copied ? (
            <>
              <Check size={16} strokeWidth={1.7} />
              Gekopieerd
            </>
          ) : (
            <>
              <Copy size={16} strokeWidth={1.7} />
              Kopieer
            </>
          )}
        </button>
        {canShare && (
          <button type="button" onClick={share} className="btn-secondary">
            <Share2 size={16} strokeWidth={1.7} />
            Deel
          </button>
        )}
      </div>
    </div>
  );
}
