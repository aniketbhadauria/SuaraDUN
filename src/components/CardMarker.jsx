import { cn } from "cn";

/** 2×2 dot grid — reference card header accent */
export function CardMarker({ className, variant = "default" }) {
  return (
    <span className={cn("card-marker", `is-${variant}`, className)} aria-hidden>
      <span /><span /><span /><span />
    </span>
  );
}
