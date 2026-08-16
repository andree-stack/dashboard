import { cn } from "@/lib/utils";

type Tone = "good" | "warn" | "crit" | "neutral";

const toneClasses: Record<Tone, string> = {
  good: "bg-good-bg text-good-ink",
  warn: "bg-warn-bg text-warn-ink",
  crit: "bg-crit-bg text-crit-ink",
  neutral: "bg-surface-alt text-ink-2",
};

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
