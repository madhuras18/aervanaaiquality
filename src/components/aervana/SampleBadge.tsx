import { cn } from "@/lib/utils";

/** Visible marker that the figures nearby are illustrative, not live measurements. */
export function SampleBadge({ className, label = "Sample data · not live" }: { className?: string; label?: string }) {
  return (
    <span
      className={cn(
        "eyebrow inline-flex items-center gap-2 border border-current/30 px-2.5 py-1 text-[0.62rem] opacity-80",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-blink" aria-hidden />
      {label}
    </span>
  );
}

export function SectionLabel({ index, children, className }: { index: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("eyebrow flex items-center gap-4 text-muted-foreground", className)}>
      <span className="text-primary">{index}</span>
      <span className="h-px w-10 bg-current opacity-40" aria-hidden />
      <span>{children}</span>
    </div>
  );
}
