/**
 * Air-quality rules used across AERVANA.
 * AQI bands follow the US EPA Air Quality Index scale (0–500).
 */

export type AqiBand = {
  key: "good" | "moderate" | "sensitive" | "unhealthy" | "very" | "hazardous";
  label: string;
  short: string;
  advice: string;
  /** Tailwind token suffix, e.g. `bg-aqi-good` */
  token: string;
  min: number;
  max: number;
};

export const AQI_BANDS: AqiBand[] = [
  { key: "good", label: "Good", short: "Good", min: 0, max: 50, token: "aqi-good", advice: "Air is clean. A good day to be outside and open the windows." },
  { key: "moderate", label: "Moderate", short: "Moderate", min: 51, max: 100, token: "aqi-moderate", advice: "Acceptable for most. Unusually sensitive people may want to ease off long outdoor exertion." },
  { key: "sensitive", label: "Unhealthy for sensitive groups", short: "Sensitive", min: 101, max: 150, token: "aqi-sensitive", advice: "Children, older adults and people with asthma should shorten time outdoors." },
  { key: "unhealthy", label: "Unhealthy", short: "Unhealthy", min: 151, max: 200, token: "aqi-unhealthy", advice: "Everyone may feel effects. Move exercise indoors and keep windows closed." },
  { key: "very", label: "Very unhealthy", short: "Very unhealthy", min: 201, max: 300, token: "aqi-very", advice: "Health alert. Avoid outdoor activity; run an air purifier indoors." },
  { key: "hazardous", label: "Hazardous", short: "Hazardous", min: 301, max: 500, token: "aqi-hazardous", advice: "Emergency conditions. Stay indoors with filtered air." },
];

export function aqiBand(aqi: number): AqiBand {
  const v = Math.max(0, Math.round(aqi));
  return AQI_BANDS.find((b) => v <= b.max) ?? AQI_BANDS[AQI_BANDS.length - 1]!;
}

export type Profile = "adult" | "child" | "older" | "sensitive";

/** Highest AQI at which outdoor exertion is still comfortable, per profile. */
export const PROFILE_LIMIT: Record<Profile, number> = {
  adult: 100,
  child: 75,
  older: 75,
  sensitive: 50,
};

/**
 * Find the start hour of the `duration`-hour window with the lowest average AQI,
 * searching only within [from, to) hours of the day.
 */
export function bestWindow(
  hourly: number[],
  from: number,
  to: number,
  duration = 1,
): { start: number; avg: number } {
  let best = { start: from, avg: Number.POSITIVE_INFINITY };
  for (let h = from; h + duration <= to; h++) {
    let sum = 0;
    for (let k = 0; k < duration; k++) sum += hourly[(h + k) % 24] ?? 0;
    const avg = sum / duration;
    if (avg < best.avg) best = { start: h, avg };
  }
  return { start: best.start, avg: Math.round(best.avg) };
}

/** Typical lifecycle-free tailpipe emission factors, kg CO₂ per passenger-km. */
export const EMISSION_FACTORS = {
  car: 0.17,
  bus: 0.1,
  metro: 0.035,
  ebike: 0.005,
  bicycle: 0,
  walk: 0,
} as const;

export type Mode = keyof typeof EMISSION_FACTORS;

export function weeklyCo2Kg(mode: Mode, kmPerTrip: number, tripsPerWeek: number): number {
  return EMISSION_FACTORS[mode] * kmPerTrip * tripsPerWeek;
}

/** A mature urban tree absorbs roughly 21 kg of CO₂ a year. */
export const TREE_KG_PER_YEAR = 21;
/** Average petrol car burns ~0.07 L per km. */
export const LITRES_PER_CAR_KM = 0.07;

export function yearlyImpact(carKmSwappedPerWeek: number, people: number) {
  const km = carKmSwappedPerWeek * 52 * people;
  const co2Kg = km * EMISSION_FACTORS.car;
  return {
    co2Kg,
    trees: co2Kg / TREE_KG_PER_YEAR,
    litres: km * LITRES_PER_CAR_KM,
  };
}

export function formatHour(h: number): string {
  const hour = ((h % 24) + 24) % 24;
  const suffix = hour < 12 ? "am" : "pm";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}${suffix}`;
}

/* ---------- Go / caution / avoid ---------- */

export type Verdict = "go" | "caution" | "avoid";

/** At or under the limit is fine; up to 50 above it calls for caution; beyond that, avoid. */
export function verdict(aqi: number, limit: number): Verdict {
  if (aqi <= limit) return "go";
  if (aqi <= limit + 50) return "caution";
  return "avoid";
}

export type Intensity = "light" | "moderate" | "vigorous";

/** Highest AQI at which each effort level is comfortable for a healthy adult. */
export const INTENSITY_LIMIT: Record<Intensity, number> = {
  light: 150,
  moderate: 100,
  vigorous: 75,
};

/* ---------- EcoRoute ---------- */

export type RouteKind = "main" | "mixed" | "green";

/** Street-level pollution along each route type, relative to the city average. */
export const ROUTE_EXPOSURE: Record<RouteKind, number> = {
  main: 1.35,
  mixed: 1,
  green: 0.7,
};

export function routeAqi(cityAqi: number, kind: RouteKind): number {
  return Math.round(cityAqi * ROUTE_EXPOSURE[kind]);
}

/* ---------- Personal impact tracker ---------- */

export type ImpactAction = { id: string; label: string; note: string; kg: number };

/** Estimated kg CO₂ saved each time an action is done. */
export const IMPACT_ACTIONS: ImpactAction[] = [
  { id: "cycle", label: "Cycled instead of driving", note: "8 km trip", kg: 8 * EMISSION_FACTORS.car },
  { id: "metro", label: "Took the metro, not the car", note: "12 km trip", kg: 12 * (EMISSION_FACTORS.car - EMISSION_FACTORS.metro) },
  { id: "walk", label: "Walked a short errand", note: "2 km", kg: 2 * EMISSION_FACTORS.car },
  { id: "wfh", label: "Worked from home", note: "20 km commute avoided", kg: 20 * EMISSION_FACTORS.car },
  { id: "carpool", label: "Shared a car ride", note: "15 km, two people", kg: (15 * EMISSION_FACTORS.car) / 2 },
  { id: "plant", label: "Ate a plant-based meal", note: "instead of a meat dish", kg: 1.5 },
  { id: "dry", label: "Line-dried the laundry", note: "instead of a tumble dryer", kg: 0.8 },
];

export const WEEKLY_GOAL_KG = 10;

/** One list of completed action ids per day, Monday first. */
export type WeekLog = string[][];

export function dayKg(ids: string[]): number {
  return ids.reduce((sum, id) => sum + (IMPACT_ACTIONS.find((a) => a.id === id)?.kg ?? 0), 0);
}

export function weekSummary(log: WeekLog) {
  const perDay = log.map(dayKg);
  const total = perDay.reduce((s, v) => s + v, 0);
  const actions = log.reduce((s, d) => s + d.length, 0);
  return { perDay, total, actions, goalPct: Math.min(total / WEEKLY_GOAL_KG, 1) };
}
