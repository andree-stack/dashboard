"use client";

import { Card, CardHeader, CardFootnote } from "@/components/ui/card";
import { TrendChart } from "@/components/charts/trend-chart";
import { usePreferences } from "@/components/preferences-context";
import {
  KpiRowClient,
  PlatformBuSection,
  TargetAchievementSection,
  MonthlyContentBreakdownSection,
  MonthlyChannelTable,
} from "@/components/charts/overview-client";

export default function OverviewPage() {
  const { t } = usePreferences();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-ink-1">{t("Tổng quan")}</h1>
        <p className="text-[13px] text-ink-2">
          {t("GMV thực tế vs. target, sức khoẻ toàn kênh — nguồn: VN RunRate'26. Đổi Kỳ báo cáo ở thanh lọc phía trên để xem theo từng tháng.")}
        </p>
      </div>

      <KpiRowClient />

      <Card>
        <CardHeader
          title={t("GMV Thực tế vs. Target theo tháng — FY2026")}
          kind={t("Line chart")}
          desc={t("1 trục — VND. Nét đứt = Target, nét liền = Thực tế, điểm T8 để rỗng vì là số MTD.")}
        />
        <TrendChart />
        <CardFootnote>
          {t("Nguồn: VN RunRate'26 — mục \"GMV TARGET 2026\" & \"GMV ACTUALISATION 2026\".")}
        </CardFootnote>
      </Card>

      <div className="grid items-start gap-4 md:grid-cols-2">
        <Card>
          <CardHeader
            title={t("GMV theo Platform × BU")}
            kind={t("Grouped bar")}
            desc={t("Cập nhật theo tháng đang chọn.")}
          />
          <PlatformBuSection />
          <CardFootnote>
            {t("Nguồn: VN RunRate'26 — \"GMV ACTUALISATION 2026\", theo từng kênh mỗi tháng.")}
          </CardFootnote>
        </Card>
        <Card>
          <CardHeader
            title={t("% Đạt Target theo kênh")}
            kind={t("Bullet / progress")}
            desc={t("Cập nhật theo tháng đang chọn.")}
          />
          <TargetAchievementSection />
          <CardFootnote>
            {t("Tính từ VN RunRate'26 — Actual ÷ Target theo từng kênh mỗi tháng.")}
          </CardFootnote>
        </Card>
      </div>

      <Card>
        <CardHeader
          title={t("GMV theo Content Type / Kênh traffic")}
          kind={t("Bar list")}
          desc={t("Tháng đang chọn, so với tháng trước. Shopee: Kênh traffic (Facebook/Websites/Shopee Video/Shopee Live/Khác). TikTok Shop: Content Type (Video/External Traffic/Showcase/Livestream/Khác).")}
        />
        <MonthlyContentBreakdownSection />
        <CardFootnote>
          {t("Lazada không có cột tương đương trong sheet nguồn nên không hiện ở đây. Shopee gộp ~20 giá trị Channel gốc về 4 nhóm chính + \"Khác\" để nhất quán qua các tháng — di chuột vào \"Khác\" để xem chi tiết từng kênh gốc bên trong.")}
        </CardFootnote>
      </Card>

      <Card>
        <CardHeader
          title={t("So sánh chi tiết theo kênh")}
          kind={t("Table")}
          desc={t("Luôn hiện đủ 6 tổ hợp Platform × BU khớp bộ lọc — kênh chưa có dữ liệu tháng này hiện \"—\".")}
        />
        <MonthlyChannelTable />
        <CardFootnote>
          {t("So sánh với tháng liền trước (MoM) — không có \"so cùng tháng năm trước\" vì dữ liệu nguồn chỉ có 1 năm. Lazada không có cột Order Status/Refund nên Hoàn thành/Refund luôn để trống cho kênh đó; Lazada PC hiện chưa vận hành nên luôn \"—\". ROAS = GMV ÷ Payout của đúng tháng đang xem, không phải trung bình.")}
        </CardFootnote>
      </Card>
    </div>
  );
}
