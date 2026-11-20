import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AQI_BANDS, aqiBand, formatHour } from "@/lib/air";
import type { City } from "@/lib/sample-data";
import { cn } from "@/lib/utils";
import { CitySearch } from "./CityPicker";
import { SampleBadge, SectionLabel } from "./SampleBadge";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const QUICK = ["pune", "delhi", "london", "copenhagen"];

function Gauge({ aqi }: { aqi: number }) {
  const band = aqiBand(aqi);
  const pct = Math.min(aqi / 300, 1);
  const r = 46;
  const c = Math.PI * r; // half circle
  return (
    <svg viewBox="0 0 110 62" className="w-full max-w-[22rem]" aria-hidden>
      <path d="M9 56 A46 46 0 0 1 101 56" fill="none" stroke="var(--border)" strokeWidth="2" />
      <path
        d="M9 56 A46 46 0 0 1 101 56"
        fill="none"
        stroke={`var(--${band.token})`}
        strokeWidth="5"
        strokeDasharray={`${c * pct} ${c}`}
        style={{ transition: "stroke-dasharray 1.2s var(--ease-editorial), stroke 0.6s" }}
      />
      {[0, 50, 100, 150, 200, 300].map((v) => {
        const a = Math.PI * (1 - v / 300);
        return (
          <line
            key={v}
            x1={55 + Math.cos(a) * 40}
            y1={56 - Math.sin(a) * 40}
            x2={55 + Math.cos(a) * 37}
            y2={56 - Math.sin(a) * 37}
            stroke="currentColor"
            strokeOpacity="0.35"
            strokeWidth="0.6"
          />
        );
      })}
    </svg>
  );
}

