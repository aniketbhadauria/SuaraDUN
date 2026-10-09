import { useState } from "react";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar-1";
import {
  AvatarStack,
  MB_AVATAR_SRC,
  STOCK_AVATARS,
  initialsFromName,
} from "@/components/ui/avatar-stack";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tooltip as Hint } from "@/components/ui/tooltip";
import {
  ADUAN_CATEGORIES, AGE_DISTRIBUTION, ALL_ADUN, BANTUAN_PROGRAM, BANTUAN_RINGKASAN, ETHNIC_COMPOSITION,
  HOTSPOT_AREAS, MACHAP, MACHAP_PROGRAM, MACHAP_PROJEK,
  MACHAP_ADUAN_MONTHLY, PETUGAS, SUPPORT_TREND, TURNOUT_HISTORY,
  fmt, pctOf, pctTone,
} from "./data.js";
import { SegmentedStatStrip } from "@/components/ui/segmented-stat-strip";
import { StatsBento } from "@/components/ui/stats-bento";
import {
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Coins,
  FileText,
  Flag,
  TrendingUp,
  UserX,
  Users,
  Vote,
} from "lucide-react";
import { CardMarker } from "./components/CardMarker.jsx";
import { LabeledProgress } from "./components/LabeledProgress.jsx";
import { Icon } from "./icons.jsx";

const NAV = [
  { id: "pengundi", label: "Pengundi", icon: "box" },
  { id: "demografi", label: "Demografi", icon: "dna" },
  { id: "sokongan", label: "Sokongan", icon: "file" },
  { id: "aduan", label: "Aduan", icon: "megaphone" },
  { id: "hotspot", label: "Hotspot", icon: "flame" },
  { id: "projek", label: "Projek", icon: "crane" },
  { id: "bantuan", label: "Bantuan", icon: "heart" },
  { id: "program", label: "Program", icon: "building" },
  { id: "petugas", label: "Petugas", icon: "star" },
];

const TITLES = Object.fromEntries(NAV.map(({ id, label }) => [id, label]));

function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="tip">
      {label ? <div className="tip-label">{label}</div> : null}
      {payload.map((p) => (
        <div key={p.name}>
          {p.name}: <b>{fmt(p.value)}</b>
        </div>
      ))}
    </div>
  );
}

function Meter({ value, max = 100, tone = "good" }) {
  const width = `${Math.min((value / max) * 100, 100)}%`;
  return (
    <span className="meter" aria-hidden="true">
      <span style={{ width }} data-tone={tone} />
    </span>
  );
}

function Tag({ children, parti }) {
  const tone = parti === "UMNO"
    ? "border-transparent bg-[#fff4c2] text-[#6b5400]"
    : parti === "MCA"
      ? "border-transparent bg-[#ffe4e4] text-[#d01228]"
      : parti === "MIC"
        ? "border-transparent bg-[#e6e8f8] text-[#1c3480]"
        : "";
  return <Badge variant="secondary" className={tone}>{children}</Badge>;
}

function Trend({ value }) {
  const name = value === "up" ? "up" : "flat";
  const label = value === "up" ? "Meningkat" : "Stabil";
  return (
    <span className={`trend trend-${value}`} title={label}>
      <Icon name={name} size={16} />
      <span className="sr">{label}</span>
    </span>
  );
}

function KpiStrip() {
  return <StatsBento className="mb-5" />;
}

