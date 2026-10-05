import { Progress } from "@/components/ui/progress";
import { cn } from "cn";

/**
 * Progress block matching reference card UI: label row + thick rounded bar.
 * @param {"default" | "success" | "warn"} tone
 */
export function LabeledProgress({
  label = "Kemajuan",
  value = 0,
  tone = "default",
  className,
  id,
}) {
  const pct = Math.min(100, Math.max(0, value ?? 0));
  return (
    <div className={cn("labeled-progress", `is-${tone}`, className)} id={id}>
      <div className="labeled-progress-head">
        <span>{label}</span>
        <b>{pct}%</b>
      </div>
      <Progress
        value={pct}
        aria-label={`${label} ${pct}%`}
        className="labeled-progress-bar"
      />
    </div>
  );
}
