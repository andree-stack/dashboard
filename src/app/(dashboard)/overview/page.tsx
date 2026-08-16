import { Card, CardHeader, CardFootnote } from "@/components/ui/card";
import { TrendChart } from "@/components/charts/trend-chart";
import {
  KpiRowClient,
  PlatformBuSection,
  TargetAchievementSection,
} from "@/components/charts/overview-client";

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-ink-1">Tổng quan</h1>
        <p className="text-[13px] text-ink-2">
          GMV thực tế vs. target, sức khoẻ toàn kênh — nguồn: VN RunRate&apos;26. Đổi{" "}
          <b>Kỳ báo cáo</b> ở thanh lọc phía trên để xem theo từng tháng.
        </p>
      </div>

      <KpiRowClient />

      <Card>
        <CardHeader
          title="GMV Thực tế vs. Target theo tháng — FY2026"
          kind="Line chart"
          desc="1 trục — VND. Target nét đứt cả năm; Thực tế nét liền, điểm T8 để rỗng vì là số MTD. Đường chấm xanh đánh dấu tháng đang chọn."
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
            desc="Cập nhật theo tháng đang chọn."
          />
          <PlatformBuSection />
          <CardFootnote>
            Nguồn: VN RunRate&apos;26 — &quot;GMV ACTUALISATION 2026&quot;, theo từng kênh mỗi tháng.
          </CardFootnote>
        </Card>
        <Card>
          <CardHeader
            title="% Đạt Target theo kênh"
            kind="Bullet / progress"
            desc="Cập nhật theo tháng đang chọn."
          />
          <TargetAchievementSection />
          <CardFootnote>
            Tính từ VN RunRate&apos;26 — Actual ÷ Target theo từng kênh mỗi tháng.
          </CardFootnote>
        </Card>
      </div>
    </div>
  );
}
