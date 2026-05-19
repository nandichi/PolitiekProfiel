import EmailLayout from "./EmailLayout";

export interface EntitlementBackupEmailProps {
  quizUrl: string;
  tierLabel: string;
}

export function EntitlementBackupEmail({
  quizUrl,
  tierLabel,
}: EntitlementBackupEmailProps) {
  return (
    <EmailLayout
      preview={`Toegangslink voor de ${tierLabel}-quiz`}
      heading="Bedankt voor je betaling"
      intro={`Je hebt toegang gekregen tot de ${tierLabel}-quiz op PolitiekProfiel. Gebruik de onderstaande persoonlijke link om de quiz te starten. De link werkt zolang je de quiz niet hebt afgerond.`}
      buttonLabel={`Start de ${tierLabel}-quiz`}
      buttonHref={quizUrl}
      extra="Bewaar deze e-mail voor het geval je de quiz wil onderbreken en later wil hervatten. Heb je een betaalbewijs nodig? Stripe stuurt je apart een bevestigingsmail met het bonnetje."
      privacyNote="Deze toegangslink is persoonlijk maar niet aan je politieke profiel gekoppeld. We bewaren je e-mailadres niet samen met je antwoorden of resultaat."
    />
  );
}

export function entitlementBackupEmailText({
  quizUrl,
  tierLabel,
}: EntitlementBackupEmailProps): string {
  return [
    "PolitiekProfiel",
    "",
    "Bedankt voor je betaling",
    "",
    `Je hebt toegang gekregen tot de ${tierLabel}-quiz op PolitiekProfiel.`,
    "Gebruik deze persoonlijke link om de quiz te starten:",
    "",
    quizUrl,
    "",
    "De link werkt zolang je de quiz niet hebt afgerond. Bewaar deze e-mail dus voor het geval je de quiz later wil hervatten.",
    "",
    "Heb je een betaalbewijs nodig? Stripe stuurt je apart een bevestigingsmail met het bonnetje.",
    "",
    "Deze toegangslink is persoonlijk maar niet aan je politieke profiel gekoppeld. We bewaren je e-mailadres niet samen met je antwoorden of resultaat.",
    "",
    "Vragen? privacy@politiekprofiel.nl",
  ].join("\n");
}

export default EntitlementBackupEmail;
