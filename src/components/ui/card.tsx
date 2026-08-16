import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface p-5",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  title,
  kind,
  desc,
}: {
  title: string;
  kind?: string;
  desc?: string;
}) {
  return (
    <div className="mb-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-[15px] font-semibold text-ink-1">{title}</h3>
        {kind && (
          <span className="text-[10.5px] font-bold uppercase tracking-wide text-ink-3">
            {kind}
          </span>
        )}
      </div>
      {desc && <p className="mt-0.5 text-[12.5px] text-ink-2">{desc}</p>}
    </div>
  );
}

export function CardFootnote({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-[11.5px] text-ink-3">{children}</p>;
}
