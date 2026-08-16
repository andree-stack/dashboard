import { Card, CardHeader, CardFootnote } from "@/components/ui/card";
import { PayoutSection, RoasSection, OperationsSummary } from "@/components/charts/operations-client";

export default function OperationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-ink-1">Vận hành: Payout &amp; ROAS</h1>
        <p className="text-[13px] text-ink-2">
          Hiệu quả chi hoa hồng theo kênh — nguồn duy nhất: VN RunRate&apos;26 (khối daily
          Gross GMV / Payout / Avg Comm / ROAS). Tháng 4/2026.
        </p>
      </div>

      <OperationsSummary />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader title="Payout theo kênh" kind="Bar" desc="Tháng 4/2026." />
          <PayoutSection />
          <CardFootnote>Nguồn: VN RunRate&apos;26 — dòng &quot;Payout&quot;, cột Total.</CardFootnote>
        </Card>
        <Card>
          <CardHeader
            title="ROAS &amp; Avg Commission % theo kênh"
            kind="Bar"
            desc="Không dùng dual-axis — Avg Comm % ghép nhãn trên cùng bar."
          />
          <RoasSection />
          <CardFootnote>Nguồn: VN RunRate&apos;26 — dòng &quot;ROAS&quot; &amp; &quot;Avg Comm&quot;.</CardFootnote>
        </Card>
      </div>

      <Card className="border-dashed bg-surface-alt">
        <CardHeader
          title="Payout & ROAS theo ngày trong tháng"
          kind="Line chart · chưa build"
          desc="Nguồn: VN RunRate'26 — khối daily có đủ 30 cột/tháng (1 cột/ngày) cho mỗi kênh."
        />
        <p className="text-[12.5px] text-ink-2">
          Khi build thật cần xử lý các ô <code className="rounded bg-surface px-1.5 py-0.5">#DIV/0!</code> ở
          kênh PC chưa launch trước khi vẽ line theo ngày.
        </p>
      </Card>
    </div>
  );
}
