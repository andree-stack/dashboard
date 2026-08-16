"use client";

import { useMemo } from "react";
import { useFilters } from "@/components/filter-context";
import { GroupedBuBar } from "@/components/charts/grouped-bar";
import { BarList } from "@/components/charts/bar-list";
import { PLATFORMS, platformBuBreakdown, targetAchievementByChannel } from "@/lib/data";
import { formatPercent } from "@/lib/utils";

export function PlatformBuSection() {
  const { platform } = useFilters();

  const data = useMemo(
    () =>
      PLATFORMS.map((p) => ({
        platform: p,
        PC: platformBuBreakdown.find((d) => d.platform === p && d.bu === "PC")?.gmv ?? 0,
        MCC: platformBuBreakdown.find((d) => d.platform === p && d.bu === "MCC")?.gmv ?? 0,
      })),
    []
  );

  return <GroupedBuBar data={data} dimPlatform={platform} />;
}

export function TargetAchievementSection() {
  const { platform } = useFilters();

  const rows = useMemo(
    () =>
      targetAchievementByChannel
        .filter((r) => platform === "Tất cả" || r.platform === platform)
        .map((r) => ({
          name: r.channel,
          value: r.pct,
          color:
            r.pct >= 95
              ? "var(--color-good)"
              : r.pct >= 80
              ? "var(--color-warn)"
              : "var(--color-crit)",
        })),
    [platform]
  );

  if (rows.length === 0) {
    return (
      <p className="py-8 text-center text-[12.5px] text-ink-3">
        Không có kênh nào khớp bộ lọc hiện tại.
      </p>
    );
  }

  return <BarList data={rows} valueFormatter={(v) => formatPercent(v, 0)} />;
}
