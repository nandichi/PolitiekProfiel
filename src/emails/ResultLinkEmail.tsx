import EmailLayout from "./EmailLayout";

export interface ResultLinkEmailProps {
  resultUrl: string;
  /** Optionele tier-label voor extra context (Quick/Standaard/Uitgebreid). */
  tierLabel?: string;
}

export function ResultLinkEmail({ resultUrl, tierLabel }: ResultLinkEmailProps) {
  const intro = tierLabel
    ? `Bedankt voor het invullen van de ${tierLabel}-quiz op PolitiekProfiel. Hieronder vind je de link naar je persoonlijke resultaat.`
    : "Bedankt voor het invullen van de quiz op PolitiekProfiel. Hieronder vind je de link naar je persoonlijke resultaat.";

  return (
    <EmailLayout
      preview="Jouw PolitiekProfiel-resultaat"
      heading="Jouw resultaat staat klaar"
      intro={intro}
      buttonLabel="Bekijk mijn resultaat"
      buttonHref={resultUrl}
      extra="Bewaar deze link goed: hij is de enige manier om dit specifieke resultaat later terug te vinden. Wil je dit resultaat verwijderen? Stuur dan een e-mail naar privacy@politiekprofiel.nl met de share-ID in de link."
      privacyNote="Deze e-mail bevat alleen je deel-link en geen antwoorden of scores. Je e-mailadres is niet aan je politieke profiel gekoppeld in onze database."
    />
  );
}

export function resultLinkEmailText({ resultUrl, tierLabel }: ResultLinkEmailProps): string {
  const intro = tierLabel
    ? `Bedankt voor het invullen van de ${tierLabel}-quiz op PolitiekProfiel.`
    : "Bedankt voor het invullen van de quiz op PolitiekProfiel.";

  return [
    "PolitiekProfiel",
    "",
    "Jouw resultaat staat klaar",
    "",
    intro,
    "",
    "Bekijk je resultaat:",
    resultUrl,
    "",
    "Bewaar deze link goed: het is de enige manier om dit resultaat later terug te vinden.",
    "",
    "Deze e-mail bevat alleen je deel-link en geen antwoorden of scores. Je e-mailadres is niet aan je politieke profiel gekoppeld in onze database.",
    "",
    "Vragen of verwijderverzoek? privacy@politiekprofiel.nl",
  ].join("\n");
}

export default ResultLinkEmail;
