import type { CollectionConfig } from "payload";
import { tierOptions } from "./shared";

export const Entitlements: CollectionConfig = {
  slug: "entitlements",
  labels: { singular: "Entitlement", plural: "Entitlements" },
  admin: {
    useAsTitle: "token",
    defaultColumns: ["token", "tier", "status", "createdAt"],
    description:
      "Betaaltoegang voor quiz-tiers. Bevat geen e-mail, antwoorden, tracking-ID of resultaat-ID.",
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "token",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        description:
          "Opaque capability-token dat de browser tijdelijk gebruikt om een betaalde quiz te starten.",
      },
    },
    {
      name: "tier",
      type: "select",
      required: true,
      options: tierOptions.filter((tier) => tier.value !== "quick"),
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Betaald", value: "paid" },
        { label: "Ingetrokken", value: "revoked" },
      ],
      index: true,
    },
    {
      type: "row",
      fields: [
        {
          name: "stripeCheckoutSessionId",
          type: "text",
          index: true,
          admin: { readOnly: true },
        },
        {
          name: "stripePaymentIntentId",
          type: "text",
          index: true,
          admin: { readOnly: true },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "stripePriceId",
          type: "text",
          admin: { readOnly: true },
        },
        {
          name: "amountTotal",
          type: "number",
          admin: {
            readOnly: true,
            description: "Bedrag in minor units, bijvoorbeeld centen.",
          },
        },
        {
          name: "currency",
          type: "text",
          admin: { readOnly: true },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "paidAt",
          type: "date",
          admin: { readOnly: true },
        },
        {
          name: "consumedAt",
          type: "date",
          admin: {
            readOnly: true,
            description:
              "Wordt gezet na submit, zonder link naar het politieke resultaat.",
          },
        },
      ],
    },
  ],
  timestamps: true,
};
