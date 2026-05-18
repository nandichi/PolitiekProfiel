import Link from "next/link";
import type { ReactNode } from "react";
import { mono, tokens } from "../styles";

export interface DataTableColumn<T> {
  key: string;
  label: string;
  align?: "left" | "right";
  width?: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  rows: T[];
  columns: DataTableColumn<T>[];
  emptyMessage?: string;
  rowHref?: (row: T) => string | null;
}

export function DataTable<T>({
  rows,
  columns,
  emptyMessage = "Geen rijen.",
  rowHref,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div
        style={{
          color: tokens.textMuted,
          padding: "32px 0",
          fontSize: "0.85rem",
          textAlign: "center",
          border: `1px dashed ${tokens.border}`,
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  const gridTemplate = columns
    .map((c) => c.width ?? "1fr")
    .join(" ");

  return (
    <div style={{ border: `1px solid ${tokens.border}` }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: gridTemplate,
          gap: "12px",
          padding: "10px 12px",
          background: tokens.surface,
          borderBottom: `1px solid ${tokens.border}`,
          ...mono,
          fontSize: "0.7rem",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: tokens.textSubtle,
        }}
      >
        {columns.map((c) => (
          <span key={c.key} style={{ textAlign: c.align ?? "left" }}>
            {c.label}
          </span>
        ))}
      </div>

      {rows.map((row, i) => {
        const href = rowHref ? rowHref(row) : null;
        const body = (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: gridTemplate,
              gap: "12px",
              padding: "10px 12px",
              borderBottom:
                i === rows.length - 1 ? "none" : `1px solid ${tokens.border}`,
              alignItems: "center",
              fontSize: "0.85rem",
              color: tokens.text,
              textDecoration: "none",
            }}
          >
            {columns.map((c) => (
              <span
                key={c.key}
                style={{
                  textAlign: c.align ?? "left",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {c.render(row)}
              </span>
            ))}
          </div>
        );
        if (href) {
          return (
            <Link
              key={i}
              href={href}
              style={{
                display: "block",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              {body}
            </Link>
          );
        }
        return <div key={i}>{body}</div>;
      })}
    </div>
  );
}
