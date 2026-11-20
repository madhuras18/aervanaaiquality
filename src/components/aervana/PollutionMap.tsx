import { lazy, Suspense, useEffect, useState } from "react";
import { AQI_BANDS, aqiBand } from "@/lib/air";
import type { City } from "@/lib/sample-data";
import { cn } from "@/lib/utils";
import { CitySearch } from "./CityPicker";
import { SampleBadge, SectionLabel } from "./SampleBadge";

const LeafletMap = lazy(() => import("./LeafletMap"));

export function PollutionMap({ cities, city, onCity }: { cities: City[]; city: City; onCity: (c: City) => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const band = aqiBand(city.aqi);
  const ranked = [...cities].sort((a, b) => a.aqi - b.aqi);

  return (
    <section id="map" className="surface-forest section-pad relative overflow-hidden">
      <div className="shell">
        <div className="reveal grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <SectionLabel index="02">Pollution map</SectionLabel>
            <h2 className="display-lg mt-6">
              Every city
              <br />
              has a <span className="text-mint">breath.</span>
            </h2>
          </div>
          <p className="lede text-muted-foreground md:col-span-5">
            Search a place or tap a point on the map. Circle size and colour follow the air quality index.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden border lg:grid-cols-12">
          <div className="aervana-map relative h-[26rem] md:h-[34rem] lg:col-span-8 lg:h-[40rem]">
            {mounted ? (
              <Suspense fallback={<div className="h-full w-full animate-pulse bg-muted" />}>
                <LeafletMap cities={cities} selected={city} onSelect={onCity} />
              </Suspense>
            ) : (
              <div className="h-full w-full bg-muted" />
            )}
            <div className="pointer-events-none absolute left-4 top-4 z-[500]">
              <SampleBadge className="bg-background/70 backdrop-blur" />
            </div>
          </div>

          <aside className="flex flex-col bg-background p-6 md:p-8 lg:col-span-4 lg:h-[40rem]">
            <CitySearch onSelect={onCity} placeholder="Search location…" />

            <div className="mt-8 border-b pb-8">
              <p className="eyebrow text-muted-foreground">Selected</p>
              <div className="mt-3 flex items-end justify-between gap-4">
                <div>
                  <p className="font-display text-3xl tracking-tight">{city.name}</p>
                  <p className="text-sm text-muted-foreground">{city.country}</p>
                </div>
                <p className="numeral text-6xl leading-none">{city.aqi}</p>
              </div>
              <p className="mt-4 flex items-center gap-2 text-sm">
                <span className={cn("h-2 w-2 rounded-full", `bg-${band.token}`)} aria-hidden />
                {band.label}
              </p>
            </div>

            <p className="eyebrow mt-8 text-muted-foreground">Cleanest to most polluted</p>
            <ol className="mt-3 max-h-56 min-h-0 flex-1 overflow-y-auto pr-2 lg:max-h-none">
              {ranked.map((c, i) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => onCity(c)}
                    className={cn(
                      "flex w-full items-center gap-3 border-b border-border/60 py-2.5 text-left text-sm transition-colors",
                      c.id === city.id ? "text-primary" : "text-foreground/75 hover:text-foreground",
                    )}
                  >
                    <span className="numeral w-6 text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1">{c.name}</span>
                    <span className={cn("h-1.5 w-1.5 rounded-full", `bg-${aqiBand(c.aqi).token}`)} aria-hidden />
                    <span className="numeral w-8 text-right">{c.aqi}</span>
                  </button>
                </li>
              ))}
            </ol>
          </aside>
        </div>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
          {AQI_BANDS.map((b) => (
            <span key={b.key} className="flex items-center gap-2">
              <span className={cn("h-2 w-2 rounded-full", `bg-${b.token}`)} aria-hidden />
              {b.short} <span className="opacity-60">{b.min}–{b.max}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
