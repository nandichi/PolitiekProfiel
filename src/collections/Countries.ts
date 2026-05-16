import type { CollectionConfig } from "payload";
import { positionVectorField, sourcesField } from "./shared";

export const Countries: CollectionConfig = {
  slug: "countries",
  labels: { singular: "Land", plural: "Landen" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "countryCode"],
    description:
      "Landen met hun gemiddelde politieke positie als referentie voor de gebruiker.",
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
          name: "countryCode",
          type: "text",
          required: true,
          label: "ISO-2 code",
          minLength: 2,
          maxLength: 2,
        },
      ],
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      label: "Beschrijving",
    },
    positionVectorField,
    sourcesField,
  ],
};
