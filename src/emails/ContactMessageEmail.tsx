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

const styles = {
  body: {
    backgroundColor: "#f4f1ea",
    color: "#0e1014",
    fontFamily:
      '"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
    margin: 0,
    padding: "32px 0",
  } as const,
  container: {
    backgroundColor: "#ffffff",
    border: "1px solid #d3ccbe",
    borderRadius: 12,
    margin: "0 auto",
    maxWidth: 560,
    padding: 32,
  } as const,
  kicker: {
    color: "#8c8377",
    fontFamily: '"Courier New", monospace',
    fontSize: 11,
    letterSpacing: "0.14em",
    margin: "0 0 8px",
    textTransform: "uppercase" as const,
  },
  heading: {
    color: "#0e1014",
    fontFamily: '"Fraunces", "Times New Roman", Georgia, serif',
    fontSize: 24,
    fontWeight: 500,
    letterSpacing: "-0.015em",
    lineHeight: 1.25,
    margin: "0 0 16px",
  },
  row: {
    borderTop: "1px solid #ebe6da",
    padding: "10px 0",
  } as const,
  label: {
    color: "#8c8377",
    fontFamily: '"Courier New", monospace',
    fontSize: 10,
    letterSpacing: "0.12em",
    margin: "0 0 2px",
    textTransform: "uppercase" as const,
  },
  value: {
    color: "#0e1014",
    fontSize: 15,
    lineHeight: 1.6,
    margin: 0,
    whiteSpace: "pre-wrap" as const,
  },
  footer: {
    color: "#8c8a80",
    fontSize: 12,
    lineHeight: 1.6,
    margin: "0 0 6px",
  } as const,
  button: {
    backgroundColor: "#142850",
    borderRadius: 8,
    color: "#ffffff",
    display: "inline-block",
    fontSize: 14,
    fontWeight: 600,
    marginTop: 8,
    padding: "10px 18px",
    textDecoration: "none",
  } as const,
} as const;

export interface ContactMessageInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  receivedAt: string;
}

export function ContactMessageEmail(input: ContactMessageInput) {
  return (
    <Html lang="nl">
      <Head />
      <Preview>
        {`${input.subject} van ${input.name} via het contactformulier`}
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading as="h2" style={styles.kicker}>
            Contactformulier politiekprofiel.nl
          </Heading>
          <Heading as="h1" style={styles.heading}>
            {input.subject}
          </Heading>

          <Section style={styles.row}>
            <Text style={styles.label}>Naam</Text>
            <Text style={styles.value}>{input.name}</Text>
          </Section>
          <Section style={styles.row}>
            <Text style={styles.label}>E-mail</Text>
            <Text style={styles.value}>{input.email}</Text>
          </Section>
          <Section style={styles.row}>
            <Text style={styles.label}>Ontvangen</Text>
            <Text style={styles.value}>{input.receivedAt}</Text>
          </Section>
          <Section style={styles.row}>
            <Text style={styles.label}>Bericht</Text>
            <Text style={styles.value}>{input.message}</Text>
          </Section>

          <Link href={`mailto:${input.email}`} style={styles.button}>
            Antwoorden
          </Link>

          <Hr style={{ borderTop: "1px solid #ebe6da", margin: "28px 0 16px" }} />
          <Text style={styles.footer}>
            Verstuurd via het contactformulier op politiekprofiel.nl. Antwoorden
            op deze mail gaat direct naar de afzender.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export function contactMessageEmailText(input: ContactMessageInput): string {
  return [
    "Nieuw bericht via het contactformulier van politiekprofiel.nl",
    "",
    `Onderwerp: ${input.subject}`,
    `Naam: ${input.name}`,
    `E-mail: ${input.email}`,
    `Ontvangen: ${input.receivedAt}`,
    "",
    "Bericht:",
    input.message,
  ].join("\n");
}
