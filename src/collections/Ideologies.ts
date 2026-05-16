import type { CollectionConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vectorField } from "./shared";

export const Ideologies: CollectionConfig = {
  slug: "ideologies",
  labels: { singular: "Ideologie", plural: "Ideologieën" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "spectrumPosition"],
    description:
      "Politieke stromingen die als resultaat aan de gebruiker worden gepresenteerd.",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true, label: "Naam" },
        {
          name: "slug",
          type: "text",
          required: true,
          unique: true,
          label: "Slug",
          admin: { description: "Kebab-case identifier, bv. 'sociaal-democraat'." },
        },
      ],
    },
    {
      name: "shortDescription",
      type: "textarea",
      required: true,
      label: "Korte samenvatting (1 zin)",
    },
    {
      name: "description",
      type: "richText",
      required: true,
      label: "Volledige beschrijving",
      editor: lexicalEditor({}),
    },
    {
      name: "spectrumPosition",
      type: "select",
      required: true,
      label: "Klassiek links-rechts",
      options: [
        { label: "Ver-links", value: "ver-links" },
        { label: "Links", value: "links" },
        { label: "Centrum-links", value: "centrum-links" },
        { label: "Centrum", value: "centrum" },
        { label: "Centrum-rechts", value: "centrum-rechts" },
        { label: "Rechts", value: "rechts" },
        { label: "Ver-rechts", value: "ver-rechts" },
      ],
    },
    vectorField("profileVector", "Profielvector"),
    {
      name: "examplePeople",
      type: "array",
      label: "Voorbeelden (personen, partijen, bewegingen)",
      fields: [{ name: "text", type: "text", required: true }],
    },
  ],
};
