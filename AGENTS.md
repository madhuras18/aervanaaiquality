<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Homepage sections live in `src/components/aervana/`, composed in `src/routes/index.tsx`; selected city is lifted state in the index route so every section reacts to it.
- Air-quality rules (AQI bands, planner windows, emission factors) live in `src/lib/air.ts` with tests in `src/test/air.test.ts`; keep UI free of these formulas.
- Sample readings come only from `src/lib/sample-data.ts` (deterministic, SSR-safe); swap this module for a live source rather than editing components.
- Leaflet is browser-only: `LeafletMap.tsx` is lazy-loaded after mount; never import it statically. Map tiles use Esri Dark Gray Canvas (CARTO now requires a key).
- Sections switch theme via `.surface-forest` / `.surface-ivory` classes that re-map shadcn tokens; dynamic `bg-aqi-*` classes are safelisted in styles.css.
