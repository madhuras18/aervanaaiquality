import { useId, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { searchCities, type City, type ContinentFilter } from "@/lib/sample-data";
import { aqiBand } from "@/lib/air";
import { cn } from "@/lib/utils";

/** Global city search over the demo dataset, supporting city, country and alias queries. */
export function CitySearch({
  onSelect,
  className,
  placeholder = "Search a city or country (e.g. Nashik, Japan, USA)…",
  continent = "All",
}: {
  onSelect: (city: City) => void;
  className?: string;
  placeholder?: string;
  continent?: ContinentFilter;
}) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  const results = useMemo(() => searchCities(query, { continent, limit: 12 }), [query, continent]);
  const showList = focused && query.trim().length > 0;

  const choose = (c: City) => {
    onSelect(c);
    setQuery("");
    setActive(0);
    setFocused(false);
  };

  return (
    <div className={cn("relative", className)}>
      <label className="flex items-center gap-3 border-b border-current/40 py-3 focus-within:border-current">
        <Search className="h-4 w-4 shrink-0 opacity-60" aria-hidden />
        <span className="sr-only">Search city or country</span>
        <input
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter" && results[active]) {
              e.preventDefault();
              choose(results[active]);
            } else if (e.key === "Escape") {
              setFocused(false);
            }
          }}
          className="w-full bg-transparent font-display text-base outline-none placeholder:text-current/45 sm:text-lg"
        />
        {query && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setQuery("");
              setActive(0);
            }}
            aria-label="Clear search"
            className="opacity-60 transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </label>
      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-full z-[600] mt-1 max-h-80 overflow-y-auto border bg-popover text-popover-foreground shadow-float"
        >
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-muted-foreground">
              No matching city in {continent === "All" ? "the demo dataset" : continent}. Try Nashik, Japan, London, USA, Cairo or Sydney.
            </li>
          ) : (
            results.map((c, i) => {
              const band = aqiBand(c.aqi);
              return (
                <li key={c.id} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => choose(c)}
                    onMouseEnter={() => setActive(i)}
                    className={cn(
                      "flex w-full items-center justify-between gap-4 px-4 py-3 text-left",
                      i === active && "bg-muted",
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span className="text-base leading-none" aria-hidden>{c.flag}</span>
                      <span className="truncate">
                        <span className="font-display">{c.name}</span>
                        <span className="ml-2 text-sm text-muted-foreground">{c.country}</span>
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2 text-sm">
                      <span className={cn("h-2 w-2 rounded-full", `bg-${band.token}`)} aria-hidden />
                      <span className="numeral">{c.aqi}</span>
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
