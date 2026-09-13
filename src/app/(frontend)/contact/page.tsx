import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { ContactForm } from "@/components/ContactForm";
import { buildBreadcrumbList, jsonLdString } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Vraag, opmerking of klacht over PolitiekProfiel? Stuur een bericht via het contactformulier. Je krijgt persoonlijk antwoord.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact · PolitiekProfiel",
    description:
      "Stuur een bericht via het contactformulier. Je krijgt persoonlijk antwoord.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactPage() {
  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: "Contact", item: "/contact" },
  ]);

  return (
    <Container width="narrow" className="py-16 md:py-24">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLdString([breadcrumbLd]) }}
      />
      <Kicker>Contact</Kicker>
      <h1 className="display mt-5 mb-4">Een vraag of iets dat niet werkt?</h1>
      <p className="mb-10 max-w-xl leading-relaxed text-ink-2">
        Gebruik het formulier hieronder. Je bericht komt direct bij mij binnen en
        ik antwoord meestal binnen een dag. Heb je een betaalde quiz gekocht en
        lukt iets niet, noem dan het e-mailadres waarmee je hebt betaald; dan kan
        ik het nakijken.
      </p>

      <ContactForm />

      <p className="mt-10 text-xs leading-relaxed text-ink-2">
        Je bericht wordt alleen gebruikt om je te antwoorden en niet aan je
        quizresultaten gekoppeld. Betalingen verlopen via Stripe; ik zie nooit je
        kaartgegevens.
      </p>
    </Container>
  );
}
