import { Logo, NAV_ITEMS } from "./Nav";

export function Footer() {
  return (
    <footer className="surface-forest relative overflow-hidden border-t pt-20">
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-6 max-w-sm font-display text-2xl leading-snug tracking-tight">
              The air we breathe.
              <br />
              <span className="text-mint">The future we shape.</span>
            </p>
          </div>
          <nav className="md:col-span-3" aria-label="Footer">
            <p className="eyebrow text-muted-foreground">Explore</p>
            <ul className="mt-4 grid grid-cols-2 gap-y-2 text-sm md:grid-cols-1">
              {NAV_ITEMS.map((i) => (
                <li key={i.href}>
                  <a href={i.href} className="link-draw text-foreground/80 hover:text-foreground">{i.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-4">
            <p className="eyebrow text-muted-foreground">About the data</p>
            <p className="mt-4 text-sm text-muted-foreground">
              Readings on this site are illustrative sample data, not real-time measurements. Health facts reference the
              World Health Organization; AQI bands follow the US EPA scale. Map tiles © Esri, © OpenStreetMap contributors.
            </p>
          </div>
        </div>
      </div>
      <p
        className="pointer-events-none mt-16 select-none text-center font-display font-semibold leading-[0.75] tracking-[-0.06em] text-ivory/[0.06]"
        style={{ fontSize: "clamp(5rem, 24vw, 26rem)" }}
        aria-hidden
      >
        AERVANA
      </p>
      <div className="shell flex flex-col gap-2 border-t py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
        <span>© {new Date().getFullYear()} AERVANA</span>
        <span>Made for cleaner cities.</span>
      </div>
    </footer>
  );
}
