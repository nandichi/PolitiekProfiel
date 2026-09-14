# Implementation plan: results and political knowledge centre

## Research conclusion

Competitors commonly show a match list, an axis chart, or both. Vote Compass explains its scale and proximity method; StemWijzer focuses on statement-level agreement; iSideWith offers a broad issue catalogue; WhichParty exposes topics, reasons and source pages. None of those patterns alone turns a long questionnaire into a calm, readable explanation of a person's own answers.

PolitiekProfiel therefore uses a separate approach:

1. A plain-language personal profile first, before any party comparison.
2. An answer atlas that exposes the specific answered statements which carry each topic, including the original context and a source link.
3. Clear distinction between a direction, an unanswered or mixed area, and quiz certainty.
4. Party and politician pages framed as a knowledge centre, with sources and no implied voting instruction.
5. A bounded international first wave. Quality, source visibility and readable Dutch take priority over pretending to cover every party in the world.

## Build order

1. Add deterministic profile narrative and answer-atlas helpers with test-first coverage.
2. Render the personal profile and answer atlas on compatible report pages without changing storage, links or scoring.
3. Add a readable contextual lens to every politician page.
4. Add a sourced first wave of US, German, British and French national-party pages.
5. Build the country index and a plain-language party dossier for every party page.
6. Run regression, type, lint, build, live route and responsive checks before release.

## Research sources

- https://source.stemwijzer.nl/faq
- https://home.kieskompas.nl/nl/tools/hoe-werkt-het-kieskompas
- https://files.voxpoplabs.com/votecompass/methodology.pdf
- https://www.isidewith.com/political-quiz
- https://whichparty.nz/topics
- https://democrats.org/wp-content/uploads/2025/07/2024-Democratic-Party-Platform.pdf
- https://prod-static.gop.com/media/RNC2024-Platform.pdf
- https://www.bundeswahlleiterin.de/en/bundestagswahlen/2025/ergebnisse/bund-99.html
- https://commonslibrary.parliament.uk/research-briefings/cbp-10009
- https://www.archives-resultats-elections.interieur.gouv.fr/resultats/legislatives2024/
