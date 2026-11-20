import heroImg from "@/assets/hero-city-forest.jpg";
import { ArrowDownRight } from "lucide-react";
import { aqiBand } from "@/lib/air";
import type { City } from "@/lib/sample-data";

export function Hero({ city }: { city: City }) {
  const band = aqiBand(city.aqi);
  return (
    <section id="top" className="surface-forest surface-deep grain relative flex min-h-[100svh] flex-col overflow-hidden">
      <img
        src={heroImg}
        alt="A forested hillside at dawn overlooking a hazy city skyline"
        className="absolute inset-0 h-full w-full object-cover animate-slow-zoom"
        fetchPriority="high"
      />
      <div className="veil-hero absolute inset-0" aria-hidden />

      <div className="shell relative flex flex-1 flex-col justify-end pb-10 pt-28 md:pb-14">
        <p className="eyebrow mb-6 text-sage animate-rise" style={{ animationDelay: "200ms" }}>
          Urban air quality intelligence
        </p>
        <h1 className="display-xl max-w-[12ch] animate-rise" style={{ animationDelay: "350ms" }}>
          The air we breathe<span className="text-mint">.</span>
        </h1>
        <div className="mt-8 grid gap-10 md:mt-12 md:grid-cols-12 md:items-end">
          <p
            className="lede max-w-xl text-foreground/80 md:col-span-6 animate-rise"
            style={{ animationDelay: "550ms" }}
          >
            <span className="font-display text-foreground">The future we shape.</span> AERVANA reads the
            air around you, explains what it means for your family, and helps you plan cleaner days.
          </p>
          <div
            className="flex flex-wrap items-center gap-4 md:col-span-6 md:justify-end animate-rise"
            style={{ animationDelay: "700ms" }}
          >
            <a
              href="#air"
              className="group inline-flex items-center gap-3 bg-primary px-6 py-4 font-display text-base text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Check your air
              <ArrowDownRight className="h-5 w-5 transition-transform group-hover:rotate-[-45deg]" />
            </a>
            <a href="#learn" className="link-draw pb-1 font-display text-base text-foreground/85">
              Why it matters
            </a>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-px border-t pt-6 text-sm md:mt-16 md:grid-cols-4">
          <div>
            <p className="eyebrow text-muted-foreground">{city.name} · sample</p>
            <p className="mt-2 flex items-baseline gap-2">
              <span className="numeral text-3xl">{city.aqi}</span>
              <span className="text-foreground/70">AQI · {band.short}</span>
            </p>
          </div>
          <div>
            <p className="eyebrow text-muted-foreground">People breathing unsafe air</p>
            <p className="mt-2 flex items-baseline gap-2">
              <span className="numeral text-3xl">99%</span>
              <span className="text-foreground/70">WHO, 2022</span>
            </p>
          </div>
          <div className="hidden md:block">
            <p className="eyebrow text-muted-foreground">Time spent indoors</p>
            <p className="mt-2 flex items-baseline gap-2">
              <span className="numeral text-3xl">~90%</span>
              <span className="text-foreground/70">of our day</span>
            </p>
          </div>
          <div className="hidden items-end justify-end md:flex">
            <a href="#air" className="eyebrow flex items-center gap-3 text-foreground/70 hover:text-foreground">
              Scroll <span className="block h-8 w-px bg-current animate-drift" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
