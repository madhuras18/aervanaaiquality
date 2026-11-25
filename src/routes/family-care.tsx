import { createFileRoute } from "@tanstack/react-router";
import familyWindowImg from "@/assets/family-window.jpg";
import { PageHeader } from "@/components/aervana/PageHeader";
import { FamilyGuidance, ProtectionTips } from "@/components/aervana/FamilySections";
import { Indoor } from "@/components/aervana/Indoor";
import { useCity } from "@/lib/city-context";

const TITLE = "Family Care — AERVANA";
const DESCRIPTION =
  "Protect children, older adults and sensitive lungs with tailored outdoor thresholds, practical haze-day shields and room-by-room indoor air habits.";

export const Route = createFileRoute("/family-care")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/family-care" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "/family-care" }],
  }),
  component: FamilyCarePage,
});

function FamilyCarePage() {
  const { city } = useCity();

  return (
    <>
      <PageHeader
        eyebrow="Family care"
        title={
          <>
            Protect the lungs
            <br />
            you <span className="text-mint">love most.</span>
          </>
        }
        lede="Clear, calm guidance for children, older adults and sensitive households — paired with a practical indoor air habit checklist."
        image={familyWindowImg}
        imageAlt="A grandmother and child looking through a bright living room window"
        badgeLabel="Sample data · not medical advice"
      />
      <FamilyGuidance city={city} />
      <ProtectionTips />
      <Indoor city={city} sectionIndex="03" />
    </>
  );
}