export interface CuratedReading {
  title: string;
  author: string;
  year: number;
  note: string;
  url: string;
}

// Redactioneel geselecteerde basisliteratuur. Gecontroleerd op 13 september
// 2026; de links openen een cataloguszoekopdracht, zodat een editie niet
// vastzit aan één tijdelijke winkelpagina.
const openLibrary = (query: string) =>
  `https://openlibrary.org/search?q=${encodeURIComponent(query)}`;

export const IDEOLOGY_READING: Record<string, CuratedReading[]> = {
  "sociaal-democraat": [
    {
      title: "The Primacy of Politics",
      author: "Sheri Berman",
      year: 2006,
      note: "Historische uitleg van de sociaal-democratische traditie in Europa.",
      url: "https://www.cambridge.org/core/books/primacy-of-politics/DD19C88ECBF20B33D8D6DE445D198D13",
    },
  ],
  "klassiek-liberaal": [
    {
      title: "On Liberty",
      author: "John Stuart Mill",
      year: 1859,
      note: "Klassieke tekst over individuele vrijheid en de grens van staatsdwang.",
      url: openLibrary("On Liberty John Stuart Mill"),
    },
  ],
  libertarier: [
    {
      title: "Anarchy, State, and Utopia",
      author: "Robert Nozick",
      year: 1974,
      note: "Invloedrijke verdediging van de minimale staat.",
      url: "https://www.hachettebookgroup.com/titles/robert-nozick/anarchy-state-and-utopia/9780465051007/?lens=basic-books",
    },
  ],
  "groen-progressief": [
    {
      title: "This Changes Everything",
      author: "Naomi Klein",
      year: 2014,
      note: "Een uitgesproken politieke analyse van klimaatverandering en economie.",
      url: openLibrary("This Changes Everything Naomi Klein"),
    },
  ],
  "christen-democraat": [
    {
      title: "The Rise of Christian Democracy in Europe",
      author: "Stathis N. Kalyvas",
      year: 1996,
      note: "Wetenschappelijke geschiedenis van christen-democratische partijen.",
      url: "https://cornellpress.cornell.edu/book/9781501731419/the-rise-of-christian-democracy-in-europe/",
    },
  ],
  "nationaal-conservatief": [
    {
      title: "Nationalism",
      author: "Anthony D. Smith",
      year: 2010,
      note: "Inleiding in theorieën over nationalisme en nationale identiteit.",
      url: openLibrary("Nationalism Anthony D Smith"),
    },
  ],
  "technocratisch-centrist": [
    {
      title: "Technocracy and the Politics of Expertise",
      author: "Frank Fischer",
      year: 1990,
      note: "Kritische studie naar de rol van expertise in democratisch bestuur.",
      url: openLibrary("Technocracy and the Politics of Expertise Frank Fischer"),
    },
  ],
  marxist: [
    {
      title: "The Communist Manifesto",
      author: "Karl Marx en Friedrich Engels",
      year: 1848,
      note: "Kerntekst voor het begrip van marxistische analyse en klassenpolitiek.",
      url: openLibrary("The Communist Manifesto Marx Engels"),
    },
  ],
  "anarcho-libertair": [
    {
      title: "Anarchism: A Very Short Introduction",
      author: "Colin Ward",
      year: 2004,
      note: "Korte inleiding in anarchistische tradities en hun verschillen.",
      url: openLibrary("Anarchism A Very Short Introduction Colin Ward"),
    },
  ],
  "conservatief-liberaal": [
    {
      title: "The Constitution of Liberty",
      author: "Friedrich A. Hayek",
      year: 1960,
      note: "Belangrijke liberale verdediging van rechtsstaat, markt en beperkte overheid.",
      url: openLibrary("The Constitution of Liberty Friedrich Hayek"),
    },
  ],
  "sociaal-liberaal": [
    {
      title: "Liberalism and Social Action",
      author: "John Dewey",
      year: 1935,
      note: "Toegankelijke Engelstalige klassieke tekst over vrijheid, democratie en sociale verantwoordelijkheid.",
      url: "https://archive.org/details/dewey_liberalism/page/n4/mode/2up",
    },
  ],
  "eco-socialist": [
    {
      title: "Less Is More",
      author: "Jason Hickel",
      year: 2020,
      note: "Pleidooi voor postgroei-economie vanuit een ecologisch-socialistisch perspectief.",
      url: openLibrary("Less Is More Jason Hickel"),
    },
  ],
  "populistisch-rechts": [
    {
      title: "What Is Populism?",
      author: "Jan-Werner Müller",
      year: 2016,
      note: "Korte, kritische uitleg van populisme als politieke stijl en claim op vertegenwoordiging.",
      url: openLibrary("What Is Populism Jan Werner Muller"),
    },
  ],
  "populistisch-links": [
    {
      title: "For a Left Populism",
      author: "Chantal Mouffe",
      year: 2018,
      note: "Theoretische verdediging van een links-populistische strategie.",
      url: openLibrary("For a Left Populism Chantal Mouffe"),
    },
  ],
  communitarist: [
    {
      title: "The Essential Communitarian Reader",
      author: "Amitai Etzioni",
      year: 1998,
      note: "Bundel over gemeenschap, plichten en de grenzen van individualisme.",
      url: "https://rowman.com/ISBN/9780847688272/The-Essential-Communitarian-Reader",
    },
  ],
  "klassiek-conservatief": [
    {
      title: "Reflections on the Revolution in France",
      author: "Edmund Burke",
      year: 1790,
      note: "Grondtekst van het moderne conservatieve denken.",
      url: openLibrary("Reflections on the Revolution in France Edmund Burke"),
    },
  ],
};
