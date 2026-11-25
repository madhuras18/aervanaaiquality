import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { to: "/", label: "Home" },
  { to: "/air-quality", label: "Air Quality" },
  { to: "/smart-living", label: "Smart Living" },
  { to: "/family-care", label: "Family Care" },
  { to: "/my-impact", label: "My Impact" },
  { to: "/assistant", label: "AI Assistant" },
] as const;

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("group flex items-center gap-2.5", className)} aria-label="AERVANA home">
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
        <circle cx="16" cy="16" r="15" fill="none" stroke="currentColor" strokeOpacity="0.35" />
        <path d="M6 19c4-6 8-6 10-3s6 3 10-3" fill="none" stroke="var(--mint)" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M6 14c4-6 8-6 10-3s6 3 10-3" fill="none" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      <span className="font-display text-[1.05rem] font-semibold tracking-[0.32em]">AERVANA</span>
    </Link>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "surface-forest fixed inset-x-0 top-0 z-[1000] transition-all duration-500",
        scrolled || open ? "border-b bg-background/90 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="shell flex h-16 items-center justify-between md:h-20">
        <Logo />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: true }}
              activeProps={{ className: "border-b border-primary pb-0.5 text-sm font-medium text-primary" }}
              inactiveProps={{ className: "link-draw pb-0.5 text-sm text-foreground/80 hover:text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="shell h-[calc(100dvh-4rem)] overflow-y-auto pb-10 pt-6 lg:hidden">
          <nav className="flex flex-col" aria-label="Mobile">
            {NAV_ITEMS.map((item, i) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: true }}
                activeProps={{ className: "flex items-baseline gap-4 border-b py-4 font-display text-3xl tracking-tight text-primary animate-rise" }}
                inactiveProps={{ className: "flex items-baseline gap-4 border-b py-4 font-display text-3xl tracking-tight text-foreground/85 animate-rise" }}
                onClick={() => setOpen(false)}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className="eyebrow text-primary">0{i + 1}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
