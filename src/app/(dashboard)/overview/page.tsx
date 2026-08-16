import { Card, CardHeader, CardFootnote } from "@/components/ui/card";
import { KpiCard, KpiRow } from "@/components/kpi-card";
import { TrendChart } from "@/components/charts/trend-chart";
import {
  PlatformBuSection,
  TargetAchievementSection,
} from "@/components/charts/overview-client";
import { kpiSnapshot } from "@/lib/data";
import { formatVnd, formatPercent, statusForAchievement } from "@/lib/utils";

export default function OverviewPage() {
  const k = kpiSnapshot;
  const achTone = statusForAchievement(k.achievementPct);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-ink-1">Tổng quan</h1>
        <p className="text-[13px] text-ink-2">
          GMV thực tế vs. target, sức khoẻ toàn kênh — nguồn: VN RunRate&apos;26.
        </p>
      </div>

      <KpiRow>
        <KpiCard label="GMV toàn kênh" value={formatVnd(k.gmvActual)} foot={k.period} />
        <KpiCard label="Target GMV" value={formatVnd(k.gmvTarget)} foot={k.period} />
        <KpiCard
          label="% Đạt Target"
          value={formatPercent(k.achievementPct)}
          tone={achTone}
          toneLabel={achTone === "good" ? "đạt" : achTone === "warn" ? "gần đạt" : "rủi ro"}
        />
        <KpiCard
          label="Tăng trưởng MoM"
          value={`+${formatPercent(k.momGrowthPct)}`}
          tone="good"
          toneLabel="▲ tốt"
        />
        <KpiCard
          label="Avg Commission % (blend)"
          value={formatPercent(k.avgCommissionPct, 2)}
          foot="3 kênh MCC đang chạy"
        />
        <KpiCard label="ROAS toàn kênh (blend)" value={`${k.roasBlend.toFixed(1)}x`} foot={k.period} />
        <KpiCard
          label="Tỷ lệ đơn Hoàn thành"
          value={formatPercent(k.completionRatePct)}
          foot="ví dụ Shopee PC"
        />
        <KpiCard
          label="Tỷ lệ hoàn (Refund)"
          value={formatPercent(k.refundPct)}
          tone="good"
          toneLabel="thấp"
          foot="ví dụ Shopee PC"
        />
      </KpiRow>

      <Card>
        <CardHeader
          title="GMV Thực tế vs. Target theo tháng — FY2026"
          kind="Line chart"
          desc="1 trục — VND. Target nét đứt cả năm; Thực tế nét liền, điểm T8 để rỗng vì là số MTD."
        />
        <TrendChart />
        <CardFootnote>
          Nguồn: VN RunRate&apos;26 — mục &quot;GMV TARGET 2026&quot; &amp; &quot;GMV
          ACTUALISATION 2026&quot;.
        </CardFootnote>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader
            title="GMV theo Platform × BU"
            kind="Grouped bar"
            desc="Tháng 5/2026, thực tế."
          />
          <PlatformBuSection />
          <CardFootnote>
            Nguồn: VN RunRate&apos;26 — &quot;GMV ACTUALISATION 2026&quot;, cột T5/2026.
          </CardFootnote>
        </Card>
        <Card>
          <CardHeader
            title="% Đạt Target theo kênh"
            kind="Bullet / progress"
            desc="Tháng 4/2026 — chỉ 3 kênh MCC đang chạy."
          />
          <TargetAchievementSection />
          <CardFootnote>
            Tính từ VN RunRate&apos;26 — khối &quot;Vietnam %&quot; theo kênh.
          </CardFootnote>
        </Card>
      </div>
    </div>
  );
}
