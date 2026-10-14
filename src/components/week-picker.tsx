"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { WEEKS, type WeekKey } from "@/lib/weekly-data";
import { cn } from "@/lib/utils";

/** Số dòng hiện sẵn không cần scroll trong picker tuần (~36px/dòng). */
const PICKER_VISIBLE_ROWS = 5;
const PICKER_ROW_HEIGHT = 36;

/** Dropdown chọn tuần dạng tuỳ biến — chỉ hiện ~5 tuần gần nhất, scroll để thấy các tuần xa hơn.
 * Không tự vẽ label — dùng chung layout/caption với các filter khác ở component gọi nó, để cả
 * hàng filter thẳng hàng và cùng format. */
export function WeekPicker({
  label,
  value,
  onChange,
  excludeWeek,
}: {
  label: string;
  value: WeekKey | null;
  onChange: (w: WeekKey) => void;
  excludeWeek?: WeekKey | null;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const options = [...WEEKS].reverse().filter((w) => w.key !== excludeWeek);
  const selected = WEEKS.find((w) => w.key === value) ?? null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-surface px-3.5 text-[12.5px] font-semibold text-ink-1 outline-none focus:border-accent"
      >
        {selected ? selected.label : "—"}
        {selected?.isPartial && (
          <span className="rounded-full bg-warn-bg px-1.5 py-0.5 text-[10px] font-bold text-warn-ink">MTD</span>
        )}
        <ChevronDown size={14} className="text-ink-3" />
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-1 w-56 overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
          <div className="overflow-y-auto py-1" style={{ maxHeight: PICKER_VISIBLE_ROWS * PICKER_ROW_HEIGHT }}>
            {options.map((w) => (
              <button
                key={w.key}
                type="button"
                onClick={() => {
                  onChange(w.key);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between px-3 py-2 text-left text-[12.5px] hover:bg-surface-alt",
                  w.key === value ? "bg-accent-soft font-bold text-accent-ink" : "text-ink-1"
                )}
                style={{ height: PICKER_ROW_HEIGHT }}
              >
                {w.label}
                {w.isPartial && <span className="text-[10px] text-warn-ink">MTD</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
