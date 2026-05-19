"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const VALID_TIERS = ["quick", "standard", "extended"] as const;
type Tier = (typeof VALID_TIERS)[number];

const ID_PATTERN = /^[A-Za-z0-9_-]{6,32}$/;
const SLUG_PATTERN = /^[a-z0-9-]{1,64}$/;

interface ToolDef {
  name: string;
  title?: string;
  description: string;
  inputSchema?: object;
  execute: (input: unknown) => Promise<unknown> | unknown;
  annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean };
}

interface ModelContextLike {
  registerTool?: (tool: ToolDef) => void;
  provideContext?: (input: { tools: ToolDef[] }) => void;
}

function isTier(value: unknown): value is Tier {
  return typeof value === "string" && (VALID_TIERS as readonly string[]).includes(value);
}

function isResultId(value: unknown): value is string {
  return typeof value === "string" && ID_PATTERN.test(value);
}

function isSlug(value: unknown): value is string {
  return typeof value === "string" && SLUG_PATTERN.test(value);
}

export function WebMcpProvider() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const nav = window.navigator as Navigator & {
      modelContext?: ModelContextLike;
    };
    const modelContext = nav.modelContext;
    if (!modelContext) return;

    const tools: ToolDef[] = [
      {
        name: "start_quiz",
        title: "Start een politieke kompas-quiz",
        description:
          "Navigeert de gebruiker naar de PolitiekProfiel-quiz in de gekozen lengte. Antwoorden worden lokaal in de browser bewaard tot het resultaat wordt opgeslagen.",
        inputSchema: {
          type: "object",
          additionalProperties: false,
          required: ["tier"],
          properties: {
            tier: {
              type: "string",
              enum: ["quick", "standard", "extended"],
              description:
                "Quizlengte. quick = 15 vragen (~3 min, gratis), standard = 50 vragen (~10 min), extended = 80 vragen (~20 min).",
            },
          },
        },
        annotations: { readOnlyHint: false },
        execute(input) {
          const tier = (input as { tier?: unknown } | null)?.tier;
          if (!isTier(tier)) {
            return { ok: false, error: "Ongeldige tier. Gebruik quick, standard of extended." };
          }
          router.push(`/quiz/${tier}`);
          return { ok: true, navigatedTo: `/quiz/${tier}` };
        },
      },
      {
        name: "open_compare",
        title: "Vergelijk twee politieke profielen",
        description:
          "Opent de vergelijkingspagina voor twee profielen. Beide parameters zijn slugs van een ideologie, politicus of land (bijv. 'sociaal-liberalisme', 'mark-rutte', 'nederland').",
        inputSchema: {
          type: "object",
          additionalProperties: false,
          required: ["a", "b"],
          properties: {
            a: {
              type: "string",
              pattern: "^[a-z0-9-]{1,64}$",
              description: "Slug van het eerste profiel.",
            },
            b: {
              type: "string",
              pattern: "^[a-z0-9-]{1,64}$",
              description: "Slug van het tweede profiel.",
            },
          },
        },
        annotations: { readOnlyHint: true },
        execute(input) {
          const obj = input as { a?: unknown; b?: unknown } | null;
          if (!isSlug(obj?.a) || !isSlug(obj?.b)) {
            return {
              ok: false,
              error:
                "Ongeldige slugs. Gebruik kleine letters, cijfers en koppeltekens (max 64 tekens).",
            };
          }
          const url = `/vergelijk?a=${encodeURIComponent(obj.a)}&b=${encodeURIComponent(obj.b)}`;
          router.push(url);
          return { ok: true, navigatedTo: url };
        },
      },
      {
        name: "open_result",
        title: "Open een opgeslagen quiz-resultaat",
        description:
          "Opent een eerder opgeslagen, anoniem PolitiekProfiel-resultaat aan de hand van de share-ID die de quiz-API teruggeeft.",
        inputSchema: {
          type: "object",
          additionalProperties: false,
          required: ["id"],
          properties: {
            id: {
              type: "string",
              pattern: "^[A-Za-z0-9_-]{6,32}$",
              description: "Share-ID van een opgeslagen resultaat (zoals geretourneerd door POST /api/results).",
            },
          },
        },
        annotations: { readOnlyHint: true },
        execute(input) {
          const id = (input as { id?: unknown } | null)?.id;
          if (!isResultId(id)) {
            return { ok: false, error: "Ongeldig resultaat-ID." };
          }
          router.push(`/r/${id}`);
          return { ok: true, navigatedTo: `/r/${id}` };
        },
      },
    ];

    const registered: string[] = [];

    if (typeof modelContext.registerTool === "function") {
      for (const tool of tools) {
        try {
          modelContext.registerTool(tool);
          registered.push(tool.name);
        } catch (err) {
          console.warn(`[webmcp] kon tool '${tool.name}' niet registreren:`, err);
        }
      }
    } else if (typeof modelContext.provideContext === "function") {
      try {
        modelContext.provideContext({ tools });
        registered.push(...tools.map((t) => t.name));
      } catch (err) {
        console.warn("[webmcp] provideContext mislukt:", err);
      }
    }

    return () => {
      const ctx = modelContext as ModelContextLike & {
        unregisterTool?: (name: string) => void;
      };
      if (typeof ctx.unregisterTool === "function") {
        for (const name of registered) {
          try {
            ctx.unregisterTool(name);
          } catch {
            /* noop */
          }
        }
      }
    };
  }, [router]);

  return null;
}
