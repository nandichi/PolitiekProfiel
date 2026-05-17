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
          name: "roleKind",
          type: "select",
          required: false,
          label: "Type rol",
          options: [
            { label: "Minister-president", value: "minister-president" },
            { label: "Vice-premier", value: "vice-premier" },
            { label: "Minister", value: "minister" },
            { label: "Fractievoorzitter", value: "fractievoorzitter" },
            { label: "Kamerlid", value: "kamerlid" },
            { label: "Partijleider", value: "partijleider" },
            { label: "Europarlementariër", value: "europarlementarier" },
            { label: "President", value: "president" },
            { label: "Premier", value: "premier" },
            { label: "Bondskanselier", value: "bondskanselier" },
            { label: "Senator", value: "senator" },
            { label: "Congreslid", value: "congreslid" },
            { label: "Voormalig", value: "voormalig" },
          ],
        },
        {
          name: "country",
          type: "text",
          required: true,
          label: "Land (Nederlands)",
        },
        { name: "party", type: "text", required: true, label: "Partij" },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "partySlug",
          type: "text",
          required: false,
          label: "Partij-slug (voor cross-link)",
          admin: {
            description:
              "Kebab-case slug van de gerelateerde partij in `parties` (bv. 'd66').",
          },
        },
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
    {
      name: "quotes",
      type: "array",
      label: "Citaten",
      admin: {
        description:
          "Pakkende quotes voor onder andere de Turing-test en politicus-detailpagina.",
      },
      fields: [
        { name: "text", type: "textarea", required: true, label: "Citaat" },
        { name: "sourceLabel", type: "text", required: true, label: "Bron" },
        { name: "sourceUrl", type: "text", required: false, label: "Bron-URL" },
      ],
    },
    {
      name: "lastReviewed",
      type: "date",
      label: "Laatst herzien",
      admin: {
        description:
          "Datum van laatste verificatie van rol en positie. Politici wisselen partij/rol — peil per build.",
      },
    },
    sourcesField,
  ],
};
