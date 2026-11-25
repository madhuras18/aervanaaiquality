import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { aqiBand } from "@/lib/air";
import { useCity } from "@/lib/city-context";
import { cn } from "@/lib/utils";
import { SampleBadge } from "./SampleBadge";

type PageHeaderProps = {
  eyebrow: string;
  title: React.ReactNode;
  lede: string;
  image: string;
  imageAlt: string;
  showCity?: boolean;
  badgeLabel?: string;
};

/** Editorial dark-forest header shared by the inner pages, with back-to-home navigation. */
export function PageHeader({
  eyebrow,
  title,
  lede,
  image,
  imageAlt,
  showCity = true,
  badgeLabel,
}: PageHeaderProps) {
  const { city } = useCity();
  const band = aqiBand(city.aqi);

  return (
    <section className="surface-forest surface-deep grain relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      <img
        src={image}
        alt={imageAlt}
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover opacity-55 animate-slow-zoom"
      />
      <div className="veil-hero absolute inset-0" aria-hidden />

      <div className="shell relative">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/"
            className="eyebrow inline-flex items-center gap-2 text-foreground/75 transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Back to home
          </Link>
          {badgeLabel && <SampleBadge label={badgeLabel} />}
        </div>

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="eyebrow text-sage animate-rise" style={{ animationDelay: "120ms" }}>
              {eyebrow}
            </p>
            <h1 className="display-lg mt-5 animate-rise" style={{ animationDelay: "220ms" }}>
              {title}
            </h1>
            <p
              className="lede mt-6 max-w-2xl text-foreground/80 animate-rise"
              style={{ animationDelay: "340ms" }}
            >
              {lede}
            </p>
          </div>

          {showCity && (
            <div
              className="border-t pt-5 md:col-span-4 md:border-t-0 md:border-l md:pl-8 md:pt-0 animate-rise"
              style={{ animationDelay: "420ms" }}
            >
              <p className="eyebrow text-muted-foreground">Selected city · sample</p>
              <div className="mt-2 flex items-baseline justify-between gap-4">
                <div>
                  <p className="font-display text-2xl tracking-tight">{city.name}</p>
                  <p className="text-xs text-muted-foreground">{city.country}</p>
                </div>
                <p className="numeral text-5xl leading-none">{city.aqi}</p>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-xs">
                <span className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full", `bg-${band.token}`)} aria-hidden />
                  {band.label}
                </span>
                <Link to="/air-quality" className="link-draw text-primary">
                  Change city
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}