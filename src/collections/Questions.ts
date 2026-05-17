import type { CollectionConfig } from "payload";
import {
  depthOptions,
  dimensionOptions,
  directionOptions,
  sourcesField,
  themeOptions,
  tierOptions,
} from "./shared";

export const Questions: CollectionConfig = {
  slug: "questions",
  labels: { singular: "Stelling", plural: "Stellingen" },
  admin: {
    useAsTitle: "statement",
    defaultColumns: ["statement", "dimension", "direction", "depth", "tiers"],
    description:
      "Politieke stellingen die in de quiz worden voorgelegd. Per dimensie moet er een gelijke balans zijn tussen 'positive' en 'negative' direction.",
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
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
      type: "row",
      fields: [
        {
          name: "depth",
          type: "select",
          required: true,
          defaultValue: "broad",
          label: "Diepte",
          options: depthOptions as unknown as { label: string; value: string }[],
          admin: {
            description:
              "Broad = kalibratievraag, breed onderscheidend; deep = verdiepingsvraag voor nuance.",
          },
        },
        {
          name: "discriminator",
          type: "number",
          required: false,
          defaultValue: 50,
          min: 0,
          max: 100,
          label: "Onderscheidend vermogen",
          admin: {
            description:
              "0-100. Hoe sterk deze vraag tussen ideologie-clusters onderscheidt; gebruikt door de adaptieve engine.",
          },
        },
      ],
    },
    {
      name: "themes",
      type: "select",
      hasMany: true,
      label: "Thema's",
      options: themeOptions as unknown as { label: string; value: string }[],
      admin: {
        description:
          "Eén of meer thema-tags. Stellingen zonder thema tellen alleen mee voor de hoofd-dimensies.",
      },
    },
    {
      name: "derivedStance",
      type: "textarea",
      label: "Afgeleid standpunt (eens-vorm)",
      admin: {
        description:
          "Voorgeformuleerd standpunt dat we tonen op de resultaatpagina ALS de gebruiker (sterk) eens is met deze stelling. Bv. 'Jij vindt dat de hoogste inkomens zwaarder belast moeten worden.'",
      },
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
