import type { DimensionId, Tier } from "@/lib/dimensions";

export interface SeedSource {
  label: string;
  url: string;
}

export interface SeedQuestion {
  statement: string;
  dimension: DimensionId;
  direction: "positive" | "negative";
  weight?: number;
  tiers: Tier[];
  info: {
    context: string;
    argumentsFor: string[];
    argumentsAgainst: string[];
    sources: SeedSource[];
  };
}

const allTiers: Tier[] = ["quick", "standard", "extended"];
const standardExtended: Tier[] = ["standard", "extended"];
const extendedOnly: Tier[] = ["extended"];

const cpb: SeedSource = {
  label: "Centraal Planbureau – Keuzes in Kaart 2025",
  url: "https://www.cpb.nl/keuzes-in-kaart-2025-2028",
};
const scp: SeedSource = {
  label: "Sociaal en Cultureel Planbureau – Continu Onderzoek Burgerperspectieven",
  url: "https://www.scp.nl/onderwerpen/burgerperspectieven",
};
const eurobarometer: SeedSource = {
  label: "Eurobarometer Standard 102 (najaar 2024)",
  url: "https://europa.eu/eurobarometer/surveys/detail/3215",
};
const vdem: SeedSource = {
  label: "V-Dem Institute – Democracy Report 2025",
  url: "https://v-dem.net/publications/democracy-reports/",
};
const rsf: SeedSource = {
  label: "Reporters Without Borders – Press Freedom Index 2025",
  url: "https://rsf.org/en/index",
};

