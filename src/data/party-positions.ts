/**
 * Het standpunt van elke Nederlandse Kamerpartij per stelling.
 *
 * Dit is de basis voor de vergelijking op de resultaatpagina: per stelling zien
 * waar iemand van een partij verschilt, met de bron erbij.
 *
 * Twee regels die de hele dataset dragen:
 *
 * 1. `geen-standpunt` is een volwaardige uitkomst. Zegt een partijprogramma
 *    niets over een stelling, dan coderen we dat zo. We vullen nooit aan vanuit
 *    aannames over de partij, en een partij wordt nooit afgerekend op een
 *    stelling waar ze geen publiek standpunt over inneemt.
 * 2. Elke codering heeft een bron. Zonder bron publiceren we geen standpunt.
 */

export type PartyStance = "eens" | "oneens" | "neutraal" | "geen-standpunt";

/**
 * Waarop een codering rust. Een standpunt kan uit het programma komen, uit
 * feitelijk stemgedrag in de Kamer, of uit beide. Dat verschil is zichtbaar op
 * de pagina, zodat een lezer kan wegen hoe hard het bewijs is.
 */
export type PositionBasis = "programma" | "stemgedrag" | "beide";

export interface PartyPosition {
  /** De stelling, exact zoals in de vragenbank. */
  statement: string;
  stance: PartyStance;
  /**
   * Waarop deze codering rust. Een partij kan in haar programma iets beloven
   * wat ze in de Kamer anders stemt; dat is precies wat een lezer hier hoort te
   * zien.
   */
  basis: PositionBasis;
  sourceUrl: string;
  /**
   * Letterlijk citaat uit het programma van maximaal 20 woorden. Leeg bij
   * `geen-standpunt`.
   */
  quote?: string;
  /**
   * Alleen gevuld als het programma en het stemgedrag elkaar tegenspreken, of
   * als er iets anders is dat de lezer moet weten.
   */
  note?: string;
}

export interface PartyPositionSet {
  /** Slug van de partijpagina. */
  partySlug: string;
  /** Volledige titel van het gecodeerde verkiezingsprogramma. */
  programmeTitle: string;
  programmeUrl: string;
  /** Datum waarop de coderingen zijn gecontroleerd. */
  reviewed: string;
  positions: PartyPosition[];
}

import d66 from "./party-positions/d66.json";
import christenunie from "./party-positions/christenunie.json";
import pvv from "./party-positions/pvv.json";
import cda from "./party-positions/cda.json";
import vvd from "./party-positions/vvd.json";

/**
 * De gecodeerde standpunten per partij. Elke partij is één JSON-bestand, zodat
 * een nieuwe partij toevoegen één import en één regel is.
 */
export const PARTY_POSITIONS: PartyPositionSet[] = [
  d66 as PartyPositionSet,
  christenunie as PartyPositionSet,
  pvv as PartyPositionSet,
  cda as PartyPositionSet,
  vvd as PartyPositionSet,
];

export function getPartyPositionSet(
  partySlug: string,
): PartyPositionSet | undefined {
  return PARTY_POSITIONS.find((set) => set.partySlug === partySlug);
}

/**
 * Normaliseert een stelling zodat we uitkomsten van de codeerronde kunnen
 * matchen op de vragenbank, ook als er onderweg een spatie of een aanhalingsteken
 * verschilt.
 */
export function normalizeStatement(statement: string): string {
  return statement
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\u2018\u2019\u201c\u201d]/g, "'")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
