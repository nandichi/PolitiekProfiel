import type { CollectionConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import {
  positionVectorField,
  regionOptions,
  regionTypeOptions,
  sourcesField,
} from "./shared";

export const Parties: CollectionConfig = {
  slug: "parties",
  labels: { singular: "Partij", plural: "Partijen" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "abbreviation", "region", "regionType"],
    description:
      "Politieke partijen en partij-families als educatieve context per ideologie. NIET als persoonlijke ranking voor de gebruiker.",
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
        {
          name: "abbreviation",
          type: "text",
          required: true,
          label: "Afkorting",
        },
        {
          name: "slug",
          type: "text",
          required: true,
          unique: true,
          label: "Slug",
          admin: { description: "Kebab-case identifier, bv. 'pvv' of 'epp'." },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "region",
          type: "select",
          required: true,
          label: "Regio",
          options: regionOptions as unknown as { label: string; value: string }[],
        },
        {
          name: "regionType",
          type: "select",
          required: true,
          label: "Type",
          options: regionTypeOptions as unknown as { label: string; value: string }[],
        },
        {
          name: "country",
          type: "text",
          required: false,
          label: "Land (Nederlands, alleen voor nationale partijen)",
        },
      ],
    },
    {
      name: "description",
      type: "richText",
      required: true,
      label: "Beschrijving",
      editor: lexicalEditor({}),
    },
    {
      name: "ideologySlugs",
      type: "text",
      hasMany: true,
      required: true,
      label: "Verwante ideologieën (slugs)",
      admin: {
        description:
          "Eén of meer ideologie-slugs (bv. 'sociaal-democraat') waarop deze partij politiek het meeste lijkt. Wordt gebruikt om partijen in de resultaatpagina te koppelen aan de ideologie van de gebruiker.",
      },
    },
    positionVectorField,
    {
      type: "row",
      fields: [
        { name: "founded", type: "text", required: false, label: "Opgericht" },
        { name: "leader", type: "text", required: false, label: "Huidige leider" },
        { name: "websiteUrl", type: "text", required: false, label: "Website" },
      ],
    },
    {
      name: "lastReviewed",
      type: "date",
      label: "Laatst herzien",
      admin: {
        description:
          "Wanneer is deze partij-positie voor het laatst gecontroleerd? Eens per jaar herzien.",
      },
    },
    sourcesField,
  ],
};
