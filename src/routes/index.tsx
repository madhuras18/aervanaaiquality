import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/aervana/Nav";
import { Hero } from "@/components/aervana/Hero";
import { Intelligence } from "@/components/aervana/Intelligence";
import { PollutionMap } from "@/components/aervana/PollutionMap";
import { Learn } from "@/components/aervana/Learn";
import { Planner } from "@/components/aervana/Planner";
import { Indoor } from "@/components/aervana/Indoor";
import { Transport } from "@/components/aervana/Transport";
import { Impact } from "@/components/aervana/Impact";
import { Assistant } from "@/components/aervana/Assistant";
import { Footer } from "@/components/aervana/Footer";
import { CITIES, DEFAULT_CITY_ID, findCity, type City } from "@/lib/sample-data";
import { useRevealAll } from "@/hooks/use-reveal";

const TITLE = "AERVANA — AI urban air quality assistant";
const DESCRIPTION =
  "Understand the air you breathe, protect your family, plan cleaner days and make sustainable choices with AERVANA.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
  }),
  component: Index,
});

function Index() {
  const [city, setCity] = useState<City>(() => findCity(DEFAULT_CITY_ID));
  useRevealAll();

  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <Hero city={city} />
        <Intelligence city={city} onCity={setCity} cities={CITIES} />
        <PollutionMap cities={CITIES} city={city} onCity={setCity} />
        <Learn />
        <Planner city={city} />
        <Indoor city={city} />
        <Transport />
        <Impact />
        <Assistant city={city} />
      </main>
      <Footer />
    </div>
  );
}
