import type { CollectionConfig } from "payload";
import {
  dimensionOptions,
  directionOptions,
  sourcesField,
  tierOptions,
} from "./shared";

export const Questions: CollectionConfig = {
  slug: "questions",
  labels: { singular: "Stelling", plural: "Stellingen" },
  admin: {
    useAsTitle: "statement",
    defaultColumns: ["statement", "dimension", "direction", "tiers"],
    description:
      "Politieke stellingen die in de quiz worden voorgelegd. Per dimensie moet er een gelijke balans zijn tussen 'positive' en 'negative' direction.",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "statement",
      type: "textarea",
      required: true,
      label: "Stelling",
      admin: {
        description:
          "Concrete, actuele stelling. Vermijd vage platitudes; wees specifiek over beleid of waarde.",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "dimension",
          type: "select",
          required: true,
          label: "Dimensie",
          options: dimensionOptions as unknown as { label: string; value: string }[],
        },
        {
          name: "direction",
          type: "select",
          required: true,
          defaultValue: "positive",
          label: "Richting",
          options: directionOptions as unknown as { label: string; value: string }[],
          admin: {
            description:
              "Bepaalt of 'volledig mee eens' de score richting de positieve of negatieve pool stuurt.",
          },
        },
        {
          name: "weight",
          type: "number",
          required: true,
          defaultValue: 1,
          min: 0.25,
          max: 3,
          label: "Gewicht",
        },
      ],
    },
    {
      name: "tiers",
      type: "select",
      required: true,
      hasMany: true,
      label: "Quizlengtes",
      defaultValue: ["standard", "extended"],
      options: tierOptions as unknown as { label: string; value: string }[],
      admin: {
        description:
          "In welke quiz-lengtes verschijnt deze stelling? Quick is een subset van Standard, Standard van Extended.",
      },
    },
    {
      name: "info",
      type: "group",
      label: "Achtergrondinfo (i)",
      admin: {
        description:
          "Wordt getoond als de gebruiker op de info-knop tikt. Houd het neutraal en gebalanceerd.",
      },
      fields: [
        {
          name: "context",
          type: "textarea",
          label: "Context",
        },
        {
          name: "argumentsFor",
          type: "array",
          label: "Argumenten vóór de stelling",
          fields: [{ name: "text", type: "text", required: true }],
        },
        {
          name: "argumentsAgainst",
          type: "array",
          label: "Argumenten tegen de stelling",
          fields: [{ name: "text", type: "text", required: true }],
        },
        sourcesField,
      ],
    },
  ],
};
