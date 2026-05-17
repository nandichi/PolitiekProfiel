import type { SeedQuestion, SeedSource } from "./questions";

const pbl: SeedSource = {
  label: "Planbureau voor de Leefomgeving – Klimaat- en Energieverkenning",
  url: "https://www.pbl.nl/onderwerpen/klimaat-en-energie",
};
const ipcc: SeedSource = {
  label: "IPCC – AR6 Synthesis Report",
  url: "https://www.ipcc.ch/report/ar6/syr/",
};
const rivm: SeedSource = {
  label: "RIVM – Volksgezondheid Toekomst Verkenning",
  url: "https://www.vtv2024.nl/",
};
const nza: SeedSource = {
  label: "Nederlandse Zorgautoriteit – Stand van de zorg",
  url: "https://www.nza.nl/",
};
const ind: SeedSource = {
  label: "IND – Asielcijfers",
  url: "https://ind.nl/nl/over-ons/cijfers-en-publicaties",
};
const wodc: SeedSource = {
  label: "WODC – Onderzoek migratie en integratie",
  url: "https://www.wodc.nl/onderwerpen/migratie",
};
const cpb2: SeedSource = {
  label: "CPB – Centraal Economisch Plan 2025",
  url: "https://www.cpb.nl/centraal-economisch-plan-2025",
};
const dnb: SeedSource = {
  label: "De Nederlandsche Bank – Economische ontwikkelingen",
  url: "https://www.dnb.nl/publicaties/",
};
const europarl: SeedSource = {
  label: "Europees Parlement – Onderzoeksdienst",
  url: "https://www.europarl.europa.eu/RegData/etudes/",
};
const clingendael: SeedSource = {
  label: "Clingendael – Europa-monitor",
  url: "https://www.clingendael.org/nl/onderwerp/europese-unie",
};
const vdem2: SeedSource = {
  label: "V-Dem Institute – Democracy Report",
  url: "https://v-dem.net/publications/democracy-reports/",
};
const staatscommissie: SeedSource = {
  label: "Staatscommissie parlementair stelsel – Lage drempels, hoge dijken",
  url: "https://www.rijksoverheid.nl/documenten/rapporten/2018/12/13/lage-drempels-hoge-dijken",
};
const bouwen: SeedSource = {
  label: "Ministerie van Volkshuisvesting – Woningbouwprogramma",
  url: "https://www.volkshuisvestingnederland.nl/onderwerpen/woningbouw",
};
const aedes: SeedSource = {
  label: "Aedes – Woningmarktmonitor",
  url: "https://aedes.nl/woningmarkt",
};

const allTiers = ["quick", "standard", "extended"] as const;
const standardExtended = ["standard", "extended"] as const;
const extendedOnly = ["extended"] as const;

