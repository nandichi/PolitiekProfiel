import type { PersonalProfile as PersonalProfileData } from "@/lib/result-profile-narrative";

interface PersonalProfileProps {
  profile: PersonalProfileData;
}

/**
 * Samenvatting in gewone taal, bovenaan het rapport.
 *
 * Deze sectie geeft het overzicht: wat de uitkomst in woorden is, hoeveel
 * antwoorden eronder liggen, en waar de duidelijkste en de open lijnen zitten.
 * De uitleg per as staat in "Vijf dimensies" en de thema's in "Zeven thema's";
 * die worden hier bewust niet herhaald.
 */
export function PersonalProfile({ profile }: PersonalProfileProps) {
  return (
    <section aria-labelledby="persoonlijke-kern-title" className="mt-12 md:mt-16 border-y border-ink py-8 md:py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(16rem,0.65fr)] lg:gap-14">
        <div className="min-w-0">
          <p className="kicker">Je politieke kern in woorden</p>
          <h2 id="persoonlijke-kern-title" className="display mt-4 max-w-3xl text-3xl md:text-4xl leading-[1.02] text-ink">
            Dit is het patroon achter je antwoorden.
          </h2>
          <p className="mt-5 max-w-3xl text-base md:text-lg text-ink-2 leading-relaxed">
            {profile.lead}
          </p>
        </div>
        <aside className="border-l-2 border-terra pl-5 md:pl-6 self-start">
          <p className="kicker">Antwoordbasis</p>
          <p className="display mt-2 text-xl leading-tight text-ink">
            {profile.coverage.label}
          </p>
          <p className="mt-3 text-sm text-ink-2 leading-relaxed">
            {profile.coverage.message}
          </p>
        </aside>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-10 xl:grid-cols-2">
        <ProfileAxisSection
          title="De lijnen die het duidelijkst terugkomen"
          kicker="Jouw politieke ruggengraat"
          axes={profile.strongestAxes}
          empty="Je uitslagen liggen op alle assen te dicht bij het midden om één duidelijke politieke ruggengraat te noemen."
        />
        <ProfileAxisSection
          title="Waar je ruimte laat voor meerdere richtingen"
          kicker="Open vragen"
          axes={profile.openAxes}
          empty="Op geen van de vijf assen blijf je dicht bij het midden. Dat betekent niet dat je nooit twijfelt, alleen dat de quiz daar een richting ziet."
        />
      </div>

      {profile.contextualAxes.length > 0 && (
        <div className="mt-10 border-t border-rule pt-6">
          <p className="kicker">Voorzichtige signalen</p>
          <p className="mt-3 max-w-3xl text-sm text-ink-2 leading-relaxed">
            Deze richtingen komen wel terug, maar niet zo sterk dat ze je profiel moeten domineren. Zie ze als context voor de duidelijkere lijnen hierboven.
          </p>
          <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
            {profile.contextualAxes.map((axis) => (
              <li key={axis.id} className="border-t border-rule pt-4">
                <p className="kicker">{axis.label}</p>
                <p className="display mt-1 text-lg leading-tight text-ink">{axis.direction}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-8 max-w-3xl text-sm text-ink-muted leading-relaxed">
        Wat elke richting precies betekent staat bij de vijf assen en de zeven
        thema&apos;s verderop in dit rapport.
      </p>
    </section>
  );
}

function ProfileAxisSection({
  title,
  kicker,
  axes,
  empty,
}: {
  title: string;
  kicker: string;
  axes: PersonalProfileData["strongestAxes"];
  empty: string;
}) {
  return (
    <section>
      <p className="kicker">{kicker}</p>
      <h3 className="display mt-3 text-2xl leading-tight text-ink">{title}</h3>
      {axes.length === 0 ? (
        <p className="mt-4 max-w-xl text-sm text-ink-2 leading-relaxed">{empty}</p>
      ) : (
        <ol className="mt-6 divide-y divide-rule border-y border-rule">
          {axes.map((axis, index) => (
            <li key={axis.id} className="grid grid-cols-[2rem_1fr_auto] gap-3 py-4 md:grid-cols-[3rem_1fr_auto] md:gap-5">
              <span className="mono text-xs text-ink-muted pt-1.5">{String(index + 1).padStart(2, "0")}</span>
              <div className="min-w-0">
                <p className="kicker">{axis.label}</p>
                <p className="display mt-1 text-lg leading-tight text-ink">{axis.direction}</p>
              </div>
              <span className="mono tabular-nums text-sm text-ink-muted pt-1.5">{axis.score > 0 ? "+" : ""}{axis.score}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
