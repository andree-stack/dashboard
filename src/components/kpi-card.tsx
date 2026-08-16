import { Badge } from "@/components/ui/badge";

export function KpiCard({
  label,
  value,
  foot,
  tone,
  toneLabel,
}: {
  label: string;
  value: string;
  foot?: string;
  tone?: "good" | "warn" | "crit";
  toneLabel?: string;
}) {
  return (
    <div className="flex min-h-[116px] flex-col justify-between bg-surface p-4">
      <div className="text-[11px] font-bold uppercase tracking-wide text-ink-3">
        {label}
      </div>
      <div className="space-y-1">
        <div className="tabular text-[22px] font-bold text-ink-1">{value}</div>
        {tone && toneLabel && <Badge tone={tone}>{toneLabel}</Badge>}
      </div>
      {foot && <div className="text-[11px] text-ink-3">{foot}</div>}
    </div>
  );
}

export function KpiRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
      {children}
    </div>
  );
}
