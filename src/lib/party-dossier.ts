import { DIMENSIONS, type DimensionId } from "@/lib/dimensions";
import type { DimensionScores } from "@/lib/scoring";
import type { PartyRegionType } from "@/data/parties";

export interface PartyDossierInput {
  name: string;
  country?: string;
  regionType: PartyRegionType;
  positionVector: DimensionScores;
  lastReviewed?: string;
}

export interface PartyDossier {
  roleLine: string;
  strongestSignals: Array<{ axis: DimensionId; label: string; direction: string; score: number }>;
  methodLine: string;
}

export function buildPartyDossier(input: PartyDossierInput): PartyDossier {
  const place = input.country ? input.country + "se" : "internationale";
  const roleLine =
    input.regionType === "faction"
      ? input.name + " is een stroming binnen een grotere partij, dus geen volledige partij op zichzelf."
      : input.regionType === "family"
        ? input.name + " is een internationale partijfamilie: nationale partijen delen hier een Europese politieke thuisbasis."
        : input.name + " is een " + place + " partij. De beschrijving en bronnen op deze pagina gaan over de partij als organisatie, niet over één individuele politicus.";

  const strongestSignals = DIMENSIONS
    .map((dimension) => ({
      axis: dimension.id,
      label: dimension.label,
      direction: input.positionVector[dimension.id] >= 0 ? dimension.polePositive.label : dimension.poleNegative.label,
      score: input.positionVector[dimension.id],
    }))
    .filter((signal) => Math.abs(signal.score) >= 25)
    .sort((a, b) => Math.abs(b.score) - Math.abs(a.score))
    .slice(0, 2);

  return {
    roleLine,
    strongestSignals,
    methodLine:
      "De vijfassenscore is een redactionele plaatsing op basis van de genoemde bronnen. Hij vat een brede richting samen, geen stemmingen, coalities of elk afzonderlijk standpunt." +
      (input.lastReviewed ? " Laatst gecontroleerd: " + input.lastReviewed + "." : ""),
  };
}