function MbBanner() {
  return (
    <section className="mb-banner mb-banner-top" aria-label="Profil YAB Menteri Besar">
      <Avatar className="mb-banner-avatar size-10 shrink-0 ring-2 ring-background md:size-14">
        <AvatarImage src={MB_AVATAR_SRC} alt="YAB Dato' Onn Hafiz bin Ghazi" className="object-[center_18%]" />
        <AvatarFallback className="bg-[#1c3480] text-[#ffcc00] text-[10px] font-bold md:text-sm">OH</AvatarFallback>
      </Avatar>
      <div className="mb-banner-copy">
        <p className="mb-banner-name">YAB Dato&apos; Onn Hafiz bin Ghazi</p>
        <p className="mb-banner-role">
          Menteri Besar Johor · {MACHAP.dun} · {MACHAP.parlimen}
        </p>
        <div className="mb-banner-tags">
          <Badge variant="secondary" className="mb-banner-badge border-transparent bg-[#fff4c2] text-[#6b5400]">MB Johor</Badge>
          <Badge variant="secondary" className="mb-banner-badge border-transparent bg-[var(--fill)] text-[var(--copy)]">{MACHAP.dun}</Badge>
          <Badge variant="secondary" className="mb-banner-badge border-transparent bg-[var(--fill)] text-[var(--copy)]">{MACHAP.parlimen}</Badge>
        </div>
      </div>
      <img src="/flag-skyline.png" alt="" className="mb-banner-art" aria-hidden="true" />
    </section>
  );
}

function RadialGauge({ pct, label, tone = "default" }) {
  return (
    <div className="gauge-wrap">
      <div className={tone === "warm" ? "gauge is-warm" : "gauge"} style={{ "--pct": pct }} aria-hidden="true">
        <span>{pct}%</span>
      </div>
      <small>{label}</small>
    </div>
  );
}

