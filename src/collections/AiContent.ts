import type { CollectionConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { aiContentKindOptions } from "./shared";

export const AiContent: CollectionConfig = {
  slug: "aiContent",
  labels: { singular: "AI-content", plural: "AI-content" },
  admin: {
    useAsTitle: "slug",
    defaultColumns: ["slug", "kind", "generatedAt", "model"],
    description:
      "Vooraf gegenereerde teksten voor de resultaatpagina. Build-time gegenereerd, gebruiker-data raakt nooit OpenAI.",
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "slug",
          type: "text",
          required: true,
          unique: true,
          index: true,
          label: "Slug",
          admin: {
            description:
              "Unieke sleutel, bv. 'ideology:sociaal-liberaal:essay' of 'dimension:economic:bucket:strong-positive'.",
          },
        },
        {
          name: "kind",
          type: "select",
          required: true,
          label: "Soort",
          options: aiContentKindOptions as unknown as {
            label: string;
            value: string;
          }[],
        },
      ],
    },
    {
      name: "title",
      type: "text",
      required: false,
      label: "Titel (optioneel)",
    },
    {
      name: "body",
      type: "richText",
      required: true,
      label: "Inhoud",
      editor: lexicalEditor({}),
    },
    {
      name: "items",
      type: "array",
      label: "Lijst-items (bij argumenten / leesvoer)",
      admin: {
        description:
          "Optioneel: voor slots die uit een reeks korte items bestaan (bv. argumentsFor, reading).",
      },
      fields: [
        { name: "text", type: "textarea", required: true, label: "Tekst" },
        { name: "meta", type: "text", required: false, label: "Bron/auteur (optioneel)" },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "model",
          type: "text",
          required: true,
          label: "Model",
          admin: { description: "Bv. 'gpt-4o-2024-08-06'." },
        },
        {
          name: "generatedAt",
          type: "date",
          required: true,
          label: "Gegenereerd op",
        },
      ],
    },
    {
      name: "prompt",
      type: "textarea",
      required: false,
      label: "Prompt (audit-trail)",
      admin: {
        description:
          "Volledige prompt waarmee deze tekst is gegenereerd. Openbaar voor transparantie.",
      },
    },
    {
      name: "humanEdited",
      type: "checkbox",
      defaultValue: false,
      label: "Handmatig bewerkt",
      admin: {
        description:
          "Aanvinken als een redacteur deze tekst heeft aangepast; voorkomt overschrijven bij regeneratie.",
      },
    },
  ],
  timestamps: true,
};
