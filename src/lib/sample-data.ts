/**
 * SAMPLE / DEMO DATA — illustrative values only.
 * These are not live or scientifically measured readings. Replace with a real air-quality source when connected.
 */

export type Continent =
  | "Asia"
  | "Europe"
  | "North America"
  | "South America"
  | "Africa"
  | "Oceania";

export const CONTINENTS: readonly Continent[] = [
  "Asia",
  "Europe",
  "North America",
  "South America",
  "Africa",
  "Oceania",
] as const;

export type Pollutant = { key: string; name: string; value: number; unit: string; limit: number };

export type City = {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  flag: string;
  continent: Continent;
  aliases?: string[];
  lat: number;
  lng: number;
  aqi: number;
  pollutants: Pollutant[];
  hourly: number[];
  weekly: number[];
};

type Seed = {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  flag: string;
  continent: Continent;
  lat: number;
  lng: number;
  aqi: number;
  aliases?: string[];
};

const SEEDS: Seed[] = [
  // India (Asia)
  { id: "nashik", name: "Nashik", country: "India", countryCode: "IN", flag: "🇮🇳", continent: "Asia", lat: 19.9975, lng: 73.7898, aqi: 78 },
  { id: "mumbai", name: "Mumbai", country: "India", countryCode: "IN", flag: "🇮🇳", continent: "Asia", lat: 19.076, lng: 72.8777, aqi: 118, aliases: ["Bombay"] },
  { id: "pune", name: "Pune", country: "India", countryCode: "IN", flag: "🇮🇳", continent: "Asia", lat: 18.5204, lng: 73.8567, aqi: 92 },
  { id: "delhi", name: "Delhi", country: "India", countryCode: "IN", flag: "🇮🇳", continent: "Asia", lat: 28.6139, lng: 77.209, aqi: 186, aliases: ["New Delhi"] },
  { id: "bengaluru", name: "Bengaluru", country: "India", countryCode: "IN", flag: "🇮🇳", continent: "Asia", lat: 12.9716, lng: 77.5946, aqi: 68, aliases: ["Bangalore"] },
  { id: "hyderabad", name: "Hyderabad", country: "India", countryCode: "IN", flag: "🇮🇳", continent: "Asia", lat: 17.385, lng: 78.4867, aqi: 96 },
  { id: "chennai", name: "Chennai", country: "India", countryCode: "IN", flag: "🇮🇳", continent: "Asia", lat: 13.0827, lng: 80.2707, aqi: 84, aliases: ["Madras"] },
  { id: "kolkata", name: "Kolkata", country: "India", countryCode: "IN", flag: "🇮🇳", continent: "Asia", lat: 22.5726, lng: 88.3639, aqi: 149, aliases: ["Calcutta"] },
  { id: "ahmedabad", name: "Ahmedabad", country: "India", countryCode: "IN", flag: "🇮🇳", continent: "Asia", lat: 23.0225, lng: 72.5714, aqi: 136 },
  { id: "jaipur", name: "Jaipur", country: "India", countryCode: "IN", flag: "🇮🇳", continent: "Asia", lat: 26.9124, lng: 75.7873, aqi: 124 },
  { id: "nagpur", name: "Nagpur", country: "India", countryCode: "IN", flag: "🇮🇳", continent: "Asia", lat: 21.1458, lng: 79.0882, aqi: 89 },
  // Asia
  { id: "tokyo", name: "Tokyo", country: "Japan", countryCode: "JP", flag: "🇯🇵", continent: "Asia", lat: 35.6762, lng: 139.6503, aqi: 46 },
  { id: "seoul", name: "Seoul", country: "South Korea", countryCode: "KR", flag: "🇰🇷", continent: "Asia", lat: 37.5665, lng: 126.978, aqi: 64, aliases: ["Korea"] },
  { id: "beijing", name: "Beijing", country: "China", countryCode: "CN", flag: "🇨🇳", continent: "Asia", lat: 39.9042, lng: 116.4074, aqi: 142 },
  { id: "shanghai", name: "Shanghai", country: "China", countryCode: "CN", flag: "🇨🇳", continent: "Asia", lat: 31.2304, lng: 121.4737, aqi: 94 },
  { id: "singapore", name: "Singapore", country: "Singapore", countryCode: "SG", flag: "🇸🇬", continent: "Asia", lat: 1.3521, lng: 103.8198, aqi: 49 },
  { id: "bangkok", name: "Bangkok", country: "Thailand", countryCode: "TH", flag: "🇹🇭", continent: "Asia", lat: 13.7563, lng: 100.5018, aqi: 112 },
  { id: "jakarta", name: "Jakarta", country: "Indonesia", countryCode: "ID", flag: "🇮🇩", continent: "Asia", lat: -6.2088, lng: 106.8456, aqi: 157 },
  { id: "dubai", name: "Dubai", country: "United Arab Emirates", countryCode: "AE", flag: "🇦🇪", continent: "Asia", lat: 25.2048, lng: 55.2708, aqi: 108, aliases: ["UAE"] },
  { id: "abudhabi", name: "Abu Dhabi", country: "United Arab Emirates", countryCode: "AE", flag: "🇦🇪", continent: "Asia", lat: 24.4539, lng: 54.3773, aqi: 99, aliases: ["UAE"] },
  { id: "riyadh", name: "Riyadh", country: "Saudi Arabia", countryCode: "SA", flag: "🇸🇦", continent: "Asia", lat: 24.7136, lng: 46.6753, aqi: 128, aliases: ["KSA"] },
  { id: "dhaka", name: "Dhaka", country: "Bangladesh", countryCode: "BD", flag: "🇧🇩", continent: "Asia", lat: 23.8103, lng: 90.4125, aqi: 174 },
  { id: "kathmandu", name: "Kathmandu", country: "Nepal", countryCode: "NP", flag: "🇳🇵", continent: "Asia", lat: 27.7172, lng: 85.324, aqi: 134 },
  // Europe
  { id: "london", name: "London", country: "United Kingdom", countryCode: "GB", flag: "🇬🇧", continent: "Europe", lat: 51.5072, lng: -0.1276, aqi: 41, aliases: ["UK", "Britain", "England"] },
  { id: "paris", name: "Paris", country: "France", countryCode: "FR", flag: "🇫🇷", continent: "Europe", lat: 48.8566, lng: 2.3522, aqi: 54 },
  { id: "berlin", name: "Berlin", country: "Germany", countryCode: "DE", flag: "🇩🇪", continent: "Europe", lat: 52.52, lng: 13.405, aqi: 37 },
  { id: "rome", name: "Rome", country: "Italy", countryCode: "IT", flag: "🇮🇹", continent: "Europe", lat: 41.9028, lng: 12.4964, aqi: 59 },
  { id: "madrid", name: "Madrid", country: "Spain", countryCode: "ES", flag: "🇪🇸", continent: "Europe", lat: 40.4168, lng: -3.7038, aqi: 52 },
  { id: "amsterdam", name: "Amsterdam", country: "Netherlands", countryCode: "NL", flag: "🇳🇱", continent: "Europe", lat: 52.3676, lng: 4.9041, aqi: 35, aliases: ["Holland"] },
  { id: "lisbon", name: "Lisbon", country: "Portugal", countryCode: "PT", flag: "🇵🇹", continent: "Europe", lat: 38.7223, lng: -9.1393, aqi: 31 },
  { id: "stockholm", name: "Stockholm", country: "Sweden", countryCode: "SE", flag: "🇸🇪", continent: "Europe", lat: 59.3293, lng: 18.0686, aqi: 19 },
  { id: "zurich", name: "Zurich", country: "Switzerland", countryCode: "CH", flag: "🇨🇭", continent: "Europe", lat: 47.3769, lng: 8.5417, aqi: 24, aliases: ["Zürich"] },
  { id: "vienna", name: "Vienna", country: "Austria", countryCode: "AT", flag: "🇦🇹", continent: "Europe", lat: 48.2082, lng: 16.3738, aqi: 33 },
  { id: "moscow", name: "Moscow", country: "Russia", countryCode: "RU", flag: "🇷🇺", continent: "Europe", lat: 55.7558, lng: 37.6173, aqi: 66 },
  // North America
  { id: "newyork", name: "New York", country: "United States", countryCode: "US", flag: "🇺🇸", continent: "North America", lat: 40.7128, lng: -74.006, aqi: 58, aliases: ["USA", "US", "America", "NYC"] },
  { id: "losangeles", name: "Los Angeles", country: "United States", countryCode: "US", flag: "🇺🇸", continent: "North America", lat: 34.0522, lng: -118.2437, aqi: 104, aliases: ["USA", "US", "America", "LA"] },
  { id: "chicago", name: "Chicago", country: "United States", countryCode: "US", flag: "🇺🇸", continent: "North America", lat: 41.8781, lng: -87.6298, aqi: 53, aliases: ["USA", "US", "America"] },
  { id: "toronto", name: "Toronto", country: "Canada", countryCode: "CA", flag: "🇨🇦", continent: "North America", lat: 43.6532, lng: -79.3832, aqi: 38 },
  { id: "vancouver", name: "Vancouver", country: "Canada", countryCode: "CA", flag: "🇨🇦", continent: "North America", lat: 49.2827, lng: -123.1207, aqi: 26 },
  { id: "montreal", name: "Montreal", country: "Canada", countryCode: "CA", flag: "🇨🇦", continent: "North America", lat: 45.5017, lng: -73.5673, aqi: 36, aliases: ["Montréal"] },
  { id: "mexico", name: "Mexico City", country: "Mexico", countryCode: "MX", flag: "🇲🇽", continent: "North America", lat: 19.4326, lng: -99.1332, aqi: 131, aliases: ["CDMX"] },
  { id: "sanfrancisco", name: "San Francisco", country: "United States", countryCode: "US", flag: "🇺🇸", continent: "North America", lat: 37.7749, lng: -122.4194, aqi: 42, aliases: ["USA", "US", "America", "SF"] },
  // South America
  { id: "saopaulo", name: "São Paulo", country: "Brazil", countryCode: "BR", flag: "🇧🇷", continent: "South America", lat: -23.5505, lng: -46.6333, aqi: 76, aliases: ["Sao Paulo"] },
  { id: "riodejaneiro", name: "Rio de Janeiro", country: "Brazil", countryCode: "BR", flag: "🇧🇷", continent: "South America", lat: -22.9068, lng: -43.1729, aqi: 61, aliases: ["Rio"] },
  { id: "buenosaires", name: "Buenos Aires", country: "Argentina", countryCode: "AR", flag: "🇦🇷", continent: "South America", lat: -34.6037, lng: -58.3816, aqi: 48 },
  { id: "santiago", name: "Santiago", country: "Chile", countryCode: "CL", flag: "🇨🇱", continent: "South America", lat: -33.4489, lng: -70.6693, aqi: 109 },
  { id: "lima", name: "Lima", country: "Peru", countryCode: "PE", flag: "🇵🇪", continent: "South America", lat: -12.0464, lng: -77.0428, aqi: 97 },
  { id: "bogota", name: "Bogotá", country: "Colombia", countryCode: "CO", flag: "🇨🇴", continent: "South America", lat: 4.711, lng: -74.0721, aqi: 74, aliases: ["Bogota"] },
  // Africa
  { id: "cairo", name: "Cairo", country: "Egypt", countryCode: "EG", flag: "🇪🇬", continent: "Africa", lat: 30.0444, lng: 31.2357, aqi: 164 },
  { id: "nairobi", name: "Nairobi", country: "Kenya", countryCode: "KE", flag: "🇰🇪", continent: "Africa", lat: -1.2921, lng: 36.8219, aqi: 72 },
  { id: "capetown", name: "Cape Town", country: "South Africa", countryCode: "ZA", flag: "🇿🇦", continent: "Africa", lat: -33.9249, lng: 18.4241, aqi: 34 },
  { id: "johannesburg", name: "Johannesburg", country: "South Africa", countryCode: "ZA", flag: "🇿🇦", continent: "Africa", lat: -26.2041, lng: 28.0473, aqi: 86, aliases: ["Joburg"] },
  { id: "lagos", name: "Lagos", country: "Nigeria", countryCode: "NG", flag: "🇳🇬", continent: "Africa", lat: 6.5244, lng: 3.3792, aqi: 148 },
  { id: "accra", name: "Accra", country: "Ghana", countryCode: "GH", flag: "🇬🇭", continent: "Africa", lat: 5.6037, lng: -0.187, aqi: 102 },
  { id: "casablanca", name: "Casablanca", country: "Morocco", countryCode: "MA", flag: "🇲🇦", continent: "Africa", lat: 33.5731, lng: -7.5898, aqi: 69 },
  // Oceania
  { id: "sydney", name: "Sydney", country: "Australia", countryCode: "AU", flag: "🇦🇺", continent: "Oceania", lat: -33.8688, lng: 151.2093, aqi: 28 },
  { id: "melbourne", name: "Melbourne", country: "Australia", countryCode: "AU", flag: "🇦🇺", continent: "Oceania", lat: -37.8136, lng: 144.9631, aqi: 25 },
  { id: "brisbane", name: "Brisbane", country: "Australia", countryCode: "AU", flag: "🇦🇺", continent: "Oceania", lat: -27.4705, lng: 153.026, aqi: 23 },
  { id: "perth", name: "Perth", country: "Australia", countryCode: "AU", flag: "🇦🇺", continent: "Oceania", lat: -31.9505, lng: 115.8605, aqi: 27 },
  { id: "auckland", name: "Auckland", country: "New Zealand", countryCode: "NZ", flag: "🇳🇿", continent: "Oceania", lat: -36.8509, lng: 174.7645, aqi: 21, aliases: ["NZ"] },
  { id: "wellington", name: "Wellington", country: "New Zealand", countryCode: "NZ", flag: "🇳🇿", continent: "Oceania", lat: -41.2866, lng: 174.7756, aqi: 16, aliases: ["NZ"] },
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

/** Normalize text for case-insensitive, accent-insensitive matching. */
function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export type ContinentFilter = "All" | Continent;

export function filterByContinent(cities: City[], continent: ContinentFilter): City[] {
  if (continent === "All") return cities;
  return cities.filter((c) => c.continent === continent);
}

/** Search cities by name, country, country code, alias, or continent, ranked by relevance. */
export function searchCities(
  query: string,
  options?: { continent?: ContinentFilter; limit?: number },
): City[] {
  const q = normalize(query);
  const pool = options?.continent ? filterByContinent(CITIES, options.continent) : CITIES;
  if (!q) return [];

  const scored: { city: City; score: number }[] = [];
  for (const city of pool) {
    const name = normalize(city.name);
    const country = normalize(city.country);
    const code = normalize(city.countryCode);
    const continent = normalize(city.continent);
    const aliases = (city.aliases ?? []).map(normalize);

    let score = 0;
    if (name === q) score = 100;
    else if (name.startsWith(q)) score = 90;
    else if (aliases.some((a) => a === q)) score = 85;
    else if (country === q || code === q) score = 80;
    else if (aliases.some((a) => a.startsWith(q))) score = 75;
    else if (name.includes(q)) score = 70;
    else if (country.startsWith(q)) score = 65;
    else if (country.includes(q)) score = 55;
    else if (aliases.some((a) => a.includes(q))) score = 50;
    else if (continent.includes(q)) score = 35;

    if (score > 0) scored.push({ city, score });
  }

  scored.sort((a, b) => b.score - a.score || a.city.name.localeCompare(b.city.name));
  const limit = options?.limit ?? 12;
  return scored.slice(0, limit).map((item) => item.city);
}
