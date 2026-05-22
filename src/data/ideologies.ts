import type { DimensionScores } from "@/lib/scoring";

export type SpectrumPosition =
  | "ver-links"
  | "links"
  | "centrum-links"
  | "centrum"
  | "centrum-rechts"
  | "rechts"
  | "ver-rechts";

export interface SeedIdeology {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  spectrumPosition: SpectrumPosition;
  profileVector: DimensionScores;
  examplePeople: string[];
}

export const IDEOLOGIES: SeedIdeology[] = [
  {
    name: "Sociaal-Democraat",
    slug: "sociaal-democraat",
    shortDescription:
      "Sterke verzorgingsstaat, eerlijke verdeling, met behoud van markt en parlementaire democratie.",
    description:
      "De sociaal-democraat ziet de markt als nuttig instrument, maar onvoldoende om brede welvaart en bestaanszekerheid te garanderen. Belasting op vermogen en hoge inkomens financiert publieke zorg, onderwijs en wonen. Sociale grondrechten staan op gelijke voet met klassieke vrijheden. In Europa is samenwerking welkom, mits sociaal beleid stevig verankerd blijft. Tradities worden niet verworpen, maar gemoderniseerd in lijn met gelijkwaardigheid en diversiteit.",
    spectrumPosition: "centrum-links",
    profileVector: {
      economic: 60,
      social: 40,
      civil: 20,
      governance: 30,
      trust: 30,
    },
    examplePeople: ["GroenLinks-PvdA", "Olaf Scholz (SPD)", "Keir Starmer"],
  },
  {
    name: "Klassiek-Liberaal",
    slug: "klassiek-liberaal",
    shortDescription:
      "Vertrouwt op individu, markt en rechtsstaat; terughoudende staat in zowel economie als privéleven.",
    description:
      "Het klassieke liberalisme legt de nadruk op individuele vrijheid, eigendomsrecht en een terughoudende staat. Belastingen blijven laag, regels beperkt en de markt sturend in economisch leven. Tegelijk hoort de overheid burgers met rust te laten in hun privéleven, geloof en leefstijl. De rechtsstaat is heilig: macht moet altijd onderworpen zijn aan onafhankelijke rechters en grondwet.",
    spectrumPosition: "centrum-rechts",
    profileVector: {
      economic: -55,
      social: 35,
      civil: 50,
      governance: 20,
      trust: 25,
    },
    examplePeople: ["VVD (centrum-rechts vleugel)", "FDP", "Mark Rutte"],
  },
  {
    name: "Libertariër",
    slug: "libertarier",
    shortDescription:
      "Maximale individuele vrijheid; minimale staat in economie én persoonlijke sfeer.",
    description:
      "De libertariër wil de overheid zoveel mogelijk uit het leven van burgers houden. Vrije markten, lage belastingen en privatisering zijn vanzelfsprekend. Ook in persoonlijke sfeer geldt non-inmenging: vrij gebruik van middelen, vrije meningsuiting en bescherming tegen surveillance. Internationale verdragen worden gewogen op effecten voor vrijheid. Vertrouwen in gevestigde instituties is matig: ze worden vooral gezien als beperking.",
    spectrumPosition: "rechts",
    profileVector: {
      economic: -80,
      social: 20,
      civil: 85,
      governance: -20,
      trust: -10,
    },
    examplePeople: ["Forum voor Vrijheid", "Javier Milei", "Ron Paul"],
  },
  {
    name: "Groen-Progressief",
    slug: "groen-progressief",
    shortDescription:
      "Sociale rechtvaardigheid, klimaatactie en culturele openheid als één samenhangend project.",
    description:
      "Groen-progressieven combineren een ambitieus klimaatbeleid met sociale herverdeling en culturele openheid. Markten worden zwaar gereguleerd op duurzaamheid en sociale lasten. Diversiteit, gendergelijkheid en minderheidsrechten staan hoog. Europese samenwerking is welkom, vooral voor klimaat en migratie. Wetenschap en publieke instituties worden vertrouwd als noodzakelijke partners in transitie.",
    spectrumPosition: "links",
    profileVector: {
      economic: 50,
      social: 80,
      civil: 50,
      governance: 60,
      trust: 30,
    },
    examplePeople: ["GroenLinks-PvdA", "Volt", "Bündnis 90/Die Grünen"],
  },
  {
    name: "Christen-Democraat",
    slug: "christen-democraat",
    shortDescription:
      "Verantwoordelijke samenleving, gespreide verantwoordelijkheid en sociale markteconomie.",
    description:
      "De christen-democratische traditie bouwt op verantwoordelijke samenleving en gespreide verantwoordelijkheid: niet de markt alleen, niet de staat alleen, maar gezin, kerk, verenigingen en bedrijven samen. Solidariteit, rentmeesterschap en gemeenschap staan voorop. In Europa zoeken christen-democraten samenwerking, met respect voor nationale tradities. Klassieke instituties verdienen vertrouwen, ook in moeilijke tijden.",
    spectrumPosition: "centrum-rechts",
    profileVector: {
      economic: 25,
      social: -25,
      civil: -10,
      governance: 10,
      trust: 35,
    },
    examplePeople: ["CDA", "Friedrich Merz (CDU)", "Helmut Kohl"],
  },
  {
    name: "Nationaal-Conservatief",
    slug: "nationaal-conservatief",
    shortDescription:
      "Behoud van nationale identiteit, beperking van migratie en kritisch op supranationale instituties.",
    description:
      "Nationaal-conservatieven zien de natiestaat als belangrijkste politieke gemeenschap. Tradities, taal, cultuur en grenzen verdienen actieve bescherming. Migratie wordt streng gereguleerd. De overheid neemt orde, veiligheid en sociale samenhang serieus. De EU mag samenwerken, maar nationale soevereiniteit blijft leidend. Wetenschap en media worden kritisch gevolgd waar zij ‘kosmopolitisch’ aanvoelen.",
    spectrumPosition: "rechts",
    profileVector: {
      economic: 0,
      social: -70,
      civil: -30,
      governance: -70,
      trust: -20,
    },
    examplePeople: ["JA21", "Fidesz", "Giorgia Meloni (Fratelli d’Italia)"],
  },
  {
    name: "Technocratisch-Centrist",
    slug: "technocratisch-centrist",
    shortDescription:
      "Pragmatische middenkoers, gestuurd door experts, instituties en evidence-based beleid.",
    description:
      "De technocratisch centrist gelooft sterk in goed bestuur, expertise en feitelijk onderbouwd beleid. Markt en staat krijgen elk een rol op basis van wat in een gegeven situatie het beste werkt. Europese samenwerking is logisch, omdat veel uitdagingen grensoverschrijdend zijn. Vertrouwen in instituties is hoog: rechtspraak, planbureaus en toezichthouders zijn cruciaal voor een werkbare samenleving.",
    spectrumPosition: "centrum",
    profileVector: {
      economic: 0,
      social: 25,
      civil: 20,
      governance: 50,
      trust: 60,
    },
    examplePeople: ["D66", "Emmanuel Macron (Renaissance)", "Mark Carney"],
  },
  {
    name: "Marxist",
    slug: "marxist",
    shortDescription:
      "Diepe kritiek op kapitalisme; collectieve eigendom en gelijkheid als kern van rechtvaardigheid.",
    description:
      "De marxistische traditie ziet kapitalisme als systeem van uitbuiting en pleit voor collectieve zeggenschap over productie en kapitaal. Klassentegenstellingen staan centraal. Staatsmacht kan worden ingezet voor herverdeling, maar bestaande instituties worden kritisch bekeken. Internationalisme is sterk: arbeiders over de wereld delen meer belangen dan natiegrenzen suggereren. Media en instituties worden gewogen op hun rol in machtsstructuren.",
    spectrumPosition: "ver-links",
    profileVector: {
      economic: 90,
      social: 50,
      civil: 0,
      governance: 30,
      trust: -30,
    },
    examplePeople: ["SP (radicale vleugel)", "Jean-Luc Mélenchon", "Bernie Sanders (links flank)"],
  },
  {
    name: "Links-libertair",
    slug: "anarcho-libertair",
    shortDescription:
      "Sterke argwaan tegen elke geconcentreerde macht: staat, kapitaal of supranationale instituties.",
    description:
      "Deze stroming combineert wantrouwen tegen staatsmacht met wantrouwen tegen grote concentraties van privé-macht. De oplossing ligt in coöperaties, federaties, lokale gemeenschappen en directe democratie. Markten kunnen bestaan, maar zonder monopolies. Burgerrechten zijn een absolute waarde, ook tegenover bedrijven. Internationale verdragen worden alleen vertrouwd als ze van onderop democratisch zijn ingericht.",
    spectrumPosition: "links",
    profileVector: {
      economic: 45,
      social: 60,
      civil: 85,
      governance: 30,
      trust: -50,
    },
    examplePeople: ["BIJ1 (radicale vleugel)", "Murray Bookchin", "Noam Chomsky"],
  },
  {
    name: "Conservatief-Liberaal",
    slug: "conservatief-liberaal",
    shortDescription:
      "Marktgericht, terughoudend bestuur, met behoud van tradities en sterke rechtsstaat.",
    description:
      "Conservatief-liberalen verbinden vrije markten met behoud van waardevolle tradities, gezin en gemeenschap. Belastingen en regels blijven beperkt. Tegelijk verdient de gevestigde rechtsorde, het justitiestelsel en de bestaande instituties bescherming. Op EU-niveau is samenwerking welkom voor handel en defensie, maar terughoudend op identiteitsvraagstukken.",
    spectrumPosition: "rechts",
    profileVector: {
      economic: -50,
      social: -30,
      civil: -10,
      governance: -5,
      trust: 15,
    },
    examplePeople: ["VVD (klassieke vleugel)", "Tories (One Nation)", "Henri Bontenbal"],
  },
  {
    name: "Sociaal-Liberaal",
    slug: "sociaal-liberaal",
    shortDescription:
      "Vrije individu in een sociale samenleving; combineert markt, herverdeling en open cultuur.",
    description:
      "De sociaal-liberaal ziet vrijheid niet als afwezigheid van staat, maar als reële mogelijkheid voor iedereen. Onderwijs, zorg en kansengelijkheid zijn essentieel om vrijheid waar te maken. De markt mag haar werk doen, mits ongelijkheid en uitsluiting begrensd blijven. Een sterke EU is welkom voor stabiliteit en kansen. Diversiteit en zelfbeschikking horen bij een moderne samenleving.",
    spectrumPosition: "centrum",
    profileVector: {
      economic: 20,
      social: 60,
      civil: 50,
      governance: 50,
      trust: 45,
    },
    examplePeople: ["D66", "Volt", "Justin Trudeau"],
  },
  {
    name: "Eco-Socialist",
    slug: "eco-socialist",
    shortDescription:
      "Klimaatcrisis vraagt structurele kritiek op kapitalisme; herverdeling én vergroening.",
    description:
      "Eco-socialisten zien klimaatverandering en ongelijkheid als verbonden problemen van een kapitalistische productiewijze. Oplossingen vragen herverdeling, publieke regie over energie en infrastructuur, en een einde aan onbeperkte groei. Cultureel zoeken zij een progressieve samenleving die plek geeft aan alle gemeenschappen. Internationale samenwerking is essentieel voor klimaatdoelen. Wantrouwen jegens bedrijven en commerciële media is groot.",
    spectrumPosition: "links",
    profileVector: {
      economic: 75,
      social: 70,
      civil: 35,
      governance: 50,
      trust: 5,
    },
    examplePeople: ["GroenLinks-PvdA (linker vleugel)", "Sahra Wagenknecht (deels)", "Naomi Klein"],
  },
  {
    name: "Populistisch-Rechts",
    slug: "populistisch-rechts",
    shortDescription:
      "Volkssoevereiniteit, kritiek op ‘elites’, harde lijn op migratie en EU.",
    description:
      "Het populistisch-rechtse perspectief stelt 'het volk' tegenover 'de elite'. Migratie wordt streng beperkt, culturele identiteit beschermd. De EU wordt als bedreiging gezien voor nationale soevereiniteit. Wantrouwen tegen media, rechters en wetenschap is groot. Economisch combineert deze stroming protectionisme met soms genereuze sociale uitgaven voor de eigen kiezers.",
    spectrumPosition: "ver-rechts",
    profileVector: {
      economic: 0,
      social: -80,
      civil: -40,
      governance: -80,
      trust: -80,
    },
    examplePeople: ["PVV", "Rassemblement National", "Donald Trump (MAGA)"],
  },
  {
    name: "Populistisch-Links",
    slug: "populistisch-links",
    shortDescription:
      "Volk tegen kapitaal: scherpe kritiek op bedrijven en banken, met sociale agenda.",
    description:
      "Populistisch links stelt 'het volk' tegenover machtige bedrijven, banken en politieke elites. Hoge belasting op vermogen, sterke publieke voorzieningen en bescherming van werknemers staan centraal. Cultureel zit deze stroming vaak in het midden of licht traditioneler. Internationaal wantrouwen jegens vrijhandelsverdragen en supranationale instituties is groot.",
    spectrumPosition: "ver-links",
    profileVector: {
      economic: 70,
      social: -10,
      civil: 5,
      governance: -30,
      trust: -70,
    },
    examplePeople: ["SP", "La France Insoumise", "Sahra Wagenknecht (BSW)"],
  },
  {
    name: "Communitarist",
    slug: "communitarist",
    shortDescription:
      "Sterk geloof in gemeenschap, lokale verbanden en sociale verantwoordelijkheid.",
    description:
      "Communitaristen zoeken samenleving in gemeenschappen, niet in geïsoleerd individu of abstracte staat. Verantwoordelijkheid, deugd, opvoeding en lokale netwerken zijn centraal. Markten mogen bestaan, mits ze gemeenschapsleven niet ondermijnen. Cultuurpolitiek is matig conservatief, maar met respect voor andersdenkenden. Vertrouwen in gevestigde instituties is genuanceerd.",
    spectrumPosition: "centrum",
    profileVector: {
      economic: 30,
      social: -10,
      civil: 0,
      governance: 30,
      trust: 20,
    },
    examplePeople: ["Pieter Omtzigt (NSC)", "ChristenUnie", "Michael Sandel"],
  },
  {
    name: "Klassiek-Conservatief",
    slug: "klassiek-conservatief",
    shortDescription:
      "Voorzichtige hervorming, eerbied voor traditie, instituties en bewezen praktijken.",
    description:
      "Klassiek-conservatieven willen veranderingen behoedzaam invoeren. Tradities, instituties en gevestigde praktijken verdienen vertrouwen, tenzij goed bewijs het tegendeel laat zien. Markt en staat staan beide in dienst van een ordelijke samenleving. Identiteit, cultuur en historische continuïteit zijn waardevol. Internationaal beleid is op stabiliteit gericht, niet op revolutie.",
    spectrumPosition: "centrum-rechts",
    profileVector: {
      economic: -20,
      social: -45,
      civil: -10,
      governance: -10,
      trust: 30,
    },
    examplePeople: ["SGP", "Edmund Burke", "BBB (matige vleugel)"],
  },
];
