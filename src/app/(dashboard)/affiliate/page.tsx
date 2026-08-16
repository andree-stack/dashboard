import { Card, CardHeader, CardFootnote } from "@/components/ui/card";
import {
  TopCreatorsSection,
  CategorySection,
  TrafficChannelSection,
  GmvSourceSection,
  ContentTypeSection,
  CampaignTypeSection,
  OrderStatusSection,
} from "@/components/charts/affiliate-client";

export default function AffiliatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-ink-1">Affiliate &amp; Creator</h1>
        <p className="text-[13px] text-ink-2">
          Hiệu suất creator/affiliate ở cấp giao dịch — nguồn: 5 sheet chi tiết (Shopee,
          Lazada, TikTok Shop × PC/MCC). Số liệu là tổng luỹ kế toàn bộ dữ liệu hiện có.
        </p>
      </div>

      <Card>
        <CardHeader
          title="Top Creator / Affiliate theo GMV"
          kind="Bar ngang"
          desc="Top 6, đổi theo bộ lọc Platform."
        />
        <TopCreatorsSection />
        <CardFootnote>
          Nguồn: group theo Affiliate Name (Shopee) / Creator Username (TikTok Shop).
        </CardFootnote>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader title="GMV theo Category sản phẩm" kind="Bar" desc="Shopee — cột L1 Global Category." />
          <CategorySection />
          <CardFootnote>Nguồn: VN Shopee PC&apos;26 + MCC&apos;26.</CardFootnote>
        </Card>
        <Card>
          <CardHeader title="GMV theo kênh Traffic" kind="Bar" desc="Shopee — cột Channel." />
          <TrafficChannelSection />
          <CardFootnote>Nguồn: VN Shopee PC&apos;26 + MCC&apos;26.</CardFootnote>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="GMV theo nguồn Creator (GMV Source)"
          kind="Stacked bar 100%"
          desc="TikTok Shop — Seller Creator / Affiliate Creator / MCN, theo BU."
        />
        <GmvSourceSection />
        <CardFootnote>Nguồn: (Updated) VN TTS PC&apos;26 + MCC&apos;26 — cột GMV Source.</CardFootnote>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader title="GMV theo Content Type" kind="Bar" desc="TikTok Shop MCC." />
          <ContentTypeSection />
          <CardFootnote>Nguồn: (Updated) VN TTS MCC&apos;26 — cột Content Type.</CardFootnote>
        </Card>
        <Card>
          <CardHeader
            title="GMV theo Loại chiến dịch"
            kind="Grouped bar"
            desc="Shopee — Mở rộng (Open) vs. Mục tiêu (Target)."
          />
          <CampaignTypeSection />
          <CardFootnote>Nguồn: VN Shopee PC&apos;26 + MCC&apos;26 — cột Campaign Type.</CardFootnote>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Phễu trạng thái đơn hàng"
          kind="Bar xếp hạng"
          desc="TikTok Shop MCC."
        />
        <OrderStatusSection />
        <CardFootnote>Nguồn: (Updated) VN TTS MCC&apos;26 — cột Order Status.</CardFootnote>
      </Card>
    </div>
  );
}
