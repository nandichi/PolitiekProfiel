import type { Field } from "payload";

export const dimensionOptions = [
  { label: "Economisch", value: "economic" },
  { label: "Sociaal-cultureel", value: "social" },
  { label: "Burgerrechten", value: "civil" },
  { label: "Bestuur", value: "governance" },
  { label: "Systeemvertrouwen", value: "trust" },
] as const;

export const tierOptions = [
  { label: "Quick (30)", value: "quick" },
  { label: "Standaard (50)", value: "standard" },
  { label: "Uitgebreid (80)", value: "extended" },
] as const;

export const directionOptions = [
  {
    label: "Eens = beweegt naar positieve pool (+)",
    value: "positive",
  },
  {
    label: "Eens = beweegt naar negatieve pool (-)",
    value: "negative",
  },
] as const;

export function vectorField(name: string, label: string): Field {
  return {
    name,
    type: "group",
    label,
    admin: {
      description:
        "Score per dimensie tussen -100 en +100. -100 = volledig negatieve pool, +100 = volledig positieve pool.",
    },
    fields: [
      {
        type: "row",
        fields: [
          {
            name: "economic",
            type: "number",
            required: true,
            min: -100,
            max: 100,
            label: "Economisch (vrije markt → sterke staat)",
          },
          {
            name: "social",
            type: "number",
            required: true,
            min: -100,
            max: 100,
            label: "Sociaal (conservatief → progressief)",
          },
        ],
      },
      {
        type: "row",
        fields: [
          {
            name: "civil",
            type: "number",
            required: true,
            min: -100,
            max: 100,
            label: "Burgerrechten (autoritair → libertair)",
          },
          {
            name: "governance",
            type: "number",
            required: true,
            min: -100,
            max: 100,
            label: "Bestuur (nationaal → multilevel)",
          },
        ],
      },
      {
        name: "trust",
        type: "number",
        required: true,
        min: -100,
        max: 100,
        label: "Systeemvertrouwen (wantrouwen → vertrouwen)",
      },
    ],
  };
}

export const positionVectorField: Field = vectorField(
  "positionVector",
  "Positie op assen (-100 tot +100)",
);

export const sourcesField: Field = {
  name: "sources",
  type: "array",
  label: "Bronnen",
  admin: {
    description:
      "Onderbouwende bronnen die de gekozen positie of stelling staven.",
  },
  fields: [
    {
      type: "row",
      fields: [
        { name: "label", type: "text", required: true, label: "Titel/uitgever" },
        { name: "url", type: "text", required: true, label: "URL" },
      ],
    },
  ],
};
