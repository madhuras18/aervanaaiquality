import { useState } from "react";
import { Check } from "lucide-react";
import indoorImg from "@/assets/indoor-home.jpg";
import type { City } from "@/lib/sample-data";
import { cn } from "@/lib/utils";
import { SectionLabel } from "./SampleBadge";

const TIPS = [
  { id: "ventilate", room: "Whole home", title: "Ventilate at the right time", body: "Open windows for 10 minutes during the day's cleanest hour, then close them as traffic builds.", weight: 20 },
  { id: "hepa", room: "Bedroom", title: "Run a HEPA purifier where you sleep", body: "A true-HEPA unit sized for the room removes over 99% of fine particles. Keep doors closed while it runs.", weight: 25 },
  { id: "cook", room: "Kitchen", title: "Use the extractor every time you cook", body: "Gas hobs release NO₂. Switch the hood on before you start and leave it running ten minutes after.", weight: 15 },
  { id: "smoke", room: "Everywhere", title: "Keep the home smoke-free", body: "No smoking or incense indoors. Candles and incense add fine particles that linger for hours.", weight: 15 },
  { id: "damp", room: "Bathroom", title: "Control damp and mould", body: "Keep humidity between 40–60%. Dry clothes outside or near an open window.", weight: 10 },
  { id: "clean", room: "Living room", title: "Clean with a damp cloth", body: "Wet-dust surfaces and vacuum with a HEPA filter to stop settled particles becoming airborne again.", weight: 15 },
];

export function Indoor({ city, sectionIndex = "05" }: { city: City; sectionIndex?: string }) {
  const [done, setDone] = useState<string[]>(["ventilate"]);
  const score = TIPS.filter((t) => done.includes(t.id)).reduce((s, t) => s + t.weight, 0);
  const outdoorHigh = city.aqi > 100;

  return (
    <section id="indoor" className="surface-ivory section-pad">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <div className="reveal">
              <SectionLabel index={sectionIndex}>Indoor air for families</SectionLabel>
              <h2 className="display-lg mt-6">
                Clean air
                <br />
                begins <em className="font-normal italic text-olive/70">at home.</em>
              </h2>
              <p className="lede mt-8 max-w-lg text-muted-foreground">
                We spend about 90% of our time indoors, where some pollutants can be two to five times higher than
                outside. Small habits make a measurable difference.
              </p>
            </div>

            <div
              className={cn(
                "reveal mt-10 border-l-2 py-1 pl-5 text-sm",
                outdoorHigh ? "border-aqi-sensitive" : "border-aqi-good",
              )}
            >
              <span className="eyebrow block text-muted-foreground">For {city.name} today (sample)</span>
              <span className="mt-1 block">
                {outdoorHigh
                  ? "Outdoor air is elevated — keep windows mostly closed and lean on filtration."
                  : "Outdoor air is fair — a short airing during the cleanest hour is worthwhile."}
              </span>
            </div>
          </div>

          <div className="reveal lg:col-span-6">
            <div className="relative">
              <img
                src={indoorImg}
                alt="A bright living room with linen curtains, an open window and houseplants"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="surface-forest absolute -bottom-8 left-4 right-auto w-56 p-5 shadow-float md:-left-10 md:w-64">
                <p className="eyebrow text-muted-foreground">Home air habits</p>
                <p className="mt-2 flex items-baseline gap-1">
                  <span className="numeral text-6xl text-mint">{score}</span>
                  <span className="text-muted-foreground">/100</span>
                </p>
                <div className="mt-3 h-px bg-border">
                  <div className="h-px bg-mint transition-all duration-700" style={{ width: `${score}%` }} />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">Tick the habits you already follow.</p>
              </div>
            </div>
          </div>
        </div>

        <ul className="mt-24 grid border-t md:grid-cols-2 lg:grid-cols-3">
          {TIPS.map((t, i) => {
            const on = done.includes(t.id);
            return (
              <li key={t.id} className="reveal border-b md:[&:nth-child(odd)]:border-r lg:border-r lg:[&:nth-child(3n)]:border-r-0" style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setDone((d) => (on ? d.filter((x) => x !== t.id) : [...d, t.id]))}
                  className="group flex h-full w-full flex-col p-6 text-left transition-colors hover:bg-muted md:p-8"
                >
                  <span className="flex items-center justify-between">
                    <span className="eyebrow text-muted-foreground">
                      {String(i + 1).padStart(2, "0")} · {t.room}
                    </span>
                    <span
                      className={cn(
                        "flex h-6 w-6 items-center justify-center border transition-colors",
                        on ? "border-primary bg-primary text-primary-foreground" : "group-hover:border-foreground/50",
                      )}
                    >
                      {on && <Check className="h-3.5 w-3.5" />}
                    </span>
                  </span>
                  <span className="mt-6 font-display text-2xl leading-tight tracking-tight">{t.title}</span>
                  <span className="mt-3 text-muted-foreground">{t.body}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
