import { createFileRoute } from "@tanstack/react-router";
import greenBoulevardImg from "@/assets/green-boulevard.jpg";
import { PageHeader } from "@/components/aervana/PageHeader";
import { OutdoorActivities, EcoRouteAndLifestyle } from "@/components/aervana/SmartLivingSections";
import { Planner } from "@/components/aervana/Planner";
import { Transport } from "@/components/aervana/Transport";
import { useCity } from "@/lib/city-context";

const TITLE = "Smart Living — AERVANA";
const DESCRIPTION =
  "Plan your daily routine around the cleanest hours, compare EcoRoutes and switch to lower-emission transport with AERVANA.";

export const Route = createFileRoute("/smart-living")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/smart-living" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "/smart-living" }],
  }),
  component: SmartLivingPage,
});

function SmartLivingPage() {
  const { city } = useCity();

  return (
    <>
      <PageHeader
        eyebrow="Smart living"
        title={
          <>
            Cleaner hours.
            <br />
            <span className="text-mint">Lighter routes.</span>
          </>
        }
        lede="Time outdoor workouts around cleaner windows, compare green-corridor EcoRoutes against main roads and see how cleaner commuting cuts emissions."
        image={greenBoulevardImg}
        imageAlt="A sunlit tree-lined boulevard with cyclists and pedestrians"
        badgeLabel="Based on sample hourly data"
      />
      <OutdoorActivities city={city} />
      <Planner city={city} sectionIndex="02" />
      <EcoRouteAndLifestyle city={city} />
      <Transport sectionIndex="04" />
    </>
  );
}