import type { CollectionConfig } from "payload";

export const quizEventTypes = [
  { label: "Quiz gestart", value: "quiz-started" },
  { label: "Vraag bekeken", value: "question-viewed" },
  { label: "Vraag beantwoord", value: "question-answered" },
  { label: "Vraag overgeslagen", value: "question-skipped" },
  { label: "Vraag terug", value: "question-back" },
  { label: "Info-drawer geopend", value: "info-opened" },
  { label: "Resume-prompt", value: "resume-prompt" },
  { label: "Adaptieve batch", value: "adaptive-batch" },
  { label: "Quiz afgerond", value: "quiz-completed" },
  { label: "Quiz verlaten", value: "quiz-abandoned" },
] as const;

export type QuizEventType = (typeof quizEventTypes)[number]["value"];

export const QuizEvents: CollectionConfig = {
  slug: "quiz-events",
  labels: { singular: "Quiz-event", plural: "Quiz-events" },
  admin: {
    useAsTitle: "type",
    defaultColumns: [
      "type",
      "attemptId",
      "trackingId",
      "questionId",
      "value",
      "occurredAt",
    ],
    description:
      "Append-only ruwe events tijdens de quiz. Bevat geen IP of user-agent.",
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
          name: "type",
          type: "select",
          required: true,
          index: true,
          label: "Type",
          options: quizEventTypes as unknown as {
            label: string;
            value: string;
          }[],
        },
        {
          name: "occurredAt",
          type: "date",
          required: true,
          index: true,
          label: "Tijdstip",
          admin: {
            description:
              "Tijdstip dat het event in de browser werd gegenereerd (client-clock).",
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "attemptId",
          type: "text",
          required: true,
          index: true,
          label: "Attempt-ID",
        },
        {
          name: "trackingId",
          type: "text",
          required: true,
          index: true,
          label: "Tracking-ID",
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "tier",
          type: "text",
          required: false,
          label: "Tier",
        },
        {
          name: "adaptive",
          type: "checkbox",
          required: false,
          defaultValue: false,
          label: "Adaptief",
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "questionId",
          type: "number",
          required: false,
          index: true,
          label: "Vraag-ID",
        },
        {
          name: "value",
          type: "number",
          required: false,
          min: -2,
          max: 2,
          label: "Waarde (-2..+2)",
        },
        {
          name: "cursor",
          type: "number",
          required: false,
          label: "Cursor-positie",
        },
        {
          name: "timeOnQuestionMs",
          type: "number",
          required: false,
          label: "Tijd op vraag (ms)",
        },
      ],
    },
    {
      name: "meta",
      type: "json",
      required: false,
      label: "Extra metadata",
      admin: {
        description:
          "Optionele extra context, bv. resume-keuze 'continue'|'restart', batch-grootte, of abandon-reason.",
      },
    },
  ],
  timestamps: true,
};
