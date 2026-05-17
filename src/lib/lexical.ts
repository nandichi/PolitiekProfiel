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
