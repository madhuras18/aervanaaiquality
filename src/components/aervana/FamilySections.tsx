import { aqiBand, bestWindow, formatHour, PROFILE_LIMIT, verdict, type Profile, type Verdict } from "@/lib/air";
import type { City } from "@/lib/sample-data";
import { cn } from "@/lib/utils";
import { SampleBadge, SectionLabel } from "./SampleBadge";

const GROUPS: {
  profile: Profile;
  title: string;
  range: string;
  why: string;
  window: [number, number];
  action: Record<Verdict, string>;
}[] = [
  {
    profile: "child",
    title: "Children & school-age",
    range: "Under 12",
    why: "Developing lungs breathe faster per kilogram of body weight and sit closer to traffic exhaust height.",
    window: [14, 19],
    action: {
      go: "Normal playground and outdoor sports are fine today. Prefer quieter side streets on the walk home.",
      caution: "Keep outdoor play shorter and closer to parks rather than busy roads; skip vigorous races.",
      avoid: "Move afternoon play indoors with windows closed and filtered air running in bedrooms.",
    },
  },
  {
    profile: "older",
    title: "Older adults",
    range: "65 and over",
    why: "Fine particles place extra strain on cardiovascular and respiratory systems, especially during peak traffic hours.",
    window: [6, 12],
    action: {
      go: "Good conditions for a relaxed morning walk or gardening. Carry water and stay in shaded greenery.",
      caution: "Stick to gentle walks during the cleanest hour and avoid hills or main thoroughfares.",
      avoid: "Stay indoors today, keep medications nearby, and run a true-HEPA purifier in the living room.",
    },
  },
  {
    profile: "sensitive",
    title: "Asthma & sensitive airways",
    range: "Heart or lung conditions",
    why: "NO₂ and PM2.5 can trigger airway inflammation even at moderate levels that healthy adults barely notice.",
    window: [5, 11],
    action: {
      go: "Conditions sit within your comfortable threshold. Keep your reliever inhaler on hand as usual.",
      caution: "Limit outdoor exertion, wear a snug N95/FFP2 mask near traffic, and air rooms only briefly.",
      avoid: "Avoid outdoor exposure, seal drafts, keep windows shut and follow your clinician's action plan.",
    },
  },
  {
    profile: "adult",
    title: "Parents & active adults",
    range: "Healthy adults",
    why: "Timing commutes and runs around clean windows reduces cumulative exposure over the year.",
    window: [5, 21],
    action: {
      go: "Good day for outdoor workouts and walking the school run. Air the home for ten minutes.",
      caution: "Ease off intense outdoor intervals and pick side-street routes away from idling traffic.",
      avoid: "Shift workouts indoors and wear a well-fitted N95/FFP2 respirator if commuting outdoors.",
    },
  },
];

const VERDICT_LABEL: Record<Verdict, { text: string; tone: string }> = {
  go: { text: "Safe outdoors", tone: "border-aqi-good bg-aqi-good/20 text-olive" },
  caution: { text: "Take precautions", tone: "border-aqi-sensitive bg-aqi-sensitive/20 text-charcoal" },
  avoid: { text: "Stay indoors", tone: "border-aqi-unhealthy bg-aqi-unhealthy/15 text-aqi-unhealthy" },
};

/** Age- and sensitivity-based family recommendations for the selected city. */
export function FamilyGuidance({ city }: { city: City }) {
  const band = aqiBand(city.aqi);
  return (
    <section className="surface-ivory section-pad">
      <div className="shell">
        <div className="reveal grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <SectionLabel index="01">Family precautions</SectionLabel>
            <h2 className="display-lg mt-6">
              Every generation
              <br />
              breathes <em className="font-normal italic text-olive/70">differently.</em>
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="lede text-muted-foreground">
              One AQI number means different things for a seven-year-old, a grandparent and a runner.
              Here is what {city.name}'s sample reading ({city.aqi} · {band.short}) means for each.
            </p>
            <div className="mt-4">
              <SampleBadge />
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-px border bg-border md:grid-cols-2">
          {GROUPS.map((g) => {
            const limit = PROFILE_LIMIT[g.profile];
            const v = verdict(city.aqi, limit);
            const best = bestWindow(city.hourly, g.window[0], g.window[1], 1);
            const badge = VERDICT_LABEL[v];
            return (
              <article key={g.profile} className="reveal flex flex-col justify-between bg-background p-7 md:p-10">
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="eyebrow text-muted-foreground">{g.range} · limit {limit} AQI</p>
                      <h3 className="mt-2 font-display text-2xl tracking-tight md:text-3xl">{g.title}</h3>
                    </div>
                    <span className={cn("border px-3 py-1 font-display text-xs uppercase tracking-wider", badge.tone)}>
                      {badge.text}
                    </span>
                  </div>
                  <p className="mt-5 text-sm text-muted-foreground">{g.why}</p>
                  <p className="mt-5 border-l-2 border-olive pl-4 text-sm leading-relaxed">{g.action[v]}</p>
                </div>
                <div className="mt-8 flex items-baseline justify-between border-t pt-4 text-sm">
                  <span className="eyebrow text-muted-foreground">Cleanest sample window</span>
                  <span className="numeral text-lg">{formatHour(best.start)} · ~AQI {best.avg}</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const TIPS = [
  {
    index: "01",
    title: "Masks that actually filter PM2.5",
    body: "Choose a certified N95, KN95 or FFP2 respirator with a snug nose-bridge seal. Cloth and loose surgical masks let fine particles slip around the edges.",
  },
  {
    index: "02",
    title: "Size purifiers to the bedroom",
    body: "Look for a true-HEPA (H13) unit whose Clean Air Delivery Rate (CADR) matches the room's floor area, and skip ionisers that emit ozone.",
  },
  {
    index: "03",
    title: "Walk school routes one street back",
    body: "Strollers and young children sit right at tailpipe height. Choosing a quiet parallel lane can cut rush-hour NO₂ exposure in half.",
  },
  {
    index: "04",
    title: "Reset after coming inside",
    body: "Leave shoes at the door, wash hands and faces after smoky commutes, and switch car ventilation to recirculate inside tunnels and jams.",
  },
];

/** Practical protection tips on dark forest ground between FamilyGuidance and Indoor checklist. */
export function ProtectionTips() {
  return (
    <section className="surface-forest section-pad">
      <div className="shell">
        <div className="reveal grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <SectionLabel index="02">Practical protection</SectionLabel>
            <h2 className="display-lg mt-6">
              Small shields for
              <br />
              <span className="text-mint">high-haze days.</span>
            </h2>
          </div>
          <p className="lede text-muted-foreground md:col-span-5">
            Four straightforward, evidence-backed habits families can rely on when city pollution spikes.
          </p>
        </div>

        <dl className="mt-14 grid gap-x-10 gap-y-10 border-t pt-12 sm:grid-cols-2 lg:grid-cols-4">
          {TIPS.map((t) => (
            <div key={t.index} className="reveal">
              <dt>
                <span className="eyebrow text-primary">{t.index}</span>
                <span className="mt-3 block font-display text-2xl leading-tight">{t.title}</span>
              </dt>
              <dd className="mt-4 text-sm leading-relaxed text-muted-foreground">{t.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}