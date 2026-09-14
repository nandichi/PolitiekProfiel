import type { CollectionConfig } from "payload";
import { hasPayloadAdmin } from "@/lib/payload-access";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
    description: "Beheerders met toegang tot het CMS.",
  },
  auth: true,
  access: {
    read: ({ req }) => hasPayloadAdmin(req),
    create: ({ req }) => hasPayloadAdmin(req),
    update: ({ req }) => hasPayloadAdmin(req),
    delete: ({ req }) => hasPayloadAdmin(req),
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Naam",
    },
    {
      name: "role",
      type: "select",
      label: "Rol",
      required: true,
      defaultValue: "editor",
      options: [
        { label: "Beheerder", value: "admin" },
        { label: "Redacteur", value: "editor" },
      ],
      access: {
        create: ({ req }) => hasPayloadAdmin(req),
        update: ({ req }) => hasPayloadAdmin(req),
      },
      admin: {
        description:
          "Nieuwe gebruikers starten als redacteur. Alleen een beheerder kan rollen wijzigen.",
      },
    },
  ],
};
