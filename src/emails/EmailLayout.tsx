import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

const BRAND = {
  paper: "#fafaf7",
  ink: "#0e1014",
  inkMuted: "#5a6071",
  inkSubtle: "#8c93a3",
  navy: "#142850",
  rule: "#dcd8c9",
} as const;

const styles = {
  body: {
    backgroundColor: BRAND.paper,
    color: BRAND.ink,
    fontFamily:
      '"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
    margin: 0,
    padding: "32px 0",
  } as const,
  container: {
    backgroundColor: "#ffffff",
    border: `1px solid ${BRAND.rule}`,
    borderRadius: 12,
    margin: "0 auto",
    maxWidth: 560,
    padding: 40,
  } as const,
  wordmark: {
    color: BRAND.navy,
    fontFamily: '"Fraunces", "Times New Roman", Georgia, serif',
    fontSize: 22,
    fontWeight: 600,
    letterSpacing: "-0.01em",
    margin: 0,
  } as const,
  heading: {
    color: BRAND.ink,
    fontFamily: '"Fraunces", "Times New Roman", Georgia, serif',
    fontSize: 28,
    fontWeight: 500,
    letterSpacing: "-0.015em",
    lineHeight: 1.2,
    margin: "24px 0 12px",
  } as const,
  paragraph: {
    color: BRAND.ink,
    fontSize: 16,
    lineHeight: 1.6,
    margin: "0 0 16px",
  } as const,
  buttonWrapper: {
    margin: "28px 0 28px",
  } as const,
  button: {
    backgroundColor: BRAND.navy,
    borderRadius: 8,
    color: "#ffffff",
    display: "inline-block",
    fontSize: 15,
    fontWeight: 600,
    padding: "12px 22px",
    textDecoration: "none",
  } as const,
  rawLink: {
    color: BRAND.navy,
    fontSize: 13,
    wordBreak: "break-all" as const,
  },
  rule: {
    borderTop: `1px solid ${BRAND.rule}`,
    margin: "32px 0 20px",
  } as const,
  footer: {
    color: BRAND.inkSubtle,
    fontSize: 12,
    lineHeight: 1.6,
    margin: "0 0 8px",
  } as const,
} as const;

export interface EmailLayoutProps {
  preview: string;
  heading: string;
  intro: string;
  buttonLabel: string;
  buttonHref: string;
  /** Optionele extra alinea onder de knop. */
  extra?: string;
  /** Extra contextregel onderaan (bv. privacy-disclaimer). */
  privacyNote?: string;
}

function EmailLayout(props: EmailLayoutProps) {
  return (
    <Html lang="nl">
      <Head />
      <Preview>{props.preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading as="h2" style={styles.wordmark}>
            PolitiekProfiel
          </Heading>
          <Heading as="h1" style={styles.heading}>
            {props.heading}
          </Heading>
          <Text style={styles.paragraph}>{props.intro}</Text>

          <Section style={styles.buttonWrapper}>
            <Link href={props.buttonHref} style={styles.button}>
              {props.buttonLabel}
            </Link>
          </Section>

          <Text style={styles.paragraph}>
            Werkt de knop niet? Kopieer dan deze link:
          </Text>
          <Text style={styles.rawLink}>{props.buttonHref}</Text>

          {props.extra ? <Text style={styles.paragraph}>{props.extra}</Text> : null}

          <Hr style={styles.rule} />

          {props.privacyNote ? (
            <Text style={styles.footer}>{props.privacyNote}</Text>
          ) : null}
          <Text style={styles.footer}>
            Je ontvangt deze mail omdat je het zelf hebt aangevraagd op
            politiekprofiel.nl. We koppelen je e-mailadres niet aan je politieke
            antwoorden of resultaten.
          </Text>
          <Text style={styles.footer}>
            Vragen? Stuur een e-mail naar privacy@politiekprofiel.nl.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default EmailLayout;
