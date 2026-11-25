import { useMemo, useState } from "react";
import { Bike, Baby, Footprints, Wind, Sun, Briefcase } from "lucide-react";
import { aqiBand, bestWindow, formatHour, PROFILE_LIMIT, type Profile } from "@/lib/air";
import type { City } from "@/lib/sample-data";
import { cn } from "@/lib/utils";
import { SampleBadge, SectionLabel } from "./SampleBadge";

const PROFILES: { id: Profile; label: string; note: string }[] = [
  { id: "adult", label: "Adult", note: "Healthy adult" },
  { id: "child", label: "Child", note: "Under 12" },
  { id: "older", label: "Older adult", note: "65+" },
  { id: "sensitive", label: "Sensitive", note: "Asthma, heart or lung condition" },
];

const ACTIVITIES = [
  { id: "run", label: "Outdoor run", icon: Footprints, from: 5, to: 21, duration: 1 },
  { id: "commute", label: "Cycle commute", icon: Bike, from: 7, to: 11, duration: 1 },
  { id: "school", label: "School run", icon: Baby, from: 7, to: 10, duration: 1 },
  { id: "play", label: "Kids play outside", icon: Sun, from: 14, to: 19, duration: 2 },
  { id: "windows", label: "Air out the home", icon: Wind, from: 5, to: 23, duration: 1 },
  { id: "errands", label: "Errands on foot", icon: Briefcase, from: 9, to: 20, duration: 1 },
] as const;

type ActivityId = (typeof ACTIVITIES)[number]["id"];

export function Planner({ city, sectionIndex = "04" }: { city: City; sectionIndex?: string }) {
  const [profile, setProfile] = useState<Profile>("adult");
  const [chosen, setChosen] = useState<ActivityId[]>(["run", "commute", "windows"]);
  const limit = PROFILE_LIMIT[profile];

  const plan = useMemo(
    () =>
      ACTIVITIES.filter((a) => chosen.includes(a.id))
        .map((a) => {
          const w = bestWindow(city.hourly, a.from, a.to, a.duration);
          return { ...a, ...w, ok: w.avg <= limit };
        })
        .sort((a, b) => a.start - b.start),
    [chosen, city, limit],
  );

  const toggle = (id: ActivityId) =>
    setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  return (
    <section id="planner" className="surface-forest section-pad">
      <div className="shell">
        <div className="reveal grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <SectionLabel index={sectionIndex}>Daily routine planner</SectionLabel>
            <h2 className="display-lg mt-6">
              Plan around
              <br />
              the <span className="text-mint">cleanest hours.</span>
            </h2>
          </div>
          <p className="lede text-muted-foreground md:col-span-5">
            Tell us who's heading out and what the day holds. We'll find the lowest-pollution window for
            each — using today's hourly pattern in {city.name}.
          </p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="reveal space-y-10 lg:col-span-4">
            <fieldset>
              <legend className="eyebrow text-muted-foreground">Who is it for</legend>
              <div className="mt-4 grid grid-cols-2 gap-px border bg-border">
                {PROFILES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={profile === p.id}
                    onClick={() => setProfile(p.id)}
                    className={cn(
                      "bg-background p-4 text-left transition-colors",
                      profile === p.id ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                    )}
                  >
                    <span className="block font-display">{p.label}</span>
                    <span className={cn("mt-1 block text-xs", profile === p.id ? "opacity-75" : "text-muted-foreground")}>
                      {p.note}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="eyebrow text-muted-foreground">Today's activities</legend>
              <div className="mt-4 divide-y border-y">
                {ACTIVITIES.map((a) => {
                  const on = chosen.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      type="button"
                      role="switch"
                      aria-checked={on}
                      onClick={() => toggle(a.id)}
                      className="flex w-full items-center gap-4 py-3.5 text-left"
                    >
                      <a.icon className={cn("h-4 w-4", on ? "text-primary" : "text-muted-foreground")} />
                      <span className={cn("flex-1", !on && "text-muted-foreground")}>{a.label}</span>
                      <span className={cn("relative h-5 w-9 rounded-full border transition-colors", on && "border-primary bg-primary")}>
                        <span
                          className={cn(
                            "absolute top-0.5 h-3.5 w-3.5 rounded-full transition-all",
                            on ? "left-[1.1rem] bg-primary-foreground" : "left-0.5 bg-foreground/50",
                          )}
                        />
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>

          <div className="reveal lg:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-display text-xl tracking-tight">
                {city.name} · {PROFILES.find((p) => p.id === profile)!.label}
              </p>
              <SampleBadge label="Based on sample hourly data" />
            </div>

            {/* 24h strip */}
            <div className="mt-8">
              <div className="flex h-14 gap-px">
                {city.hourly.map((v, h) => (
                  <div
                    key={h}
                    title={`${formatHour(h)} · AQI ${v}`}
                    className={cn("relative flex-1", `bg-${aqiBand(v).token}`, v > limit ? "opacity-25" : "opacity-90")}
                  >
                    {plan.some((p) => h >= p.start && h < p.start + p.duration) && (
                      <span className="absolute inset-x-0 -top-2 mx-auto h-1.5 w-1.5 rounded-full bg-ivory" />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[0.7rem] text-muted-foreground">
                {[0, 6, 12, 18, 23].map((h) => (
                  <span key={h}>{formatHour(h)}</span>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Faded hours are above the comfortable limit for this profile (AQI {limit}).
              </p>
            </div>

            <ol className="mt-10 border-t">
              {plan.length === 0 && <li className="py-8 text-muted-foreground">Choose an activity to build your day.</li>}
              {plan.map((p) => (
                <li key={p.id} className="grid grid-cols-[5.5rem_1fr] gap-4 border-b py-6 md:grid-cols-[8rem_1fr_auto] md:items-center">
                  <span className="numeral text-3xl md:text-4xl">{formatHour(p.start)}</span>
                  <div>
                    <p className="flex items-center gap-2 font-display text-lg">
                      <p.icon className="h-4 w-4 text-primary" /> {p.label}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {p.ok
                        ? `Cleanest ${p.duration > 1 ? `${p.duration}-hour window` : "hour"} between ${formatHour(p.from)} and ${formatHour(p.to)}.`
                        : `Even the best window is above the comfortable limit — consider an indoor alternative or a mask (N95/FFP2).`}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "col-start-2 w-fit border px-3 py-1 text-xs md:col-start-auto",
                      p.ok ? "border-primary text-primary" : "border-aqi-sensitive text-aqi-sensitive",
                    )}
                  >
                    AQI ~{p.avg} · {p.ok ? "Go" : "Move indoors"}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
