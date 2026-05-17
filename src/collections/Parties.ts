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
        { name: "leader", type: "text", required: false, label: "Politiek leider / lijsttrekker" },
        {
          name: "factionLeader",
          type: "text",
          required: false,
          label: "Fractievoorzitter TK",
        },
        { name: "websiteUrl", type: "text", required: false, label: "Website" },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "seatsTK2025",
          type: "number",
          required: false,
          min: 0,
          max: 150,
          label: "Zetels TK 2025 (per peildatum)",
          admin: {
            description:
              "Aantal Tweede Kamer-zetels na verkiezingen 29 oktober 2025, inclusief eventuele afsplitsingen per peildatum.",
          },
        },
        {
          name: "coalitionStatus",
          type: "select",
          required: false,
          label: "Coalitie-status t.o.v. zittend kabinet",
          options: [
            { label: "Regering", value: "governing" },
            { label: "Oppositie", value: "opposition" },
            { label: "Afsplitsing", value: "splinter" },
            { label: "Niet van toepassing", value: "none" },
          ],
        },
        {
          name: "cpbReviewed2025",
          type: "checkbox",
          defaultValue: false,
          label: "CPB-doorrekening 2025-2028?",
        },
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
