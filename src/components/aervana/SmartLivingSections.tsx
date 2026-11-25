import { useState } from "react";
import { aqiBand, bestWindow, formatHour, INTENSITY_LIMIT, routeAqi, verdict, type Intensity, type RouteKind, type Verdict } from "@/lib/air";
import type { City } from "@/lib/sample-data";
import { cn } from "@/lib/utils";
import { SampleBadge, SectionLabel } from "./SampleBadge";

const OUTDOOR_LIST: { id: string; label: string; intensity: Intensity; from: number; to: number; tip: string }[] = [
  { id: "stroll", label: "Morning walk or dog walk", intensity: "light", from: 6, to: 11, tip: "Low breathing rate keeps particle intake modest even on fair days." },
  { id: "yoga", label: "Park stretching & yoga", intensity: "light", from: 6, to: 10, tip: "Pick leafy parks set back from junctions for noticeably fresher air." },
  { id: "cycle", label: "Steady cycling or brisk walk", intensity: "moderate", from: 6, to: 20, tip: "Use side streets one block off main arteries to cut exhaust exposure." },
  { id: "run", label: "Distance run or tempo training", intensity: "vigorous", from: 5, to: 21, tip: "Heavy mouth breathing draws fine particles deep into the lungs — time it early." },
  { id: "sport", label: "Outdoor football or court games", intensity: "vigorous", from: 15, to: 20, tip: "Switch indoors or shorten intervals when sample AQI climbs past 75." },
];

const VERDICT_COPY: Record<Verdict, { label: string; style: string }> = {
  go: { label: "Go ahead", style: "border-aqi-good text-olive bg-aqi-good/20" },
  caution: { label: "Take care", style: "border-aqi-sensitive text-charcoal bg-aqi-sensitive/20" },
  avoid: { label: "Move indoors", style: "border-aqi-unhealthy text-aqi-unhealthy bg-aqi-unhealthy/15" },
};

