import type { CollectionConfig } from "payload";

export const Results: CollectionConfig = {
  slug: "results",
  labels: { singular: "Resultaat", plural: "Resultaten" },
  admin: {
    useAsTitle: "shareId",
    defaultColumns: ["shareId", "ideologySlug", "lengthTier", "createdAt"],
    description:
      "Anoniem opgeslagen quizresultaten, opgehaald via een shareId in de URL.",
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "shareId",
      type: "text",
      required: true,
      unique: true,
      index: true,
      label: "Share-ID",
      admin: { description: "Korte unieke string in de URL." },
    },
    {
      name: "lengthTier",
      type: "select",
      required: true,
      defaultValue: "standard",
      options: [
        { label: "Quick", value: "quick" },
        { label: "Standaard", value: "standard" },
        { label: "Uitgebreid", value: "extended" },
      ],
    },
    {
      name: "ideologySlug",
      type: "text",
      required: true,
      index: true,
    },
    {
      name: "dimensions",
      type: "group",
      label: "Dimensiescores",
      fields: [
        { name: "economic", type: "number", required: true },
        { name: "social", type: "number", required: true },
        { name: "civil", type: "number", required: true },
        { name: "governance", type: "number", required: true },
        { name: "trust", type: "number", required: true },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "answeredCount", type: "number", required: true },
        { name: "skippedCount", type: "number", required: true },
        { name: "totalQuestions", type: "number", required: true },
      ],
    },
  ],
  timestamps: true,
};
