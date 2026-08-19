import { Card, CardHeader, CardFootnote } from "@/components/ui/card";
import { TrendChart } from "@/components/charts/trend-chart";
import {
  KpiRowClient,
  PlatformBuSection,
  TargetAchievementSection,
  MonthlyContentBreakdownSection,
  MonthlyChannelTable,
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
          desc="1 trục — VND. Nét đứt = Target, nét liền = Thực tế, điểm T8 để rỗng vì là số MTD."
        />
        <TrendChart />
        <CardFootnote>
          Nguồn: VN RunRate&apos;26 — mục &quot;GMV TARGET 2026&quot; &amp; &quot;GMV
          ACTUALISATION 2026&quot;.
        </CardFootnote>
      </Card>

      <div className="grid items-start gap-4 md:grid-cols-2">
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

      <Card>
        <CardHeader
          title="GMV theo Content Type / Kênh traffic"
          kind="Bar list"
          desc="Tháng đang chọn, so với tháng trước. Shopee: Kênh traffic (Facebook/Websites/Shopee Video/Shopee Live/Khác). TikTok Shop: Content Type (Video/External Traffic/Showcase/Livestream/Khác)."
        />
        <MonthlyContentBreakdownSection />
        <CardFootnote>
          Lazada không có cột tương đương trong sheet nguồn nên không hiện ở đây. Shopee gộp ~20
          giá trị Channel gốc về 4 nhóm chính + &quot;Khác&quot; để nhất quán qua các tháng — di
          chuột vào &quot;Khác&quot; để xem chi tiết từng kênh gốc bên trong.
        </CardFootnote>
      </Card>

      <Card>
        <CardHeader
          title="So sánh chi tiết theo kênh"
          kind="Table"
          desc="Luôn hiện đủ 6 tổ hợp Platform × BU khớp bộ lọc — kênh chưa có dữ liệu tháng này hiện “—”."
        />
        <MonthlyChannelTable />
        <CardFootnote>
          So sánh với tháng liền trước (MoM) — không có &quot;so cùng tháng năm trước&quot; vì dữ
          liệu nguồn chỉ có 1 năm. Lazada không có cột Order Status/Refund nên Hoàn thành/Refund
          luôn để trống cho kênh đó; Lazada PC hiện chưa vận hành nên luôn “—”. ROAS = GMV ÷ Payout
          của đúng tháng đang xem, không phải trung bình.
        </CardFootnote>
      </Card>
    </div>
  );
}
