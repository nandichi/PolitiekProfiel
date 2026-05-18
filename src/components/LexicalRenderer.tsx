import type { ReactNode } from "react";

type Node = {
  type: string;
  text?: string;
  children?: Node[];
  format?: number;
  tag?: string;
  listType?: "bullet" | "number";
};

/** Alle platte tekst in een Lexical-subboom (volgorde behouden). */
function deepText(node: Node): string {
  if (node.type === "text" && typeof node.text === "string") return node.text;
  if (!node.children?.length) return "";
  return node.children.map(deepText).join("");
}

function trailingChar(node: Node): string | null {
  const t = deepText(node);
  if (!t) return null;
  return t[t.length - 1] ?? null;
}

function leadingChar(node: Node): string | null {
  const t = deepText(node);
  if (!t) return null;
  return t[0] ?? null;
}

/** Voorkomt plakken (bv. vet 'stemwijzer' + plat 'en...' → 'stemwijzeren'). */
function needsSpaceBetween(a: Node, b: Node): boolean {
  const te = trailingChar(a);
  const ls = leadingChar(b);
  if (!te || !ls) return false;
  if (/\s/.test(te) || /\s/.test(ls)) return false;
  return /^\p{L}$/u.test(te) && /^\p{L}$/u.test(ls);
}

function renderChildList(children: Node[]): ReactNode[] {
  const out: ReactNode[] = [];
  for (let i = 0; i < children.length; i++) {
    if (i > 0 && needsSpaceBetween(children[i - 1], children[i])) {
      out.push(" ");
    }
    out.push(renderNode(children[i], i));
  }
  return out;
}

export function LexicalRenderer({ value }: { value: unknown }) {
  if (!value || typeof value !== "object") return null;
  const root = (value as { root?: Node }).root;
  if (!root || !Array.isArray(root.children)) return null;
  return <>{root.children.map((node, i) => renderNode(node, i))}</>;
}

function renderNode(node: Node, key: number): ReactNode {
  if (node.type === "paragraph") {
    const children = node.children ?? [];
    return (
      <p key={key}>
        {children.length ? renderChildList(children) : null}
      </p>
    );
  }
  if (node.type === "heading") {
    const children = node.children ?? [];
    const allowed = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;
    const tag = (allowed as readonly string[]).includes(node.tag ?? "")
      ? (node.tag as (typeof allowed)[number])
      : "h3";
    const inner = children.length ? renderChildList(children) : null;
    if (tag === "h1") return <h1 key={key}>{inner}</h1>;
    if (tag === "h2") return <h2 key={key}>{inner}</h2>;
    if (tag === "h3") return <h3 key={key}>{inner}</h3>;
    if (tag === "h4") return <h4 key={key}>{inner}</h4>;
    if (tag === "h5") return <h5 key={key}>{inner}</h5>;
    return <h6 key={key}>{inner}</h6>;
  }
  if (node.type === "list") {
    const ordered = node.listType === "number" || node.tag === "ol";
    const inner = node.children?.map((child, i) => renderNode(child, i)) ?? null;
    return ordered ? <ol key={key}>{inner}</ol> : <ul key={key}>{inner}</ul>;
  }
  if (node.type === "listitem") {
    const children = node.children ?? [];
    return (
      <li key={key}>
        {children.length ? renderChildList(children) : null}
      </li>
    );
  }
  if (node.type === "text" && typeof node.text === "string") {
    const f = node.format ?? 0;
    let out: ReactNode = node.text;
    if (f & 1) out = <strong key={`b-${key}`}>{out}</strong>;
    if (f & 2) out = <em key={`i-${key}`}>{out}</em>;
    if (f & 8) out = <u key={`u-${key}`}>{out}</u>;
    return <span key={key}>{out}</span>;
  }
  if (node.children?.length) {
    return (
      <span key={key}>{renderChildList(node.children)}</span>
    );
  }
  return null;
}
