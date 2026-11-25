import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Assistant } from "@/components/aervana/Assistant";
import { SectionLabel } from "@/components/aervana/SampleBadge";
import { useCity } from "@/lib/city-context";

const TITLE = "AI Assistant — AERVANA";
const DESCRIPTION =
  "Ask AERVANA plain-language questions about air quality, pollution, protecting family, air purifiers and safer daily routines.";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/assistant" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "/assistant" }],
  }),
  component: AssistantPage,
});

const RELATED = [
  { to: "/air-quality" as const, title: "Air Quality", note: "Check sample AQI, pollutants & map" },
  { to: "/smart-living" as const, title: "Smart Living", note: "Plan cleaner hours & EcoRoutes" },
  { to: "/family-care" as const, title: "Family Care", note: "Home checklist & age guidance" },
  { to: "/my-impact" as const, title: "My Impact", note: "Log weekly cleaner habits" },
];

function AssistantPage() {
  const { city, setCity } = useCity();

  return (
    <>
      <div className="surface-forest surface-deep pt-24 md:pt-28">
        <div className="shell">
          <Link
            to="/"
            className="eyebrow inline-flex items-center gap-2 text-foreground/75 transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Back to home
          </Link>
        </div>
      </div>
      <Assistant city={city} onCity={setCity} standalone />
      <section className="surface-ivory section-pad">
        <div className="shell">
          <div className="reveal grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <SectionLabel index="02">Go deeper</SectionLabel>
              <h2 className="display-md mt-5">Turn answers into action across AERVANA.</h2>
            </div>
            <p className="text-sm text-muted-foreground md:col-span-5">
              Your chosen city ({city.name}) stays synced across every page as you explore.
            </p>
          </div>
          <div className="mt-10 grid gap-px border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {RELATED.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group flex flex-col justify-between bg-background p-6 transition-colors hover:bg-muted"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-display text-xl">{item.title}</span>
                  <ArrowUpRight className="h-4 w-4 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{item.note}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}