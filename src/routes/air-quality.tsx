import { createFileRoute } from "@tanstack/react-router";
import cityHazeImg from "@/assets/city-haze.jpg";
import { PageHeader } from "@/components/aervana/PageHeader";
import { Intelligence } from "@/components/aervana/Intelligence";
import { PollutionMap } from "@/components/aervana/PollutionMap";
import { Learn } from "@/components/aervana/Learn";
import { useCity } from "@/lib/city-context";
import { CITIES } from "@/lib/sample-data";

const TITLE = "Air Quality — AERVANA";
const DESCRIPTION =
  "Inspect city AQI, PM2.5, PM10, NO₂, SO₂, CO and O₃ readings, explore the interactive pollution map and follow hourly and weekly air trends.";

export const Route = createFileRoute("/air-quality")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/air-quality" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "/air-quality" }],
  }),
  component: AirQualityPage,
});

function AirQualityPage() {
  const { city, setCity } = useCity();

  return (
    <>
      <PageHeader
        eyebrow="Air quality intelligence"
        title={
          <>
            Every pollutant,
            <br />
            in <span className="text-mint">plain sight.</span>
          </>
        }
        lede="Search cities, read all six key pollutants against WHO guidelines, explore the interactive map and understand what fine particles mean for your lungs."
        image={cityHazeImg}
        imageAlt="City skyline seen through morning atmospheric haze"
        badgeLabel="Sample data · not live"
      />
      <Intelligence city={city} onCity={setCity} cities={CITIES} />
      <PollutionMap cities={CITIES} city={city} onCity={setCity} />
      <Learn />
    </>
  );
}