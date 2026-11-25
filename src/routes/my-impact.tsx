import { createFileRoute } from "@tanstack/react-router";
import rooftopGardenImg from "@/assets/rooftop-garden.jpg";
import { PageHeader } from "@/components/aervana/PageHeader";
import { PersonalImpact } from "@/components/aervana/PersonalImpact";
import { Impact } from "@/components/aervana/Impact";

const TITLE = "My Impact — AERVANA";
const DESCRIPTION =
  "Track your weekly sustainable actions, estimate CO₂ savings with visual progress charts and explore citywide collective impact.";

export const Route = createFileRoute("/my-impact")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/my-impact" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "/my-impact" }],
  }),
  component: MyImpactPage,
});

function MyImpactPage() {
  return (
    <>
      <PageHeader
        eyebrow="My environmental impact"
        title={
          <>
            Small choices,
            <br />
            <span className="text-mint">measured clearly.</span>
          </>
        }
        lede="Record your cleaner daily habits, follow your weekly CO₂ savings curve and see what happens when a street or city moves together."
        image={rooftopGardenImg}
        imageAlt="A lush urban rooftop garden surrounded by leafy trees"
        showCity={false}
        badgeLabel="Estimated emission factors"
      />
      <PersonalImpact />
      <Impact sectionIndex="03" />
    </>
  );
}