"use client";

import { useCallback, useEffect, useState } from "react";
import { Share2 } from "lucide-react";
import { motion } from "motion/react";
import {
  WhatsAppIcon,
  XIcon,
  FacebookIcon,
  LinkedInIcon,
  RedditIcon,
  BlueskyIcon,
  EmailIcon,
  InstagramIcon,
} from "./SocialIcons";
import { InstagramStoryDialog } from "./InstagramStoryDialog";

interface SocialShareGridProps {
  shareId: string;
  ideologyName: string;
}

interface PlatformTile {
  id: string;
  label: string;
  shortLabel: string;
  brand: string;
  Icon: (p: { className?: string }) => React.ReactElement;
  href: (ctx: { url: string; encodedUrl: string; text: string; encodedText: string }) => string;
  rel?: string;
}

const PLATFORMS: PlatformTile[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    shortLabel: "WhatsApp",
    brand: "#25D366",
    Icon: WhatsAppIcon,
    href: ({ encodedText, encodedUrl }) =>
      `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
  },
  {
    id: "x",
    label: "X / Twitter",
    shortLabel: "X",
    brand: "#0e1014",
    Icon: XIcon,
    href: ({ encodedText, encodedUrl }) =>
      `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
  },
  {
    id: "facebook",
    label: "Facebook",
    shortLabel: "Facebook",
    brand: "#1877F2",
    Icon: FacebookIcon,
    href: ({ encodedUrl }) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    shortLabel: "LinkedIn",
    brand: "#0A66C2",
    Icon: LinkedInIcon,
    href: ({ encodedUrl }) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  },
  {
    id: "reddit",
    label: "Reddit",
    shortLabel: "Reddit",
    brand: "#FF4500",
    Icon: RedditIcon,
    href: ({ encodedUrl, encodedText }) =>
      `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedText}`,
  },
  {
    id: "bluesky",
    label: "Bluesky",
    shortLabel: "Bluesky",
    brand: "#0085FF",
    Icon: BlueskyIcon,
    href: ({ encodedText, encodedUrl }) =>
      `https://bsky.app/intent/compose?text=${encodedText}%20${encodedUrl}`,
  },
  {
    id: "email",
    label: "E-mail",
    shortLabel: "E-mail",
    brand: "#142850",
    Icon: EmailIcon,
    href: ({ encodedText, url }) =>
      `mailto:?subject=Mijn%20PolitiekProfiel&body=${encodedText}%20${encodeURIComponent(url)}`,
  },
];

export function SocialShareGrid({ shareId, ideologyName }: SocialShareGridProps) {
  const [url, setUrl] = useState("");
  const [canShare, setCanShare] = useState(false);
  const [igOpen, setIgOpen] = useState(false);

  const text = `Mijn politieke profiel: ${ideologyName}.`;
  const encodedText = encodeURIComponent(text);
  const encodedUrl = url ? encodeURIComponent(url) : "";

  useEffect(() => {
    if (typeof window === "undefined") return;
    setUrl(`${window.location.origin}/r/${shareId}`);
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      setCanShare(true);
    }
  }, [shareId]);

  const nativeShare = useCallback(async () => {
    if (!url || typeof navigator === "undefined" || !navigator.share) return;
    try {
      await navigator.share({
        title: "Mijn PolitiekProfiel",
        text,
        url,
      });
    } catch {
      /* geannuleerd */
    }
  }, [url, text]);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-px bg-rule border border-rule">
        {/* Instagram Story – special handler */}
        <ShareTile
          label="Instagram Story"
          shortLabel="IG Story"
          brand="#E1306C"
          accentGradient
          onClick={() => setIgOpen(true)}
          icon={<InstagramIcon />}
        />

        {PLATFORMS.map((p) => (
          <ShareTile
            key={p.id}
            label={p.label}
            shortLabel={p.shortLabel}
            brand={p.brand}
            href={url ? p.href({ url, encodedUrl, text, encodedText }) : undefined}
            icon={<p.Icon />}
          />
        ))}

        {canShare && (
          <ShareTile
            label="Meer opties"
            shortLabel="Delen"
            brand="#0e1014"
            onClick={nativeShare}
            icon={<Share2 size={20} strokeWidth={1.8} />}
          />
        )}
      </div>

      <InstagramStoryDialog
        open={igOpen}
        onOpenChange={setIgOpen}
        shareId={shareId}
        ideologyName={ideologyName}
        profileUrl={url}
      />
    </div>
  );
}

interface ShareTileProps {
  label: string;
  shortLabel: string;
  brand: string;
  href?: string;
  onClick?: () => void;
  icon: React.ReactNode;
  accentGradient?: boolean;
}

function ShareTile({
  label,
  shortLabel,
  brand,
  href,
  onClick,
  icon,
  accentGradient,
}: ShareTileProps) {
  const content = (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="group relative flex h-full flex-col items-start justify-between gap-6 bg-paper p-4 sm:p-5 transition-colors"
      style={
        {
          // Brand kleur als CSS variable zodat hover staat werkt
          ["--brand" as string]: brand,
        } as React.CSSProperties
      }
    >
      {accentGradient ? (
        <span
          className="flex h-10 w-10 items-center justify-center text-paper"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%)",
          }}
          aria-hidden
        >
          {icon}
        </span>
      ) : (
        <span
          className="flex h-10 w-10 items-center justify-center text-ink transition-colors group-hover:text-(--brand)"
          aria-hidden
        >
          {icon}
        </span>
      )}

      <div className="flex w-full items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-ink leading-tight">
          {shortLabel}
        </span>
        <span
          className="mono text-[0.62rem] tracking-wider text-ink-subtle transition-colors group-hover:text-(--brand)"
          aria-hidden
        >
          →
        </span>
      </div>

      {/* Accent bar */}
      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-(--brand) transition-transform duration-300 group-hover:scale-x-100"
        aria-hidden
      />
    </motion.div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Deel op ${label}`}
        className="block focus:outline-none focus:ring-2 focus:ring-navy"
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Deel via ${label}`}
      className="block text-left focus:outline-none focus:ring-2 focus:ring-navy"
    >
      {content}
    </button>
  );
}
