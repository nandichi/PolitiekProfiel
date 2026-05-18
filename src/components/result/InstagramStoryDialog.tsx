"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { Check, Download, ExternalLink, Loader2, Smartphone, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface InstagramStoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareId: string;
  ideologyName: string;
  profileUrl: string;
}

type Capability = "unknown" | "share-files" | "download-only";

/**
 * Modal voor "Deel op Instagram Story". Implementeert een Spotify-achtige
 * flow met twee paden:
 *
 * - Mobiel + Web Share API met files: primaire knop deelt het PNG-bestand
 *   via het native deelmenu (gebruiker kiest Instagram → "Voeg toe aan Story").
 * - Desktop / geen file-share: QR-code naar de directe PNG-download, plus
 *   download-knop met instructies om vanaf de telefoon te delen.
 *
 * Officiële "Sharing to Stories" deep-link API vereist een Facebook App ID
 * en native app-context; daarom kiezen we voor de Web Share API met file
 * en een instagram://story-camera fallback voor mobiel.
 */
export function InstagramStoryDialog({
  open,
  onOpenChange,
  shareId,
  ideologyName,
  profileUrl,
}: InstagramStoryDialogProps) {
  const [capability, setCapability] = useState<Capability>("unknown");
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shared, setShared] = useState(false);

  const storyUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/api/og/${shareId}?format=story`;
  }, [shareId]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.canShare) {
      setCapability("download-only");
      return;
    }
    try {
      const testFile = new File([new Blob(["test"])], "test.png", {
        type: "image/png",
      });
      if (navigator.canShare({ files: [testFile] })) {
        setCapability("share-files");
      } else {
        setCapability("download-only");
      }
    } catch {
      setCapability("download-only");
    }
  }, []);

  const filename = `politiekprofiel-${shareId}-story.png`;
  const text = `Mijn politieke profiel: ${ideologyName}. Doe ook de quiz op politiekprofiel.nl`;

  const handleShare = useCallback(async () => {
    if (!storyUrl) return;
    setError(null);
    setSharing(true);
    try {
      const res = await fetch(storyUrl);
      if (!res.ok) throw new Error("kon afbeelding niet laden");
      const blob = await res.blob();
      const file = new File([blob], filename, { type: blob.type || "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Mijn PolitiekProfiel",
          text,
        });
        setShared(true);
        setTimeout(() => setShared(false), 3000);
      } else {
        throw new Error("Bestand delen niet ondersteund");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Onbekende fout";
      if (!/abort/i.test(message)) {
        setError(message);
      }
    } finally {
      setSharing(false);
    }
  }, [storyUrl, filename, text]);

  const openInstagramDeepLink = useCallback(() => {
    if (typeof window === "undefined") return;
    window.location.href = "instagram://story-camera";
    setTimeout(() => {
      window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
    }, 800);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 bg-paper border border-rule-strong shadow-2xl max-h-[calc(100vh-2rem)] overflow-y-auto"
                initial={{ opacity: 0, scale: 0.96, y: "-46%" }}
                animate={{ opacity: 1, scale: 1, y: "-50%" }}
                exit={{ opacity: 0, scale: 0.96, y: "-46%" }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 sm:px-8 h-16 border-b border-rule">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-7 w-7 items-center justify-center text-paper text-xs"
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%)",
                      }}
                      aria-hidden
                    />
                    <p className="kicker">Deel op Instagram Story</p>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Sluiten"
                      className="w-10 h-10 -mr-2 inline-flex items-center justify-center text-ink-muted hover:text-ink"
                    >
                      <X size={20} strokeWidth={1.7} />
                    </button>
                  </Dialog.Close>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-0">
                  {/* Preview */}
                  <div className="p-6 sm:p-8 md:border-r border-rule flex flex-col items-center md:items-start">
                    <p className="kicker mb-4">Voorbeeld</p>
                    <div
                      className="relative w-full max-w-[200px] md:max-w-[210px] border border-rule-strong bg-paper-50 overflow-hidden"
                      style={{ aspectRatio: "9 / 16" }}
                    >
                      {storyUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={storyUrl}
                          alt={`Story-kaart voor ${ideologyName}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <p className="mt-3 mono text-[0.62rem] tracking-wider text-ink-subtle">
                      1080 × 1920 · PNG
                    </p>
                    <Dialog.Title asChild>
                      <h3 className="display text-xl md:text-2xl mt-4 leading-tight">
                        Story-kaart
                      </h3>
                    </Dialog.Title>
                    <Dialog.Description asChild>
                      <p className="mt-2 text-sm text-ink-2 leading-relaxed">
                        Klaar voor 9:16. Met je ideologie, dimensiescores en
                        top-thema&apos;s.
                      </p>
                    </Dialog.Description>
                  </div>

                  {/* Actions */}
                  <div className="p-6 sm:p-8 flex flex-col gap-6">
                    {capability === "share-files" && (
                      <Section number="01" title="Direct delen">
                        <p className="text-sm text-ink-2 mb-4 leading-relaxed">
                          Open het deelmenu, kies <strong className="text-ink">Instagram</strong> en
                          tik op <strong className="text-ink">Voeg toe aan je verhaal</strong>.
                        </p>
                        <button
                          type="button"
                          onClick={handleShare}
                          disabled={sharing}
                          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-medium text-paper transition-all disabled:opacity-60"
                          style={{
                            backgroundImage:
                              "linear-gradient(135deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%)",
                          }}
                        >
                          {sharing ? (
                            <>
                              <Loader2
                                size={16}
                                strokeWidth={1.8}
                                className="animate-spin"
                              />
                              Bestand laden…
                            </>
                          ) : shared ? (
                            <>
                              <Check size={16} strokeWidth={2} />
                              Gedeeld
                            </>
                          ) : (
                            <>Deel naar Instagram Story</>
                          )}
                        </button>
                        {error && (
                          <p className="mt-3 text-xs text-terra">{error}</p>
                        )}
                        <button
                          type="button"
                          onClick={openInstagramDeepLink}
                          className="mt-3 inline-flex items-center gap-2 text-xs text-ink-muted hover:text-ink underline-offset-2 hover:underline"
                        >
                          <ExternalLink size={12} strokeWidth={1.8} />
                          Open Instagram-app
                        </button>
                      </Section>
                    )}

                    {capability !== "share-files" && (
                      <Section number="01" title="Scan met je telefoon">
                        <p className="text-sm text-ink-2 mb-4 leading-relaxed">
                          Scan deze QR-code met je telefoon, download de afbeelding
                          en deel daarna vanuit je galerij op Instagram.
                        </p>
                        <div className="flex items-start gap-5">
                          <div className="bg-paper border border-rule-strong p-3 shrink-0">
                            {storyUrl && (
                              <QRCodeSVG
                                value={storyUrl}
                                size={120}
                                bgColor="#fafaf7"
                                fgColor="#0e1014"
                                level="M"
                              />
                            )}
                          </div>
                          <div className="text-xs text-ink-muted leading-relaxed">
                            <p className="kicker mb-2 text-[0.62rem]">
                              <Smartphone
                                size={11}
                                strokeWidth={1.8}
                                className="inline-block -translate-y-px mr-1"
                              />
                              Open camera
                            </p>
                            <p>
                              Open de camera-app, scan de code en bewaar de
                              afbeelding. Open daarna Instagram, tik op
                              &ldquo;Verhaal&rdquo; en kies de foto uit je
                              galerij.
                            </p>
                          </div>
                        </div>
                      </Section>
                    )}

                    <Section number="02" title="Download de PNG">
                      <p className="text-sm text-ink-2 mb-4 leading-relaxed">
                        Of bewaar de afbeelding direct en upload zelf naar
                        Instagram of een andere app.
                      </p>
                      <a
                        href={storyUrl}
                        download={filename}
                        className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium border border-ink text-ink hover:bg-ink hover:text-paper transition-colors"
                      >
                        <Download size={15} strokeWidth={1.8} />
                        Download story-PNG
                      </a>
                    </Section>

                    {profileUrl && (
                      <div className="border-t border-rule pt-4">
                        <p className="kicker mb-1.5">Of deel de link</p>
                        <code className="block mono text-xs text-ink-2 break-all">
                          {profileUrl}
                        </code>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-3 mb-3 pb-2 border-b border-rule">
        <span className="index-num text-[0.65rem]">{number}</span>
        <p className="kicker">{title}</p>
      </div>
      {children}
    </div>
  );
}
