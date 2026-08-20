"use client";

import { Card, CardHeader, CardFootnote } from "@/components/ui/card";
import { usePreferences } from "@/components/preferences-context";
import { PayoutSection, RoasSection, OperationsSummary, OrderStatusSection } from "@/components/charts/operations-client";

export default function OperationsPage() {
  const { t } = usePreferences();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-ink-1">{t("Vận hành: Payout & ROAS")}</h1>
        <p className="text-[13px] text-ink-2">
          {t("Hiệu quả chi hoa hồng theo kênh — nguồn: 5 sheet chi tiết giao dịch, group theo tháng (Tháng 4–8/2026).")}{" "}
          {t("Đổi")} <b>{t("Kỳ báo cáo")}</b> {t("ở thanh lọc phía trên để xem theo từng tháng.")}
        </p>
      </div>

      <OperationsSummary />

      <div className="grid items-start gap-4 md:grid-cols-2">
        <Card>
          <CardHeader title={t("Payout theo kênh")} kind={t("Bar")} desc={t("Cập nhật theo tháng đang chọn.")} />
          <PayoutSection />
          <CardFootnote>
            {t("Nguồn: Σ commission/spend theo đơn hàng — Shopee: \"Order Brand Commission to Affiliate\"; TikTok Shop: Commission + Shop Ads + creator bonus; Lazada: \"Est. Spend\".")}
          </CardFootnote>
        </Card>
        <Card>
          <CardHeader
            title={t("ROAS & Avg Commission % theo kênh")}
            kind={t("Bar")}
            desc={t("Không dùng dual-axis — Avg Comm % ghép nhãn trên cùng bar.")}
          />
          <RoasSection />
          <CardFootnote>
            {t("TikTok Shop PC có ít đơn đã settle ở tháng đầu (T5, T8) nên ROAS bị đẩy lên rất cao — đây là độ trễ ghi nhận hoa hồng, không phải hiệu quả thật.")}
          </CardFootnote>
        </Card>
      </div>

      <Card>
        <CardHeader
          title={t("Phễu trạng thái đơn hàng")}
          kind={t("Bar xếp hạng")}
          desc={t("Shopee + TikTok Shop, tháng đang chọn — mỗi platform 1 bộ trạng thái riêng.")}
        />
        <OrderStatusSection />
        <CardFootnote>
          {t("Lazada không có cột Order Status nên không hiện ở đây. Shopee: GMV thật = đơn \"Hoàn thành\". TikTok Shop: GMV thật = Settled + Completed.")}
        </CardFootnote>
      </Card>

      <Card className="border-dashed bg-surface-alt">
        <CardHeader
          title={t("Payout & ROAS theo ngày trong tháng")}
          kind={t("Line chart · chưa build")}
          desc={t("Cần group dữ liệu giao dịch theo ngày thay vì theo tháng — chưa làm ở bản này.")}
        />
        <p className="text-[12.5px] text-ink-2">
          {t("5 sheet chi tiết có cột ngày giờ đặt đơn (Order Time/Time Created) nên hoàn toàn có thể group theo ngày khi cần, tương tự cách đã group theo tháng ở trên.")}
        </p>
      </Card>
    </div>
  );
}
