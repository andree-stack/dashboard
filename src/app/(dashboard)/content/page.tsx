"use client";

import { FolderClock } from "lucide-react";
import { usePreferences } from "@/components/preferences-context";

export default function ContentPage() {
  const { t } = usePreferences();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-ink-1">{t("Content & Chiến dịch")}</h1>
        <p className="text-[13px] text-ink-2">{t("Để trống — bổ sung sau khi có yêu cầu cụ thể.")}</p>
      </div>

      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-surface-alt px-6 py-16 text-center">
        <FolderClock className="text-ink-3" size={28} />
        <p className="text-[13.5px] font-semibold text-ink-1">
          {t("Chưa xây dựng ở phiên bản này")}
        </p>
        <p className="max-w-md text-[12.5px] text-ink-2">
          {t("Cột")} <code className="rounded bg-surface px-1.5 py-0.5">Content Type</code>{" "}
          {t("ở 2 sheet TikTok Shop detail (xem tab Affiliate & Creator) đã sẵn sàng dùng ngay khi cần mở rộng. Nếu cần thêm nhịp độ đăng bài hằng ngày, nối lại sheet")}{" "}
          <code className="rounded bg-surface px-1.5 py-0.5">VN Content Volume&apos;26</code>{" "}
          {t("(hiện tạm gác).")}
        </p>
      </div>
    </div>
  );
}
