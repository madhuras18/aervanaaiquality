import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/aervana/Hero";
import { HomePreviews } from "@/components/aervana/HomePreviews";
import { useCity } from "@/lib/city-context";

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
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  const { city } = useCity();

  return (
    <>
      <Hero city={city} />
      <HomePreviews city={city} />
    </>
  );
}
