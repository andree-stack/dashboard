import { Card, CardHeader, CardFootnote } from "@/components/ui/card";
import { PayoutSection, RoasSection, OperationsSummary } from "@/components/charts/operations-client";

export default function OperationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-ink-1">Vận hành: Payout &amp; ROAS</h1>
        <p className="text-[13px] text-ink-2">
          Hiệu quả chi hoa hồng theo kênh — nguồn: 5 sheet chi tiết giao dịch, group theo tháng
          (Tháng 4–8/2026). Đổi <b>Kỳ báo cáo</b> ở thanh lọc phía trên để xem theo từng tháng.
        </p>
      </div>

      <OperationsSummary />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader title="Payout theo kênh" kind="Bar" desc="Cập nhật theo tháng đang chọn." />
          <PayoutSection />
          <CardFootnote>
            Nguồn: Σ commission/spend theo đơn hàng — Shopee: &quot;Order Brand Commission to
            Affiliate&quot;; TikTok Shop: Commission + Shop Ads + creator bonus; Lazada: &quot;Est.
            Spend&quot;.
          </CardFootnote>
        </Card>
        <Card>
          <CardHeader
            title="ROAS &amp; Avg Commission % theo kênh"
            kind="Bar"
            desc="Không dùng dual-axis — Avg Comm % ghép nhãn trên cùng bar."
          />
          <RoasSection />
          <CardFootnote>
            TikTok Shop PC có ít đơn đã settle ở tháng đầu (T5, T8) nên ROAS bị đẩy lên rất cao —
            đây là độ trễ ghi nhận hoa hồng, không phải hiệu quả thật.
          </CardFootnote>
        </Card>
      </div>

      <Card className="border-dashed bg-surface-alt">
        <CardHeader
          title="Payout & ROAS theo ngày trong tháng"
          kind="Line chart · chưa build"
          desc="Cần group dữ liệu giao dịch theo ngày thay vì theo tháng — chưa làm ở bản này."
        />
        <p className="text-[12.5px] text-ink-2">
          5 sheet chi tiết có cột ngày giờ đặt đơn (Order Time/Time Created) nên hoàn toàn có thể
          group theo ngày khi cần, tương tự cách đã group theo tháng ở trên.
        </p>
      </Card>
    </div>
  );
}
