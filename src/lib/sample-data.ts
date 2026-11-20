/**
 * SAMPLE DATA — illustrative values only.
 * These are not live measurements. Replace with a real air-quality source when connected.
 */

export type Pollutant = { key: string; name: string; value: number; unit: string; limit: number };

export type City = {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  aqi: number;
  pollutants: Pollutant[];
  hourly: number[];
  weekly: number[];
};

type Seed = { id: string; name: string; country: string; lat: number; lng: number; aqi: number };

const SEEDS: Seed[] = [
  { id: "pune", name: "Pune", country: "India", lat: 18.52, lng: 73.86, aqi: 92 },
  { id: "delhi", name: "New Delhi", country: "India", lat: 28.61, lng: 77.21, aqi: 186 },
  { id: "mumbai", name: "Mumbai", country: "India", lat: 19.08, lng: 72.88, aqi: 118 },
  { id: "bengaluru", name: "Bengaluru", country: "India", lat: 12.97, lng: 77.59, aqi: 68 },
  { id: "london", name: "London", country: "United Kingdom", lat: 51.51, lng: -0.13, aqi: 41 },
  { id: "paris", name: "Paris", country: "France", lat: 48.86, lng: 2.35, aqi: 54 },
  { id: "copenhagen", name: "Copenhagen", country: "Denmark", lat: 55.68, lng: 12.57, aqi: 22 },
  { id: "berlin", name: "Berlin", country: "Germany", lat: 52.52, lng: 13.4, aqi: 37 },
  { id: "newyork", name: "New York", country: "United States", lat: 40.71, lng: -74.01, aqi: 58 },
  { id: "losangeles", name: "Los Angeles", country: "United States", lat: 34.05, lng: -118.24, aqi: 104 },
  { id: "mexico", name: "Mexico City", country: "Mexico", lat: 19.43, lng: -99.13, aqi: 131 },
  { id: "saopaulo", name: "São Paulo", country: "Brazil", lat: -23.55, lng: -46.63, aqi: 76 },
  { id: "cairo", name: "Cairo", country: "Egypt", lat: 30.04, lng: 31.24, aqi: 164 },
  { id: "beijing", name: "Beijing", country: "China", lat: 39.9, lng: 116.4, aqi: 142 },
  { id: "tokyo", name: "Tokyo", country: "Japan", lat: 35.68, lng: 139.69, aqi: 46 },
  { id: "singapore", name: "Singapore", country: "Singapore", lat: 1.35, lng: 103.82, aqi: 49 },
  { id: "sydney", name: "Sydney", country: "Australia", lat: -33.87, lng: 151.21, aqi: 28 },
  { id: "jakarta", name: "Jakarta", country: "Indonesia", lat: -6.21, lng: 106.85, aqi: 157 },
];

/** Deterministic pseudo-random generator so SSR and browser render identical numbers. */
function rng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function build(seed: Seed): City {
  const r = rng(seed.id);
  // Daily rhythm: low before dawn and mid-afternoon, peaks at rush hours.
  const hourly = Array.from({ length: 24 }, (_, h) => {
    const morning = Math.exp(-((h - 8.5) ** 2) / 4);
    const evening = Math.exp(-((h - 19.5) ** 2) / 5);
    const dip = Math.exp(-((h - 15) ** 2) / 6);
    const factor = 0.72 + 0.42 * morning + 0.5 * evening - 0.12 * dip + (r() - 0.5) * 0.08;
    return Math.max(5, Math.round(seed.aqi * factor));
  });
  const weekly = Array.from({ length: 7 }, (_, d) =>
    Math.max(5, Math.round(seed.aqi * (0.82 + r() * 0.36 - (d >= 5 ? 0.1 : 0)))),
  );
  const k = seed.aqi / 100;
  const j = () => 0.85 + r() * 0.3;
  const pollutants: Pollutant[] = [
    { key: "pm25", name: "PM2.5", value: Math.round(28 * k * j() * 10) / 10, unit: "µg/m³", limit: 15 },
    { key: "pm10", name: "PM10", value: Math.round(55 * k * j()), unit: "µg/m³", limit: 45 },
    { key: "no2", name: "NO₂", value: Math.round(32 * k * j()), unit: "µg/m³", limit: 25 },
    { key: "o3", name: "O₃", value: Math.round(60 * (0.7 + k * 0.3) * j()), unit: "µg/m³", limit: 100 },
    { key: "so2", name: "SO₂", value: Math.round(9 * k * j()), unit: "µg/m³", limit: 40 },
    { key: "co", name: "CO", value: Math.round(0.6 * k * j() * 100) / 100, unit: "mg/m³", limit: 4 },
  ];
  return { ...seed, hourly, weekly, pollutants };
}

export const CITIES: City[] = SEEDS.map(build);

export const DEFAULT_CITY_ID = "pune";

export function findCity(id: string): City {
  return CITIES.find((c) => c.id === id) ?? CITIES[0]!;
}

export function searchCities(query: string): City[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return CITIES.filter(
    (c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q),
  ).slice(0, 6);
}
