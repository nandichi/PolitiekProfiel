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
      name: "attemptId",
      type: "text",
      required: false,
      index: true,
      label: "Attempt-ID",
      admin: {
        description:
          "Koppelt dit resultaat aan een quiz-attempts row. Leeg voor historische resultaten van vóór de tracking-integratie.",
      },
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
      name: "themeScores",
      type: "group",
      label: "Thema-scores",
      admin: {
        description:
          "Optioneel; pas gevuld vanaf v2 van de quiz. Score per thema -100..+100.",
      },
      fields: [
        { name: "klimaat", type: "number", required: false },
        { name: "zorg", type: "number", required: false },
        { name: "migratie", type: "number", required: false },
        { name: "economie", type: "number", required: false },
        { name: "eu", type: "number", required: false },
        { name: "democratie", type: "number", required: false },
        { name: "wonen", type: "number", required: false },
      ],
    },
    {
      name: "confidence",
      type: "group",
      label: "Confidence per dimensie (0-100)",
      admin: {
        description:
          "Optioneel; pas gevuld vanaf v2. Hoe zeker het profiel is per dimensie, op basis van # antwoorden, sterkte en variance.",
      },
      fields: [
        { name: "economic", type: "number", required: false },
        { name: "social", type: "number", required: false },
        { name: "civil", type: "number", required: false },
        { name: "governance", type: "number", required: false },
        { name: "trust", type: "number", required: false },
      ],
    },
    {
      name: "paradoxes",
      type: "array",
      label: "Paradoxen",
      admin: {
        description:
          "Lijst van interne tegenstrijdigheden gedetecteerd in de antwoorden.",
      },
      fields: [
        { name: "dimension", type: "text", required: false },
        { name: "theme", type: "text", required: false },
        { name: "type", type: "text", required: true },
        { name: "severity", type: "number", required: true },
        { name: "description", type: "text", required: false },
        {
          name: "exampleQuestionIds",
          type: "array",
          label: "Voorbeelden",
          fields: [{ name: "questionId", type: "number", required: true }],
        },
      ],
    },
    {
      name: "answers",
      type: "array",
      label: "Antwoorden (anoniem)",
      admin: {
        description:
          "Vraag-ID + waarde voor stance-extractie. Bevat geen PII.",
      },
      fields: [
        { name: "questionId", type: "number", required: true },
        { name: "value", type: "number", required: true },
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
