import { useEffect, useRef, useState } from "react";
import { yearlyImpact } from "@/lib/air";
import { cn } from "@/lib/utils";
import { SectionLabel } from "./SampleBadge";

const SCALES = [
  { people: 1, label: "Just me" },
  { people: 4, label: "My household" },
  { people: 250, label: "My street" },
  { people: 10000, label: "My neighbourhood" },
  { people: 1000000, label: "My city" },
];

function useCountUp(value: number) {
  const [display, setDisplay] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / 900, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setDisplay(a + (value - a) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return display;
}

function compact(n: number) {
  if (n >= 1_000_000) return { v: (n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1), u: "M" };
  if (n >= 10_000) return { v: (n / 1000).toFixed(0), u: "k" };
  return { v: Math.round(n).toLocaleString("en-US"), u: "" };
}

function Stat({ value, unit, label, emphasis }: { value: number; unit: string; label: string; emphasis?: boolean }) {
  const d = useCountUp(value);
  const c = compact(d);
  return (
    <div className="border-t py-8">
      <p className={cn("numeral leading-[0.85]", emphasis ? "text-[clamp(4rem,11vw,9rem)]" : "text-[clamp(3rem,6vw,5rem)]")}>
        {c.v}
        <span className="text-olive/50">{c.u}</span>
      </p>
      <p className="mt-4 flex items-baseline gap-2">
        <span className="font-display">{unit}</span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </p>
    </div>
  );
}

export function Impact({ sectionIndex = "07" }: { sectionIndex?: string }) {
  const [km, setKm] = useState(20);
  const [scale, setScale] = useState(1);
  const people = SCALES[scale]!.people;
  const r = yearlyImpact(km, people);

  return (
    <section id="impact" className="surface-ivory section-pad">
      <div className="shell">
        <div className="reveal grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <SectionLabel index={sectionIndex}>Collective impact</SectionLabel>
            <h2 className="display-lg mt-6">
              Small swaps.
              <br />
              <span className="text-olive/60">Citywide change.</span>
            </h2>
          </div>
          <p className="text-sm text-muted-foreground md:col-span-4">
            Estimates only: 0.17 kg CO₂ and 0.07 L fuel per car-km avoided; one urban tree absorbs about 21 kg CO₂ a year.
          </p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="reveal space-y-10 lg:col-span-4">
            <label className="block">
              <span className="flex items-baseline justify-between">
                <span className="eyebrow text-muted-foreground">Car km swapped each week</span>
                <span className="numeral text-3xl">{km}</span>
              </span>
              <input type="range" min={0} max={150} step={5} value={km} onChange={(e) => setKm(+e.target.value)} className="range-brand mt-4" />
            </label>
            <fieldset>
              <legend className="eyebrow text-muted-foreground">If this many people did it</legend>
              <div className="mt-4 flex flex-col">
                {SCALES.map((s, i) => (
                  <button
                    key={s.label}
                    type="button"
                    aria-pressed={scale === i}
                    onClick={() => setScale(i)}
                    className={cn(
                      "flex items-baseline justify-between border-b py-3 text-left transition-colors",
                      scale === i ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span className="flex items-center gap-3 font-display text-lg">
                      <span className={cn("h-1.5 w-1.5 rounded-full", scale === i ? "bg-olive" : "bg-transparent")} />
                      {s.label}
                    </span>
                    <span className="numeral text-sm">{s.people.toLocaleString("en-US")}</span>
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="reveal lg:col-span-8">
            <Stat value={r.co2Kg} unit="kg CO₂" label="avoided every year" emphasis />
            <div className="grid gap-x-12 sm:grid-cols-2">
              <Stat value={r.trees} unit="trees" label="worth of yearly absorption" />
              <Stat value={r.litres} unit="litres" label="of fuel not burned" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