export const THEMED_QUESTIONS: SeedQuestion[] = [
  // ============ KLIMAAT (10) ============
  {
    statement:
      "Nederland moet de klimaatdoelen aanscherpen, ook als dat ten koste gaat van economische groei op de korte termijn.",
    dimension: "governance",
    direction: "positive",
    weight: 1.2,
    tiers: [...allTiers],
    depth: "broad",
    discriminator: 80,
    themes: ["klimaat", "economie"],
    derivedStance:
      "Je vindt dat klimaatdoelen zwaarder wegen dan economische groei op korte termijn.",
    info: {
      context:
        "De klimaatwet legt 55% reductie in 2030 vast t.o.v. 1990. Voorstanders willen aanscherping naar 60-70%; tegenstanders waarschuwen voor de economische gevolgen.",
      argumentsFor: [
        "Klimaatschade is onomkeerbaar; uitstellen is duurder.",
        "Schone industrie biedt economische kansen voor de lange termijn.",
      ],
      argumentsAgainst: [
        "Strengere doelen jagen industrie en banen naar het buitenland.",
        "Draagvlak brokkelt af bij hoge lasten voor burgers.",
      ],
      sources: [pbl, ipcc],
    },
  },
  {
    statement:
      "Vlees en zuivel moeten zwaarder belast worden om de uitstoot omlaag te krijgen.",
    dimension: "social",
    direction: "positive",
    tiers: [...standardExtended],
    depth: "deep",
    discriminator: 70,
    themes: ["klimaat"],
    derivedStance:
      "Je vindt dat dierlijke producten zwaarder belast moeten worden om de uitstoot te beperken.",
    info: {
      context:
        "De Raad voor de Leefomgeving adviseerde een vleesbelasting (true pricing). Boeren en consumentenorganisaties vrezen onbetaalbaar voedsel.",
      argumentsFor: [
        "De milieukosten zitten nu niet in de prijs van dierlijke producten.",
        "Lagere consumptie verlaagt uitstoot en land- en watergebruik fors.",
      ],
      argumentsAgainst: [
        "Treft vooral lagere inkomens; gezond eten wordt duurder.",
        "Een soevereine voedselkeuze hoort niet door belasting gestuurd te worden.",
      ],
      sources: [pbl],
    },
  },
  {
    statement:
      "Kernenergie hoort een centrale rol te spelen in de Nederlandse energiemix.",
    dimension: "economic",
    direction: "negative",
    tiers: [...standardExtended],
    depth: "broad",
    discriminator: 65,
    themes: ["klimaat"],
    derivedStance:
      "Je vindt dat kernenergie een belangrijke pijler moet zijn van de Nederlandse energievoorziening.",
    info: {
      context:
        "Het kabinet wil 2-4 nieuwe kerncentrales bouwen, naast Borssele. Bouwkosten en afvalverwerking blijven hete hangijzers.",
      argumentsFor: [
        "Kernenergie levert CO2-arme basislast, los van weer.",
        "Maakt het net robuuster naast wind en zon.",
      ],
      argumentsAgainst: [
        "Bouw is jaren vertraagd en kost tientallen miljarden.",
        "Het afvalvraagstuk is voor duizenden jaren onopgelost.",
      ],
      sources: [pbl],
    },
  },
  {
    statement:
      "De overheid moet vervuilende industrie versneld sluiten als ze niet snel genoeg verduurzaamt.",
    dimension: "economic",
    direction: "positive",
    tiers: [...standardExtended],
    depth: "deep",
    discriminator: 70,
    themes: ["klimaat", "economie"],
    derivedStance:
      "Je vindt dat zwaar vervuilende bedrijven gedwongen moeten worden te verduurzamen of te stoppen.",
    info: {
      context:
        "Tata Steel, Chemours en Schiphol zijn omstreden grote uitstoters. Maatwerkafspraken lopen, maar progressie is traag.",
      argumentsFor: [
        "Vrijwillige afspraken halen niet de noodzakelijke uitstootreducties.",
        "Omwonenden lijden gezondheidsschade door slepende vervuiling.",
      ],
      argumentsAgainst: [
        "Sluiting kost duizenden banen en hoogwaardige kennis.",
        "Productie verplaatst zich naar landen met soepelere regels (carbon leakage).",
      ],
      sources: [pbl],
    },
  },
  {
    statement:
      "De boeren hebben in Nederland te veel concessies hoeven doen voor het klimaatbeleid.",
    dimension: "social",
    direction: "negative",
    tiers: [...allTiers],
    depth: "broad",
    discriminator: 75,
    themes: ["klimaat"],
    derivedStance:
      "Je vindt dat boeren te zwaar belast zijn door het Nederlandse klimaatbeleid.",
    info: {
      context:
        "Stikstofuitkoop en de Kritische Depositiewaarde (KDW) hebben tot grote protesten geleid. Tegenstanders zien de boer als zondebok.",
      argumentsFor: [
        "Boerenfamilies en eeuwenoude bedrijven worden weggevaagd.",
        "Voedselzekerheid en het Nederlandse landschap staan onder druk.",
      ],
      argumentsAgainst: [
        "De stikstofcrisis kent een onderbouwde wetenschappelijke basis.",
        "Andere sectoren (industrie, mobiliteit) leveren ook bij.",
      ],
      sources: [pbl],
    },
  },
  {
    statement:
      "Korte vluchten binnen Europa moeten verboden worden als er een treinverbinding bestaat.",
    dimension: "governance",
    direction: "positive",
    tiers: [...extendedOnly],
    depth: "deep",
    discriminator: 55,
    themes: ["klimaat", "eu"],
    derivedStance:
      "Je vindt dat korte vluchten met een goed treinalternatief verboden moeten worden.",
    info: {
      context:
        "Frankrijk verbood enkele korte vluchten in 2023. Schiphol heeft veel verbindingen onder 700 km waar trein een alternatief is.",
      argumentsFor: [
        "Treinen stoten een fractie uit van vliegen.",
        "Stimuleert investeringen in Europees treinnet.",
      ],
      argumentsAgainst: [
        "Trein is voor veel routes nog te traag en duur.",
        "Tast keuzevrijheid en zakelijke mobiliteit aan.",
      ],
      sources: [europarl],
    },
  },
  {
    statement:
      "Rijden in een privé-auto op fossiele brandstof moet over tien jaar onmogelijk zijn.",
    dimension: "civil",
    direction: "negative",
    tiers: [...standardExtended],
    depth: "deep",
    discriminator: 65,
    themes: ["klimaat"],
    derivedStance:
      "Je vindt dat de privé-auto op benzine of diesel binnen tien jaar uitgefaseerd moet zijn.",
    info: {
      context:
        "De EU besloot dat vanaf 2035 nieuwe auto's geen CO2 meer mogen uitstoten. Verkoop blijft mogelijk, gebruik van bestaande auto's niet (nu nog niet) verboden.",
      argumentsFor: [
        "Privé-mobiliteit veroorzaakt circa 12% van de uitstoot in Nederland.",
        "Versnelt transitie naar deelmobiliteit en OV.",
      ],
      argumentsAgainst: [
        "Voor mensen op het platteland is een auto onmisbaar.",
        "Onhaalbare deadlines schaden vertrouwen in beleid.",
      ],
      sources: [pbl],
    },
  },
  {
    statement:
      "De klimaatcrisis verdient méér aandacht in het onderwijs dan ze nu krijgt.",
    dimension: "social",
    direction: "positive",
    tiers: [...extendedOnly],
    depth: "deep",
    discriminator: 50,
    themes: ["klimaat"],
    info: {
      context:
        "Op middelbare scholen wordt klimaatverandering aangestipt bij aardrijkskunde en biologie. Klimaatactivisten pleiten voor een verplichte module.",
      argumentsFor: [
        "Toekomstige generaties moeten begrijpen waar de wereld voor staat.",
        "Klimaatkennis stimuleert oplossingsgerichte burgers en kiezers.",
      ],
      argumentsAgainst: [
        "Een vol curriculum laat weinig ruimte voor extra verplichte stof.",
        "Risico op activistische lesstof in plaats van wetenschappelijke onderbouwing.",
      ],
      sources: [],
    },
  },
  {
    statement:
      "Subsidies op zonnepanelen en warmtepompen moeten verder uitgebreid worden voor lage inkomens.",
    dimension: "economic",
    direction: "positive",
    tiers: [...standardExtended],
    depth: "broad",
    discriminator: 60,
    themes: ["klimaat", "economie", "wonen"],
    derivedStance:
      "Je vindt dat verduurzaming van huizen gericht gesubsidieerd moet worden voor mensen met een laag inkomen.",
    info: {
      context:
        "Hogere inkomens profiteren onevenredig van bestaande subsidies omdat zij sneller kunnen investeren. Lage inkomens blijven achter in slecht geïsoleerde woningen.",
      argumentsFor: [
        "Energiearmoede neemt af als slechte huizen verbeteren.",
        "Verkleint de kloof in verduurzaming tussen arm en rijk.",
      ],
      argumentsAgainst: [
        "Subsidies zijn duur en lekken weg naar wie ze het minst nodig heeft.",
        "Verhuurder of woningcorporatie hoort verantwoordelijk te zijn, niet de overheid.",
      ],
      sources: [pbl, aedes],
    },
  },
  {
    statement:
      "Nederland mag klimaatdoelen niet opofferen voor internationale concurrentie, zelfs als andere landen achterblijven.",
    dimension: "governance",
    direction: "positive",
    weight: 1.2,
    tiers: [...extendedOnly],
    depth: "deep",
    discriminator: 75,
    themes: ["klimaat", "eu"],
    info: {
      context:
        "Critici waarschuwen voor carbon leakage als Nederland alleen doorpakt. Voorstanders zien koploper-positie als kans en morele plicht.",
      argumentsFor: [
        "Achterblijven legitimeert nietsdoen bij andere landen.",
        "Voorlopers hebben straks een industriële voorsprong in schone tech.",
      ],
      argumentsAgainst: [
        "Eenzijdig doorpakken verzwakt onze economie zonder klimaatwinst.",
        "Mondiale uitstoot daalt niet door Nederlandse zelfopoffering.",
      ],
      sources: [pbl, ipcc],
    },
  },

  // ============ ZORG (10) ============
  {
    statement:
      "Het eigen risico in de zorgverzekering moet afgeschaft worden.",
    dimension: "economic",
    direction: "positive",
    tiers: [...allTiers],
    depth: "broad",
    discriminator: 80,
    themes: ["zorg"],
    derivedStance:
      "Je vindt dat het eigen risico in de zorgverzekering moet verdwijnen.",
    info: {
      context:
        "Het eigen risico staat in 2025 op €385. SP en PvdA willen het schrappen; VVD en CDA willen het behouden als rem op overconsumptie.",
      argumentsFor: [
        "Mensen mijden noodzakelijke zorg vanwege de kosten.",
        "Eigen risico raakt vooral chronisch zieken en lage inkomens.",
      ],
      argumentsAgainst: [
        "Zonder eigen risico stijgt zorggebruik en daarmee de premie.",
        "Afschaffing kost meerdere miljarden per jaar.",
      ],
      sources: [nza, rivm],
    },
  },
  {
    statement:
      "Winstuitkering in de zorgsector moet wettelijk verboden worden.",
    dimension: "economic",
    direction: "positive",
    tiers: [...standardExtended],
    depth: "deep",
    discriminator: 70,
    themes: ["zorg", "economie"],
    derivedStance:
      "Je vindt dat private zorgaanbieders geen winst meer mogen uitkeren aan investeerders.",
    info: {
      context:
        "In de huisartsenzorg en GGZ groeit het aandeel commerciële ketens. Onderzoek (NZa, 2024) wijst op risico's voor kwaliteit en toegankelijkheid.",
      argumentsFor: [
        "Zorggeld hoort naar zorg, niet naar aandeelhouders.",
        "Commerciële prikkels kunnen tot risicoselectie leiden.",
      ],
      argumentsAgainst: [
        "Verbod vermindert investeringsbereidheid en innovatie.",
        "Niet commerciële zorg blijkt ook niet altijd efficiënter.",
      ],
      sources: [nza],
    },
  },
  {
    statement:
      "De geestelijke gezondheidszorg verdient een veel groter aandeel van het zorgbudget.",
    dimension: "economic",
    direction: "positive",
    tiers: [...standardExtended],
    depth: "broad",
    discriminator: 60,
    themes: ["zorg"],
    derivedStance:
      "Je vindt dat de GGZ structureel meer geld moet krijgen ten opzichte van andere zorg.",
    info: {
      context:
        "Wachtlijsten in de GGZ lopen op tot meer dan een jaar. Jongeren en mensen met angst- en stemmingsstoornissen wachten het langst.",
      argumentsFor: [
        "Onbehandelde mentale problemen leiden tot grotere maatschappelijke kosten.",
        "Voor jongeren is wachten op zorg desastreus.",
      ],
      argumentsAgainst: [
        "Er is een tekort aan personeel, niet alleen aan geld.",
        "Andere zorg (ouderen, oncologie) staat ook onder druk.",
      ],
      sources: [nza, rivm],
    },
  },
  {
    statement:
      "Zorgverzekeraars moeten verdwijnen en de zorg moet weer puur publiek gefinancierd worden.",
    dimension: "economic",
    direction: "positive",
    weight: 1.3,
    tiers: [...extendedOnly],
    depth: "deep",
    discriminator: 85,
    themes: ["zorg", "economie"],
    derivedStance:
      "Je wilt het stelsel van zorgverzekeraars vervangen door een publiek gefinancierd zorgstelsel.",
    info: {
      context:
        "Sinds 2006 kent Nederland gereguleerde marktwerking via verzekeraars. SP, BIJ1 en delen van PvdA pleiten voor een Nationaal ZorgFonds.",
      argumentsFor: [
        "Marktwerking heeft bureaucratie verergerd en kosten opgejaagd.",
        "Een fonds verdeelt geld eerlijker en simpeler.",
      ],
      argumentsAgainst: [
        "Volledig publieke zorg leidt elders tot wachtlijsten (denk VK NHS).",
        "Verzekeraars houden kosten en kwaliteit scherp in het oog.",
      ],
      sources: [nza],
    },
  },
  {
    statement:
      "Mensen moeten meer eigen verantwoordelijkheid nemen voor hun gezondheid (sporten, dieet, niet roken), ook als dat hun zorgkosten beïnvloedt.",
    dimension: "economic",
    direction: "negative",
    tiers: [...standardExtended],
    depth: "deep",
    discriminator: 60,
    themes: ["zorg"],
    derivedStance:
      "Je vindt dat persoonlijke gezondheid een grotere persoonlijke verantwoordelijkheid moet zijn.",
    info: {
      context:
        "Discussie over premie-differentiatie, suikertaks en preventiebeleid loopt steeds op. Voorstanders willen prikkels; tegenstanders zien stigmatisering.",
      argumentsFor: [
        "Voorkomt onhoudbare kostenstijging in een vergrijzend land.",
        "Mensen die gezonder leven horen daar baat bij te hebben.",
      ],
      argumentsAgainst: [
        "Gezondheid hangt sterk samen met inkomen en opleiding.",
        "Risico op victim-blaming bij chronisch zieken.",
      ],
      sources: [rivm],
    },
  },
  {
    statement:
      "Mantelzorgers verdienen een financiële vergoeding van de overheid.",
    dimension: "economic",
    direction: "positive",
    tiers: [...standardExtended],
    depth: "broad",
    discriminator: 55,
    themes: ["zorg"],
    derivedStance:
      "Je vindt dat mantelzorgers structureel financieel ondersteund moeten worden.",
    info: {
      context:
        "Een mantelzorgcompliment bestond tot 2015 en is verdwenen. SCP-onderzoek toont dat een derde van de mantelzorgers zwaar belast is.",
      argumentsFor: [
        "Mantelzorg bespaart de samenleving miljarden.",
        "Erkenning voorkomt overbelasting en uitval.",
      ],
      argumentsAgainst: [
        "Vergoeding kan zorg ‘betaalbaar’ maken die anders publiek zou worden geregeld.",
        "Definitie van mantelzorger is moeilijk handhaafbaar.",
      ],
      sources: [rivm],
    },
  },
  {
    statement:
      "Een patiënt heeft het recht om bij ondraaglijk lijden zelf voor euthanasie te kiezen, ook bij dementie of voltooid leven.",
    dimension: "civil",
    direction: "positive",
    weight: 1.2,
    tiers: [...standardExtended],
    depth: "broad",
    discriminator: 75,
    themes: ["zorg", "democratie"],
    derivedStance:
      "Je vindt dat zelfgekozen levenseinde breder mogelijk moet zijn, ook bij dementie of voltooid leven.",
    info: {
      context:
        "De Wet toetsing levensbeëindiging staat euthanasie toe bij ondraaglijk lijden. Bij dementie en 'voltooid leven' wordt het politiek scherper gevoerd.",
      argumentsFor: [
        "Zelfbeschikking is een fundamenteel recht.",
        "Het voorkomt eenzaam en mensonwaardig sterven.",
      ],
      argumentsAgainst: [
        "Risico op druk op kwetsbare ouderen.",
        "Medische beoordeling bij dementie is principieel ingewikkeld.",
      ],
      sources: [],
    },
  },
  {
    statement:
      "Preventie en leefstijl horen een veel groter deel van het zorgbudget te krijgen, ook als curatieve zorg moet inleveren.",
    dimension: "economic",
    direction: "positive",
    tiers: [...extendedOnly],
    depth: "deep",
    discriminator: 55,
    themes: ["zorg"],
    info: {
      context:
        "Slechts circa 3% van het zorgbudget gaat naar preventie. Voorstanders willen verschuiven; tegenstanders zien preventie als 'soft' beleid.",
      argumentsFor: [
        "Voorkomen is goedkoper en menselijker dan genezen.",
        "Welvaartsziekten zijn deels te voorkomen.",
      ],
      argumentsAgainst: [
        "Effecten van preventie zijn moeilijk meetbaar.",
        "Curatieve zorg kampt al met enorme druk; afnemen is risicovol.",
      ],
      sources: [rivm],
    },
  },
  {
    statement:
      "Verpleegkundigen en zorgmedewerkers verdienen aanzienlijk meer salaris, zelfs als dat de premie verhoogt.",
    dimension: "economic",
    direction: "positive",
    tiers: [...allTiers],
    depth: "broad",
    discriminator: 70,
    themes: ["zorg", "economie"],
    derivedStance:
      "Je vindt dat zorgpersoneel structureel beter betaald moet worden, ook als de premie omhoog gaat.",
    info: {
      context:
        "De SER-rapportage 2024 pleitte voor 9-15% loonsverhoging in de zorg om uitstroom te keren.",
      argumentsFor: [
        "Goed salaris houdt mensen in het vak.",
        "Onderwaardering raakt vooral vrouwen die de meerderheid van de zorg dragen.",
      ],
      argumentsAgainst: [
        "Hogere lonen vertalen direct in hogere zorgpremies.",
        "Werkdruk en autonomie zijn vaak belangrijker dan loon.",
      ],
      sources: [nza, cpb2],
    },
  },
  {
    statement:
      "Mensen die zelf bewust ongezond leven, moeten een hogere zorgpremie betalen.",
    dimension: "civil",
    direction: "negative",
    tiers: [...extendedOnly],
    depth: "deep",
    discriminator: 65,
    themes: ["zorg"],
    info: {
      context:
        "Premie-differentiatie op leefstijl ligt politiek uiterst gevoelig. Voorstanders zien rechtvaardigheid; tegenstanders gelijkheid.",
      argumentsFor: [
        "Mensen die de samenleving kosten, betalen zelf bij.",
        "Werkt als prikkel voor gezond gedrag.",
      ],
      argumentsAgainst: [
        "Schendt het solidariteitsprincipe van de zorgverzekering.",
        "Bestraft mensen met genetische pech of moeilijke leefomstandigheden.",
      ],
      sources: [rivm],
    },
  },

  // ============ MIGRATIE (10) ============
  {
    statement:
      "Het aantal asielzoekers dat Nederland jaarlijks opvangt moet expliciet aan een maximum gebonden worden.",
    dimension: "social",
    direction: "negative",
    weight: 1.3,
    tiers: [...allTiers],
    depth: "broad",
    discriminator: 90,
    themes: ["migratie"],
    derivedStance:
      "Je vindt dat Nederland een hard maximum moet stellen op het aantal asielzoekers per jaar.",
    info: {
      context:
        "Het kabinet-Schoof voerde een asielnoodmaatregelenwet in. Een quotumwet werd in 2024 in de Tweede Kamer aangenomen.",
      argumentsFor: [
        "Opvangcapaciteit, woningmarkt en zorg zijn overbelast.",
        "Een maximum biedt duidelijkheid en draagvlak.",
      ],
      argumentsAgainst: [
        "Internationale verdragen verbieden willekeurige quota.",
        "Bescherming hoort afhankelijk van het asielverhaal te zijn, niet van een teller.",
      ],
      sources: [ind, wodc],
    },
  },
  {
    statement:
      "Wie naar Nederland komt, moet vanaf dag één Nederlands leren en de wet kennen, op straffe van consequenties voor verblijf.",
    dimension: "social",
    direction: "negative",
    tiers: [...standardExtended],
    depth: "broad",
    discriminator: 75,
    themes: ["migratie"],
    derivedStance:
      "Je vindt dat strenge inburgering een voorwaarde moet zijn voor verblijf in Nederland.",
    info: {
      context:
        "De inburgeringswet 2021 verschoof de regie naar gemeentes. Strenge sancties zijn er, maar inburgering blijft kwetsbaar.",
      argumentsFor: [
        "Taal en wet zijn de basis voor meedoen.",
        "Heldere eisen geven nieuwkomers structuur.",
      ],
      argumentsAgainst: [
        "Trauma en analfabetisme bemoeilijken snel inburgeren.",
        "Sancties kunnen de integratie juist remmen.",
      ],
      sources: [wodc],
    },
  },
  {
    statement:
      "Arbeidsmigratie binnen de EU moet beperkt worden om Nederlandse arbeiders en huisvesting te beschermen.",
    dimension: "governance",
    direction: "negative",
    tiers: [...standardExtended],
    depth: "deep",
    discriminator: 75,
    themes: ["migratie", "eu", "wonen"],
    derivedStance:
      "Je vindt dat arbeidsmigratie binnen de EU naar Nederland beperkt moet worden.",
    info: {
      context:
        "Roemer-rapport (2020) signaleerde uitbuiting van arbeidsmigranten. Nederland is zwaar afhankelijk van Polen, Roemenen en Bulgaren in agro en logistiek.",
      argumentsFor: [
        "Druk op woningen, scholen en zorg neemt af.",
        "Lokale werknemers krijgen sterker arbeidsmarktperspectief.",
      ],
      argumentsAgainst: [
        "EU-vrij verkeer is een kernverdrag; beperken raakt onze eigen burgers.",
        "Veel sectoren zouden zonder arbeidsmigratie tot stilstand komen.",
      ],
      sources: [wodc, europarl],
    },
  },
  {
    statement:
      "Nederland moet meer doen om vluchtelingen op te vangen die op de grens van Europa stranden.",
    dimension: "social",
    direction: "positive",
    tiers: [...allTiers],
    depth: "broad",
    discriminator: 75,
    themes: ["migratie", "eu"],
    derivedStance:
      "Je vindt dat Nederland zijn deel zou moeten doen bij EU-grensvluchtelingen.",
    info: {
      context:
        "De EU sloot deals met Turkije en Tunesië om migratie buiten de unie te houden. Mensenrechtenorganisaties signaleren ernstige misstanden.",
      argumentsFor: [
        "Mensenrechten gelden ook aan de Europese grens.",
        "Verspreiding is humaner dan stilstand in opvangkampen.",
      ],
      argumentsAgainst: [
        "Verdeling werkt alleen als alle EU-landen mee zouden doen.",
        "Te ruimhartig beleid trekt extra migratie aan.",
      ],
      sources: [europarl, ind],
    },
  },
  {
    statement:
      "Kennismigranten met een hoog inkomen moeten andere fiscale regels krijgen dan andere migranten.",
    dimension: "economic",
    direction: "negative",
    tiers: [...extendedOnly],
    depth: "deep",
    discriminator: 55,
    themes: ["migratie", "economie"],
    info: {
      context:
        "De 30%-regeling voor kennismigranten wordt versoberd. Werkgevers waarschuwen voor talentvlucht; critici noemen het oneerlijk.",
      argumentsFor: [
        "Internationaal talent is essentieel voor de Nederlandse kenniseconomie.",
        "Concurrentie met andere EU-landen om talent is hard.",
      ],
      argumentsAgainst: [
        "Twee klassen migranten in fiscale zin is principieel onrechtvaardig.",
        "Bedrijven horen aantrekkelijk te zijn op meer dan belasting.",
      ],
      sources: [cpb2],
    },
  },
  {
    statement:
      "Migranten zonder verblijfsstatus (ongedocumenteerden) horen recht te hebben op basiszorg en onderdak.",
    dimension: "civil",
    direction: "positive",
    tiers: [...standardExtended],
    depth: "deep",
    discriminator: 70,
    themes: ["migratie", "zorg"],
    derivedStance:
      "Je vindt dat ongedocumenteerde migranten recht hebben op basiszorg en opvang.",
    info: {
      context:
        "Steden als Amsterdam en Utrecht hebben 24-uurs opvang voor ongedocumenteerden (BBB-regeling). Het kabinet schaft die in fasen af.",
      argumentsFor: [
        "Mensenrechten kennen geen verblijfsstatus.",
        "Voorkomt verkommering, ziekte en criminaliteit op straat.",
      ],
      argumentsAgainst: [
        "Maakt de Nederlandse opvang aantrekkelijker dan beoogd.",
        "Uitzetting wordt politiek én feitelijk lastiger.",
      ],
      sources: [wodc],
    },
  },
  {
    statement:
      "Inburgering, asielprocedures en migratie horen Europees geregeld te worden, niet alleen nationaal.",
    dimension: "governance",
    direction: "positive",
    tiers: [...standardExtended],
    depth: "broad",
    discriminator: 80,
    themes: ["migratie", "eu"],
    derivedStance:
      "Je vindt dat asiel en migratie hoofdzakelijk Europees beleid moeten zijn.",
    info: {
      context:
        "Het EU-Asiel- en Migratiepact (2024) introduceert verplichte solidariteit. Nederland kreeg uitzonderingen op delen ervan.",
      argumentsFor: [
        "Migratie stopt niet bij de grens; alleen samen kunnen we het reguleren.",
        "Voorkomt dat enkele landen alle opvang dragen.",
      ],
      argumentsAgainst: [
        "Nationale soevereiniteit op migratie raakt de kern van zelfbestuur.",
        "EU-regels werken traag en bureaucratisch.",
      ],
      sources: [europarl, clingendael],
    },
  },
  {
    statement:
      "Iedereen die ergens fout in Nederland is geboren, moet automatisch Nederlander zijn (ius soli).",
    dimension: "social",
    direction: "positive",
    tiers: [...extendedOnly],
    depth: "deep",
    discriminator: 60,
    themes: ["migratie"],
    info: {
      context:
        "Nederland kent ius sanguinis: nationaliteit volgt de ouders. Frankrijk, VS en VK kennen vormen van ius soli.",
      argumentsFor: [
        "Voorkomt dat kinderen statenloos opgroeien.",
        "Wie hier geboren is, hoort er volwaardig bij.",
      ],
      argumentsAgainst: [
        "Maakt Nederlanderschap mogelijk eenvoudig te verwerven via tijdelijk verblijf.",
        "Doorbreekt de band tussen nationaliteit en duurzame binding.",
      ],
      sources: [wodc],
    },
  },
  {
    statement:
      "Religieuze symbolen (zoals hoofddoek, keppel, kruis) horen niet thuis bij ambtenaren in publieke functies (politie, rechter).",
    dimension: "social",
    direction: "negative",
    tiers: [...standardExtended],
    depth: "broad",
    discriminator: 75,
    themes: ["migratie", "democratie"],
    derivedStance:
      "Je vindt dat ambtenaren in machtspublieke functies geen religieuze symbolen moeten dragen.",
    info: {
      context:
        "Frankrijk kent strikte laïcité; Nederland laat hoofddoeken bij de politie sinds 2024 toe in beperkte vorm.",
      argumentsFor: [
        "Het uniform staat boven persoonlijke overtuiging.",
        "Burgers moeten neutraliteit kunnen zien.",
      ],
      argumentsAgainst: [
        "Verbod sluit gelovigen uit van publieke functies.",
        "Echte neutraliteit zit in handelen, niet in kleding.",
      ],
      sources: [],
    },
  },
  {
    statement:
      "Migratiebeperking is een hogere prioriteit dan de invulling van vacatures in de Nederlandse economie.",
    dimension: "economic",
    direction: "negative",
    tiers: [...extendedOnly],
    depth: "deep",
    discriminator: 70,
    themes: ["migratie", "economie"],
    info: {
      context:
        "Werkgevers (VNO-NCW) waarschuwen voor 1 miljoen vacatures zonder migratie. Politiek staan zekerheden vaak haaks op elkaar.",
      argumentsFor: [
        "Onbeperkte arbeidsmigratie houdt loondruk laag en mensen kwetsbaar.",
        "Eerst nationaal arbeidspotentieel benutten (statushouders, parttimers).",
      ],
      argumentsAgainst: [
        "Vergrijzing dwingt tot internationale arbeid.",
        "Sectoren als zorg en bouw bezwijken zonder instroom.",
      ],
      sources: [cpb2, dnb],
    },
  },

  // ============ ECONOMIE (10) ============
  {
    statement:
      "Erfenissen boven €500.000 horen veel zwaarder belast te worden.",
    dimension: "economic",
    direction: "positive",
    tiers: [...standardExtended],
    depth: "deep",
    discriminator: 70,
    themes: ["economie"],
    derivedStance:
      "Je vindt dat erfenissen boven €500.000 fors zwaarder belast moeten worden.",
    info: {
      context:
        "Erfbelasting is in Nederland progressief, maar het effectieve tarief is internationaal aan de lage kant. WRR pleitte voor verzwaring.",
      argumentsFor: [
        "Vermogen wordt steeds vaker geërfd in plaats van verdiend.",
        "Het bestrijdt vermogensongelijkheid in één generatie.",
      ],
      argumentsAgainst: [
        "Mensen sparen juist voor hun kinderen; dubbele belasting voelt onrechtvaardig.",
        "Bedrijfsopvolging in familie-mkb wordt bemoeilijkt.",
      ],
      sources: [cpb2],
    },
  },
  {
    statement:
      "Het verschil tussen vast en flex op de arbeidsmarkt moet veel kleiner worden, zelfs als dat ondernemers beperkt.",
    dimension: "economic",
    direction: "positive",
    tiers: [...allTiers],
    depth: "broad",
    discriminator: 75,
    themes: ["economie"],
    derivedStance:
      "Je vindt dat flexwerkers en vaste werknemers gelijker beschermd moeten worden.",
    info: {
      context:
        "Commissie Borstlap pleitte voor 'meer vast minder flex'. Veel flexwerkers werken jarenlang zonder zekerheid.",
      argumentsFor: [
        "Onzekerheid drukt het welzijn van een hele generatie werkenden.",
        "Vermindert oneerlijke concurrentie tussen werkvormen.",
      ],
      argumentsAgainst: [
        "Werkgevers kiezen flex voor wendbaarheid; dichten beperkt banen.",
        "ZZP'ers verliezen autonomie en fiscale voordelen.",
      ],
      sources: [cpb2],
    },
  },
  {
    statement:
      "Een aanvullende belasting op grote vermogens (>€2 miljoen) is noodzakelijk om de begroting eerlijk te maken.",
    dimension: "economic",
    direction: "positive",
    weight: 1.2,
    tiers: [...standardExtended],
    depth: "deep",
    discriminator: 85,
    themes: ["economie"],
    derivedStance:
      "Je vindt dat een vermogensbelasting voor grote vermogens nodig is om de begroting eerlijk te maken.",
    info: {
      context:
        "GL-PvdA, SP en BIJ1 pleiten voor vermogensbelasting. CPB-doorrekeningen tonen tientallen miljarden opbrengstpotentieel.",
      argumentsFor: [
        "De rijkste 1% bezit een onevenredig deel van het nationale vermogen.",
        "Inkomen uit kapitaal wordt nu lichter belast dan inkomen uit arbeid.",
      ],
      argumentsAgainst: [
        "Risico op kapitaalvlucht en emigratie van vermogenden.",
        "Familievermogen is vaak gebonden aan bedrijven en huizen, niet liquide.",
      ],
      sources: [cpb2, dnb],
    },
  },
  {
    statement:
      "Pensioenleeftijd mag verder omhoog naar 70 jaar voor wie nu jonger dan 40 is.",
    dimension: "economic",
    direction: "negative",
    tiers: [...standardExtended],
    depth: "deep",
    discriminator: 65,
    themes: ["economie", "zorg"],
    derivedStance:
      "Je vindt dat de pensioenleeftijd voor jongere generaties verder omhoog mag.",
    info: {
      context:
        "AOW-leeftijd stijgt naar 67 jaar (2024+). Vergrijzing zet druk op de financierbaarheid. ABP en pensioenfederatie waarschuwen.",
      argumentsFor: [
        "Levensverwachting stijgt; pensioenduur moet daarmee meebewegen.",
        "Behoud werknemers in productieve sectoren langer.",
      ],
      argumentsAgainst: [
        "Niet iedereen kan tot 70 fysiek werken (bouw, zorg).",
        "Ouderen op arbeidsmarkt verdringen jongeren.",
      ],
      sources: [cpb2, dnb],
    },
  },
  {
    statement:
      "De overheid moet veel actiever industriebeleid voeren en strategische sectoren beschermen.",
    dimension: "economic",
    direction: "positive",
    tiers: [...extendedOnly],
    depth: "deep",
    discriminator: 60,
    themes: ["economie", "eu"],
    info: {
      context:
        "Industriepolitiek beleeft een terugkeer in EU en VS (IRA, Chips Act). Nederland houdt zich relatief afzijdig.",
      argumentsFor: [
        "Strategische autonomie vraagt actief beleid.",
        "Chips, batterijen en groene tech moeten in EU blijven.",
      ],
      argumentsAgainst: [
        "Overheid kiest zelden de juiste winnaars.",
        "Subsidie- en protectionisme-races zijn duur en oneerlijk.",
      ],
      sources: [cpb2, europarl],
    },
  },
  {
    statement:
      "Multinationals die de Nederlandse fiscaliteit ontwijken horen daarvoor hard aangepakt te worden, ook ten koste van vestigingsklimaat.",
    dimension: "economic",
    direction: "positive",
    tiers: [...allTiers],
    depth: "broad",
    discriminator: 70,
    themes: ["economie"],
    derivedStance:
      "Je vindt dat belastingontwijking door multinationals hard aangepakt moet worden, ook als dat het vestigingsklimaat schaadt.",
    info: {
      context:
        "Nederland is internationaal bekend om brievenbusvennootschappen. OESO-pijler 2 introduceert een minimumtarief.",
      argumentsFor: [
        "Bedrijven horen bij te dragen aan de samenleving die ze gebruiken.",
        "Eerlijke concurrentie voor mkb dat zich niet aan ontwijking kan onttrekken.",
      ],
      argumentsAgainst: [
        "Hoofdkantoren vertrekken; banen en kennis verdwijnen.",
        "Eenzijdige aanpak werkt zonder internationale afstemming niet.",
      ],
      sources: [cpb2],
    },
  },
  {
    statement:
      "Nederland moet veel agressiever bezuinigen om de staatsschuld omlaag te krijgen.",
    dimension: "economic",
    direction: "negative",
    tiers: [...standardExtended],
    depth: "deep",
    discriminator: 65,
    themes: ["economie", "democratie"],
    derivedStance:
      "Je vindt dat het terugdringen van de staatsschuld een hogere prioriteit moet zijn dan publieke uitgaven.",
    info: {
      context:
        "De Nederlandse staatsschuld lag rond 43% bbp in 2024 (EU-norm 60%). Critici willen toch behoudender, zeker met vergrijzing voor de deur.",
      argumentsFor: [
        "Schuld nu drukt toekomstige generaties.",
        "Buffer is nodig voor toekomstige crises (klimaat, demografie).",
      ],
      argumentsAgainst: [
        "Nederland heeft nog royaal begrotingsruimte.",
        "Bezuinigen tijdens groei schaadt onze brede welvaart.",
      ],
      sources: [cpb2, dnb],
    },
  },
  {
    statement:
      "Een 32-urige werkweek moet de norm worden in plaats van 40 uur.",
    dimension: "economic",
    direction: "positive",
    tiers: [...extendedOnly],
    depth: "deep",
    discriminator: 60,
    themes: ["economie"],
    info: {
      context:
        "België en Spanje experimenteren met 4-daagse werkweek. Onderzoek wijst op productiviteitswinst, lagere uitval.",
      argumentsFor: [
        "Werk-privébalans verbetert; gezondheidskosten dalen.",
        "Productiviteit per uur stijgt, niet daalt.",
      ],
      argumentsAgainst: [
        "Niet elke sector (zorg, onderwijs) kan met minder uren toe.",
        "Loonkosten per uur stijgen, ondernemerschap onder druk.",
      ],
      sources: [cpb2],
    },
  },
  {
    statement:
      "De Nederlandse economie hoort meer op groen ondernemerschap te wedden, ook al kost dat traditionele banen.",
    dimension: "economic",
    direction: "positive",
    tiers: [...standardExtended],
    depth: "broad",
    discriminator: 65,
    themes: ["economie", "klimaat"],
    info: {
      context:
        "PBL en RCO schatten 500.000+ banen in groene economie tegen 2035, maar transitie kost ook tienduizenden bestaande banen.",
      argumentsFor: [
        "De toekomst is groen of ze is niet.",
        "Eerste-bewegers-voordeel is groot.",
      ],
      argumentsAgainst: [
        "Mensen in fossiele sectoren mogen niet de rekening krijgen.",
        "Subsidies voor groen lekken vaak weg naar grote bedrijven.",
      ],
      sources: [pbl, cpb2],
    },
  },
  {
    statement:
      "Het is meer rechtvaardig om ondernemers fiscaal te belonen dan om werknemers extra te beschermen.",
    dimension: "economic",
    direction: "negative",
    tiers: [...extendedOnly],
    depth: "deep",
    discriminator: 70,
    themes: ["economie"],
    info: {
      context:
        "ZZP-aftrek staat al jaren ter discussie; werknemers en zelfstandigen hebben verschillende fiscale regimes. Critici noemen dit oneerlijke concurrentie.",
      argumentsFor: [
        "Ondernemers dragen risico en moeten daarvoor beloond worden.",
        "Werknemers genieten al ontslag- en arbeidsbescherming.",
      ],
      argumentsAgainst: [
        "Fiscale gunsten voor zzp lokken schijnzelfstandigheid uit.",
        "Werknemersbescherming is een basis voor stabiele samenleving.",
      ],
      sources: [cpb2],
    },
  },

  // ============ EU (10) ============
  {
    statement:
      "Nederland hoort meer bevoegdheden over te dragen aan de EU op het gebied van defensie en buitenlands beleid.",
    dimension: "governance",
    direction: "positive",
    weight: 1.2,
    tiers: [...allTiers],
    depth: "broad",
    discriminator: 85,
    themes: ["eu"],
    derivedStance:
      "Je vindt dat de EU sterker moet worden in defensie en buitenlands beleid.",
    info: {
      context:
        "De oorlog in Oekraïne en de geopolitieke schok van de tweede Trump-presidentschap hebben het debat over EU-defensie aangewakkerd.",
      argumentsFor: [
        "Geopolitiek alleen kunnen we ons als klein land niet redden.",
        "Schaalvoordeel maakt EU-defensie effectiever en goedkoper.",
      ],
      argumentsAgainst: [
        "Defensie raakt de kern van soevereiniteit.",
        "Eensluidend EU-buitenlandbeleid is een illusie bij 27 lidstaten.",
      ],
      sources: [europarl, clingendael],
    },
  },
  {
    statement:
      "Er moet een vetorecht behouden blijven voor nationale parlementen op alle grote EU-besluiten.",
    dimension: "governance",
    direction: "negative",
    tiers: [...standardExtended],
    depth: "broad",
    discriminator: 75,
    themes: ["eu", "democratie"],
    derivedStance:
      "Je vindt dat nationale parlementen veto-recht moeten blijven houden bij grote EU-besluiten.",
    info: {
      context:
        "Het unanimiteitsvereiste in de Raad belemmert besluitvorming. Voorstellen om naar gekwalificeerde meerderheid te gaan komen telkens terug.",
      argumentsFor: [
        "Veto beschermt kleine landen tegen grote machten.",
        "Voorkomt dat EU verandert in een federale supermacht.",
      ],
      argumentsAgainst: [
        "Veto-recht verlamt besluitvorming bij crisis.",
        "Eén land mag niet 26 anderen blokkeren.",
      ],
      sources: [europarl, clingendael],
    },
  },
  {
    statement:
      "Een rijkere EU-lidstaat zoals Nederland hoort ruimhartig bij te dragen aan een sterk EU-budget.",
    dimension: "economic",
    direction: "positive",
    tiers: [...standardExtended],
    depth: "deep",
    discriminator: 70,
    themes: ["eu", "economie"],
    derivedStance:
      "Je vindt dat Nederland ruimhartig moet bijdragen aan het EU-budget.",
    info: {
      context:
        "Nederland is netto-betaler. Het is een terugkerend punt in elke MFK-onderhandeling.",
      argumentsFor: [
        "Solidariteit binnen de EU komt onze interne markt en stabiliteit ten goede.",
        "Sterke EU is in ons eigen belang.",
      ],
      argumentsAgainst: [
        "Nederland draagt al onevenredig veel bij.",
        "EU-uitgaven horen efficiënter, niet groter.",
      ],
      sources: [europarl, cpb2],
    },
  },
  {
    statement:
      "Nederland moet de optie van vertrek uit de EU bespreekbaar houden.",
    dimension: "governance",
    direction: "negative",
    weight: 1.3,
    tiers: [...standardExtended],
    depth: "broad",
    discriminator: 90,
    themes: ["eu"],
    derivedStance:
      "Je vindt dat een Nexit, of in elk geval die optie, op tafel mag liggen.",
    info: {
      context:
        "PVV en FvD pleiten in programma's voor vertrek of fundamentele heronderhandeling. Brexit liet zien wat zo'n stap kan betekenen.",
      argumentsFor: [
        "Wij moeten zelf over onze wetten en grenzen gaan.",
        "Heronderhandeling lukt alleen onder dreiging van vertrek.",
      ],
      argumentsAgainst: [
        "Brexit kostte het VK 4-6% bbp; Nederland zou nog harder geraakt worden.",
        "Onze economie is volledig verweven met de EU.",
      ],
      sources: [europarl, cpb2, clingendael],
    },
  },
  {
    statement:
      "De EU moet meer macht krijgen om in te grijpen wanneer een lidstaat de rechtsstaat ondermijnt.",
    dimension: "trust",
    direction: "positive",
    tiers: [...standardExtended],
    depth: "deep",
    discriminator: 75,
    themes: ["eu", "democratie"],
    derivedStance:
      "Je vindt dat de EU rechtsstaat-schendingen in lidstaten harder mag aanpakken.",
    info: {
      context:
        "Hongarije en Polen kennen jarenlange artikel 7-procedures. Het rechtsstaat-mechanisme koppelt EU-geld aan democratische standaarden.",
      argumentsFor: [
        "Democratie en rechtsstaat zijn fundamenten van de unie.",
        "Solidariteit vraagt om naleving van gedeelde waarden.",
      ],
      argumentsAgainst: [
        "EU mag zich niet als overkoepelende rechter opwerpen.",
        "Inmenging legitimeert nationalisme in lidstaten.",
      ],
      sources: [europarl, vdem2],
    },
  },
  {
    statement:
      "Europese verkiezingen verdienen veel meer aandacht dan ze nu in Nederland krijgen.",
    dimension: "trust",
    direction: "positive",
    tiers: [...extendedOnly],
    depth: "deep",
    discriminator: 50,
    themes: ["eu", "democratie"],
    info: {
      context:
        "Opkomst Europese verkiezingen 2024 in Nederland: 46%. Beduidend lager dan TK-verkiezingen.",
      argumentsFor: [
        "EU-besluiten raken ons dagelijks leven steeds meer.",
        "Lage opkomst legitimeert anti-EU stemmen onevenredig.",
      ],
      argumentsAgainst: [
        "Burgers weten dat hun stem op EU-niveau minder direct werkt.",
        "Politiek hoort de Europese discussie eenvoudiger te maken.",
      ],
      sources: [europarl, clingendael],
    },
  },
  {
    statement:
      "De EU is uiteindelijk meer in het belang van bedrijven dan van gewone burgers.",
    dimension: "trust",
    direction: "negative",
    tiers: [...standardExtended],
    depth: "deep",
    discriminator: 70,
    themes: ["eu", "democratie"],
    derivedStance:
      "Je vindt dat de EU vooral grote bedrijven dient, in plaats van gewone burgers.",
    info: {
      context:
        "Eurobarometer 2024 laat zien dat een meerderheid 'EU als project' steunt, maar slechts 40% vindt dat de EU hun belang dient.",
      argumentsFor: [
        "Lobby in Brussel wordt gedomineerd door multinationals.",
        "Verdragen zoals CETA bevoordelen kapitaal boven werknemers.",
      ],
      argumentsAgainst: [
        "Consumentenrechten, GDPR en milieuwetgeving beschermen burgers.",
        "De interne markt levert burgers welvaart, niet alleen bedrijven.",
      ],
      sources: [europarl],
    },
  },
  {
    statement:
      "Europese minimumlonen en sociale standaarden moeten in alle lidstaten gelden.",
    dimension: "economic",
    direction: "positive",
    tiers: [...extendedOnly],
    depth: "deep",
    discriminator: 65,
    themes: ["eu", "economie"],
    info: {
      context:
        "De EU-richtlijn minimumloon (2022) verplicht lidstaten een fair minimumloon. Implementatie en hoogte verschillen flink.",
      argumentsFor: [
        "Voorkomt sociale dumping en oneerlijke concurrentie.",
        "Onze werknemers worden niet onderboden door Oost-Europa.",
      ],
      argumentsAgainst: [
        "Loonbeleid hoort nationaal te zijn, gekoppeld aan koopkracht.",
        "Eén Europees tarief vat de werkelijkheid in 27 economieën slecht.",
      ],
      sources: [europarl, cpb2],
    },
  },
  {
    statement:
      "Nederland moet zich aansluiten bij landen die de uitbreiding van de EU naar de Balkan tegenhouden.",
    dimension: "governance",
    direction: "negative",
    tiers: [...extendedOnly],
    depth: "deep",
    discriminator: 55,
    themes: ["eu"],
    info: {
      context:
        "Servië, Albanië, Noord-Macedonië en Bosnië-Herzegovina zijn kandidaat-lidstaten. Voortgang stagneert om diverse redenen.",
      argumentsFor: [
        "Eerdere uitbreidingen hebben de unie verzwakt op rechtsstaat.",
        "Eerst orde op zaken stellen voor we groter worden.",
      ],
      argumentsAgainst: [
        "Stilzetten duwt deze landen richting Rusland of China.",
        "Geleidelijke integratie is goed voor stabiliteit op het continent.",
      ],
      sources: [clingendael, europarl],
    },
  },
  {
    statement:
      "Nederland hoort koploper te zijn in een sterk Europees klimaatbeleid, ook al kost dat economisch geld.",
    dimension: "governance",
    direction: "positive",
    tiers: [...allTiers],
    depth: "broad",
    discriminator: 70,
    themes: ["eu", "klimaat"],
    info: {
      context:
        "Het Green Deal-pakket maakt de EU één van de leidende klimaatactoren mondiaal. Lidstaten zoals Nederland kunnen extra ambities tonen.",
      argumentsFor: [
        "EU is invloedrijker met koplopers binnen de eigen rijen.",
        "Nederland heeft als waterland direct belang bij sterk EU-klimaatbeleid.",
      ],
      argumentsAgainst: [
        "Industrie verhuist als wij vooruit lopen op een EU-tempo.",
        "EU-tempo is al strenger dan veel andere blokken.",
      ],
      sources: [europarl, pbl],
    },
  },

  // ============ DEMOCRATIE (10) ============
  {
    statement:
      "Een referendum over belangrijke wetten moet eenvoudig te organiseren zijn voor burgers.",
    dimension: "civil",
    direction: "positive",
    weight: 1.2,
    tiers: [...allTiers],
    depth: "broad",
    discriminator: 80,
    themes: ["democratie"],
    derivedStance:
      "Je vindt dat burgers eenvoudig een referendum moeten kunnen aanvragen over belangrijke wetten.",
    info: {
      context:
        "De Wet raadgevend referendum werd in 2018 afgeschaft. Diverse partijen pleiten voor een nieuw, bindend referendum.",
      argumentsFor: [
        "Burgers hebben recht op directe zeggenschap bij grote besluiten.",
        "Vergroot betrokkenheid bij politiek.",
      ],
      argumentsAgainst: [
        "Referenda zijn vatbaar voor populisme en simplificatie.",
        "Vertegenwoordigende democratie heeft expertise nodig die referenda missen.",
      ],
      sources: [staatscommissie, vdem2],
    },
  },
  {
    statement:
      "Rechters moeten wetten van het parlement aan de Grondwet kunnen toetsen.",
    dimension: "trust",
    direction: "positive",
    tiers: [...standardExtended],
    depth: "deep",
    discriminator: 75,
    themes: ["democratie"],
    derivedStance:
      "Je vindt dat constitutionele toetsing in Nederland mogelijk moet worden.",
    info: {
      context:
        "Nederland is één van de weinige democratieën zonder constitutionele toetsing. Hervorming wordt al jaren bediscussieerd.",
      argumentsFor: [
        "Beschermt grondrechten tegen toevallige meerderheden.",
        "Stelt minderheden veiliger.",
      ],
      argumentsAgainst: [
        "Rechters worden te machtig (juristocratie).",
        "Parlement hoort het laatste woord te hebben in een democratie.",
      ],
      sources: [staatscommissie, vdem2],
    },
  },
  {
    statement:
      "Het Nederlandse kiesstelsel hoort district-elementen te bevatten zodat kiezers een persoonlijker stem hebben.",
    dimension: "governance",
    direction: "positive",
    tiers: [...extendedOnly],
    depth: "deep",
    discriminator: 55,
    themes: ["democratie"],
    info: {
      context:
        "De Staatscommissie-Remkes adviseerde verandering naar gemengd stelsel. Implementatie blijft uit.",
      argumentsFor: [
        "Versterkt de band tussen kiezer en gekozene.",
        "Politiek wordt herkenbaarder voor burgers.",
      ],
      argumentsAgainst: [
        "Risico op grote partijen die kleinere stemmen wegdrukken.",
        "Evenredigheid verdwijnt, kleine partijen vallen uit beeld.",
      ],
      sources: [staatscommissie],
    },
  },
  {
    statement:
      "Politieke partijen moeten verplicht hun financiering volledig openbaar maken.",
    dimension: "trust",
    direction: "positive",
    tiers: [...allTiers],
    depth: "broad",
    discriminator: 70,
    themes: ["democratie"],
    derivedStance:
      "Je vindt dat partijfinanciering volledig openbaar moet zijn.",
    info: {
      context:
        "Sinds 2023 geldt een grens voor anonieme giften, maar transparantie blijft beperkt vergeleken met andere democratieën.",
      argumentsFor: [
        "Voorkomt verborgen belangen van donors.",
        "Versterkt vertrouwen in democratie.",
      ],
      argumentsAgainst: [
        "Donors kunnen onder druk komen of stigma oplopen.",
        "Te veel transparantie schaadt vrijheid van politieke vereniging.",
      ],
      sources: [staatscommissie],
    },
  },
  {
    statement:
      "De macht van de minister-president moet uitgebreid worden zodat regeren slagvaardiger wordt.",
    dimension: "civil",
    direction: "negative",
    tiers: [...extendedOnly],
    depth: "deep",
    discriminator: 65,
    themes: ["democratie"],
    info: {
      context:
        "Vergelijken we Nederland met Duitsland, Frankrijk of het VK, dan is de Nederlandse premier relatief zwak. Discussie over 'gekozen MP' duikt op.",
      argumentsFor: [
        "Crises vragen om snelle, duidelijke leiding.",
        "Helderheid voor kiezer en internationaal speelveld.",
      ],
      argumentsAgainst: [
        "Macht horen we te spreiden, niet te concentreren.",
        "Coalitie-politiek vraagt om consensus, niet om een sterke man/vrouw.",
      ],
      sources: [staatscommissie],
    },
  },
  {
    statement:
      "Publieke omroep (NPO) is een onmisbaar tegengewicht tegen de macht van commerciële media.",
    dimension: "trust",
    direction: "positive",
    tiers: [...standardExtended],
    depth: "broad",
    discriminator: 70,
    themes: ["democratie"],
    derivedStance:
      "Je vindt de publieke omroep een onmisbare pijler in het media-landschap.",
    info: {
      context:
        "De NPO heeft een vast budget en pluralisme is wettelijk verankerd. Critici pleiten voor versobering of afschaffing.",
      argumentsFor: [
        "Onafhankelijke journalistiek vraagt om publieke financiering.",
        "Voorkomt eenzijdige berichtgeving uit commerciële belangen.",
      ],
      argumentsAgainst: [
        "Publieke omroep is duur en niet altijd objectief.",
        "Mediavrijheid kan ook van commerciële spelers komen.",
      ],
      sources: [vdem2],
    },
  },
  {
    statement:
      "Wetenschappers horen zich vooral terughoudend op te stellen in politieke discussies.",
    dimension: "trust",
    direction: "negative",
    tiers: [...standardExtended],
    depth: "deep",
    discriminator: 75,
    themes: ["democratie"],
    derivedStance:
      "Je vindt dat wetenschappers terughoudend moeten zijn met politieke uitspraken.",
    info: {
      context:
        "Tijdens corona en klimaatdebat namen wetenschappers vaak publiek stelling. Voorstanders zien dat als plicht; tegenstanders als activisme.",
      argumentsFor: [
        "Wetenschappers behoren feiten te leveren, geen meningen.",
        "Politisering van wetenschap schaadt vertrouwen op lange termijn.",
      ],
      argumentsAgainst: [
        "Stil zwijgen bij urgentie is geen optie.",
        "Goede wetenschap is altijd publieke wetenschap.",
      ],
      sources: [vdem2],
    },
  },
  {
    statement:
      "Lokale gemeenten verdienen meer eigen geld en bevoegdheden dan ze nu hebben.",
    dimension: "governance",
    direction: "positive",
    tiers: [...extendedOnly],
    depth: "deep",
    discriminator: 55,
    themes: ["democratie"],
    info: {
      context:
        "Decentralisaties (Wmo, jeugdzorg, participatie) gingen in 2015 naar gemeentes zonder voldoende geld. Steden eisen 'opnieuw schikken'.",
      argumentsFor: [
        "Lokaal bestuur is dichter bij de burger.",
        "Differentiatie tussen regio's verbetert beleid.",
      ],
      argumentsAgainst: [
        "Kleine gemeenten missen capaciteit voor complexe taken.",
        "Versnipperd beleid leidt tot ongelijkheid tussen burgers.",
      ],
      sources: [staatscommissie],
    },
  },
  {
    statement:
      "Politieke macht in Nederland is overgenomen door een elite die niet representatief is voor de bevolking.",
    dimension: "trust",
    direction: "negative",
    weight: 1.3,
    tiers: [...allTiers],
    depth: "broad",
    discriminator: 90,
    themes: ["democratie"],
    derivedStance:
      "Je vindt dat het Nederlandse politieke bestel gedomineerd wordt door een niet-representatieve elite.",
    info: {
      context:
        "Onderzoek (Burgerperspectieven, SCP) laat zien dat lager opgeleide Nederlanders veel minder politiek vertegenwoordigd zijn dan hoger opgeleiden.",
      argumentsFor: [
        "Tweede Kamer bestaat voor 90% uit hbo'ers en wo'ers.",
        "Beleid gaat regelmatig in tegen de duidelijke wens van de meerderheid.",
      ],
      argumentsAgainst: [
        "Diversiteit van levensverhalen is groter dan opleiding suggereert.",
        "Een 'elite' suggereert complot waar gewoon politiek bedrijven hoort.",
      ],
      sources: [staatscommissie, vdem2],
    },
  },
  {
    statement:
      "Een burgerberaad met door loting gekozen burgers hoort bindende invloed te krijgen op grote beslissingen.",
    dimension: "civil",
    direction: "positive",
    tiers: [...extendedOnly],
    depth: "deep",
    discriminator: 65,
    themes: ["democratie"],
    info: {
      context:
        "Het klimaat-burgerberaad (2024) was raadgevend. Ierland gebruikte vergelijkbare beraden voor grondwetswijzigingen.",
      argumentsFor: [
        "Burgers buiten politiek hebben verfrissende perspectieven.",
        "Loting maakt deelname democratisch breed.",
      ],
      argumentsAgainst: [
        "Wetgeving vergt expertise die loting niet garandeert.",
        "Verantwoording naar kiezers loopt via parlement, niet via beraad.",
      ],
      sources: [staatscommissie],
    },
  },

  // ============ WONEN (10) ============
  {
    statement:
      "Beleggers moeten geweerd worden van de markt voor betaalbare koopwoningen.",
    dimension: "economic",
    direction: "positive",
    weight: 1.2,
    tiers: [...allTiers],
    depth: "broad",
    discriminator: 80,
    themes: ["wonen", "economie"],
    derivedStance:
      "Je vindt dat beleggers van de markt voor betaalbare koopwoningen geweerd moeten worden.",
    info: {
      context:
        "Sinds 2022 kunnen gemeenten een opkoopbescherming hanteren. Beleggers bezitten een groot deel van de starterswoningen.",
      argumentsFor: [
        "Beleggers drijven de prijs op en concurreren met starters.",
        "Woningen horen primair om in te wonen, niet om te verdienen.",
      ],
      argumentsAgainst: [
        "Particuliere verhuur is nodig voor flexibele woningvraag.",
        "Verbod komt vooral op gemeenten zelf neer en is moeilijk handhaafbaar.",
      ],
      sources: [aedes, bouwen],
    },
  },
  {
    statement:
      "De Wet betaalbare huur moet uitgebreid worden tot meer woningen en hogere huurklassen.",
    dimension: "economic",
    direction: "positive",
    tiers: [...standardExtended],
    depth: "broad",
    discriminator: 70,
    themes: ["wonen", "economie"],
    derivedStance:
      "Je vindt dat huurprijsregulering verder uitgebreid moet worden.",
    info: {
      context:
        "De Wet betaalbare huur (2024) reguleert ook middenhuur tot circa €1.157. Uitbreiden naar duurder segment is een terugkerend voorstel.",
      argumentsFor: [
        "Middenhuur is voor veel jonge huishoudens onbetaalbaar.",
        "Voorkomt dat huurders 50%+ van hun inkomen kwijt zijn.",
      ],
      argumentsAgainst: [
        "Regulering remt nieuwbouw door particuliere investeerders.",
        "Aanbod krimpt; wachttijden lopen op.",
      ],
      sources: [aedes, bouwen],
    },
  },
  {
    statement:
      "Bouwen in groene gebieden moet mogelijk worden gemaakt om de woningnood op te lossen.",
    dimension: "social",
    direction: "negative",
    tiers: [...standardExtended],
    depth: "deep",
    discriminator: 70,
    themes: ["wonen", "klimaat"],
    derivedStance:
      "Je vindt dat we natuur op moeten offeren als dat helpt om de woningnood op te lossen.",
    info: {
      context:
        "Stikstof- en natuurregels blokkeren bouwprojecten. Discussie over 'bouwen buiten de stad' loopt al jaren.",
      argumentsFor: [
        "Binnenstedelijk bouwen alleen is te traag voor de huidige nood.",
        "Voldoende ruimte buiten steden voorhanden.",
      ],
      argumentsAgainst: [
        "Schaarse natuur en open landschap moeten beschermd blijven.",
        "Concentratie van wonen rond steden is duurzamer.",
      ],
      sources: [bouwen, pbl],
    },
  },
  {
    statement:
      "Nederland moet veel meer publieke woningbouwgrond zelf in eigendom houden om speculatie tegen te gaan.",
    dimension: "economic",
    direction: "positive",
    tiers: [...extendedOnly],
    depth: "deep",
    discriminator: 60,
    themes: ["wonen", "economie"],
    info: {
      context:
        "Erfpacht is in Amsterdam gebruikelijk; elders niet. Voorstanders pleiten voor landelijke aanpak om speculatie te dempen.",
      argumentsFor: [
        "Publieke grond houdt waarde voor de samenleving.",
        "Voorkomt dat ontwikkelaars woningen onbetaalbaar maken.",
      ],
      argumentsAgainst: [
        "Erfpacht maakt eigen woningbezit minder aantrekkelijk.",
        "Investeerders kiezen alternatieve markten met privé-eigendom.",
      ],
      sources: [bouwen, aedes],
    },
  },
  {
    statement:
      "Een sterke woningcorporatie hoort weer een dominante speler te zijn in de Nederlandse woningmarkt.",
    dimension: "economic",
    direction: "positive",
    tiers: [...standardExtended],
    depth: "broad",
    discriminator: 65,
    themes: ["wonen"],
    derivedStance:
      "Je vindt dat woningcorporaties weer een centrale rol horen te krijgen.",
    info: {
      context:
        "De verhuurderheffing is afgeschaft, maar bouwopgaven blijven enorm. Corporaties willen weer 'voor het hele middenveld' bouwen.",
      argumentsFor: [
        "Corporaties bouwen niet voor winst maar voor mensen.",
        "Geven betaalbare woningen langdurige zekerheid.",
      ],
      argumentsAgainst: [
        "Corporaties zijn historisch bureaucratisch en log gebleken.",
        "Risico op overconcentratie zonder private alternatieven.",
      ],
      sources: [aedes],
    },
  },
  {
    statement:
      "Hypotheekrenteaftrek hoort verder afgebouwd te worden om de huizenmarkt eerlijker te maken.",
    dimension: "economic",
    direction: "positive",
    tiers: [...standardExtended],
    depth: "deep",
    discriminator: 65,
    themes: ["wonen", "economie"],
    derivedStance:
      "Je vindt dat hypotheekrenteaftrek verder afgebouwd moet worden.",
    info: {
      context:
        "HRA wordt sinds 2014 stapsgewijs afgebouwd. CPB en DNB zien de regeling als prijsopdrijvend.",
      argumentsFor: [
        "Subsidieert vooral hogere inkomens met grote hypotheken.",
        "Drijft huizenprijzen op zonder structurele oplossing.",
      ],
      argumentsAgainst: [
        "Starters die nu een huis kopen, rekenen op de aftrek.",
        "Plotseling afschaffen zou de huizenmarkt destabiliseren.",
      ],
      sources: [cpb2, dnb],
    },
  },
  {
    statement:
      "Statushouders horen niet langer voorrang te krijgen op sociale huurwoningen.",
    dimension: "social",
    direction: "negative",
    tiers: [...standardExtended],
    depth: "broad",
    discriminator: 80,
    themes: ["wonen", "migratie"],
    derivedStance:
      "Je vindt dat statushouders geen voorrang meer moeten krijgen op sociale huurwoningen.",
    info: {
      context:
        "Sinds 2017 kunnen gemeenten zelf bepalen of ze voorrang geven aan statushouders. Sinds 2025 wijst kabinet dit landelijk af.",
      argumentsFor: [
        "Voorrang voelt onrechtvaardig voor mensen die lang wachten.",
        "Druk op andere wachtenden neemt toe.",
      ],
      argumentsAgainst: [
        "Anders blijven statushouders in azc's; opvang blijft vol.",
        "Voorrang is praktisch klein, maar communicatief groot opgeklopt.",
      ],
      sources: [bouwen, wodc],
    },
  },
  {
    statement:
      "Vakantiewoningen in toeristische gebieden mogen niet ten koste gaan van permanent wonen.",
    dimension: "social",
    direction: "positive",
    tiers: [...extendedOnly],
    depth: "deep",
    discriminator: 55,
    themes: ["wonen"],
    info: {
      context:
        "In Amsterdam, Den Haag en Friese kustdorpen verdringt vakantieverhuur het permanente wonen.",
      argumentsFor: [
        "Lokale gemeenschappen worden uitgehold door toerisme.",
        "Bestaande woningen horen primair voor bewoners te zijn.",
      ],
      argumentsAgainst: [
        "Toerisme is lokaal economisch belangrijk.",
        "Eigenaren zien verhuur als verdienmodel.",
      ],
      sources: [bouwen, aedes],
    },
  },
  {
    statement:
      "Nieuwbouw hoort veel meer in een hoog tempo via prefab en industriële bouw te gaan, ook al kost dat architectonische kwaliteit.",
    dimension: "social",
    direction: "negative",
    tiers: [...extendedOnly],
    depth: "deep",
    discriminator: 50,
    themes: ["wonen"],
    info: {
      context:
        "Prefab kan bouwsnelheid sterk versnellen. Architectenkringen waarschuwen voor uniform straatbeeld.",
      argumentsFor: [
        "Snelheid is bittere noodzaak voor de woningnood.",
        "Industriële bouw kan klimaatneutraler dan traditionele bouw.",
      ],
      argumentsAgainst: [
        "Stadsbeeld verarmt door eenheidsworst.",
        "Goedkope nieuwbouw veroudert snel en moet over 30 jaar weer gesloopt.",
      ],
      sources: [bouwen],
    },
  },
  {
    statement:
      "De prioriteit bij de woningmarkt moet liggen bij starters en jonge gezinnen, niet bij doorstromers.",
    dimension: "social",
    direction: "positive",
    tiers: [...allTiers],
    depth: "broad",
    discriminator: 65,
    themes: ["wonen"],
    derivedStance:
      "Je vindt dat starters en jonge gezinnen voorrang horen te krijgen op de woningmarkt.",
    info: {
      context:
        "Starters zijn jaren bezig om een woning te kopen of huren. Doorstromers (oudere gezinnen, gepensioneerden) blijven vaak hangen.",
      argumentsFor: [
        "Generationele rechtvaardigheid vraagt om actie.",
        "Stagnatie houdt de hele markt vast.",
      ],
      argumentsAgainst: [
        "Doorstromers worden gestraft voor lang bouwen.",
        "Doelgroepenbeleid is moeilijk uit te voeren zonder rechtsongelijkheid.",
      ],
      sources: [bouwen, aedes],
    },
  },
];
