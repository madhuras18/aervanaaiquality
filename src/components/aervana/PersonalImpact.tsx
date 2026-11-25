import { useEffect, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  IMPACT_ACTIONS,
  TREE_KG_PER_YEAR,
  WEEKLY_GOAL_KG,
  dayKg,
  weekSummary,
  type WeekLog,
} from "@/lib/air";
import { cn } from "@/lib/utils";
import { SampleBadge, SectionLabel } from "./SampleBadge";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const STORAGE_KEY = "aervana-impact-week-v1";

const STARTER_LOG: WeekLog = [
  ["cycle", "plant"],
  ["metro"],
  ["wfh", "dry"],
  ["walk", "plant"],
  ["cycle"],
  ["walk"],
  [],
];

const EMPTY_LOG: WeekLog = [[], [], [], [], [], [], []];

function isValidLog(raw: unknown): raw is WeekLog {
  return (
    Array.isArray(raw) &&
    raw.length === 7 &&
    raw.every((d) => Array.isArray(d) && d.every((id) => typeof id === "string"))
  );
}

/** Personal environmental action logger, estimated emissions savings & weekly progress charts. */
export function PersonalImpact() {
  const [log, setLog] = useState<WeekLog>(STARTER_LOG);
  const [day, setDay] = useState(3);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (isValidLog(parsed)) setLog(parsed);
      }
    } catch {
      /* storage unavailable */
    }
    setHydrated(true);
  }, []);

  const persist = (next: WeekLog) => {
    setLog(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  };

  const toggleAction = (actionId: string) => {
    const current = log[day] ?? [];
    const updated = current.includes(actionId)
      ? current.filter((id) => id !== actionId)
      : [...current, actionId];
    const next = log.map((d, i) => (i === day ? updated : d));
    persist(next);
  };

  const summary = weekSummary(log);
  const activeDayIds = log[day] ?? [];
  const yearlyKg = summary.total * 52;
  const yearlyTrees = yearlyKg / TREE_KG_PER_YEAR;

  const dailyChart = DAYS.map((label, i) => ({
    day: label,
    kg: Number((summary.perDay[i] ?? 0).toFixed(2)),
  }));

  let running = 0;
  const cumulativeChart = DAYS.map((label, i) => {
    running += summary.perDay[i] ?? 0;
    return { day: label, total: Number(running.toFixed(2)) };
  });

  return (
    <>
      {/* Band 1 (ivory): action logger & estimated emissions savings */}
      <section className="surface-ivory section-pad">
        <div className="shell">
          <div className="reveal grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <SectionLabel index="01">Personal impact tracker</SectionLabel>
              <h2 className="display-lg mt-6">
                Log your week.
                <br />
                <em className="font-normal italic text-olive/70">See it add up.</em>
              </h2>
            </div>
            <div className="md:col-span-5">
              <p className="lede text-muted-foreground">
                Pick a day and check off the cleaner habits you completed. Your log stays saved in this
                browser.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <SampleBadge label="Estimated factors · saved locally" />
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-12 border-t pt-12 lg:grid-cols-12 lg:gap-16">
            {/* Weekly summary figures */}
            <div className="reveal space-y-8 lg:col-span-5">
              <div>
                <p className="eyebrow text-muted-foreground">Estimated CO₂ saved this week</p>
                <p className="mt-2 flex items-baseline gap-2">
                  <span className="numeral text-[5rem] leading-[0.85] md:text-[6.5rem]">
                    {summary.total.toFixed(1)}
                  </span>
                  <span className="font-display text-xl text-muted-foreground">kg CO₂</span>
                </p>
                <div className="mt-5 h-1.5 bg-border">
                  <div
                    className="h-full bg-olive transition-all duration-700"
                    style={{ width: `${summary.goalPct * 100}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>{Math.round(summary.goalPct * 100)}% of {WEEKLY_GOAL_KG} kg weekly goal</span>
                  <span>{summary.actions} actions logged</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 border-t pt-6">
                <div>
                  <p className="eyebrow text-muted-foreground">At this pace / year</p>
                  <p className="numeral mt-2 text-4xl">{Math.round(yearlyKg)} <span className="text-base font-normal text-muted-foreground">kg</span></p>
                </div>
                <div>
                  <p className="eyebrow text-muted-foreground">Tree absorption equiv.</p>
                  <p className="numeral mt-2 text-4xl">{yearlyTrees.toFixed(1)} <span className="text-base font-normal text-muted-foreground">trees</span></p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 border-t pt-6">
                <button
                  type="button"
                  onClick={() => persist(EMPTY_LOG)}
                  className="inline-flex items-center gap-2 border px-3.5 py-2 text-xs font-display uppercase tracking-wider text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                  Clear week
                </button>
                {hydrated && summary.actions === 0 && (
                  <button
                    type="button"
                    onClick={() => persist(STARTER_LOG)}
                    className="inline-flex items-center gap-2 border border-primary px-3.5 py-2 text-xs font-display uppercase tracking-wider text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    Load example week
                  </button>
                )}
              </div>
            </div>

            {/* Day tabs + actions checklist */}
            <div className="reveal lg:col-span-7">
              <div className="grid grid-cols-7 gap-px border bg-border" role="tablist" aria-label="Days of the week">
                {DAYS.map((label, i) => {
                  const kg = dayKg(log[i] ?? []);
                  const selected = i === day;
                  return (
                    <button
                      key={label}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setDay(i)}
                      className={cn(
                        "bg-background px-1 py-3 text-center transition-colors",
                        selected ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                      )}
                    >
                      <span className="block font-display text-xs sm:text-sm">{label}</span>
                      <span className={cn("numeral mt-1 block text-[0.7rem]", selected ? "opacity-85" : "text-muted-foreground")}>
                        {kg.toFixed(1)}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex items-baseline justify-between">
                <h3 className="font-display text-xl tracking-tight">
                  {DAYS[day]}'s sustainable actions
                </h3>
                <span className="numeral text-sm text-muted-foreground">
                  {dayKg(activeDayIds).toFixed(2)} kg saved
                </span>
              </div>

              <ul className="mt-4 divide-y border-y">
                {IMPACT_ACTIONS.map((a) => {
                  const done = activeDayIds.includes(a.id);
                  return (
                    <li key={a.id}>
                      <button
                        type="button"
                        aria-pressed={done}
                        onClick={() => toggleAction(a.id)}
                        className="group flex w-full items-center gap-4 py-4 text-left transition-colors hover:bg-muted/50"
                      >
                        <span
                          className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center border transition-colors",
                            done ? "border-primary bg-primary text-primary-foreground" : "group-hover:border-foreground/50",
                          )}
                        >
                          {done && <Check className="h-3.5 w-3.5" />}
                        </span>
                        <span className="flex-1">
                          <span className="block font-display text-base sm:text-lg">{a.label}</span>
                          <span className="text-xs text-muted-foreground">{a.note}</span>
                        </span>
                        <span className="numeral text-sm text-olive">
                          +{a.kg.toFixed(2)} kg
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Band 2 (forest): weekly progress visual charts */}
      <section className="surface-forest section-pad">
        <div className="shell">
          <div className="reveal grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <SectionLabel index="02">Weekly progress</SectionLabel>
              <h2 className="display-lg mt-6">
                Every day shapes
                <br />
                the <span className="text-mint">curve.</span>
              </h2>
            </div>
            <p className="lede text-muted-foreground md:col-span-5">
              Daily CO₂ avoided across the week alongside your cumulative progress toward the {WEEKLY_GOAL_KG} kg
              personal benchmark.
            </p>
          </div>

          <div className="mt-14 grid gap-12 border-t pt-12 lg:grid-cols-12">
            <div className="reveal lg:col-span-6">
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-xl tracking-tight">Daily emissions saved</h3>
                <span className="text-xs text-muted-foreground">kg CO₂ per day</span>
              </div>
              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyChart} margin={{ top: 10, right: 0, left: -24, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                    <Tooltip
                      cursor={{ fill: "var(--muted)" }}
                      contentStyle={{ background: "var(--forest-deep)", border: "1px solid var(--border)", borderRadius: 2, color: "var(--ivory)", fontFamily: "var(--font-display)" }}
                      labelStyle={{ color: "var(--sage)" }}
                    />
                    <Bar dataKey="kg" name="kg CO₂" fill="var(--mint)" barSize={22} animationDuration={800} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="reveal lg:col-span-6">
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-xl tracking-tight">Cumulative vs. {WEEKLY_GOAL_KG} kg goal</h3>
                <span className="text-xs text-muted-foreground">Running weekly total</span>
              </div>
              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cumulativeChart} margin={{ top: 10, right: 0, left: -24, bottom: 0 }}>
                    <defs>
                      <linearGradient id="impactFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--mint)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="var(--mint)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                    <ReferenceLine y={WEEKLY_GOAL_KG} stroke="var(--sage)" strokeDasharray="4 4" />
                    <Tooltip
                      contentStyle={{ background: "var(--forest-deep)", border: "1px solid var(--border)", borderRadius: 2, color: "var(--ivory)", fontFamily: "var(--font-display)" }}
                      labelStyle={{ color: "var(--sage)" }}
                    />
                    <Area type="monotone" dataKey="total" name="Cumulative kg CO₂" stroke="var(--mint)" strokeWidth={2} fill="url(#impactFill)" animationDuration={800} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}