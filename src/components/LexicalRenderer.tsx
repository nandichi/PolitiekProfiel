import type { ReactNode } from "react";

type Node = {
  type: string;
  text?: string;
  children?: Node[];
  format?: number;
};

export function LexicalRenderer({ value }: { value: unknown }) {
  if (!value || typeof value !== "object") return null;
  const root = (value as { root?: Node }).root;
  if (!root || !Array.isArray(root.children)) return null;
  return <>{root.children.map((node, i) => renderNode(node, i))}</>;
}

function renderNode(node: Node, key: number): ReactNode {
  if (node.type === "paragraph") {
    return (
      <p key={key}>
        {node.children?.map((child, i) => renderNode(child, i)) ?? null}
      </p>
    );
  }
  if (node.type === "heading") {
    return (
      <h3 key={key}>
        {node.children?.map((child, i) => renderNode(child, i)) ?? null}
      </h3>
    );
  }
  if (node.type === "list") {
    return (
      <ul key={key}>
        {node.children?.map((child, i) => renderNode(child, i)) ?? null}
      </ul>
    );
  }
  if (node.type === "listitem") {
    return (
      <li key={key}>
        {node.children?.map((child, i) => renderNode(child, i)) ?? null}
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
  if (node.children) {
    return (
      <span key={key}>
        {node.children.map((child, i) => renderNode(child, i))}
      </span>
    );
  }
  return null;
}
