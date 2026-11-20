import { useId, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { CITIES, searchCities, type City } from "@/lib/sample-data";
import { aqiBand } from "@/lib/air";
import { cn } from "@/lib/utils";

/** Location search over the sample city set. */
export function CitySearch({
  onSelect,
  className,
  placeholder = "Search a city…",
}: {
  onSelect: (city: City) => void;
  className?: string;
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  const results = useMemo(() => searchCities(query), [query]);
  const showList = focused && query.trim().length > 0;

  const choose = (c: City) => {
    onSelect(c);
    setQuery("");
    setActive(0);
  };

  return (
    <div className={cn("relative", className)}>
      <label className="flex items-center gap-3 border-b border-current/40 py-3 focus-within:border-current">
        <Search className="h-4 w-4 shrink-0 opacity-60" aria-hidden />
        <span className="sr-only">Search location</span>
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
            }
          }}
          className="w-full bg-transparent font-display text-lg outline-none placeholder:text-current/45"
        />
      </label>
      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-full z-[600] mt-1 border bg-popover text-popover-foreground shadow-float"
        >
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-muted-foreground">
              Not in the sample set yet — live data isn't connected. Try {CITIES[1]!.name}, London or Tokyo.
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
                    <span>
                      <span className="font-display">{c.name}</span>
                      <span className="ml-2 text-sm text-muted-foreground">{c.country}</span>
                    </span>
                    <span className="flex items-center gap-2 text-sm">
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
