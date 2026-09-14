import { DIMENSIONS, type DimensionId } from "@/lib/dimensions";
import type { DimensionScores } from "@/lib/scoring";

export interface PoliticianProfileLensInput {
  name: string;
  role: string;
  party: string;
  country: string;
  dimensions: DimensionScores;
}

export interface PoliticianProfileSignal {
  axis: DimensionId;
  label: string;
  direction: string;
  explanation: string;
}

export interface PoliticianProfileLens {
  roleTitle: string;
  roleExplanation: string;
  strongestSignals: PoliticianProfileSignal[];
  profileNote: string;
}

function roleContext(role: string, party: string, country: string) {
  const normalised = role.toLowerCase();
  if (normalised.includes("fractievoorzitter")) {
    return {
      title: "Wat doet een fractievoorzitter?",
      explanation: `Een fractievoorzitter leidt de Kamerfractie van ${party}. Die persoon voert vaak het woord in grote debatten, bepaalt samen met de fractie de politieke lijn en is een zichtbaar aanspreekpunt voor andere partijen.`,
    };
  }
  if (normalised.includes("minister-president") || normalised.includes("premier")) {
    return {
      title: "Wat doet een minister-president?",
      explanation: `Een minister-president coördineert het kabinet en vertegenwoordigt de regering naar buiten. Dat is iets anders dan alleen een partij leiden: regeringsbesluiten worden door het hele kabinet genomen.`,
    };
  }
  if (normalised.includes("minister") || normalised.includes("staatssecretaris")) {
    return {
      title: "Wat betekent deze regeringsrol?",
      explanation: `Een minister of staatssecretaris werkt binnen een kabinet aan een eigen beleidsterrein. Een partijprogramma geeft richting, maar besluiten ontstaan via het kabinet, het parlement en uitvoering in ${country}.`,
    };
  }
  return {
    title: "Wat doet een Kamerlid?",
    explanation: `Een Kamerlid controleert de regering, behandelt wetten en stemt over voorstellen. De partijpositie geeft context, maar een individueel Kamerlid is niet hetzelfde als een hele fractie.`,
  };
}

export function buildPoliticianProfileLens(
  input: PoliticianProfileLensInput,
): PoliticianProfileLens {
  const role = roleContext(input.role, input.party, input.country);
  const strongestSignals = DIMENSIONS
    .map((dimension) => {
      const score = input.dimensions[dimension.id];
      const pole = score >= 0 ? dimension.polePositive : dimension.poleNegative;
      return {
        axis: dimension.id,
        score,
        label: dimension.label,
        direction: pole.label,
        explanation: pole.description,
      };
    })
    .filter((signal) => Math.abs(signal.score) >= 25)
    .sort((a, b) => Math.abs(b.score) - Math.abs(a.score))
    .slice(0, 2)
    .map(({ axis, label, direction, explanation }) => ({
      axis,
      label,
      direction,
      explanation,
    }));

  const profileNote = strongestSignals.length
    ? `De kaart hieronder is een redactionele schatting van de publieke politieke positie van ${input.name}. Zij vat geen volledige loopbaan, elk interview of elke individuele stemming samen en is geen stemadvies.`
    : `In deze vijfassige kaart komt voor ${input.name} geen scherpe richting naar voren. Dat betekent niet dat er geen standpunten zijn, maar dat deze compacte indeling geen sterke uitslag laat zien. Het is geen stemadvies.`;

  return {
    roleTitle: role.title,
    roleExplanation: role.explanation,
    strongestSignals,
    profileNote,
  };
}
