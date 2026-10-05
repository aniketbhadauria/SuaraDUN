"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type SegmentedStatItem = {
  label: string;
  value: string;
  icon: LucideIcon;
};

type SegmentedStatStripProps = {
  items: SegmentedStatItem[];
  className?: string;
  columns?: 3 | 4;
  "aria-label"?: string;
};

const columnClass: Record<3 | 4, string> = {
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-4",
};

export function SegmentedStatStrip({
  items,
  className,
  columns = 4,
  "aria-label": ariaLabel,
}: SegmentedStatStripProps) {
  return (
    <div
      className={cn(
        "grid gap-px overflow-hidden rounded-xl border border-border bg-border",
        columnClass[columns],
        className,
      )}
      role="list"
      aria-label={ariaLabel}
    >
      {items.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          role="listitem"
          className="flex flex-col justify-center bg-card p-3.5 md:p-4"
        >
          <Icon className="mb-1 size-3.5 text-muted-foreground" aria-hidden />
          <p className="font-[family-name:var(--font-heading)] text-lg leading-tight tracking-tight text-foreground md:text-xl">
            {value}
          </p>
          <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">{label}</p>
        </div>
      ))}
    </div>
  );
}

export default SegmentedStatStrip;
