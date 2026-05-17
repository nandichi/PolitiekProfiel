import "server-only";

import { payload } from "@/lib/payload";
import { lexicalToPlainText } from "@/lib/lexical";
import type { DimensionId } from "@/lib/dimensions";
import type { ScoreBucket } from "@/lib/buckets";
import type { ThemeId } from "@/lib/themes";
import type { ParadoxType } from "@/lib/paradox";

export interface AiContentItem {
  text: string;
  meta?: string;
}

export interface AiContentRecord {
  slug: string;
  kind: string;
  title?: string;
  body: string;
  bodyLexical: unknown;
  items: AiContentItem[];
  model: string;
  generatedAt: string;
  humanEdited: boolean;
}

interface AiContentDoc {
  slug: string;
  kind: string;
  title?: string;
  body: unknown;
  items?: AiContentItem[] | null;
  model: string;
  generatedAt: string;
  humanEdited?: boolean;
}

function mapDoc(d: AiContentDoc): AiContentRecord {
  return {
    slug: d.slug,
    kind: d.kind,
    title: d.title,
    body: lexicalToPlainText(d.body),
    bodyLexical: d.body,
    items: Array.isArray(d.items) ? d.items : [],
    model: d.model,
    generatedAt: d.generatedAt,
    humanEdited: Boolean(d.humanEdited),
  };
}

export async function getAiContentBySlug(
  slug: string,
): Promise<AiContentRecord | null> {
  const p = await payload();
  const res = await p.find({
    collection: "aiContent",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  });
  const doc = res.docs[0] as unknown as AiContentDoc | undefined;
  return doc ? mapDoc(doc) : null;
}

export async function getAiContentBySlugs(
  slugs: ReadonlyArray<string>,
): Promise<Map<string, AiContentRecord>> {
  if (slugs.length === 0) return new Map();
  const p = await payload();
  const res = await p.find({
    collection: "aiContent",
    where: { slug: { in: slugs as string[] } },
    limit: slugs.length + 10,
    depth: 0,
    pagination: false,
  });
  const docs = res.docs as unknown as AiContentDoc[];
  const map = new Map<string, AiContentRecord>();
  for (const d of docs) map.set(d.slug, mapDoc(d));
  return map;
}

export function ideologyEssaySlug(slug: string): string {
  return `ideology:${slug}:essay`;
}

export function ideologyReadingSlug(slug: string): string {
  return `ideology:${slug}:reading`;
}

export function ideologyArgumentsForSlug(slug: string): string {
  return `ideology:${slug}:arguments-for`;
}

export function ideologyArgumentsAgainstSlug(slug: string): string {
  return `ideology:${slug}:arguments-against`;
}

export function ideologyThemeSlug(slug: string, theme: ThemeId): string {
  return `ideology:${slug}:theme:${theme}`;
}

export function dimensionBucketSlug(
  dim: DimensionId,
  bucket: ScoreBucket,
): string {
  return `dimension:${dim}:bucket:${bucket}`;
}

export function paradoxSlug(type: ParadoxType): string {
  return `paradox:${type}`;
}
