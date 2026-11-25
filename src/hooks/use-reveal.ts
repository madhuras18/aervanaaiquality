import { useEffect } from "react";

/** Adds `.is-visible` to every `.reveal` element as it scrolls into view, including lazy-mounted route children. */
export function useRevealAll(key?: string) {
  useEffect(() => {
    const seen = new WeakSet<Element>();

    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px -2% 0px" },
    );

    const scan = () => {
      const els = document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)");
      els.forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        io.observe(el);
      });
    };

    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, [key]);
}
