import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_CITY_ID, findCity, type City } from "@/lib/sample-data";

const STORAGE_KEY = "aervana-city";

type CityState = { city: City; setCity: (c: City) => void };

const CityContext = createContext<CityState | null>(null);

/** Selected city shared by every page; remembered in the browser between visits. */
export function CityProvider({ children }: { children: ReactNode }) {
  const [city, setCityState] = useState<City>(() => findCity(DEFAULT_CITY_ID));

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setCityState(findCity(saved));
    } catch {
      /* storage unavailable */
    }
  }, []);

  const setCity = useCallback((c: City) => {
    setCityState(c);
    try {
      window.localStorage.setItem(STORAGE_KEY, c.id);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const value = useMemo(() => ({ city, setCity }), [city, setCity]);
  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}

export function useCity(): CityState {
  const ctx = useContext(CityContext);
  if (!ctx) throw new Error("useCity must be used inside CityProvider");
  return ctx;
}
