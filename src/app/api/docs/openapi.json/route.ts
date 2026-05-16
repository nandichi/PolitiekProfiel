import { NextResponse } from "next/server";

const BASE_URL = "https://politiekprofiel.nl";

export const dynamic = "force-static";

export function GET() {
  const spec = {
    openapi: "3.1.0",
    info: {
      title: "PolitiekProfiel API",
      version: "1.0.0",
      summary:
        "Anonieme scoring-API voor het PolitiekProfiel-kompas. Antwoorden in, gescoorde dimensies en gedeelde resultaat-ID uit.",
      description:
        "PolitiekProfiel is een Nederlandstalig politiek kompas op vijf onafhankelijke dimensies (economisch, sociaal-cultureel, burgerrechten, bestuur, systeemvertrouwen). Deze API ontvangt antwoorden van een quizsessie, berekent dimensiescores en de best passende ideologie, en slaat het anonieme resultaat op met een korte share-ID.",
      contact: {
        name: "PolitiekProfiel",
        url: BASE_URL,
      },
      license: {
        name: "All rights reserved",
        url: `${BASE_URL}/privacy`,
      },
    },
    servers: [
      {
        url: BASE_URL,
        description: "Productie",
      },
    ],
    tags: [
      {
        name: "results",
        description: "Quiz-resultaten anoniem indienen en delen",
      },
    ],
    paths: {
      "/api/results": {
        post: {
          tags: ["results"],
          operationId: "submitQuizAnswers",
          summary: "Quiz-antwoorden indienen en geanonimiseerd resultaat opslaan",
          description:
            "Ontvangt een tier (quick / standard / extended) en een lijst antwoorden, valideert en scoort deze, bepaalt de best passende ideologie en slaat het anonieme resultaat op. Geeft een korte `id` terug die in de URL `/r/{id}` opvraagbaar is.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SubmitRequest" },
                examples: {
                  quick: {
                    summary: "Quick tier — 5 antwoorden",
                    value: {
                      tier: "quick",
                      answers: [
                        { questionId: 1, value: 2 },
                        { questionId: 2, value: -1 },
                        { questionId: 3, value: 0 },
                        { questionId: 4, value: 1 },
                        { questionId: 5, value: null },
                      ],
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Resultaat opgeslagen",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SubmitResponse" },
                },
              },
            },
            "400": {
              description: "Ongeldige input (onbekende tier, geen of te weinig antwoorden, ongeldige IDs)",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            "500": {
              description: "Interne fout (bijv. ontbrekende quiz-content of ideologieën)",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Tier: {
          type: "string",
          enum: ["quick", "standard", "extended"],
          description:
            "Quizlengte. quick = ~30 vragen, standard = ~50, extended = ~80.",
        },
        AnswerValue: {
          type: "integer",
          enum: [-2, -1, 0, 1, 2],
          description:
            "Likert-schaal: -2 (sterk oneens), -1 (oneens), 0 (neutraal), 1 (eens), 2 (sterk eens). Stuur `null` om over te slaan.",
        },
        Answer: {
          type: "object",
          required: ["questionId", "value"],
          properties: {
            questionId: {
              type: "integer",
              minimum: 1,
              description: "ID van de stelling zoals geleverd door de quiz-content.",
            },
            value: {
              nullable: true,
              oneOf: [{ $ref: "#/components/schemas/AnswerValue" }, { type: "null" }],
              description: "Likert-waarde of `null` (overgeslagen).",
            },
          },
        },
        SubmitRequest: {
          type: "object",
          required: ["tier", "answers"],
          properties: {
            tier: { $ref: "#/components/schemas/Tier" },
            answers: {
              type: "array",
              minItems: 1,
              items: { $ref: "#/components/schemas/Answer" },
              description:
                "Minimaal vijf niet-null antwoorden zijn vereist voor een betrouwbaar resultaat.",
            },
          },
        },
        SubmitResponse: {
          type: "object",
          required: ["id"],
          properties: {
            id: {
              type: "string",
              description:
                "Korte share-ID. Open op `/r/{id}` voor de publieke resultaatpagina.",
              example: "k3J7m2pQ",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          required: ["error"],
          properties: {
            error: {
              type: "string",
              description: "Mensvriendelijke foutmelding in het Nederlands.",
            },
          },
        },
      },
    },
  };

  return new NextResponse(JSON.stringify(spec, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/openapi+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
