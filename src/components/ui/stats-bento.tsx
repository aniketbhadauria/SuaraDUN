import { SegmentedStatStrip } from "@/components/ui/segmented-stat-strip";
import { MACHAP, MACHAP_ADUAN_MONTHLY, fmt } from "@/data.js";
import { cn } from "cn";
import { CheckCircle2, Flame, Heart, Megaphone, Star } from "lucide-react";

export type StatsBentoProps = {
  className?: string;
};

const aduanBars = MACHAP_ADUAN_MONTHLY.map((m) => m.aduan);
const maxAduan = Math.max(...aduanBars, 1);

export function StatsBento({ className }: StatsBentoProps) {
  const tiles = [
    { label: "Aduan 2024", value: fmt(MACHAP.aduan2024), icon: Megaphone },
    { label: "% Selesai", value: `${MACHAP.pctSelesai}%`, icon: CheckCircle2 },
    { label: "Projek Aktif", value: String(MACHAP.projekAktif), icon: Star },
    { label: "Penerima Bantuan", value: fmt(MACHAP.penerimaBantuan), icon: Heart },
  ];

  return (
    <section
      className={cn("stats-bento w-full", className)}
      aria-label="Petunjuk utama DUN"
    >
      <div
        className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4 md:grid-rows-1"
        aria-label="Ringkasan kawasan"
      >
        <div
          className="relative flex min-h-0 flex-col justify-center gap-1.5 bg-primary p-3.5 md:p-4"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(45deg,#808080_0px_1px,transparent_1px_8px)] opacity-25 mask-[radial-gradient(ellipse_70%_45%_at_100%_0%,#000_70%,transparent_110%)]"
            aria-hidden
          />
          <div className="relative">
            <span className="mb-1 inline-block rounded-full bg-primary-foreground/10 px-2 py-px text-[8px] font-semibold tracking-widest text-primary-foreground/70 uppercase">
              {MACHAP.dun}
            </span>
            <h3 className="font-[family-name:var(--font-heading)] text-2xl leading-none tracking-tighter text-primary-foreground md:text-[1.75rem]">
              {fmt(MACHAP.pengundi)}
            </h3>
            <p className="mt-0.5 text-[11px] font-medium text-primary-foreground/80">Pengundi DUN</p>
          </div>
          <p className="relative line-clamp-2 text-[10px] leading-snug text-primary-foreground/55 md:line-clamp-1">
            Ringkasan pengundi berdaftar dan aktiviti khidmat untuk kawasan {MACHAP.dun} · {MACHAP.parlimen}.
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 bg-muted p-3.5 md:p-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              Sokongan BN
            </p>
            <p className="font-[family-name:var(--font-heading)] text-2xl leading-tight text-foreground md:text-[1.65rem]">
              {MACHAP.sokonganBn}%
            </p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">Trend aduan bulanan 2024</p>
          </div>
          <div className="flex h-7 shrink-0 items-end gap-0.5" aria-hidden>
            {aduanBars.map((n, i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-gradient-to-t from-[#010066] to-[#cc0001]"
                style={{ height: `${Math.round((n / maxAduan) * 100)}%`, minHeight: "12%" }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center bg-card px-3 py-2.5 text-center md:py-3">
          <Flame className="mx-auto mb-0.5 size-4 text-[#cc0001]" aria-hidden />
          <p className="font-[family-name:var(--font-heading)] text-xl leading-none text-foreground">{MACHAP.hotspot}</p>
          <p className="mt-0.5 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">Hotspot</p>
        </div>

        <div className="flex items-center gap-2 bg-muted p-3.5 md:px-3 md:py-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background text-sm font-semibold text-foreground shadow-sm">
            ★
          </div>
          <div className="min-w-0">
            <p className="font-[family-name:var(--font-heading)] text-xs leading-tight text-foreground md:text-sm">
              {MACHAP.programAktif} program aktif
            </p>
            <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">Komuniti & khidmat DUN</p>
          </div>
        </div>
      </div>

      <SegmentedStatStrip
        className="mt-2.5 md:mt-3"
        aria-label="Ringkasan prestasi"
        items={tiles}
      />
    </section>
  );
}

export default StatsBento;
