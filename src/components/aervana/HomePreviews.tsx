import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import cityHazeImg from "@/assets/city-haze.jpg";
import greenBoulevardImg from "@/assets/green-boulevard.jpg";
import familyWindowImg from "@/assets/family-window.jpg";
import rooftopGardenImg from "@/assets/rooftop-garden.jpg";
import { aqiBand, bestWindow, formatHour, routeAqi } from "@/lib/air";
import type { City } from "@/lib/sample-data";
import { cn } from "@/lib/utils";
import { SampleBadge, SectionLabel } from "./SampleBadge";

/** Compact editorial introduction and visual previews linking to each AERVANA page. */
export function HomePreviews({ city }: { city: City }) {
  const band = aqiBand(city.aqi);
  const cleanest = bestWindow(city.hourly, 5, 22, 1);
  const greenAqi = routeAqi(city.aqi, "green");
  const pm25 = city.pollutants.find((p) => p.key === "pm25");

  const previews = [
    {
      index: "01",
      to: "/air-quality" as const,
      eyebrow: "Air Quality",
      title: "Readings, map & pollutant science.",
      body: `Sample AQI ${city.aqi} (${band.label.toLowerCase()}) in ${city.name}${pm25 ? ` with PM2.5 at ${pm25.value} ${pm25.unit}` : ""}. Inspect all six pollutants, hourly trends and the world map.`,
      cta: "Open Air Quality",
      stat: `${city.aqi} AQI`,
      statNote: `${city.name} · sample`,
      image: cityHazeImg,
      alt: "Urban skyline seen through soft morning atmospheric haze",
    },
    {
      index: "02",
      to: "/smart-living" as const,
      eyebrow: "Smart Living",
      title: "Cleaner hours, greener routes & lighter trips.",
      body: `Today's cleanest sample hour looks like ${formatHour(cleanest.start)} (~AQI ${cleanest.avg}). Compare green-street EcoRoutes (~AQI ${greenAqi}) and low-carbon commutes.`,
      cta: "Open Smart Living",
      stat: formatHour(cleanest.start),
      statNote: "Cleanest hour · sample",
      image: greenBoulevardImg,
      alt: "A tree-lined urban boulevard shaded in morning sunlight",
    },
    {
      index: "03",
      to: "/family-care" as const,
      eyebrow: "Family Care",
      title: "Calm protection for children, elders & home.",
      body: "Age-specific outdoor limits, a room-by-room indoor air habit score and practical guidance on ventilation, HEPA filters and masks.",
      cta: "Open Family Care",
      stat: "90%",
      statNote: "of our day spent indoors",
      image: familyWindowImg,
      alt: "A grandmother and child looking out through a sunlit home window",
    },
    {
      index: "04",
      to: "/my-impact" as const,
      eyebrow: "My Impact",
      title: "Log daily habits & see citywide change.",
      body: "Track sustainable swaps across the week, follow your estimated CO₂ savings with weekly charts, and scale your habits to a whole neighbourhood.",
      cta: "Open My Impact",
      stat: "10 kg",
      statNote: "weekly CO₂ savings target",
      image: rooftopGardenImg,
      alt: "A lush rooftop garden overlooking green city buildings",
    },
  ];

  return (
    <>
      {/* Short editorial introduction & asymmetrical feature previews */}
      <section id="explore" className="surface-ivory section-pad">
        <div className="shell">
          <div className="reveal grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <SectionLabel index="01">Why AERVANA</SectionLabel>
              <h2 className="display-lg mt-6">
                Clarity for every
                <br />
                <em className="font-normal italic text-olive/70">breath you take.</em>
              </h2>
            </div>
            <div className="md:col-span-5">
              <p className="lede text-muted-foreground">
                Urban air shifts by the hour and by the street. AERVANA turns complex air data into five
                focused spaces — so you can check conditions, plan your day, protect family and track your
                footprint without clutter.
              </p>
              <div className="mt-5">
                <SampleBadge label={`Showing ${city.name} · sample data`} />
              </div>
            </div>
          </div>

          <div className="mt-16 divide-y border-y md:mt-20">
            {previews.map((item, idx) => (
              <article
                key={item.to}
                className="reveal grid gap-8 py-12 md:grid-cols-12 md:items-center md:gap-12 md:py-16"
              >
                <div className={cn("md:col-span-5", idx % 2 === 1 && "md:order-2")}>
                  <Link to={item.to} className="group block overflow-hidden">
                    <div className="relative aspect-[16/10] overflow-hidden bg-forest">
                      <img
                        src={item.image}
                        alt={item.alt}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="veil-fade absolute inset-0 opacity-60" aria-hidden />
                      <div className="absolute bottom-4 left-4 text-ivory">
                        <p className="numeral text-3xl leading-none">{item.stat}</p>
                        <p className="mt-1 text-xs text-ivory/75">{item.statNote}</p>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className={cn("md:col-span-7", idx % 2 === 1 && "md:order-1")}>
                  <p className="eyebrow text-muted-foreground">
                    <span className="text-olive">{item.index}</span> · {item.eyebrow}
                  </p>
                  <h3 className="display-md mt-4">{item.title}</h3>
                  <p className="mt-4 max-w-xl text-muted-foreground">{item.body}</p>
                  <div className="mt-7">
                    <Link
                      to={item.to}
                      className="group inline-flex items-center gap-3 border border-primary bg-primary px-5 py-3 font-display text-sm text-primary-foreground transition-colors hover:bg-transparent hover:text-primary"
                    >
                      {item.cta}
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Dedicated preview band for the AI Assistant page */}
      <section className="surface-forest surface-deep section-pad relative overflow-hidden">
        <div className="pointer-events-none absolute -right-32 top-12 h-[28rem] w-[28rem] rounded-full bg-mint/10 blur-3xl animate-breathe" aria-hidden />
        <div className="shell relative grid gap-10 md:grid-cols-12 md:items-end">
          <div className="reveal md:col-span-7">
            <SectionLabel index="05">AI Assistant</SectionLabel>
            <h2 className="display-lg mt-6">
              Have a question
              <br />
              about <span className="text-mint">today's air?</span>
            </h2>
            <p className="lede mt-6 max-w-xl text-muted-foreground">
              Ask about outdoor exercise, protecting children, air purifiers, ventilation or greener
              commutes — tuned to {city.name}.
            </p>
          </div>
          <div className="reveal flex flex-col items-start gap-4 md:col-span-5 md:items-end">
            <SampleBadge label="Demo answers" />
            <Link
              to="/assistant"
              className="group inline-flex items-center gap-3 bg-primary px-6 py-4 font-display text-base text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Open AI Assistant
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}