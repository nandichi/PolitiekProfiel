import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Embed · PolitiekProfiel",
  robots: { index: false, follow: false },
};

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#fafaf7",
          color: "#0e1014",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}
