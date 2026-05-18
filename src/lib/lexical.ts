export function paragraphsToLexical(text: string) {
  const paragraphs = text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  return {
    root: {
      type: "root",
      format: "" as const,
      indent: 0,
      version: 1,
      direction: "ltr" as const,
      children: paragraphs.map((paragraph) => ({
        type: "paragraph",
        format: "" as const,
        indent: 0,
        version: 1,
        direction: "ltr" as const,
        textFormat: 0,
        children: [
          {
            type: "text",
            format: 0,
            style: "",
            mode: "normal" as const,
            text: paragraph,
            detail: 0,
            version: 1,
          },
        ],
      })),
    },
  };
}

interface LexicalTextNode {
  type: "text";
  text: string;
  format?: number;
}

interface LexicalParagraphNode {
  type: "paragraph";
  children: LexicalTextNode[];
}

interface LexicalRoot {
  root?: {
    children?: Array<{
      type?: string;
      children?: Array<{ type?: string; text?: string }>;
    }>;
  };
}

/**
 * Pak de eerste echte alinea uit een Lexical-document (sla headings/lists over)
 * en geef daaruit de eerste zin terug. Wordt gebruikt voor TL;DR-callouts boven
 * lange prose-blokken. Geeft `""` terug als er geen geschikte zin is.
 */
export function lexicalFirstSentence(
  value: unknown,
  maxChars = 240,
): string {
  const v = value as LexicalRoot | null;
  const children = v?.root?.children;
  if (!children) return "";
  for (const node of children) {
    if (node?.type !== "paragraph") continue;
    const text = (node.children ?? []).map((c) => c.text ?? "").join("").trim();
    if (!text) continue;
    const sentence = firstSentenceOf(text, maxChars);
    if (sentence) return sentence;
  }
  return "";
}

function firstSentenceOf(text: string, maxChars: number): string {
  const match = text.match(/^.+?[.!?](?=\s|$)/u);
  if (match) {
    const s = match[0].trim();
    if (s.length <= maxChars) return s;
  }
  if (text.length <= maxChars) return text.trim();
  return text.slice(0, maxChars).replace(/\s+\S*$/, "").trim() + "...";
}

export function lexicalToPlainText(value: unknown): string {
  const v = value as LexicalRoot | null;
  if (!v?.root?.children) return "";
  return v.root.children
    .map((node) => {
      if (!node?.children) return "";
      return node.children.map((c) => c.text ?? "").join("");
    })
    .filter(Boolean)
    .join("\n\n");
}

export type { LexicalParagraphNode, LexicalRoot, LexicalTextNode };
