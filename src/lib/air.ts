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
