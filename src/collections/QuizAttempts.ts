import type { CollectionConfig } from "payload";
import { tierOptions } from "./shared";

export const QuizAttempts: CollectionConfig = {
  slug: "quiz-attempts",
  labels: { singular: "Quiz-poging", plural: "Quiz-pogingen" },
  admin: {
    useAsTitle: "attemptId",
    defaultColumns: [
      "attemptId",
      "trackingId",
      "tier",
      "submitted",
      "questionsAnswered",
      "startedAt",
    ],
    description:
      "Eén document per quiz-poging (start). Bevat alleen anonieme telemetrie: geen IP, geen user-agent.",
    hidden: true,
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "attemptId",
          type: "text",
          required: true,
          unique: true,
          index: true,
          label: "Attempt-ID",
        },
        {
          name: "trackingId",
          type: "text",
          required: true,
          index: true,
          label: "Tracking-ID",
          admin: {
            description:
              "Browser-persistent ID uit localStorage. Stabiel over meerdere quizzes.",
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "tier",
          type: "select",
          required: true,
          label: "Quizlengte",
          options: tierOptions as unknown as { label: string; value: string }[],
        },
        {
          name: "adaptive",
          type: "checkbox",
          defaultValue: false,
          label: "Adaptief",
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "startedAt",
          type: "date",
          required: true,
          index: true,
          label: "Gestart op",
        },
        {
          name: "lastEventAt",
          type: "date",
          required: false,
          label: "Laatste event",
        },
        {
          name: "completedAt",
          type: "date",
          required: false,
          label: "Afgerond/verlaten op",
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "submitted",
          type: "checkbox",
          defaultValue: false,
          label: "Ingediend",
        },
        {
          name: "abandoned",
          type: "checkbox",
          defaultValue: false,
          label: "Verlaten",
        },
        {
          name: "shareId",
          type: "text",
          required: false,
          index: true,
          label: "Share-ID",
          admin: {
            description:
              "Gevuld na succesvolle submit; koppelt deze poging aan het Results-record.",
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "questionsSeen",
          type: "number",
          required: true,
          defaultValue: 0,
          label: "# Gezien",
        },
        {
          name: "questionsAnswered",
          type: "number",
          required: true,
          defaultValue: 0,
          label: "# Beantwoord",
        },
        {
          name: "questionsSkipped",
          type: "number",
          required: true,
          defaultValue: 0,
          label: "# Overgeslagen",
        },
        {
          name: "questionsBack",
          type: "number",
          required: true,
          defaultValue: 0,
          label: "# Terug",
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "infoOpenedCount",
          type: "number",
          required: true,
          defaultValue: 0,
          label: "# Info-drawer geopend",
        },
        {
          name: "durationMs",
          type: "number",
          required: false,
          label: "Duur (ms)",
          admin: {
            description:
              "Tijd tussen startedAt en completedAt. Gevuld bij submit of abandon.",
          },
        },
      ],
    },
  ],
  timestamps: true,
};
