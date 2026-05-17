import type { CollectionConfig } from "payload";
import { positionVectorField, sourcesField } from "./shared";

export const Politicians: CollectionConfig = {
  slug: "politicians",
  labels: { singular: "Politicus", plural: "Politici" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "country", "party", "isInternational"],
    description:
      "Bekende politici die als referentiepunten dienen op de resultaatpagina.",
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
        { name: "name", type: "text", required: true, label: "Naam" },
        { name: "role", type: "text", required: true, label: "Rol/functie" },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "country",
          type: "text",
          required: true,
          label: "Land (Nederlands)",
        },
        { name: "party", type: "text", required: true, label: "Partij" },
        {
          name: "isInternational",
          type: "checkbox",
          defaultValue: false,
          label: "Internationaal?",
        },
      ],
    },
    {
      name: "bio",
      type: "textarea",
      required: true,
      label: "Korte beschrijving",
    },
    {
      name: "ideologySlugs",
      type: "text",
      hasMany: true,
      label: "Verwante ideologieën (slugs)",
      admin: {
        description:
          "Eén of meer ideologie-slugs (bv. 'sociaal-liberaal') waarop deze politicus politiek het meeste lijkt. Wordt gebruikt voor de 'politici van jouw ideologie'-toggle.",
      },
    },
    positionVectorField,
    sourcesField,
  ],
};
