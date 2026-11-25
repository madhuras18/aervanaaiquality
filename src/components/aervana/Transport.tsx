import { useState } from "react";
import cyclingImg from "@/assets/cycling-city.jpg";
import { weeklyCo2Kg, type Mode } from "@/lib/air";
import { cn } from "@/lib/utils";
import { SectionLabel } from "./SampleBadge";

const MODES: { id: Mode; label: string; exposure: string; note: string }[] = [
  { id: "walk", label: "Walk", exposure: "Low–medium", note: "Choose side streets — exposure drops sharply a block away from main roads." },
  { id: "bicycle", label: "Bicycle", exposure: "Medium", note: "Faster breathing, but you're away from tailpipes on protected lanes." },
  { id: "ebike", label: "E-bike", exposure: "Low–medium", note: "Lighter effort means lower intake, with near-zero emissions." },
  { id: "metro", label: "Metro / rail", exposure: "Low", note: "Lowest emissions per passenger of any motorised option." },
  { id: "bus", label: "Bus", exposure: "Medium", note: "Shared emissions; electric buses cut street-level NO₂." },
  { id: "car", label: "Car (petrol)", exposure: "High", note: "In-car air can be more polluted than the pavement in traffic." },
];

export function Transport({ sectionIndex = "06" }: { sectionIndex?: string }) {
  const [km, setKm] = useState(8);
  const [trips, setTrips] = useState(10);
  const [mode, setMode] = useState<Mode>("bicycle");
  const max = weeklyCo2Kg("car", km, trips) || 1;
  const carYear = weeklyCo2Kg("car", km, trips) * 52;
  const chosenYear = weeklyCo2Kg(mode, km, trips) * 52;
  const selected = MODES.find((m) => m.id === mode)!;

  return (
    <section id="transport" className="surface-forest section-pad overflow-hidden">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="reveal relative lg:col-span-5">
          <img
            src={cyclingImg}
            alt="A cyclist on a tree-lined bike lane in early morning light"
            loading="lazy"
            className="aspect-[4/5] w-full object-cover lg:sticky lg:top-24 lg:aspect-[3/4]"
          />
        </div>

        <div className="lg:col-span-7">
          <div className="reveal">
            <SectionLabel index={sectionIndex}>Sustainable transport</SectionLabel>
            <h2 className="display-lg mt-6">
              Move lighter.
              <br />
              <span className="text-sage">Breathe easier.</span>
            </h2>
            <p className="lede mt-8 max-w-xl text-muted-foreground">
              Transport is one of the biggest sources of urban air pollution. Compare how your regular trip adds up.
            </p>
          </div>

          <div className="reveal mt-12 grid gap-8 sm:grid-cols-2">
            <label className="block">
              <span className="flex items-baseline justify-between">
                <span className="eyebrow text-muted-foreground">Trip distance</span>
                <span className="numeral text-2xl">{km} km</span>
              </span>
              <input type="range" min={1} max={40} value={km} onChange={(e) => setKm(+e.target.value)} className="range-brand mt-4" />
            </label>
            <label className="block">
              <span className="flex items-baseline justify-between">
                <span className="eyebrow text-muted-foreground">Trips per week</span>
                <span className="numeral text-2xl">{trips}</span>
              </span>
              <input type="range" min={1} max={20} value={trips} onChange={(e) => setTrips(+e.target.value)} className="range-brand mt-4" />
            </label>
          </div>

          <div className="reveal mt-12 border-t">
            {MODES.map((m) => {
              const kg = weeklyCo2Kg(m.id, km, trips);
              const on = m.id === mode;
              return (
                <button
                  key={m.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setMode(m.id)}
                  className={cn("grid w-full grid-cols-[7rem_1fr_4.5rem] items-center gap-4 border-b py-4 text-left md:grid-cols-[9rem_1fr_6rem]", on ? "text-foreground" : "text-foreground/65 hover:text-foreground")}
                >
                  <span className={cn("font-display", on && "text-primary")}>{m.label}</span>
                  <span className="relative h-2 bg-muted">
                    <span
                      className={cn("absolute inset-y-0 left-0 transition-all duration-700", m.id === "car" ? "bg-sand" : on ? "bg-primary" : "bg-sage/70")}
                      style={{ width: `${Math.max((kg / max) * 100, kg === 0 ? 0 : 1.5)}%` }}
                    />
                  </span>
                  <span className="numeral text-right">
                    {kg.toFixed(1)}
                    <span className="ml-1 text-xs text-muted-foreground">kg</span>
                  </span>
                </button>
              );
            })}
            <p className="mt-3 text-xs text-muted-foreground">Estimated weekly CO₂ using typical emission factors per passenger-km.</p>
          </div>

          <div className="reveal mt-12 grid gap-8 border-l-2 border-primary pl-6 sm:grid-cols-2">
            <div>
              <p className="eyebrow text-muted-foreground">Choosing {selected.label.toLowerCase()} over the car</p>
              <p className="mt-2">
                <span className="numeral text-5xl text-mint">{Math.max(carYear - chosenYear, 0).toFixed(0)}</span>
                <span className="ml-2 text-muted-foreground">kg CO₂ saved / year</span>
              </p>
            </div>
            <div>
              <p className="eyebrow text-muted-foreground">Your exposure · {selected.exposure}</p>
              <p className="mt-2 text-sm text-foreground/80">{selected.note}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