export const QUESTIONS: SeedQuestion[] = [
  // ============== ECONOMIC (16) ==============
  {
    statement:
      "De overheid moet de hoogste inkomens (boven €150.000 per jaar) zwaarder belasten dan nu.",
    dimension: "economic",
    direction: "positive",
    tiers: allTiers,
    info: {
      context:
        "In Nederland geldt sinds 2024 een toptarief van 49,5% boven circa €75.000. Voorstanders willen een extra schijf voor topinkomens; tegenstanders waarschuwen voor weglek van talent en investeringen.",
      argumentsFor: [
        "Vermindert ongelijkheid en versterkt de publieke kas voor zorg en onderwijs.",
        "Topinkomens stegen sneller dan modale lonen; meedragen lijkt rechtvaardig.",
      ],
      argumentsAgainst: [
        "Hogere belasting kan ondernemen en investeren ontmoedigen.",
        "Internationale concurrentie om talent zou Nederland kunnen schaden.",
      ],
      sources: [cpb],
    },
  },
  {
    statement:
      "Grote bedrijven betalen in Nederland nu te weinig winstbelasting.",
    dimension: "economic",
    direction: "positive",
    tiers: allTiers,
    info: {
      context:
        "De vennootschapsbelasting in Nederland kent een toptarief van 25,8% (2025). Multinationals maken gebruik van internationale constructies om effectief minder te betalen.",
      argumentsFor: [
        "Een eerlijker bijdrage van grote bedrijven verlicht de last voor mkb en burgers.",
        "Internationale afspraken (OESO Pijler 2) bevestigen dat aanpassing nodig is.",
      ],
      argumentsAgainst: [
        "Hogere lasten kunnen hoofdkantoren naar het buitenland verjagen.",
        "Een aantrekkelijk fiscaal klimaat trekt investeringen en banen.",
      ],
      sources: [
        cpb,
        {
          label: "OESO – Pillar Two implementation overview",
          url: "https://www.oecd.org/tax/beps/pillar-two-implementation.htm",
        },
      ],
    },
  },
  {
    statement:
      "Essentiële diensten zoals openbaar vervoer en zorg horen in publieke handen, niet bij de markt.",
    dimension: "economic",
    direction: "positive",
    tiers: allTiers,
    info: {
      context:
        "Sinds de jaren ’90 zijn delen van zorg, energie, post en vervoer geprivatiseerd. Sindsdien loopt het debat over of dat tot betere of juist slechtere uitkomsten leidt.",
      argumentsFor: [
        "Publieke diensten dienen iedereen, niet enkel rendement.",
        "Privatisering bracht versnippering en hogere prijzen in sectoren als zorg en post.",
      ],
      argumentsAgainst: [
        "Marktwerking levert efficiëntere dienstverlening en innovatie op.",
        "Volledig publiek beheer is duur en gevoelig voor politieke sturing.",
      ],
      sources: [
        {
          label: "Parlementaire onderzoekscommissie privatisering en verzelfstandiging",
          url: "https://www.parlementairemonitor.nl/9353000/1/j9vvij5epmj1ey0/vivp9aft7zw8",
        },
      ],
    },
  },
  {
    statement:
      "Het minimumloon mag verder omhoog naar minimaal €16 per uur, ook als bedrijven dat moeilijk vinden.",
    dimension: "economic",
    direction: "positive",
    tiers: standardExtended,
    info: {
      context:
        "Per 2025 is het wettelijk minimumloon in Nederland €14,06 per uur. De FNV en linkse partijen pleiten voor verdere verhoging.",
      argumentsFor: [
        "Werken moet lonen; te lage lonen leiden tot armoede ondanks fulltime werk.",
        "Hogere lonen verkleinen het inkomensverschil zonder uitkeringen te verhogen.",
      ],
      argumentsAgainst: [
        "Forse verhoging kan banen kosten in horeca, retail en zorg.",
        "Kleine ondernemers kunnen de extra loonkosten niet altijd dragen.",
      ],
      sources: [
        {
          label: "CBS – ontwikkeling minimumloon Nederland",
          url: "https://www.cbs.nl/nl-nl/cijfers/detail/85217NED",
        },
      ],
    },
  },
  {
    statement:
      "De overheid moet zelf actief sociale huurwoningen blijven bouwen, ook als dat de woningmarkt verstoort.",
    dimension: "economic",
    direction: "positive",
    tiers: standardExtended,
    info: {
      context:
        "Nederland kent al jaren een tekort aan betaalbare woningen. Tegelijk wordt het aandeel sociale huur sinds 2010 gedrukt door verhuurderheffing en verkoop.",
      argumentsFor: [
        "Een sterk sociaal segment houdt huren betaalbaar voor lage middeninkomens.",
        "Markt alleen heeft het tekort niet kunnen oplossen.",
      ],
      argumentsAgainst: [
        "Veel sociale huur kan de doorstroming en koopmarkt vastzetten.",
        "Subsidies belasten de begroting fors.",
      ],
      sources: [
        {
          label: "Ministerie van Volkshuisvesting – Woningbouwprogramma",
          url: "https://www.volkshuisvestingnederland.nl/onderwerpen/woningbouw",
        },
      ],
    },
  },
  {
    statement:
      "Het is rechtvaardig om vermogen boven €1 miljoen progressief te belasten.",
    dimension: "economic",
    direction: "positive",
    tiers: extendedOnly,
    info: {
      context:
        "Box 3 belast in Nederland vermogen, niet inkomen uit vermogen. Een echte progressieve vermogensbelasting bestaat niet, maar wordt door SP, PvdA en GroenLinks bepleit.",
      argumentsFor: [
        "De rijkste 1% bezit een snel groeiend deel van het vermogen.",
        "Vermogensongelijkheid is hardnekkiger dan inkomensongelijkheid.",
      ],
      argumentsAgainst: [
        "Risico op kapitaalvlucht naar landen zonder vermogensbelasting.",
        "Familiebedrijven kunnen door zo’n belasting in problemen komen.",
      ],
      sources: [
        {
          label: "WRR – Houdbare welvaart en ongelijkheid",
          url: "https://www.wrr.nl/publicaties",
        },
      ],
    },
  },
  {
    statement:
      "Werknemers verdienen meer formele zeggenschap in beslissingen van bedrijven waar ze werken.",
    dimension: "economic",
    direction: "positive",
    tiers: extendedOnly,
    info: {
      context:
        "Duitsland kent ‘Mitbestimmung’: werknemers hebben zetels in raden van commissarissen van grote bedrijven. In Nederland is dat beperkter geregeld.",
      argumentsFor: [
        "Werknemers zijn directe stakeholders en hebben kennis van de werkvloer.",
        "Vergroot vertrouwen en stabiliteit in bedrijven.",
      ],
      argumentsAgainst: [
        "Kan besluitvorming vertragen en strategische wendbaarheid verminderen.",
        "Aandeelhouders dragen het financiële risico en horen primair te beslissen.",
      ],
      sources: [
        {
          label: "Sociaal-Economische Raad – Medezeggenschap",
          url: "https://www.ser.nl/nl/thema/medezeggenschap",
        },
      ],
    },
  },
  {
    statement:
      "Een vorm van basisinkomen zou voor iedere volwassene in Nederland mogelijk moeten zijn.",
    dimension: "economic",
    direction: "positive",
    tiers: extendedOnly,
    info: {
      context:
        "Pilots in Finland, Utrecht en Tilburg onderzochten kleinschalige varianten van basisinkomen. De effecten op werkbereidheid en welzijn waren wisselend.",
      argumentsFor: [
        "Geeft mensen bestaanszekerheid los van loonarbeid en uitkeringssysteem.",
        "Vermindert bureaucratie en armoedevallen.",
      ],
      argumentsAgainst: [
        "Volledige invoering is zeer kostbaar zonder duidelijke arbeidswinst.",
        "Kan prikkel om te werken verminderen, vooral bij lagere inkomens.",
      ],
      sources: [
        {
          label: "Universiteit Utrecht – Weten wat werkt onderzoek",
          url: "https://www.uu.nl/onderzoek/weten-wat-werkt",
        },
      ],
    },
  },
  {
    statement:
      "Lagere belastingen voor bedrijven zijn beter voor de Nederlandse economie.",
    dimension: "economic",
    direction: "negative",
    tiers: allTiers,
    info: {
      context:
        "Voorstanders verwijzen naar Ierland en Zwitserland; tegenstanders naar de race-to-the-bottom in Europa.",
      argumentsFor: [
        "Lagere lasten trekken investeringen en banen aan.",
        "Bedrijven kunnen meer reserveren voor innovatie en lonen.",
      ],
      argumentsAgainst: [
        "Belastingverlagingen leiden zelden direct tot loonstijging.",
        "De begroting komt onder druk; publieke voorzieningen lijden.",
      ],
      sources: [cpb],
    },
  },
  {
    statement:
      "De overheid bemoeit zich te veel met de keuzes die bedrijven en burgers maken.",
    dimension: "economic",
    direction: "negative",
    tiers: allTiers,
    info: {
      context:
        "Onderzoek wijst op een toename van regels in zorg, milieu, financiële sector en arbeidsmarkt sinds 2000.",
      argumentsFor: [
        "Te veel regels remmen ondernemerschap en eigen verantwoordelijkheid.",
        "Burgers weten zelf vaak het beste wat goed voor hen is.",
      ],
      argumentsAgainst: [
        "Regelgeving beschermt consumenten, werknemers en milieu.",
        "Markten falen zonder kaders, denk aan banken in 2008.",
      ],
      sources: [
        {
          label: "ATR – Adviescollege Toetsing Regeldruk – Jaarverslag",
          url: "https://www.atr-regeldruk.nl/",
        },
      ],
    },
  },
  {
    statement:
      "Werknemers moeten makkelijker ontslagen kunnen worden zodat bedrijven flexibeler zijn.",
    dimension: "economic",
    direction: "negative",
    tiers: allTiers,
    info: {
      context:
        "De Wet Werk en Zekerheid en de WAB hebben de afgelopen jaren het ontslagrecht aangepast. Werkgevers vinden ontslag in NL nog altijd duur en ingewikkeld.",
      argumentsFor: [
        "Bedrijven kunnen sneller schakelen bij economische tegenwind.",
        "Soepelere regels kunnen leiden tot meer vaste banen.",
      ],
      argumentsAgainst: [
        "Bestaanszekerheid van werknemers neemt af.",
        "Zwakkere positie kan loondruk en stress verhogen.",
      ],
      sources: [
        {
          label: "Commissie Borstlap – In wat voor land willen wij werken?",
          url: "https://www.rijksoverheid.nl/documenten/rapporten/2020/01/23/eindrapport-in-wat-voor-land-willen-wij-werken",
        },
      ],
    },
  },
  {
    statement:
      "Privatisering heeft Nederland over het algemeen welvarender en efficiënter gemaakt.",
    dimension: "economic",
    direction: "negative",
    tiers: standardExtended,
    info: {
      context:
        "Sinds de jaren ’90 zijn KPN, NS-onderdelen, energiebedrijven en delen van de zorg geheel of deels geprivatiseerd.",
      argumentsFor: [
        "Marktwerking heeft prijzen gedrukt en innovatie gestimuleerd.",
        "Efficiëntere dienstverlening, bijvoorbeeld in telecom.",
      ],
      argumentsAgainst: [
        "In zorg en post is privatisering juist tot hogere kosten geleid.",
        "Publieke belangen blijken lastig te borgen via marktprikkels.",
      ],
      sources: [
        {
          label: "Eerste Kamer – Onderzoek privatisering en verzelfstandiging",
          url: "https://www.eerstekamer.nl/commissieonderzoek/onderzoek_privatisering",
        },
      ],
    },
  },
  {
    statement:
      "Een vlaktaks (één belastingtarief voor iedereen) is rechtvaardiger dan progressieve belasting.",
    dimension: "economic",
    direction: "negative",
    tiers: standardExtended,
    info: {
      context:
        "Estland en Hongarije kennen een vlaktaks. Nederland heeft een progressief stelsel met meerdere schijven.",
      argumentsFor: [
        "Eenvoudig, transparant en moeilijk te ontwijken.",
        "Iedereen wordt gelijk behandeld in tariefzin.",
      ],
      argumentsAgainst: [
        "Lage en hoge inkomens dragen relatief evenveel; ongelijkheid neemt toe.",
        "Toeslagen of aftrekposten worden vaak alsnog ingevoerd, en complexiteit komt terug.",
      ],
      sources: [cpb],
    },
  },
  {
    statement:
      "De zorg werkt het beste met concurrentie tussen private aanbieders en zorgverzekeraars.",
    dimension: "economic",
    direction: "negative",
    tiers: extendedOnly,
    info: {
      context:
        "Sinds 2006 kent Nederland gereguleerde marktwerking in de zorg via verzekeraars en aanbieders.",
      argumentsFor: [
        "Concurrentie kan leiden tot lagere prijzen en betere kwaliteit.",
        "Keuzevrijheid voor de patiënt blijft behouden.",
      ],
      argumentsAgainst: [
        "Marktwerking kan tot administratieve last en perverse prikkels leiden.",
        "Publieke gezondheid laat zich slecht in marktcategorieën persen.",
      ],
      sources: [
        {
          label: "RVS – Met de stroom mee – evaluatie zorgstelsel",
          url: "https://www.raadrvs.nl/",
        },
      ],
    },
  },
  {
    statement:
      "Strenge milieuregels remmen economische groei en moeten worden versoepeld.",
    dimension: "economic",
    direction: "negative",
    tiers: extendedOnly,
    info: {
      context:
        "Nederland heeft strenge stikstofnormen en klimaatdoelen. Bedrijven en boeren stellen dat dit hun positie schaadt.",
      argumentsFor: [
        "Bedrijven verliezen concurrentiekracht t.o.v. landen met soepelere regels.",
        "Boeren en industrie hebben ruimte nodig om te investeren en te innoveren.",
      ],
      argumentsAgainst: [
        "Milieukosten verschuiven naar de samenleving en de toekomst.",
        "Schone industrie biedt juist economische kansen voor de lange termijn.",
      ],
      sources: [
        {
          label: "PBL – Klimaat- en Energieverkenning",
          url: "https://www.pbl.nl/onderwerpen/klimaat-en-energie",
        },
      ],
    },
  },
  {
    statement:
      "De huidige uitkeringen in Nederland zijn aan de hoge kant en moeten naar beneden.",
    dimension: "economic",
    direction: "negative",
    tiers: extendedOnly,
    info: {
      context:
        "De koppeling tussen uitkeringen en minimumloon staat regelmatig politiek ter discussie.",
      argumentsFor: [
        "Werken moet duidelijk lonender zijn dan een uitkering.",
        "Lagere lasten op werk kunnen arbeidsparticipatie stimuleren.",
      ],
      argumentsAgainst: [
        "Lagere uitkeringen vergroten armoede onder kwetsbare groepen.",
        "Bestaanszekerheid is fundament voor een leefbare samenleving.",
      ],
      sources: [
        {
          label: "Nibud – Inkomensonderzoek",
          url: "https://www.nibud.nl/onderzoek/",
        },
      ],
    },
  },

  // ============== SOCIAL (16) ==============
  {
    statement:
      "Nederland moet meer asielzoekers opvangen dan nu het geval is.",
    dimension: "social",
    direction: "positive",
    tiers: allTiers,
    info: {
      context:
        "In 2024 vroegen circa 32.000 mensen asiel aan in Nederland. Het kabinet maakt opvang nu strenger met de asielnoodmaatregelenwet.",
      argumentsFor: [
        "Bescherming van vluchtelingen is een internationale verplichting.",
        "Andere EU-landen vangen relatief meer mensen op.",
      ],
      argumentsAgainst: [
        "De opvangcapaciteit is overspannen, met druk op huisvesting en zorg.",
        "Draagvlak in de samenleving staat onder druk.",
      ],
      sources: [
        {
          label: "IND – Asielinstroom maandcijfers",
          url: "https://ind.nl/nl/over-ons/cijfers-en-publicaties",
        },
      ],
    },
  },
  {
    statement:
      "Onderwijs op school moet expliciet aandacht besteden aan diversiteit en LGBTQ+-thema's.",
    dimension: "social",
    direction: "positive",
    tiers: allTiers,
    info: {
      context:
        "Sinds 2012 is aandacht voor seksuele diversiteit verplicht in het curriculum. Sommige scholen vinden dit lastig binnen hun identiteit.",
      argumentsFor: [
        "Vergroot acceptatie en veiligheid voor LHBTI-leerlingen.",
        "Een diverse samenleving vraagt om brede vorming.",
      ],
      argumentsAgainst: [
        "Religieuze gezinnen ervaren spanning met hun overtuigingen.",
        "Scholen moeten ook ruimte hebben voor pedagogische eigen koers.",
      ],
      sources: [
        {
          label: "Onderwijsinspectie – Burgerschapsonderwijs",
          url: "https://www.onderwijsinspectie.nl/onderwerpen/burgerschap",
        },
      ],
    },
  },
  {
    statement:
      "Mannen en vrouwen verdienen wettelijk gelijke kansen, ook als dat actieve quota of voorrangsbeleid vraagt.",
    dimension: "social",
    direction: "positive",
    tiers: allTiers,
    info: {
      context:
        "Sinds 2022 geldt een ingroeiquotum van 1/3 vrouwen in raden van commissarissen van beursvennootschappen.",
      argumentsFor: [
        "Quota doorbreken structurele achterstand sneller dan vrijwillige doelen.",
        "Diverse besturen presteren onderzoek-tot-onderzoek beter.",
      ],
      argumentsAgainst: [
        "Selecteren op geslacht botst met gelijke behandeling.",
        "Bedrijven moeten zelf hun talent kunnen kiezen.",
      ],
      sources: [
        {
          label: "SER – Diversiteit in de top",
          url: "https://www.ser.nl/nl/thema/diversiteit",
        },
      ],
    },
  },
  {
    statement:
      "De positie van het koningshuis moet democratischer worden of zelfs heroverwogen.",
    dimension: "social",
    direction: "positive",
    tiers: standardExtended,
    info: {
      context:
        "Een meerderheid van de Nederlanders steunt de monarchie, maar steun voor de koning fluctueert. Politieke partijen verschillen sterk.",
      argumentsFor: [
        "Erfelijke functies passen niet bij een moderne democratie.",
        "Symboliek kan ook een gekozen president of een ceremonieel staatshoofd vervullen.",
      ],
      argumentsAgainst: [
        "De monarchie biedt stabiliteit en continuïteit boven politieke conflicten.",
        "Verandering biedt geen aantoonbare democratische meerwaarde.",
      ],
      sources: [scp],
    },
  },
  {
    statement:
      "Religieuze symbolen horen niet thuis bij overheidsfuncties (politie, rechter, leerkracht in het openbaar onderwijs).",
    dimension: "social",
    direction: "positive",
    tiers: standardExtended,
    info: {
      context:
        "In Nederland geldt een kleine-letterlijne in dit debat: politie en rechters dragen geen zichtbare religieuze tekens; sommige sectoren wel.",
      argumentsFor: [
        "Neutraliteit van de overheid versterkt vertrouwen voor alle burgers.",
        "Een uniform straalt gelijkheid uit, los van geloof.",
      ],
      argumentsAgainst: [
        "Vrijheid van religie geldt ook voor ambtenaren.",
        "Een hoofddoek of keppel zegt niets over neutraal handelen.",
      ],
      sources: [
        {
          label: "College voor de Rechten van de Mens – Religieuze symbolen",
          url: "https://www.mensenrechten.nl/",
        },
      ],
    },
  },
  {
    statement:
      "Drugs zoals XTC en MDMA zouden onder strikte voorwaarden gereguleerd verkrijgbaar moeten zijn.",
    dimension: "social",
    direction: "positive",
    tiers: extendedOnly,
    info: {
      context:
        "De Staatscommissie MDMA adviseerde in 2024 een gecontroleerde regulering van MDMA voor volwassenen, mits omkleed met waarborgen.",
      argumentsFor: [
        "Reguleren snijdt criminaliteit en maakt gebruik veiliger.",
        "Onderzoek wijst op relatief lage gezondheidsrisico’s bij begeleid gebruik.",
      ],
      argumentsAgainst: [
        "Normalisering kan gebruik en jongerenrisico vergroten.",
        "Volksgezondheid en internationale verdragen lopen risico.",
      ],
      sources: [
        {
          label: "Staatscommissie MDMA – Eindrapport 2024",
          url: "https://www.rijksoverheid.nl/onderwerpen/staatscommissie-mdma",
        },
      ],
    },
  },
  {
    statement:
      "Discriminatie tegen mensen met een migratie-achtergrond is een groot probleem in Nederland.",
    dimension: "social",
    direction: "positive",
    tiers: extendedOnly,
    info: {
      context:
        "Onderzoek van het SCP en Verwey-Jonker Instituut toont aan dat discriminatie voorkomt op de arbeidsmarkt en in het uitgaansleven.",
      argumentsFor: [
        "Empirisch onderzoek bevestigt structurele achterstanden.",
        "Erkenning is voorwaarde voor effectief beleid.",
      ],
      argumentsAgainst: [
        "Het beeld van structurele discriminatie kan worden overdreven.",
        "Verschillen kunnen ook andere oorzaken hebben dan discriminatie.",
      ],
      sources: [
        {
          label: "SCP – Gevestigd of gevlucht? (2023)",
          url: "https://www.scp.nl/publicaties",
        },
      ],
    },
  },
  {
    statement:
      "Het Sinterklaasfeest moet zich blijven aanpassen aan moderne opvattingen over racisme.",
    dimension: "social",
    direction: "positive",
    tiers: extendedOnly,
    info: {
      context:
        "Sinds 2014 is de figuur van Zwarte Piet in de meeste media en gemeentes vervangen door Roetveegpiet.",
      argumentsFor: [
        "Het feest blijft populair, terwijl pijnlijke kanten worden verzacht.",
        "Erfgoed verandert altijd; dat hoort bij een levende traditie.",
      ],
      argumentsAgainst: [
        "Tradities dienen niet steeds aangepast te worden onder druk van een minderheid.",
        "Verwarring rond ‘welke piet’ ontmoedigt vrijwilligers.",
      ],
      sources: [scp],
    },
  },
  {
    statement:
      "Nederland moet de instroom van asielzoekers fors beperken.",
    dimension: "social",
    direction: "negative",
    tiers: allTiers,
    info: {
      context:
        "Het kabinet-Schoof heeft in 2024 strengere asielmaatregelen aangekondigd via een Asielnoodmaatregelenwet.",
      argumentsFor: [
        "De huidige instroom legt te veel druk op huisvesting, zorg en onderwijs.",
        "Strengere kaders kunnen draagvlak voor échte vluchtelingen behouden.",
      ],
      argumentsAgainst: [
        "Nederland heeft internationale verplichtingen, ook in zware tijden.",
        "Vluchtelingen dragen op termijn vaak bij aan economie en samenleving.",
      ],
      sources: [
        {
          label: "Rijksoverheid – Asielnoodmaatregelenwet",
          url: "https://www.rijksoverheid.nl/onderwerpen/asielbeleid",
        },
      ],
    },
  },
  {
    statement:
      "Tradities en culturele wortels van Nederland moeten beter beschermd worden.",
    dimension: "social",
    direction: "negative",
    tiers: allTiers,
    info: {
      context:
        "Veel partijen pleiten voor meer aandacht voor canon, cultuurhistorie en erfgoed in onderwijs en publieke ruimte.",
      argumentsFor: [
        "Cultuur biedt houvast in een snel veranderende samenleving.",
        "Kennis van eigen geschiedenis versterkt sociale samenhang.",
      ],
      argumentsAgainst: [
        "Bescherming kan uitsluiting impliceren van wie ‘er niet bijhoort’.",
        "Cultuur is geen statisch museum, maar veranderlijk.",
      ],
      sources: [
        {
          label: "Canon van Nederland",
          url: "https://www.canonvannederland.nl/",
        },
      ],
    },
  },
  {
    statement:
      "Op scholen moet de Nederlandse cultuur en geschiedenis centraler komen te staan.",
    dimension: "social",
    direction: "negative",
    tiers: allTiers,
    info: {
      context:
        "De curriculumherziening is een politiek beladen thema, met spanning tussen burgerschap, internationaal perspectief en nationale verhalen.",
      argumentsFor: [
        "Zonder gedeeld referentiekader brokkelt samenleving af.",
        "Eigen geschiedenis (zowel hoogtepunten als zwarte bladzijden) hoort centraal.",
      ],
      argumentsAgainst: [
        "Centralisering kan andere perspectieven verdringen.",
        "Een internationaal perspectief is in een open economie essentieel.",
      ],
      sources: [
        {
          label: "SLO – Curriculumontwikkeling",
          url: "https://www.slo.nl/",
        },
      ],
    },
  },
  {
    statement:
      "Inburgering voor nieuwkomers moet strenger en sneller verlopen.",
    dimension: "social",
    direction: "negative",
    tiers: standardExtended,
    info: {
      context:
        "Sinds 2022 geldt de nieuwe Wet inburgering, met een sterke gemeentelijke rol en verplichte taal- en participatiecomponenten.",
      argumentsFor: [
        "Snellere integratie helpt nieuwkomers en samenleving.",
        "Heldere eisen voorkomen langdurige afhankelijkheid.",
      ],
      argumentsAgainst: [
        "Te hoge druk leidt tot afhakers en mislukkingen.",
        "Inburgering vraagt tijd, vooral bij trauma of analfabetisme.",
      ],
      sources: [
        {
          label: "Divosa – Monitor Wet inburgering",
          url: "https://www.divosa.nl/themas/inburgering",
        },
      ],
    },
  },
  {
    statement:
      "Het traditionele gezin als hoeksteen van de samenleving is iets om te koesteren.",
    dimension: "social",
    direction: "negative",
    tiers: standardExtended,
    info: {
      context:
        "Christen-democratische en conservatieve partijen benadrukken de rol van het gezin in opvoeding en samenleving.",
      argumentsFor: [
        "Gezinnen zorgen voor stabiliteit en intergenerationele zorg.",
        "Beleidsondersteuning voor gezinnen heeft positieve effecten op kinderen.",
      ],
      argumentsAgainst: [
        "Het ‘traditionele’ gezin is één model naast vele andere.",
        "Beleid moet alle vormen van samenleven gelijk waarderen.",
      ],
      sources: [
        {
          label: "CBS – Huishoudensstatistiek",
          url: "https://www.cbs.nl/nl-nl/cijfers/detail/37312",
        },
      ],
    },
  },
  {
    statement:
      "Religieuze instellingen verdienen meer respect en ruimte in het publieke debat.",
    dimension: "social",
    direction: "negative",
    tiers: extendedOnly,
    info: {
      context:
        "Het debat over de plek van kerken, moskeeën en synagogen in publieke ruimte en beleid is regelmatig fel.",
      argumentsFor: [
        "Religie is voor velen een belangrijke morele en sociale bron.",
        "Vrijheid van godsdienst is een grondrecht dat actieve ruimte vraagt.",
      ],
      argumentsAgainst: [
        "Een seculiere staat houdt religie en politiek gescheiden.",
        "Ruimte mag niet ten koste gaan van gelijke rechten van anderen.",
      ],
      sources: [
        {
          label: "WRR – Geloven in het publieke domein",
          url: "https://www.wrr.nl/",
        },
      ],
    },
  },
  {
    statement:
      "Genderneutrale taal (zoals 'reizigers' i.p.v. 'dames en heren') gaat te ver.",
    dimension: "social",
    direction: "negative",
    tiers: extendedOnly,
    info: {
      context:
        "NS, gemeentes en bedrijven kiezen vaker voor genderneutrale aanspreekvormen. Tegenstanders zien dit als symbolisch en overdreven.",
      argumentsFor: [
        "Aanspreekvormen zijn deel van traditie en hoeven niet weg.",
        "Aanpassen voor kleine groepen kan averechts werken.",
      ],
      argumentsAgainst: [
        "Inclusieve taal kost weinig en sluit niemand uit.",
        "Taal stuurt onbewust ons denken en daarmee ons gedrag.",
      ],
      sources: [
        {
          label: "Onze Taal – Genderneutrale aanspreekvormen",
          url: "https://onzetaal.nl/taaladvies/genderneutrale-aanspreekvormen",
        },
      ],
    },
  },
  {
    statement:
      "Nationale symbolen zoals vlag en volkslied verdienen een prominentere plek in het openbare leven.",
    dimension: "social",
    direction: "negative",
    tiers: extendedOnly,
    info: {
      context:
        "In Nederland worden vlag en volkslied minder vaak op evenementen ingezet dan in de VS of Frankrijk.",
      argumentsFor: [
        "Symbolen versterken een gedeeld gevoel van burgerschap.",
        "Eer voor de nationale symbolen verbindt over politieke verschillen heen.",
      ],
      argumentsAgainst: [
        "Verplicht ritueel rond symbolen kan dwingend en hol aanvoelen.",
        "Burgerschap zit in handelen, niet in vlaggen.",
      ],
      sources: [scp],
    },
  },

  // ============== CIVIL (16) ==============
  {
    statement:
      "De overheid mag mijn berichten en e-mails niet zonder concrete verdenking inzien.",
    dimension: "civil",
    direction: "positive",
    tiers: allTiers,
    info: {
      context:
        "De Wet op de inlichtingen- en veiligheidsdiensten 2017 (Wiv) maakt grootschalige interceptie mogelijk, met onafhankelijk toezicht.",
      argumentsFor: [
        "Massale interceptie raakt iedereen, niet alleen verdachten.",
        "Privacy is grondrecht en basis van vrije meningsuiting.",
      ],
      argumentsAgainst: [
        "Diensten moeten dreigingen tijdig kunnen detecteren.",
        "Toezicht door TIB en CTIVD biedt al strenge waarborgen.",
      ],
      sources: [
        {
          label: "CTIVD – Toezicht op de Wiv",
          url: "https://www.ctivd.nl/",
        },
      ],
    },
  },
  {
    statement:
      "End-to-end versleuteling moet beschermd blijven, ook als het politieonderzoek bemoeilijkt.",
    dimension: "civil",
    direction: "positive",
    tiers: allTiers,
    info: {
      context:
        "Op EU-niveau wordt al jaren gediscussieerd over ‘chatcontrole’: scannen van versleutelde berichten op CSAM.",
      argumentsFor: [
        "Versleuteling beschermt journalisten, dissidenten en gewone burgers.",
        "Achterdeurtjes worden ook door criminelen en buitenlandse actoren misbruikt.",
      ],
      argumentsAgainst: [
        "Politie en OM hebben gerichte toegang nodig bij ernstige misdaden.",
        "Volledige privacy zonder uitzondering geeft criminelen vrij spel.",
      ],
      sources: [
        {
          label: "Bits of Freedom – Chatcontrole",
          url: "https://www.bitsoffreedom.nl/onderwerp/chatcontrole/",
        },
      ],
    },
  },
  {
    statement:
      "Cameratoezicht in publieke ruimtes is een te grote inbreuk op privacy.",
    dimension: "civil",
    direction: "positive",
    tiers: allTiers,
    info: {
      context:
        "Steeds meer Nederlandse gemeentes plaatsen camera's, slimme sensoren en ANPR in de openbare ruimte.",
      argumentsFor: [
        "Massale registratie verandert hoe mensen zich gedragen.",
        "Gegevens kunnen lekken, gehackt of misbruikt worden.",
      ],
      argumentsAgainst: [
        "Camerabeelden helpen bij het oplossen van misdrijven.",
        "Beelden geven veiligheidsgevoel in onveilige gebieden.",
      ],
      sources: [
        {
          label: "Autoriteit Persoonsgegevens – Cameratoezicht",
          url: "https://autoriteitpersoonsgegevens.nl/themas/cameratoezicht",
        },
      ],
    },
  },
  {
    statement:
      "Vreedzame demonstraties moeten worden beschermd, ook als ze de openbare orde tijdelijk verstoren.",
    dimension: "civil",
    direction: "positive",
    tiers: standardExtended,
    info: {
      context:
        "Klimaatblokkades, boerenprotesten en pro-Palestijnse acties roepen het debat op over de balans tussen demonstratierecht en orde.",
      argumentsFor: [
        "Het demonstratierecht is een hoeksteen van een vrije samenleving.",
        "Verstoring is vaak inherent aan zichtbaar protest.",
      ],
      argumentsAgainst: [
        "Andere burgers hebben ook recht op vrije doorgang en veiligheid.",
        "Aanhoudende blokkades schaden vertrouwen in de overheid.",
      ],
      sources: [
        {
          label: "Amnesty International – Recht op protest",
          url: "https://www.amnesty.nl/wat-we-doen/themas/recht-op-protest",
        },
      ],
    },
  },
  {
    statement:
      "De wet op de inlichtingen- en veiligheidsdiensten geeft de AIVD/MIVD te ruime bevoegdheden.",
    dimension: "civil",
    direction: "positive",
    tiers: standardExtended,
    info: {
      context:
        "Tijdens een raadgevend referendum in 2018 stemde een meerderheid tegen de Wiv 2017. Toch is hij ingevoerd na aanpassingen.",
      argumentsFor: [
        "De zogeheten ‘sleepnetbevoegdheid’ raakt onschuldige burgers.",
        "Toezicht is achteraf en kan misbruik niet altijd voorkomen.",
      ],
      argumentsAgainst: [
        "Dreigingen op het gebied van terrorisme en cyber zijn reëel.",
        "TIB en CTIVD bieden goed onafhankelijk toezicht.",
      ],
      sources: [
        {
          label: "TIB – Toetsingscommissie Inzet Bevoegdheden",
          url: "https://www.tib-ivd.nl/",
        },
      ],
    },
  },
  {
    statement:
      "Kraken zou niet strafbaar moeten zijn als een pand lang leegstaat.",
    dimension: "civil",
    direction: "positive",
    tiers: extendedOnly,
    info: {
      context:
        "Sinds 2010 is kraken in Nederland bij wet strafbaar. Tegelijk staat speculatie en leegstand op gespannen voet met het woningtekort.",
      argumentsFor: [
        "Krakers vullen leegstand op tijdens de wooncrisis.",
        "Eigenaren moeten ook verantwoordelijkheid nemen voor leegstand.",
      ],
      argumentsAgainst: [
        "Eigendomsrecht is een fundament van de rechtsstaat.",
        "Kraken kan tot wanordelijkheden en onveiligheid leiden.",
      ],
      sources: [
        {
          label: "WODC – Evaluatie kraken en leegstandsbestrijding",
          url: "https://www.wodc.nl/",
        },
      ],
    },
  },
  {
    statement:
      "Persoonlijke vrijheden mogen niet worden ingeperkt op basis van ‘aanstootgevendheid’.",
    dimension: "civil",
    direction: "positive",
    tiers: extendedOnly,
    info: {
      context:
        "Het Europees Hof voor de Rechten van de Mens stelt herhaaldelijk dat de vrijheid van meningsuiting ook kwetsende uitingen omvat.",
      argumentsFor: [
        "Vrijheid van meningsuiting moet juist ongemakkelijke uitingen beschermen.",
        "Aanstootgevendheid is subjectief en gevaarlijk als juridische maatstaf.",
      ],
      argumentsAgainst: [
        "Sommige uitingen schaden de menselijke waardigheid van groepen.",
        "Een grens bij haatzaaien beschermt minderheden.",
      ],
      sources: [
        {
          label: "EHRM – Vrijheid van meningsuiting (art. 10)",
          url: "https://hudoc.echr.coe.int",
        },
      ],
    },
  },
  {
    statement:
      "Drugsgebruikers horen niet strafrechtelijk vervolgd te worden, maar geholpen.",
    dimension: "civil",
    direction: "positive",
    tiers: extendedOnly,
    info: {
      context:
        "Portugal decriminaliseerde gebruik in 2001; gezondheidsuitkomsten verbeterden volgens onderzoek.",
      argumentsFor: [
        "Strafrecht lost verslaving niet op, en stigmatiseert gebruikers.",
        "Gezondheidszorgaanpak is effectiever en goedkoper.",
      ],
      argumentsAgainst: [
        "Volledige decriminalisering kan gebruik normaliseren.",
        "Politie heeft handhavingsinstrumenten nodig in zware criminaliteit.",
      ],
      sources: [
        {
          label: "EMCDDA – Drugs policy report Portugal",
          url: "https://www.emcdda.europa.eu/countries/portugal_en",
        },
      ],
    },
  },
  {
    statement:
      "De politie heeft ruimere bevoegdheden nodig om de veiligheid op straat te garanderen.",
    dimension: "civil",
    direction: "negative",
    tiers: allTiers,
    info: {
      context:
        "Wijken met hoge incidenten kennen al preventief fouilleren; uitbreiding wordt regelmatig voorgesteld.",
      argumentsFor: [
        "Toenemende ondermijning vraagt sterkere instrumenten.",
        "Ruime bevoegdheden geven veiligheidsgevoel terug aan bewoners.",
      ],
      argumentsAgainst: [
        "Ruime bevoegdheden raken vooral kwetsbare groepen via etnisch profileren.",
        "Veiligheid valt niet enkel op te lossen met extra macht.",
      ],
      sources: [
        {
          label: "Politieacademie – Effectiviteit preventief fouilleren",
          url: "https://www.politieacademie.nl/onderzoek",
        },
      ],
    },
  },
  {
    statement:
      "Verdachten van zware criminaliteit moeten preventief vastgehouden kunnen worden, ook zonder sluitend bewijs.",
    dimension: "civil",
    direction: "negative",
    tiers: allTiers,
    info: {
      context:
        "Het OM kan voorlopige hechtenis vorderen op basis van ernstige bezwaren; niet op vermoeden alleen.",
      argumentsFor: [
        "Voor zware bedreiging moet de samenleving zich snel kunnen beschermen.",
        "Onmiddellijk ingrijpen voorkomt soms erger.",
      ],
      argumentsAgainst: [
        "Onschuldpresumptie is een fundament van onze rechtsstaat.",
        "Voorarrest zonder bewijs leidt tot machtsmisbruik.",
      ],
      sources: [
        {
          label: "Raad voor de Rechtspraak – Voorlopige hechtenis",
          url: "https://www.rechtspraak.nl/Themas/Strafrecht",
        },
      ],
    },
  },
  {
    statement:
      "Terreurverdachten moeten ook zonder strafrechtelijke veroordeling hun nationaliteit kunnen verliezen.",
    dimension: "civil",
    direction: "negative",
    tiers: allTiers,
    info: {
      context:
        "Sinds 2017 kan het Nederlanderschap worden ingetrokken bij dubbelgenationaliseerden die zich aansluiten bij een terreurorganisatie.",
      argumentsFor: [
        "Een terugkeer naar NL kan grote veiligheidsrisico's opleveren.",
        "De maatregel werkt afschrikwekkend.",
      ],
      argumentsAgainst: [
        "Maakt onderscheid tussen burgers met enkele en dubbele nationaliteit.",
        "Recht op verdediging hoort bij elke verdachte.",
      ],
      sources: [
        {
          label: "Adviescommissie Vreemdelingenzaken – Intrekking Nederlanderschap",
          url: "https://www.adviescommissievoorvreemdelingenzaken.nl/",
        },
      ],
    },
  },
  {
    statement:
      "Cameratoezicht en slimme sensoren maken onze samenleving veiliger en moeten worden uitgebreid.",
    dimension: "civil",
    direction: "negative",
    tiers: standardExtended,
    info: {
      context:
        "Slimme verkeerssensoren, ANPR en gezichtsherkenning worden steeds breder ingezet.",
      argumentsFor: [
        "Beelden helpen bij opsporing van geweld en winkeldiefstal.",
        "Bewoners voelen zich veiliger met camera's in de buurt.",
      ],
      argumentsAgainst: [
        "Vergrote surveillance gaat ten koste van privacy.",
        "Risico op misbruik en discriminatie via algoritmes.",
      ],
      sources: [
        {
          label: "AP – Slimme camera's en gezichtsherkenning",
          url: "https://autoriteitpersoonsgegevens.nl/",
        },
      ],
    },
  },
  {
    statement:
      "Onlinediensten moeten verplicht achterdeurtjes bouwen voor opsporingsdiensten.",
    dimension: "civil",
    direction: "negative",
    tiers: standardExtended,
    info: {
      context:
        "Op EU-niveau staat ‘chatcontrole’ ter discussie, een verplichting voor diensten om versleutelde berichten te scannen.",
      argumentsFor: [
        "Misdaad verplaatst zich naar versleutelde kanalen.",
        "Politie moet effectieve middelen houden, ook online.",
      ],
      argumentsAgainst: [
        "Achterdeurtjes verzwakken de hele beveiliging van iedereen.",
        "Massale scanning is een grote inbreuk op grondrechten.",
      ],
      sources: [
        {
          label: "EDRi – Chat Control",
          url: "https://edri.org/our-work/chat-control/",
        },
      ],
    },
  },
  {
    statement:
      "Demonstraties die de openbare orde verstoren moeten harder worden aangepakt.",
    dimension: "civil",
    direction: "negative",
    tiers: extendedOnly,
    info: {
      context:
        "Sinds de boerenprotesten en klimaatblokkades is er meer roep om strenger optreden bij verstoringen.",
      argumentsFor: [
        "Burgers en bedrijven hebben recht op normale doorgang.",
        "Kalm optreden vergroot het risico op verdere escalatie.",
      ],
      argumentsAgainst: [
        "Hard optreden raakt het demonstratierecht in de kern.",
        "Politie-optreden moet juist proportioneel zijn.",
      ],
      sources: [
        {
          label: "Inspectie Justitie & Veiligheid – Optreden bij demonstraties",
          url: "https://www.inspectie-jenv.nl/",
        },
      ],
    },
  },
  {
    statement:
      "Strengere straffen werken afschrikwekkend en dienen het algemeen belang.",
    dimension: "civil",
    direction: "negative",
    tiers: extendedOnly,
    info: {
      context:
        "Onderzoek toont dat zwaardere straffen niet altijd meer afschrikking opleveren; pakkans speelt grotere rol.",
      argumentsFor: [
        "Slachtoffers en samenleving voelen zich serieus genomen.",
        "Lange straffen halen daders langer uit de samenleving.",
      ],
      argumentsAgainst: [
        "Effect op recidive blijkt empirisch beperkt.",
        "Hoge gevangeniskosten en risico op verharding van daders.",
      ],
      sources: [
        {
          label: "WODC – Effecten van straffen op recidive",
          url: "https://www.wodc.nl/",
        },
      ],
    },
  },
  {
    statement:
      "Een verbod op gezichtsbedekkende kleding in publieke ruimtes is gerechtvaardigd.",
    dimension: "civil",
    direction: "negative",
    tiers: extendedOnly,
    info: {
      context:
        "Sinds 2019 geldt in Nederland een gedeeltelijk verbod op gezichtsbedekkende kleding in zorg, onderwijs, ov en overheidsgebouwen.",
      argumentsFor: [
        "Gezichtsherkenning is essentieel voor veiligheid en communicatie.",
        "De wet beperkt zich tot specifieke publieke contexten.",
      ],
      argumentsAgainst: [
        "Het raakt vooral een specifieke religieuze minderheid.",
        "De praktische problemen waren beperkt vóór de wet.",
      ],
      sources: [
        {
          label: "WODC – Evaluatie boerkaverbod",
          url: "https://www.wodc.nl/",
        },
      ],
    },
  },

  // ============== GOVERNANCE (16) ==============
  {
    statement:
      "Meer macht naar de Europese Unie zou Nederland uiteindelijk versterken.",
    dimension: "governance",
    direction: "positive",
    tiers: allTiers,
    info: {
      context:
        "De EU verdiept zich onder andere op gebied van defensie, klimaat en industriebeleid.",
      argumentsFor: [
        "Op het wereldtoneel telt Europa alleen samen mee.",
        "Gezamenlijke aanpak is efficiënter voor klimaat, migratie en veiligheid.",
      ],
      argumentsAgainst: [
        "Macht naar Brussel verzwakt nationale democratie.",
        "Belangen tussen lidstaten lopen sterk uiteen.",
      ],
      sources: [eurobarometer],
    },
  },
  {
    statement:
      "Belangrijke besluiten over klimaat, migratie en defensie horen op Europees niveau te worden genomen.",
    dimension: "governance",
    direction: "positive",
    tiers: allTiers,
    info: {
      context:
        "Gemeenschappelijk Europees beleid bestaat al deels (klimaatpakket, EU-Asielpact, defensie-initiatieven).",
      argumentsFor: [
        "Grote uitdagingen overstijgen landgrenzen.",
        "Schaalvoordelen en gelijke regels voorkomen wegloop.",
      ],
      argumentsAgainst: [
        "Lidstaten verschillen qua context te sterk.",
        "Nationale democratie verliest greep op kerntaken.",
      ],
      sources: [
        {
          label: "Europa Decentraal – EU-Asielpact",
          url: "https://europadecentraal.nl/",
        },
      ],
    },
  },
  {
    statement:
      "Gemeentes verdienen meer eigen beleidsruimte en geld, ook als dat tot verschillen tussen regio's leidt.",
    dimension: "governance",
    direction: "positive",
    tiers: allTiers,
    info: {
      context:
        "Gemeentes voeren sinds 2015 veel zorg- en jeugdtaken uit, maar klagen over onvoldoende middelen.",
      argumentsFor: [
        "Lokaal bestuur staat dichter bij burgers en kan maatwerk leveren.",
        "Decentralisatie vergroot betrokkenheid en innovatie.",
      ],
      argumentsAgainst: [
        "Verschillen tussen gemeentes ondermijnen gelijke voorzieningen.",
        "Kleine gemeentes missen schaal voor complexe taken.",
      ],
      sources: [
        {
          label: "VNG – Stand van het lokaal bestuur",
          url: "https://www.vng.nl/",
        },
      ],
    },
  },
  {
    statement:
      "Een gezamenlijk Europees leger zou een verstandige stap zijn.",
    dimension: "governance",
    direction: "positive",
    tiers: standardExtended,
    info: {
      context:
        "Met een veranderende rol van de VS en oorlog in Oekraïne staat Europese defensiesamenwerking hoog op de agenda.",
      argumentsFor: [
        "Versnipperde nationale legers zijn duur en inefficiënt.",
        "Europa moet zichzelf kunnen verdedigen, los van Amerikaanse politiek.",
      ],
      argumentsAgainst: [
        "Defensie raakt nationale soevereiniteit in de kern.",
        "Kosten en commando-structuur zijn complex.",
      ],
      sources: [
        {
          label: "EDA – European Defence Agency",
          url: "https://eda.europa.eu/",
        },
      ],
    },
  },
  {
    statement:
      "Burgers moeten meer directe zeggenschap krijgen via burgerraden of referenda.",
    dimension: "governance",
    direction: "positive",
    tiers: standardExtended,
    info: {
      context:
        "Burgerberaden over klimaat, energie of stedelijke planning komen in heel Europa op.",
      argumentsFor: [
        "Burgerinspraak versterkt democratisch draagvlak.",
        "Beraden brengen gewone mensen in beleidsvorming.",
      ],
      argumentsAgainst: [
        "Lottocratie kan parlementaire democratie ondermijnen.",
        "Risico op manipulatie of slecht geïnformeerde uitkomsten.",
      ],
      sources: [
        {
          label: "OECD – Innovative Citizen Participation",
          url: "https://www.oecd.org/governance/innovative-citizen-participation",
        },
      ],
    },
  },
  {
    statement:
      "Eurobonds en gezamenlijke schulduitgifte versterken Europa als geheel.",
    dimension: "governance",
    direction: "positive",
    tiers: extendedOnly,
    info: {
      context:
        "Tijdens corona en daarna investeerde de EU via SURE en NextGenerationEU in gezamenlijk geleende middelen.",
      argumentsFor: [
        "Lagere rentes en stabieler eurogebied.",
        "Solidariteit tussen lidstaten versterkt het project.",
      ],
      argumentsAgainst: [
        "Risico op moral hazard: zwakke landen leunen op sterke.",
        "Rijkere landen dragen disproportioneel bij.",
      ],
      sources: [
        {
          label: "Europese Commissie – NextGenerationEU",
          url: "https://commission.europa.eu/strategy-and-policy/recovery-plan-europe_nl",
        },
      ],
    },
  },
  {
    statement:
      "Een referendum kan een waardevolle aanvulling zijn op de parlementaire democratie.",
    dimension: "governance",
    direction: "positive",
    tiers: extendedOnly,
    info: {
      context:
        "In 2018 werd het raadgevend referendum afgeschaft. Discussie over nieuwe vormen blijft levendig.",
      argumentsFor: [
        "Geeft burgers stem op specifieke onderwerpen tussen verkiezingen.",
        "Versterkt deliberatieve cultuur als goed georganiseerd.",
      ],
      argumentsAgainst: [
        "Complexe vraagstukken vragen meer dan een ja/nee.",
        "Lage opkomst kan resultaten zeer onrepresentatief maken.",
      ],
      sources: [
        {
          label: "Staatscommissie Parlementair stelsel – Eindrapport",
          url: "https://www.staatscommissieparlementairstelsel.nl/",
        },
      ],
    },
  },
  {
    statement:
      "Provincies en gemeentes verdienen meer financiële zelfstandigheid van Den Haag.",
    dimension: "governance",
    direction: "positive",
    tiers: extendedOnly,
    info: {
      context:
        "De financiering van decentrale overheden wordt vooral vanuit het Rijk geregeld; eigen belastinginstrumenten zijn beperkt.",
      argumentsFor: [
        "Eigen middelen verkleinen afhankelijkheid en vergroten verantwoordelijkheid.",
        "Lokaal maatwerk vraagt lokale financiële ruimte.",
      ],
      argumentsAgainst: [
        "Lokale belastingverschillen kunnen ongelijkheid versterken.",
        "Centraal Rijksbeleid biedt gelijke voorzieningen voor iedereen.",
      ],
      sources: [
        {
          label: "ROB – Raad voor het Openbaar Bestuur",
          url: "https://www.raadopenbaarbestuur.nl/",
        },
      ],
    },
  },
  {
    statement:
      "Nederland moet zelf bepalen wie er ons land binnenkomt, niet Brussel.",
    dimension: "governance",
    direction: "negative",
    tiers: allTiers,
    info: {
      context:
        "Het EU-asielpact (2024) verdeelt verantwoordelijkheden tussen lidstaten op basis van solidariteit.",
      argumentsFor: [
        "Migratie raakt direct aan nationale identiteit en draagvlak.",
        "Nederland kan beter aansluiten bij eigen capaciteit.",
      ],
      argumentsAgainst: [
        "Een Europese aanpak is effectiever bij grensoverschrijdende migratie.",
        "Een ‘alleen-gangerschap’ is in Schengen lastig houdbaar.",
      ],
      sources: [
        {
          label: "Europese Commissie – Migration and Asylum Pact",
          url: "https://home-affairs.ec.europa.eu/policies/migration-and-asylum_en",
        },
      ],
    },
  },
  {
    statement:
      "De Europese Unie heeft te veel macht en moet kleiner worden.",
    dimension: "governance",
    direction: "negative",
    tiers: allTiers,
    info: {
      context:
        "Eurokritische partijen pleiten voor terughalen van bevoegdheden uit Brussel.",
      argumentsFor: [
        "Subsidiariteit: laat zoveel mogelijk op nationaal niveau.",
        "Brussel is te ver van de gewone burger.",
      ],
      argumentsAgainst: [
        "Veel grensoverschrijdende problemen vragen Europese aanpak.",
        "Kleine lidstaten hebben juist baat bij sterke EU.",
      ],
      sources: [eurobarometer],
    },
  },
  {
    statement:
      "Belangrijke nationale beslissingen mogen niet door internationale rechters worden tegengehouden.",
    dimension: "governance",
    direction: "negative",
    tiers: allTiers,
    info: {
      context:
        "Het EHRM toetst Nederlandse wetten aan het EVRM; recente debatten gaan over migratie en klimaatzaken.",
      argumentsFor: [
        "Een gekozen wetgever moet het laatste woord hebben.",
        "Internationale rechters missen democratische legitimiteit.",
      ],
      argumentsAgainst: [
        "Mensenrechten verdienen bescherming boven wisselende meerderheden.",
        "Internationale rechtsorde dient de stabiliteit en rechten van iedereen.",
      ],
      sources: [
        {
          label: "Raad voor de Rechtspraak – Internationaal recht",
          url: "https://www.rechtspraak.nl/",
        },
      ],
    },
  },
  {
    statement:
      "Een serieus debat over een Nexit verdient een eerlijke kans in de Tweede Kamer.",
    dimension: "governance",
    direction: "negative",
    tiers: standardExtended,
    info: {
      context:
        "Sinds Brexit is de discussie over EU-lidmaatschap in Nederland minder fel, maar leeft bij sommige partijen.",
      argumentsFor: [
        "Open debat hoort bij democratie, ook over taboes.",
        "Burgers verdienen helderheid over kosten en baten van EU-lidmaatschap.",
      ],
      argumentsAgainst: [
        "Brexit toont dat een vertrek economisch en politiek pijnlijk is.",
        "Nexit-debat speelt in op gevoel, niet op feiten.",
      ],
      sources: [
        {
          label: "CPB – Voor- en nadelen van EU-lidmaatschap",
          url: "https://www.cpb.nl/",
        },
      ],
    },
  },
  {
    statement:
      "Bij conflict tussen Nederlandse wet en EU-recht moet de Nederlandse wet voorgaan.",
    dimension: "governance",
    direction: "negative",
    tiers: standardExtended,
    info: {
      context:
        "Het Hof van Justitie van de EU bevestigde herhaaldelijk de voorrang van EU-recht boven nationaal recht.",
      argumentsFor: [
        "Soevereiniteit van het parlement is fundament van de democratie.",
        "Burgers stemmen op nationale politici, niet op EU-rechters.",
      ],
      argumentsAgainst: [
        "EU-recht waarborgt gelijkheid tussen lidstaten.",
        "Nederland heeft soevereiniteit gedeeld in de verdragen.",
      ],
      sources: [
        {
          label: "HvJ EU – Voorrang van Unierecht",
          url: "https://curia.europa.eu",
        },
      ],
    },
  },
  {
    statement:
      "Het Europees Parlement is te ver van de gewone burger om belangrijke beslissingen te nemen.",
    dimension: "governance",
    direction: "negative",
    tiers: extendedOnly,
    info: {
      context:
        "De opkomst bij EP-verkiezingen lag in 2024 in Nederland boven de 46%, hoger dan ooit, maar nog steeds onder TK-niveau.",
      argumentsFor: [
        "Veel kiezers volgen Brussel niet.",
        "Brusselse besluiten lijken ver weg en abstract.",
      ],
      argumentsAgainst: [
        "Het EP wordt direct gekozen, dat is nooit ‘ver weg’.",
        "Afstand verkleint door beter te informeren, niet door bevoegdheden in te trekken.",
      ],
      sources: [eurobarometer],
    },
  },
  {
    statement:
      "Centralisatie in Den Haag is efficiënter dan macht overdragen aan provincies.",
    dimension: "governance",
    direction: "negative",
    tiers: extendedOnly,
    info: {
      context:
        "Sinds 2015 zijn veel taken juist gedecentraliseerd; de evaluaties wijzen op gemengde resultaten.",
      argumentsFor: [
        "Eén landelijk beleid voorkomt postcode-loterijen.",
        "Schaal en uniformiteit dragen bij aan gelijke kansen.",
      ],
      argumentsAgainst: [
        "Lokale verschillen vragen lokale antwoorden.",
        "Centralisatie ontneemt regio's eigen identiteit en beleid.",
      ],
      sources: [
        {
          label: "ROB – Decentraal bestuur",
          url: "https://www.raadopenbaarbestuur.nl/",
        },
      ],
    },
  },
  {
    statement:
      "Internationale verdragen mogen Nederland niet binden tegen de wil van een meerderheid.",
    dimension: "governance",
    direction: "negative",
    tiers: extendedOnly,
    info: {
      context:
        "Verdragen als het EVRM of het VN-Vluchtelingenverdrag werken door in nationaal beleid.",
      argumentsFor: [
        "Democratie betekent dat de meerderheid uiteindelijk bepaalt.",
        "Verdragen kunnen verouderd raken zonder mogelijkheid tot aanpassing.",
      ],
      argumentsAgainst: [
        "Verdragen beschermen minderheden tegen wisselende meerderheden.",
        "Nederland bouwt op betrouwbaarheid in internationale orde.",
      ],
      sources: [
        {
          label: "Nederlandse Vereniging voor Internationaal Recht",
          url: "https://nvir.nl/",
        },
      ],
    },
  },

  // ============== TRUST (16) ==============
  {
    statement:
      "De rechtspraak in Nederland werkt over het algemeen onafhankelijk en eerlijk.",
    dimension: "trust",
    direction: "positive",
    tiers: allTiers,
    info: {
      context:
        "Volgens het EU Justice Scoreboard 2024 vertrouwt circa 70% van de Nederlanders de rechtspraak.",
      argumentsFor: [
        "De rechtspraak heeft sterke waarborgen tegen politieke beïnvloeding.",
        "Internationale ranglijsten plaatsen NL hoog qua onafhankelijkheid.",
      ],
      argumentsAgainst: [
        "De toeslagenaffaire toonde gebreken in toetsing aan menselijke maat.",
        "Werkdruk en doorlooptijden ondermijnen kwaliteit.",
      ],
      sources: [
        {
          label: "EU Justice Scoreboard 2024",
          url: "https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/upholding-rule-law/eu-justice-scoreboard_en",
        },
      ],
    },
  },
  {
    statement:
      "Nederlandse wetenschappers en experts zijn over het algemeen te vertrouwen op hun vakgebied.",
    dimension: "trust",
    direction: "positive",
    tiers: allTiers,
    info: {
      context:
        "Het Rathenau Instituut meet jaarlijks vertrouwen in wetenschap; Nederland scoort consistent hoog.",
      argumentsFor: [
        "Peer review en open data versterken integriteit van onderzoek.",
        "Onafhankelijke instituten als KNAW en NWO bewaken kwaliteit.",
      ],
      argumentsAgainst: [
        "Onderzoeksintegriteitskwesties blijven bestaan.",
        "Financiers (overheid, markt) kunnen onderzoek sturen.",
      ],
      sources: [
        {
          label: "Rathenau Instituut – Vertrouwen in wetenschap",
          url: "https://www.rathenau.nl/nl/publicaties/vertrouwen-de-wetenschap-2024",
        },
      ],
    },
  },
  {
    statement:
      "Onze verkiezingen verlopen eerlijk en zijn betrouwbaar.",
    dimension: "trust",
    direction: "positive",
    tiers: allTiers,
    info: {
      context:
        "Nederland kent papieren stembiljetten en handmatige telling, met internationaal als zeer betrouwbaar gewaardeerd verkiezingsproces.",
      argumentsFor: [
        "Strikte controle door stembureaus en hertellingen.",
        "Onafhankelijke kiesraad met openbare verantwoording.",
      ],
      argumentsAgainst: [
        "Risico op fraude en cyberdreiging blijft bestaan.",
        "Niet alle stemwijzers en informatiekanalen zijn neutraal.",
      ],
      sources: [
        {
          label: "Kiesraad – Verkiezingsproces",
          url: "https://www.kiesraad.nl/",
        },
      ],
    },
  },
  {
    statement:
      "De NPO en kwaliteitskranten leveren grotendeels betrouwbare informatie.",
    dimension: "trust",
    direction: "positive",
    tiers: standardExtended,
    info: {
      context:
        "Nederland staat in 2025 op #4 in de Reporters Without Borders Press Freedom Index.",
      argumentsFor: [
        "Hoge journalistieke standaarden en interne kwaliteitscontrole.",
        "Pluriform medialandschap met onafhankelijke titels.",
      ],
      argumentsAgainst: [
        "Concentratie van eigendom kan diversiteit beperken.",
        "Sociale media verspreiden ongecontroleerde informatie sneller.",
      ],
      sources: [rsf],
    },
  },
  {
    statement:
      "Toezichthouders zoals AFM, DNB, NZa en ACM doen hun werk over het algemeen goed.",
    dimension: "trust",
    direction: "positive",
    tiers: standardExtended,
    info: {
      context:
        "Toezichthouders fungeren als onafhankelijke waakhonden in financiële, zorg- en marktsectoren.",
      argumentsFor: [
        "Heldere mandaten en parlementaire verantwoording.",
        "Snelle interventies in crisissituaties (bv. ABN-Amro 2008).",
      ],
      argumentsAgainst: [
        "Soms te weinig daadkracht of te veel ‘light touch’.",
        "Capaciteit blijft achter bij complexiteit van markten.",
      ],
      sources: [
        {
          label: "Algemene Rekenkamer – Effectiviteit toezichthouders",
          url: "https://www.rekenkamer.nl/",
        },
      ],
    },
  },
  {
    statement:
      "Het RIVM en andere kennisinstituten verdienen vertrouwen, ook bij omstreden adviezen.",
    dimension: "trust",
    direction: "positive",
    tiers: extendedOnly,
    info: {
      context:
        "Tijdens corona kwam het RIVM onder vuur, maar uit evaluaties blijkt dat de adviezen grotendeels methodisch correct waren.",
      argumentsFor: [
        "Onafhankelijk onderzoek vraagt vertrouwen, ook in onzekerheid.",
        "Heldere transparantie over methode en data.",
      ],
      argumentsAgainst: [
        "Communicatie tijdens corona had soms een politieke kleur.",
        "Onafhankelijkheid komt onder druk door financiering en politiek.",
      ],
      sources: [
        {
          label: "Onderzoeksraad voor Veiligheid – Aanpak coronacrisis",
          url: "https://www.onderzoeksraad.nl/nl/page/26088/aanpak-coronacrisis",
        },
      ],
    },
  },
  {
    statement:
      "Het democratische stelsel met partijen, parlement en regering is nog steeds het beste systeem dat we hebben.",
    dimension: "trust",
    direction: "positive",
    tiers: extendedOnly,
    info: {
      context:
        "V-Dem rangschikt Nederland al jaren hoog op de Liberal Democracy Index.",
      argumentsFor: [
        "Vrije pers, vrije verkiezingen en machtenscheiding zijn waardevol.",
        "Geen alternatief systeem combineert vrijheden en stabiliteit beter.",
      ],
      argumentsAgainst: [
        "Het stelsel kent reële tekortkomingen (formaties, polarisatie).",
        "Burgers ervaren afstand tot politiek en verlangen vernieuwing.",
      ],
      sources: [vdem],
    },
  },
  {
    statement:
      "Politici zijn over het algemeen mensen die zich oprecht inzetten voor het algemeen belang.",
    dimension: "trust",
    direction: "positive",
    tiers: extendedOnly,
    info: {
      context:
        "Het SCP meldt dat het beeld van politici sterk negatief is, terwijl het feitelijke beeld genuanceerder is.",
      argumentsFor: [
        "De meeste politici geven veel tijd en privacy op voor publieke zaak.",
        "Cynisme over politiek miskent het reële werk dat wordt gedaan.",
      ],
      argumentsAgainst: [
        "Schandalen blijven het beeld bepalen.",
        "Carrièrebelangen wegen soms zwaarder dan publiek belang.",
      ],
      sources: [scp],
    },
  },
  {
    statement:
      "De gevestigde media verzwijgen of vertekenen belangrijke onderwerpen.",
    dimension: "trust",
    direction: "negative",
    tiers: allTiers,
    info: {
      context:
        "Het wantrouwen jegens NPO, NRC en RTL groeit volgens diverse barometers, vooral in bepaalde delen van het electoraat.",
      argumentsFor: [
        "Selectie van nieuws bepaalt onbewust wat 'belangrijk' is.",
        "Bepaalde dossiers (toeslagenaffaire, gas, corona) kwamen pas laat in beeld.",
      ],
      argumentsAgainst: [
        "Nederland scoort hoog op persvrijheid en pluriformiteit.",
        "Ongelijke aandacht is niet hetzelfde als verzwijgen.",
      ],
      sources: [
        rsf,
        {
          label: "Commissariaat voor de Media – Mediamonitor",
          url: "https://www.cvdm.nl/",
        },
      ],
    },
  },
  {
    statement:
      "De overheid heeft tijdens de coronacrisis fouten gemaakt waarover ze nooit eerlijk zal zijn.",
    dimension: "trust",
    direction: "negative",
    tiers: allTiers,
    info: {
      context:
        "De Onderzoeksraad voor Veiligheid kwam met meerdere rapporten over de coronacrisis.",
      argumentsFor: [
        "Verantwoording is traag en deels ontwijkend.",
        "Vertrouwen herstellen begint met openheid.",
      ],
      argumentsAgainst: [
        "Diverse parlementaire enquêtes en rapporten zijn juist openbaar.",
        "Geen systeem is perfect; transparantie groeit gestaag.",
      ],
      sources: [
        {
          label: "Onderzoeksraad voor Veiligheid – Aanpak coronacrisis",
          url: "https://www.onderzoeksraad.nl/",
        },
      ],
    },
  },
  {
    statement:
      "Politici zijn vooral bezig met hun eigen carrière, niet met het landsbelang.",
    dimension: "trust",
    direction: "negative",
    tiers: allTiers,
    info: {
      context:
        "Onderzoek van het SCP meet 'politiek wantrouwen' jaarlijks; cijfers blijven hoog.",
      argumentsFor: [
        "Veel kiezers ervaren dat beloften na verkiezingen verdampen.",
        "Lobby- en draaideurproblematiek versterkt dit beeld.",
      ],
      argumentsAgainst: [
        "Politiek werk is veeleisend en vaak slecht zichtbaar.",
        "Het beeld is een karikatuur van een diverse beroepsgroep.",
      ],
      sources: [scp],
    },
  },
  {
    statement:
      "Big tech en multinationals hebben meer macht dan democratisch gekozen regeringen.",
    dimension: "trust",
    direction: "negative",
    tiers: standardExtended,
    info: {
      context:
        "De EU heeft met de DMA en DSA grote tech-bedrijven aangepakt; uitvoering blijft een politiek strijdpunt.",
      argumentsFor: [
        "Algoritmes en netwerkmacht beïnvloeden samenlevingen ingrijpend.",
        "Belastingontwijking en lobby vergroten machtsongelijkheid.",
      ],
      argumentsAgainst: [
        "Overheden behouden ultieme bevoegdheid via wetgeving.",
        "Nieuwe regelgeving toont dat democratieën kunnen ingrijpen.",
      ],
      sources: [
        {
          label: "Europese Commissie – Digital Markets Act",
          url: "https://commission.europa.eu/strategy-and-policy/priorities-2019-2024/europe-fit-digital-age/digital-markets-act_en",
        },
      ],
    },
  },
  {
    statement:
      "Wetenschappelijk onderzoek wordt te veel gestuurd door commerciële of politieke belangen.",
    dimension: "trust",
    direction: "negative",
    tiers: standardExtended,
    info: {
      context:
        "Toenemende rol van publiek-private financiering roept vragen op over onafhankelijkheid van onderzoek.",
      argumentsFor: [
        "Opdrachtgevers kunnen onderzoeksvragen sturen.",
        "Bevindingen die niet passen worden niet altijd gepubliceerd.",
      ],
      argumentsAgainst: [
        "Peer review en open access bieden tegenwicht.",
        "Universiteiten houden eigen mandaat tegen sturing.",
      ],
      sources: [
        {
          label: "KNAW – Onafhankelijkheid van wetenschap",
          url: "https://www.knaw.nl/",
        },
      ],
    },
  },
  {
    statement:
      "Banken en de financiële sector zijn nooit echt verantwoordelijk gehouden na de kredietcrisis.",
    dimension: "trust",
    direction: "negative",
    tiers: extendedOnly,
    info: {
      context:
        "Sinds 2008 is bankregulering verscherpt, maar grote bedragen aan boetes en bonussen wekken weerstand.",
      argumentsFor: [
        "Topsalarissen en bonussen bleven na de crisis hoog.",
        "Strafrechtelijke vervolging van bankiers kwam zelden van de grond.",
      ],
      argumentsAgainst: [
        "Wet- en toezichthouders zijn aanmerkelijk strenger geworden.",
        "Banken hebben hun buffers fors versterkt.",
      ],
      sources: [
        {
          label: "DNB – Toezichtkader banken",
          url: "https://www.dnb.nl/",
        },
      ],
    },
  },
  {
    statement:
      "Het toeslagenschandaal toont aan dat onze instituties fundamenteel niet deugen.",
    dimension: "trust",
    direction: "negative",
    tiers: extendedOnly,
    info: {
      context:
        "De parlementaire ondervragingscommissie kwalificeerde de affaire als ‘ongekend onrecht’ (2020).",
      argumentsFor: [
        "Tienduizenden gezinnen zijn jarenlang onrechtvaardig behandeld.",
        "De rechtsstaat heeft het signaal lange tijd genegeerd.",
      ],
      argumentsAgainst: [
        "De toeslagenaffaire heeft ook tot herstel en hervorming geleid.",
        "Eén schandaal duidt nog niet op fundamenteel falen van alle instituties.",
      ],
      sources: [
        {
          label: "POK – Ongekend onrecht",
          url: "https://www.tweedekamer.nl/kamerstukken/detail?id=2020Z25762",
        },
      ],
    },
  },
  {
    statement:
      "De rechtspraak laat in haar uitspraken vaker politieke voorkeuren meewegen dan recht.",
    dimension: "trust",
    direction: "negative",
    tiers: extendedOnly,
    info: {
      context:
        "Sinds Urgenda en stikstofuitspraken klinkt het verwijt van ‘juridificering’ van politiek vaker.",
      argumentsFor: [
        "Rechters wegen normen waarbij grenzen tussen recht en politiek vervagen.",
        "Sommige uitspraken nopen wetgever tot ingrijpend beleid.",
      ],
      argumentsAgainst: [
        "Rechters passen geldende verdragen en wetten toe.",
        "Onderzoek wijst niet op politiek gedreven jurisprudentie.",
      ],
      sources: [
        {
          label: "Raad voor de Rechtspraak – Onafhankelijkheid",
          url: "https://www.rechtspraak.nl/",
        },
      ],
    },
  },
];