export function Intelligence({ city, onCity, cities }: { city: City; onCity: (c: City) => void; cities: City[] }) {
  const band = aqiBand(city.aqi);
  const hourlyData = city.hourly.map((v, h) => ({ hour: formatHour(h), aqi: v }));
  const weeklyData = city.weekly.map((v, d) => ({ day: DAYS[d], aqi: v }));

  return (
    <section id="air" className="surface-ivory section-pad">
      <div className="shell">
        <div className="reveal grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <SectionLabel index="01">Air quality intelligence</SectionLabel>
            <h2 className="display-lg mt-6">
              Read the air
              <br />
              like a <em className="font-normal italic text-olive/70">forecast.</em>
            </h2>
          </div>
          <div className="md:col-span-5">
            <CitySearch onSelect={onCity} />
            <div className="mt-4 flex flex-wrap gap-2">
              {QUICK.map((id) => {
                const c = cities.find((x) => x.id === id)!;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onCity(c)}
                    className={cn(
                      "border px-3 py-1.5 text-sm transition-colors",
                      c.id === city.id ? "border-primary bg-primary text-primary-foreground" : "hover:border-foreground/50",
                    )}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-12 border-t pt-12 md:mt-20 lg:grid-cols-12 lg:gap-16">
          {/* Prominent AQI */}
          <div className="reveal lg:col-span-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-muted-foreground">{city.country}</p>
                <p className="mt-1 font-display text-3xl tracking-tight">{city.name}</p>
              </div>
              <SampleBadge />
            </div>
            <div className="relative mt-8">
              <Gauge aqi={city.aqi} />
              <div className="absolute inset-x-0 bottom-0 flex max-w-[22rem] flex-col items-center">
                <span key={city.id} className="numeral text-[6.5rem] leading-[0.8] md:text-[8rem] animate-rise">
                  {city.aqi}
                </span>
              </div>
            </div>
            <div className="mt-6 flex max-w-[22rem] items-center justify-center gap-3">
              <span className={cn("h-2.5 w-2.5 rounded-full", `bg-${band.token}`)} aria-hidden />
              <span className="font-display text-lg">{band.label}</span>
            </div>
            <p className="mt-6 max-w-md text-muted-foreground">{band.advice}</p>

            <div className="mt-10 flex h-1.5 max-w-md overflow-hidden" aria-label="AQI scale">
              {AQI_BANDS.map((b) => (
                <div key={b.key} className={cn("flex-1", `bg-${b.token}`, b.key === band.key ? "opacity-100" : "opacity-35")} />
              ))}
            </div>
            <div className="mt-2 flex max-w-md justify-between text-[0.7rem] text-muted-foreground">
              <span>0</span>
              <span>100</span>
              <span>200</span>
              <span>300+</span>
            </div>
          </div>

          {/* Pollutants */}
          <div className="reveal lg:col-span-7">
            <div className="flex items-baseline justify-between">
              <h3 className="font-display text-xl tracking-tight">Pollutant readings</h3>
              <span className="text-xs text-muted-foreground">vs. WHO 2021 guideline</span>
            </div>
            <dl className="mt-6 divide-y border-y">
              {city.pollutants.map((p) => {
                const ratio = p.value / p.limit;
                const over = ratio > 1;
                return (
                  <div key={p.key} className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-4 py-4 md:grid-cols-[6rem_1fr_9rem]">
                    <dt className="font-display text-lg">{p.name}</dt>
                    <div className="relative h-px bg-border">
                      <div
                        className={cn("absolute inset-y-[-1px] left-0", over ? "bg-aqi-unhealthy" : "bg-olive")}
                        style={{ width: `${Math.min(ratio / 3, 1) * 100}%`, transition: "width 1s var(--ease-editorial)" }}
                      />
                      <div className="absolute -top-2 h-4 w-px bg-foreground/50" style={{ left: `${100 / 3}%` }} aria-hidden />
                    </div>
                    <dd className="text-right">
                      <span className="numeral text-2xl">{p.value}</span>
                      <span className="ml-1 text-xs text-muted-foreground">{p.unit}</span>
                      <span className={cn("block text-xs", over ? "text-aqi-unhealthy" : "text-muted-foreground")}>
                        {over ? `${ratio.toFixed(1)}× guideline` : "within guideline"}
                      </span>
                    </dd>
                  </div>
                );
              })}
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">Tick marks the guideline value. Illustrative sample figures.</p>
          </div>
        </div>

        {/* Charts */}
        <div className="mt-20 grid gap-12 lg:grid-cols-12">
          <div className="reveal lg:col-span-8">
            <div className="flex items-baseline justify-between">
              <h3 className="font-display text-xl tracking-tight">Today, hour by hour</h3>
              <span className="text-xs text-muted-foreground">Sample pattern · AQI</span>
            </div>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData} margin={{ top: 10, right: 0, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="aqiFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--olive)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--olive)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="hour" tickLine={false} axisLine={false} interval={3} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                  <Tooltip
                    cursor={{ stroke: "var(--olive)", strokeDasharray: "3 3" }}
                    contentStyle={{ background: "var(--forest)", border: "none", borderRadius: 2, color: "var(--ivory)", fontFamily: "var(--font-display)" }}
                    labelStyle={{ color: "var(--sage)" }}
                    itemStyle={{ color: "var(--ivory)" }}
                  />
                  <Area type="monotone" dataKey="aqi" name="AQI" stroke="var(--forest)" strokeWidth={1.5} fill="url(#aqiFill)" animationDuration={900} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="reveal lg:col-span-4">
            <div className="flex items-baseline justify-between">
              <h3 className="font-display text-xl tracking-tight">This week</h3>
              <span className="text-xs text-muted-foreground">Daily avg</span>
            </div>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 0, left: -24, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                  <Tooltip
                    cursor={{ fill: "var(--muted)" }}
                    contentStyle={{ background: "var(--forest)", border: "none", borderRadius: 2, color: "var(--ivory)", fontFamily: "var(--font-display)" }}
                    labelStyle={{ color: "var(--sage)" }}
                    itemStyle={{ color: "var(--ivory)" }}
                  />
                  <Bar dataKey="aqi" name="AQI" barSize={14} animationDuration={900}>
                    {weeklyData.map((d) => (
                      <Cell key={d.day} fill={`var(--${aqiBand(d.aqi).token})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