function DemografiPage({ ink, grid }) {
  const ageColors = (row) => (row.firstTime ? "#e6b800" : "#1a9e62");

  return (
    <div className="stack demografi-page">
      <KpiStrip />
      <header className="section-page-head">
        <Icon name="dna" size={22} />
        <div>
          <h2 className="section-page-title">Demografi Pengundi</h2>
          <p className="quiet">Komposisi etnik &amp; usia — {MACHAP.dun}</p>
        </div>
      </header>
      <div className="split demografi-panels">
        <section className="card demografi-panel" aria-labelledby="etnik-heading">
          <p id="etnik-heading" className="panel-kicker">Komposisi etnik</p>
          <div className="ethnic-layout">
            <div className="chart donut" role="img" aria-label="Carta komposisi etnik pengundi">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={ETHNIC_COMPOSITION}
                    dataKey="pct"
                    nameKey="name"
                    innerRadius={52}
                    outerRadius={78}
                    stroke="none"
                  >
                    {ETHNIC_COMPOSITION.map((e) => <Cell key={e.name} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v}%`, "Peratus"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="ethnic-bars">
              {ETHNIC_COMPOSITION.map((e) => (
                <li key={e.name}>
                  <div className="ethnic-bar-head">
                    <span>{e.name}</span>
                    <b>{e.pct}%</b>
                  </div>
                  <div className="ethnic-bar-track">
                    <span style={{ width: `${e.pct}%`, background: e.color }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className="card demografi-panel" aria-labelledby="usia-heading">
          <p id="usia-heading" className="panel-kicker">Taburan usia pengundi</p>
          <div className="chart">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={AGE_DISTRIBUTION} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid stroke={grid} vertical={false} />
                <XAxis dataKey="group" tick={{ fill: ink, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: ink, fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip
                  formatter={(v) => [fmt(v), "Pengundi"]}
                  labelFormatter={(l) => `Umur ${l}`}
                />
                <Bar dataKey="count" name="Pengundi" radius={[6, 6, 0, 0]}>
                  {AGE_DISTRIBUTION.map((row) => (
                    <Cell key={row.group} fill={ageColors(row)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend" aria-hidden="true">
            <span><i className="swatch swatch-first" /> Pengundi Pertama</span>
            <span><i className="swatch swatch-age" /> Lain-lain</span>
          </div>
        </section>
      </div>
    </div>
  );
}

function SokonganPage({ ink, grid }) {
  const pct = (v) => `${v}%`;

  return (
    <div className="stack sokongan-page">
      <KpiStrip />
      <header className="section-page-head">
        <Icon name="chart" size={22} />
        <div>
          <h2 className="section-page-title">Trend Sokongan DUN</h2>
          <p className="quiet">
            Keputusan PRN historik {MACHAP.dun} — BN/UMNO menang PRN15 2023
          </p>
        </div>
      </header>
      <section className="card sokongan-chart-panel" aria-label="Trend sokongan mengikut PRN">
        <div className="chart">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={SUPPORT_TREND} margin={{ left: 0, right: 16, top: 12, bottom: 8 }}>
              <CartesianGrid stroke={grid} vertical={false} />
              <XAxis dataKey="prn" tick={{ fill: ink, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                domain={[0, 100]}
                tickFormatter={pct}
                tick={{ fill: ink, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={44}
              />
              <Tooltip formatter={(v) => [`${v}%`, ""]} labelFormatter={(l) => l} />
              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                formatter={(value) => (value === "bn" ? "BN/UMNO" : "PH/PKR")}
              />
              <Line
                type="monotone"
                dataKey="bn"
                name="bn"
                stroke="#e6b800"
                strokeWidth={2.5}
                dot={{ r: 5, fill: "#e6b800", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="ph"
                name="ph"
                stroke="#d01228"
                strokeWidth={2.5}
                dot={{ r: 5, fill: "#d01228", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <SegmentedStatStrip
          className="mt-4"
          columns={3}
          aria-label="Ringkasan sokongan BN mengikut PRN"
          items={SUPPORT_TREND.map((row, i) => ({
            value: `${row.bn}%`,
            label: `${row.prn} · BN/UMNO`,
            icon: [Flag, BarChart3, TrendingUp][i] ?? Flag,
          }))}
        />
      </section>
    </div>
  );
}

const ADUAN_CAT_MAX = ADUAN_CATEGORIES[0].count;

function AduanPage({ ink, grid }) {
  return (
    <div className="stack aduan-page">
      <KpiStrip />
      <header className="section-page-head">
        <Icon name="megaphone" size={22} />
        <div>
          <h2 className="section-page-title">Aduan Rakyat</h2>
          <p className="quiet">Jan–Jun 2024 — kawasan {MACHAP.dun}</p>
        </div>
      </header>
      <div className="split demografi-panels">
        <section className="card demografi-panel" aria-labelledby="volum-aduan-heading">
          <p id="volum-aduan-heading" className="panel-kicker">Volum aduan bulanan</p>
          <div className="chart">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={MACHAP_ADUAN_MONTHLY} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid stroke={grid} vertical={false} />
                <XAxis dataKey="bln" tick={{ fill: ink, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: ink, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={36}
                />
                <Tooltip content={<Tip />} />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  formatter={(value) => (value === "selesai" ? "Selesai" : "Belum selesai")}
                />
                <Bar dataKey="selesai" name="selesai" stackId="vol" fill="#1a9e62" radius={[0, 0, 0, 0]} />
                <Bar dataKey="terbuka" name="terbuka" stackId="vol" fill="#e85d75" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="card demografi-panel" aria-labelledby="kategori-aduan-heading">
          <p id="kategori-aduan-heading" className="panel-kicker">Kategori aduan</p>
          <ul className="aduan-categories">
            {ADUAN_CATEGORIES.map((cat) => (
              <li key={cat.label}>
                <span className="aduan-cat-icon" style={{ color: cat.color }} aria-hidden="true">
                  <Icon name={cat.icon} size={20} />
                </span>
                <div className="aduan-cat-body">
                  <div className="ethnic-bar-head">
                    <span>{cat.label}</span>
                    <b style={{ color: cat.color }}>{cat.count}</b>
                  </div>
                  <div className="ethnic-bar-track">
                    <span style={{ width: `${(cat.count / ADUAN_CAT_MAX) * 100}%`, background: cat.color }} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function BantuanPage() {
  return (
    <div className="stack bantuan-page">
      <KpiStrip />
      <header className="section-page-head">
        <Icon name="heart" size={22} />
        <div>
          <h2 className="section-page-title">Agihan Bantuan</h2>
          <p className="quiet">Rekod bantuan &amp; kebajikan — kawasan {MACHAP.dun} 2024</p>
        </div>
      </header>
      <SegmentedStatStrip
        aria-label="Ringkasan agihan bantuan"
        items={[
          { label: "Penerima Bantuan", value: fmt(MACHAP.penerimaBantuan), icon: Users },
          { label: "Jumlah Diagih", value: BANTUAN_RINGKASAN.jumlahDiagih, icon: Coins },
          { label: "Jenis Bantuan", value: String(BANTUAN_RINGKASAN.jenisBantuan), icon: FileText },
          { label: "% Diagih", value: `${BANTUAN_RINGKASAN.pctDiagih}%`, icon: CheckCircle2 },
        ]}
      />
      <section className="bantuan-panel" aria-label="Senarai bantuan">
        <div className="bantuan-table-wrap">
          <table className="bantuan-table">
            <thead>
              <tr>
                <th scope="col">Jenis Bantuan</th>
                <th scope="col">Penerima</th>
                <th scope="col">Jumlah</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {BANTUAN_PROGRAM.map((row) => (
                <tr key={row.id}>
                  <td className="bantuan-jenis">{row.jenis}</td>
                  <td className="bantuan-penerima">{fmt(row.penerima)}</td>
                  <td className="bantuan-jumlah">{row.jumlah}</td>
                  <td>
                    <span className={`bantuan-status is-${row.statusKey}`}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

const PETUGAS_MEDAL = ["gold", "silver", "bronze"];

function PetugasPage() {
  const rows = [...PETUGAS].sort((a, b) => b.pctSiap - a.pctSiap || b.rating - a.rating);

  return (
    <div className="stack petugas-page">
      <KpiStrip />
      <header className="section-page-head petugas-page-head">
        <Icon name="star" size={22} />
        <div className="flex-1 min-w-0">
          <h2 className="section-page-title">Prestasi Petugas</h2>
          <p className="quiet">Penilaian Jun 2024 — kawasan DUN {MACHAP.dun.split(" ")[0]}</p>
        </div>
        <AvatarStack
          className="shrink-0"
          people={PETUGAS.slice(0, 3).map((p, i) => ({
            name: p.nama,
            src: STOCK_AVATARS[i % STOCK_AVATARS.length],
            initials: initialsFromName(p.nama),
          }))}
        />
      </header>
      <section className="petugas-panel" aria-label="Jadual prestasi petugas">
        <div className="petugas-table-wrap">
          <table className="petugas-table">
            <thead>
              <tr>
                <th scope="col">Nama</th>
                <th scope="col">Peranan</th>
                <th scope="col">Aduan</th>
                <th scope="col">% Siap</th>
                <th scope="col">Hadir</th>
                <th scope="col">Rating</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p, i) => {
                const rank = i + 1;
                const medal = PETUGAS_MEDAL[i];
                const siapTone = p.pctSiap >= 95 ? "high" : "mid";
                return (
                  <tr key={p.id}>
                    <td className="petugas-nama">
                      {medal ? (
                        <span className={`petugas-medal is-${medal}`} aria-label={`Kedudukan ${rank}`} />
                      ) : (
                        <span className="petugas-medal-spacer" aria-hidden />
                      )}
                      <Avatar className="size-9 shrink-0 ring-2 ring-background">
                        <AvatarImage
                          src={STOCK_AVATARS[(p.id - 1) % STOCK_AVATARS.length]}
                          alt={p.nama}
                        />
                        <AvatarFallback>{initialsFromName(p.nama)}</AvatarFallback>
                      </Avatar>
                      <span>{p.nama}</span>
                    </td>
                    <td className="petugas-peranan">{p.peranan}</td>
                    <td className="petugas-aduan">{fmt(p.aduan)}</td>
                    <td className="petugas-siap">
                      <div
                        className="petugas-siap-track"
                        role="progressbar"
                        aria-valuenow={p.pctSiap}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${p.pctSiap}% siap`}
                      >
                        <span className={`petugas-siap-fill is-${siapTone}`} style={{ width: `${p.pctSiap}%` }} />
                      </div>
                      <b>{p.pctSiap}%</b>
                    </td>
                    <td className="petugas-hadir">{p.hadir}%</td>
                    <td className="petugas-rating">
                      {p.rating.toFixed(1)}
                      <Icon name="star" size={14} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function ProgramPage() {
  return (
    <div className="stack program-page">
      <KpiStrip />
      <header className="section-page-head">
        <Icon name="building" size={22} />
        <div>
          <h2 className="section-page-title">Program Komuniti</h2>
          <p className="quiet">Program aktif ADUN {MACHAP.dun} 2024</p>
        </div>
      </header>
      <section className="program-panel" aria-label="Senarai program">
        <div className="program-table-wrap">
          <table className="program-table">
            <thead>
              <tr>
                <th scope="col">Program</th>
                <th scope="col">Kekerapan</th>
                <th scope="col">Peserta</th>
                <th scope="col">Kategori</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {MACHAP_PROGRAM.map((row) => (
                <tr key={row.id}>
                  <td className="program-nama">{row.nama}</td>
                  <td className="program-kekerapan">{row.kekerapan}</td>
                  <td className="program-peserta">{fmt(row.peserta)}</td>
                  <td>
                    <span className={`program-cat is-${row.kategoriKey}`}>{row.kategori}</span>
                  </td>
                  <td>
                    <span className="program-status is-active">{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function ProjekPage() {
  return (
    <div className="stack projek-page">
      <KpiStrip />
      <header className="section-page-head">
        <Icon name="crane" size={22} />
        <div>
          <h2 className="section-page-title">Projek Pembangunan Negeri</h2>
          <p className="quiet">Peruntukan &amp; status projek DUN {MACHAP.dun} 2024</p>
        </div>
      </header>
      <ol className="projek-list" aria-label="Senarai projek">
        {MACHAP_PROJEK.map((p) => (
          <li key={p.id}>
            <article className="surface-card projek-card">
              <div className="surface-card-header">
                <CardMarker variant="projek" />
                <span className={`surface-card-status is-${p.phase}`}>{p.status}</span>
              </div>
              <div className="surface-card-divider" />
              <div className="surface-card-body">
                <h3 className="surface-card-title">{p.nama}</h3>
                <p className="surface-card-note">Peruntukan &amp; kemajuan projek {MACHAP.dun}</p>
                <div className="chip-row">
                  <span className="chip-tag is-budget">{p.peruntukan}</span>
                  <span className="chip-tag">#pembangunan</span>
                </div>
              </div>
              <div className="surface-card-divider" />
              <LabeledProgress
                label="Kemajuan"
                value={p.progress}
                tone={p.phase === "done" ? "success" : "warn"}
              />
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}

function HotspotPage() {
  return (
    <div className="stack hotspot-page">
      <KpiStrip />
      <header className="section-page-head">
        <Icon name="flame" size={22} />
        <div>
          <h2 className="section-page-title">Kawasan Hotspot Isu</h2>
          <p className="quiet">Kawasan prioriti berdasarkan aduan — {MACHAP.dun}</p>
        </div>
      </header>
      <ol className="hotspot-list">
        {HOTSPOT_AREAS.map((area, i) => (
          <li key={area.id}>
            <article className={`hotspot-item hotspot-item-${area.level}`}>
              <span className="hotspot-rank" aria-label={`Kedudukan ${i + 1}`}>{i + 1}</span>
              <div className="hotspot-copy">
                <span className="hotspot-name">{area.nama}</span>
                <span className="hotspot-isu">{area.isu}</span>
              </div>
              <div className="hotspot-metric">
                <b>{area.aduan}</b>
                <span>aduan</span>
              </div>
              <span className={`hotspot-status is-${area.level}`}>{area.status}</span>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}

function DetailSheet({ adun, onClose }) {
  const pct = adun ? pctOf(adun) : 0;
  const stats = adun ? [
    ["Aduan", adun.aduan],
    ["Selesai", adun.siap],
    ["Hotspot", adun.hotspot],
    ["Program", adun.prog],
    ["Projek", adun.projek],
    ["Kadar", `${pct}%`],
  ] : [];
  return (
    <Sheet open={!!adun} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {adun ? (
          <>
            <SheetHeader>
              <SheetDescription>{adun.dun}</SheetDescription>
              <SheetTitle className="text-2xl">{adun.nama}</SheetTitle>
            </SheetHeader>
            <div className="tag-row px-4">
              <Tag parti={adun.parti}>{adun.parti}</Tag>
              <Tag>{adun.div}</Tag>
              <Tag>Rating {adun.rating.toFixed(1)}</Tag>
              {adun.isMB ? <Tag parti="UMNO">Menteri Besar</Tag> : null}
            </div>
            <div className="sheet-stats px-4">
              {stats.map(([label, value]) => (
                <div key={label}>
                  <b>{value}</b>
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <div className="sheet-progress px-4">
              <LabeledProgress
                label="Kadar penyelesaian"
                value={pct}
                tone={pct >= 95 ? "success" : pct >= 88 ? "default" : "warn"}
              />
            </div>
            <dl className="facts px-4">
              <div><dt>Bahagian</dt><dd>{adun.div}</dd></div>
              <div><dt>Trend</dt><dd>{adun.trend === "up" ? "Meningkat" : "Stabil"}</dd></div>
              <div><dt>Keutamaan</dt><dd>{adun.hotspot > 2 ? "Perhatian segera" : "Biasa"}</dd></div>
            </dl>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

export default function App() {
  const [tab, setTab] = useState("pengundi");
  const [selected, setSelected] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  const openAdun = (a) => setSelected(a);
  const go = (id) => setTab(id);

  const ink = "#6d7596";
  const grid = "rgba(28,52,128,0.08)";

  return (
    <TooltipProvider>
    <div className="app" data-collapsed={collapsed ? "true" : "false"}>
      <a className="skip" href="#kandungan">Langkau ke kandungan</a>
      <aside className="sidebar" aria-label="Menu">
        <div className="brand">
          <button type="button" className="brand-logo-btn" onClick={() => go("pengundi")} aria-label="DUN — laman utama">
            <img src="/dun-logo.png" alt="DUN" className="brand-logo" width={128} height={40} />
          </button>
        </div>
        <p className="brand-sub">{MACHAP.dunShort} · byDUN</p>
        <nav className="nav" aria-label="Utama">
          {NAV.map((item) => (
            <Hint key={item.id}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={tab === item.id ? "nav-item is-active" : "nav-item"}
                  aria-current={tab === item.id ? "page" : undefined}
                  aria-label={item.label}
                  onClick={() => go(item.id)}
                >
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" hidden={!collapsed}>{item.label}</TooltipContent>
            </Hint>
          ))}
        </nav>
        <div className="side-foot">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="user" aria-label="Onn H.">
                <Avatar className="size-7 ring-2 ring-background md:size-7">
                  <AvatarImage src={MB_AVATAR_SRC} alt="Onn Hafiz" className="object-[center_18%]" />
                  <AvatarFallback className="bg-[#1c3480] text-[#ffcc00] text-xs font-bold">OH</AvatarFallback>
                </Avatar>
                <span className="user-name">Onn H.</span>
                <Icon name="chevron" size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side={collapsed ? "right" : "top"} align="start" className="w-64">
              <DropdownMenuLabel>
                <span className="block">YAB Dato&apos; Onn Hafiz bin Ghazi</span>
                <span className="block text-xs font-normal text-muted-foreground">Menteri Besar Johor · N26 Machap</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openAdun(ALL_ADUN.find((a) => a.isMB))}>Lihat DUN Machap</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            type="button"
            className="nav-item rail-toggle"
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Besarkan menu" : "Kecilkan menu"}
            onClick={() => setCollapsed((v) => !v)}
          >
            <Icon name={collapsed ? "expand" : "collapse"} />
            <span>{collapsed ? "Besarkan" : "Kecilkan"}</span>
          </button>
        </div>
      </aside>

      <main className="main" id="kandungan">
        <div className="mobile-head">
          <button type="button" className="mobile-head-logo" onClick={() => go("pengundi")} aria-label="DUN — laman utama">
            <img src="/dun-logo.png" alt="" className="brand-logo" width={96} height={30} />
          </button>
          <span className="mobile-head-dun">{MACHAP.dunShort}</span>
          <button type="button" onClick={() => go("bantuan")}>Bantuan</button>
        </div>
        <MbBanner />
        {tab !== "pengundi" && tab !== "demografi" && tab !== "sokongan" && tab !== "aduan" && tab !== "hotspot" && tab !== "projek" && tab !== "bantuan" && tab !== "program" && tab !== "petugas" ? (
          <header className="page-head">
            <h1>{TITLES[tab]}</h1>
          </header>
        ) : null}

        <div key={tab} className="view-body">
        {tab === "pengundi" && (
          <div className="stack">
            <KpiStrip />
            <section className="card">
              <h2>Statistik Pengundi</h2>
              <SegmentedStatStrip
                className="mt-4"
                aria-label="Statistik pengundi"
                items={[
                  { label: "Jumlah Pengundi", value: fmt(MACHAP.pengundi), icon: Users },
                  { label: "Berdaftar SPR", value: fmt(MACHAP.berdaftarSpr), icon: ClipboardCheck },
                  { label: "Belum Daftar Est.", value: fmt(MACHAP.belumDaftar), icon: UserX },
                  { label: "Keluar PRN '23", value: `${MACHAP.keluarPrn23}%`, icon: Vote },
                ]}
              />
            </section>
            <div className="charts">
              <section className="card">
                <h2>Keluar undi</h2>
                <p className="quiet">Perbandingan PRN</p>
                <div className="gauge-row">
                  <RadialGauge pct={MACHAP.keluarPrn23} label="Keluar PRN '23" />
                  <RadialGauge pct={MACHAP.keluarPrn18} label="Keluar PRN '18" tone="warm" />
                </div>
              </section>
              <section className="card">
                <h2>Demografi pengundi</h2>
                <div className="gender-block">
                  <div className="gender-row">
                    <div className="gender-head"><span>Wanita</span><b>{MACHAP.wanita}%</b></div>
                    <div className="gender-bar"><span className="is-wanita" style={{ width: `${MACHAP.wanita}%` }} /></div>
                  </div>
                  <div className="gender-row">
                    <div className="gender-head"><span>Lelaki</span><b>{MACHAP.lelaki}%</b></div>
                    <div className="gender-bar"><span className="is-lelaki" style={{ width: `${MACHAP.lelaki}%` }} /></div>
                  </div>
                </div>
                <h3 className="quiet" style={{ marginTop: 20 }}>Trend keluar undi</h3>
                <SegmentedStatStrip
                  className="mt-2"
                  columns={3}
                  aria-label="Trend keluar undi PRN"
                  items={TURNOUT_HISTORY.map((t, i) => ({
                    value: `${t.pct}%`,
                    label: t.label,
                    icon: [Vote, BarChart3, TrendingUp][i] ?? Vote,
                  }))}
                />
              </section>
            </div>
          </div>
        )}

        {tab === "demografi" && <DemografiPage ink={ink} grid={grid} />}

        {tab === "sokongan" && <SokonganPage ink={ink} grid={grid} />}

        {tab === "aduan" && <AduanPage ink={ink} grid={grid} />}

        {tab === "petugas" && <PetugasPage />}

        {tab === "hotspot" && <HotspotPage />}

        {tab === "projek" && <ProjekPage />}

        {tab === "program" && <ProgramPage />}

        {tab === "bantuan" && <BantuanPage />}
        </div>
      </main>

      <nav className="tabbar" aria-label="Utama">
        {NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            className={tab === item.id ? "is-active" : undefined}
            aria-current={tab === item.id ? "page" : undefined}
            onClick={() => go(item.id)}
          >
            <Icon name={item.icon} size={22} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <DetailSheet adun={selected} onClose={() => setSelected(null)} />
    </div>
    </TooltipProvider>
  );
}
