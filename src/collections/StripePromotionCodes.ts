import type { CollectionConfig } from "payload";
import { createFreeQuizPromotionCode } from "@/lib/stripe-promotion-codes";

export const StripePromotionCodes: CollectionConfig = {
  slug: "stripe-promotion-codes",
  labels: {
    singular: "Stripe promotiecode",
    plural: "Stripe promotiecodes",
  },
  admin: {
    useAsTitle: "code",
    defaultColumns: ["code", "tier", "maxRedemptions", "expiresAt", "createdAt"],
    description:
      "Admin generator voor Stripe promotion codes. Nieuwe records maken direct een 100 procent korting-code in Stripe aan.",
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation !== "create" || data.stripePromotionCodeId) {
          return data;
        }

        const created = await createFreeQuizPromotionCode({
          code: typeof data.code === "string" ? data.code : undefined,
          tier:
            data.tier === "standard" || data.tier === "extended"
              ? data.tier
              : "all",
          maxRedemptions:
            typeof data.maxRedemptions === "number"
              ? data.maxRedemptions
              : undefined,
          expiresAt:
            typeof data.expiresAt === "string" ? data.expiresAt : undefined,
          note: typeof data.note === "string" ? data.note : undefined,
        });

        return {
          ...data,
          code: created.code,
          stripeCouponId: created.stripeCouponId,
          stripePromotionCodeId: created.stripePromotionCodeId,
        };
      },
    ],
  },
  fields: [
    {
      name: "code",
      type: "text",
      unique: true,
      index: true,
      admin: {
        description:
          "Laat leeg om automatisch een code te genereren. Alleen hoofdletters, cijfers, _ en -.",
      },
    },
    {
      name: "tier",
      type: "select",
      required: true,
      defaultValue: "all",
      options: [
        { label: "Alle betaalde quizzen", value: "all" },
        { label: "Standaard (50)", value: "standard" },
        { label: "Uitgebreid (80)", value: "extended" },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "maxRedemptions",
          type: "number",
          min: 1,
          label: "Maximaal aantal keer te gebruiken",
        },
        {
          name: "expiresAt",
          type: "date",
          label: "Verloopt op",
        },
      ],
    },
    {
      name: "note",
      type: "textarea",
      label: "Interne notitie",
    },
    {
      type: "row",
      fields: [
        {
          name: "stripeCouponId",
          type: "text",
          admin: { readOnly: true },
        },
        {
          name: "stripePromotionCodeId",
          type: "text",
          admin: { readOnly: true },
        },
      ],
    },
  ],
  timestamps: true,
};