/** Outdoor activity recommendations derived from INTENSITY_LIMIT and verdict(). */
export function OutdoorActivities({ city }: { city: City }) {
  return (
    <section className="surface-ivory section-pad">
      <div className="shell">
        <div className="reveal grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <SectionLabel index="01">Outdoor activity guide</SectionLabel>
            <h2 className="display-lg mt-6">
              Match your pace
              <br />
              to <em className="font-normal italic text-olive/70">the air.</em>
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="lede text-muted-foreground">
              Harder exercise pulls up to ten times more air into your lungs. Here is how today's sample
              conditions in {city.name} line up by effort level.
            </p>
            <div className="mt-4">
              <SampleBadge label={`${city.name} · AQI ${city.aqi} (sample)`} />
            </div>
          </div>
        </div>

        <ul className="mt-14 divide-y border-y">
          {OUTDOOR_LIST.map((item) => {
            const limit = INTENSITY_LIMIT[item.intensity];
            const v = verdict(city.aqi, limit);
            const best = bestWindow(city.hourly, item.from, item.to, 1);
            const badge = VERDICT_COPY[v];
            return (
              <li key={item.id} className="reveal grid gap-4 py-6 md:grid-cols-12 md:items-center md:gap-8">
                <div className="md:col-span-4">
                  <p className="eyebrow text-muted-foreground">{item.intensity} effort · limit {limit} AQI</p>
                  <h3 className="mt-1 font-display text-2xl tracking-tight">{item.label}</h3>
                </div>
                <p className="text-sm text-muted-foreground md:col-span-4">{item.tip}</p>
                <div className="flex flex-wrap items-center justify-between gap-4 md:col-span-4 md:justify-end">
                  <div className="text-left md:text-right">
                    <p className="eyebrow text-muted-foreground">Best hour</p>
                    <p className="numeral text-xl">{formatHour(best.start)} · ~{best.avg}</p>
                  </div>
                  <span className={cn("border px-3 py-1 font-display text-xs uppercase tracking-wider", badge.style)}>
                    {badge.label}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

const ROUTES: { kind: RouteKind; label: string; extraMins: number; summary: string }[] = [
  { kind: "main", label: "Main arterial road", extraMins: 0, summary: "Fastest direct line, sitting beside peak traffic exhaust and bus stops." },
  { kind: "mixed", label: "Balanced urban streets", extraMins: 3, summary: "Mix of feeder streets and shorter crossings — close to the city average." },
  { kind: "green", label: "EcoRoute · parks & side streets", extraMins: 6, summary: "Tree-lined lanes and canals set back from heavy vehicles (~30% lower exposure)." },
];

const LIFESTYLE_TIPS = [
  { index: "01", title: "Time errands around the midday dip", body: "Urban PM2.5 and NO₂ typically ease between late morning and mid-afternoon before evening rush hour." },
  { index: "02", title: "Step two metres back at crossings", body: "Idling engines create concentrated plumes at the kerb — waiting a couple of paces back noticeably cuts inhalation." },
  { index: "03", title: "Batch deliveries & local shops", body: "Combining online orders and walking to neighbourhood grocers reduces urban delivery-van mileage." },
  { index: "04", title: "Keep tyres inflated & engines off", body: "When you do drive, steady speeds and switching off while parked reduce both tailpipe fumes and tyre-wear dust." },
];

/** EcoRoute street-level exposure comparison + sustainable lifestyle suggestions. */
export function EcoRouteAndLifestyle({ city }: { city: City }) {
  const [chosen, setChosen] = useState<RouteKind>("green");
  const [minutes, setMinutes] = useState(25);
  const mainAqi = routeAqi(city.aqi, "main");
  const greenAqi = routeAqi(city.aqi, "green");
  const reductionPct = Math.round(((mainAqi - greenAqi) / Math.max(mainAqi, 1)) * 100);

  return (
    <section className="surface-ivory section-pad">
      <div className="shell">
        <div className="reveal grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel index="03">EcoRoute exposure comparison</SectionLabel>
            <h2 className="display-lg mt-6">
              One street over,
              <br />
              <em className="font-normal italic text-olive/70">cleaner air.</em>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="lede text-muted-foreground">
              Air pollution falls sharply just one block away from heavy traffic. Compare illustrative
              street-level AQI for a typical trip in {city.name}.
            </p>
          </div>
        </div>

        <div className="reveal mt-12 grid gap-10 border-t pt-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <label className="block">
              <span className="flex items-baseline justify-between">
                <span className="eyebrow text-muted-foreground">Base trip time</span>
                <span className="numeral text-3xl">{minutes} min</span>
              </span>
              <input
                type="range"
                min={10}
                max={60}
                step={5}
                value={minutes}
                onChange={(e) => setMinutes(+e.target.value)}
                className="range-brand mt-4"
              />
            </label>

            <div className="mt-10 border-l-2 border-olive pl-5">
              <p className="eyebrow text-muted-foreground">Choosing EcoRoute over main roads</p>
              <p className="mt-2">
                <span className="numeral text-5xl text-olive">−{reductionPct}%</span>
                <span className="ml-2 text-sm text-muted-foreground">lower street AQI</span>
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Illustrative street multiplier applied to {city.name}'s sample AQI ({city.aqi}).
              </p>
            </div>
          </div>

          <div className="divide-y border-y lg:col-span-8">
            {ROUTES.map((r) => {
              const aqi = routeAqi(city.aqi, r.kind);
              const band = aqiBand(aqi);
              const active = chosen === r.kind;
              return (
                <button
                  key={r.kind}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setChosen(r.kind)}
                  className={cn(
                    "grid w-full gap-4 py-6 text-left transition-colors sm:grid-cols-12 sm:items-center",
                    active ? "bg-muted/60 px-4" : "hover:bg-muted/30 px-4",
                  )}
                >
                  <div className="sm:col-span-6">
                    <p className="flex items-center gap-2 font-display text-xl">
                      <span className={cn("h-2.5 w-2.5 rounded-full", `bg-${band.token}`)} aria-hidden />
                      {r.label}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{r.summary}</p>
                  </div>
                  <div className="sm:col-span-3">
                    <p className="eyebrow text-muted-foreground">Trip time</p>
                    <p className="numeral mt-1 text-2xl">{minutes + r.extraMins} min</p>
                  </div>
                  <div className="sm:col-span-3 sm:text-right">
                    <p className="eyebrow text-muted-foreground">Route AQI</p>
                    <p className="numeral mt-1 text-3xl">{aqi}</p>
                    <p className="text-xs text-muted-foreground">{band.short}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sustainable lifestyle suggestions */}
        <div className="mt-20 border-t pt-14">
          <div className="reveal flex flex-wrap items-baseline justify-between gap-4">
            <h3 className="display-md">Sustainable lifestyle habits</h3>
            <span className="eyebrow text-muted-foreground">Everyday choices that cut exposure & emissions</span>
          </div>
          <dl className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {LIFESTYLE_TIPS.map((tip) => (
              <div key={tip.index} className="reveal border-t pt-5">
                <dt>
                  <span className="eyebrow text-olive">{tip.index}</span>
                  <span className="mt-2 block font-display text-xl leading-snug">{tip.title}</span>
                </dt>
                <dd className="mt-3 text-sm text-muted-foreground">{tip.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}