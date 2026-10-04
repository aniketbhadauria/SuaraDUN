import { useMemo, useState } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tooltip as Hint } from "@/components/ui/tooltip";
import {
  ALL_ADUN, DIVISI, PARTI_LIST, PARTI_SEATS, STATE_TREND,
  fmt, pctOf, pctTone, rTone, shortName,
} from "./data.js";
import { Icon } from "./icons.jsx";

const NAV = [
  { id: "overview", label: "Gambaran", icon: "home" },
  { id: "adun", label: "ADUN", icon: "people" },
  { id: "ranking", label: "Ranking", icon: "chart" },
  { id: "kritikal", label: "Kritikal", icon: "alert" },
  { id: "bahagian", label: "Bahagian", icon: "map" },
];

const TITLES = {
  overview: "Gambaran",
  adun: "ADUN",
  ranking: "Ranking",
  kritikal: "Kritikal",
  bahagian: "Bahagian",
  bantuan: "Bantuan",
  panduan: "Panduan",
};

const SORTS = [
  ["dun", "No. DUN"],
  ["rating", "Rating"],
  ["aduan", "Aduan"],
  ["siap", "% selesai"],
];

const sum = (rows, key) => rows.reduce((s, a) => s + a[key], 0);

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
      ? "border-transparent bg-[#ffe4e4] text-[#cc0001]"
      : parti === "MIC"
        ? "border-transparent bg-[#e6e8f8] text-[#010066]"
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

function Wallet({ totalSiap, pctSiap, onOpen, onCopy, copied }) {
  return (
    <section className="wallet" aria-label="Ringkasan kerajaan negeri">
      <div className="wallet-inner">
        <div className="wallet-top">
          <div>
            <p className="kicker">Kerajaan negeri</p>
            <p className="wallet-id">YAB Onn Hafiz · N26 Machap</p>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onCopy} aria-label={copied ? "Ringkasan disalin" : "Salin ringkasan"}>
            <Icon name={copied ? "check" : "copy"} size={18} />
          </Button>
        </div>
        <p className="wallet-balance">{fmt(totalSiap)}</p>
        <div className="wallet-foot">
          <div className="coins" aria-label="UMNO 37, MCA 8, MIC 3">
            <span className="coin coin-umno">UM</span>
            <span className="coin coin-mca">MC</span>
            <span className="coin coin-mic">MI</span>
            <button type="button" className="coin coin-plus" onClick={() => onOpen("bahagian")} aria-label="Lihat bahagian">
              +
            </button>
          </div>
          <span className="pill">{pctSiap}%</span>
        </div>
      </div>
      <div className="wallet-actions">
        <Button type="button" variant="secondary" className="h-13 rounded-[18px]" onClick={() => onOpen("adun")}>
          <Icon name="swap" size={18} />
          Semua ADUN
        </Button>
        <Button type="button" variant="secondary" className="h-13 rounded-[18px]" onClick={() => onOpen("kritikal")}>
          <Icon name="send" size={18} />
          Kritikal
        </Button>
      </div>
    </section>
  );
}

function AdunCard({ a, onOpen }) {
  const pct = pctOf(a);
  const up = a.trend === "up";
  return (
    <Card
      role="button"
      tabIndex={0}
      className={`adun-card cursor-pointer gap-3.5 rounded-[22px] border-0 py-4 shadow-[0_12px_32px_rgba(28,39,64,0.08)] ring-0 ${a.isMB ? "is-mb" : ""}`}
      onClick={() => onOpen(a)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(a);
        }
      }}
    >
      <CardHeader className="rate-head px-4">
        <CardTitle className="rate-title">{a.dun}</CardTitle>
        <span className="rate-chevron" aria-hidden="true"><Icon name="chevron" size={16} /></span>
      </CardHeader>
      <CardContent className="grid gap-3.5 px-4">
        <span className="rate-figure">
          <span className="rate-num">{pct}%</span>
          <span className={up ? "rate-delta is-up" : "rate-delta"}>{up ? "↗" : "→"} {a.rating.toFixed(1)}</span>
          <Tag parti={a.parti}>{a.parti}</Tag>
        </span>
        <Progress
          value={pct}
          aria-label={`${pct}% selesai`}
          className="h-2 bg-[#e7eef2] [&_[data-slot=progress-indicator]]:bg-[#2bbfa0]"
        />
        <CardDescription className="rate-note">
          {a.nama}{a.isMB ? " · Menteri Besar" : ""} · {a.aduan} aduan · {a.hotspot} hotspot · {a.prog} program
        </CardDescription>
      </CardContent>
    </Card>
  );
}

function AdunAvatar({ a }) {
  const fallbackClass = a.isMB
    ? "avatar avatar-photo size-10 text-xs font-bold"
    : `avatar avatar-${a.parti} size-10`;
  const label = a.isMB ? "OH" : a.parti.slice(0, 1);
  return (
    <Avatar className="size-10 shrink-0">
      <AvatarFallback className={fallbackClass}>{label}</AvatarFallback>
    </Avatar>
  );
}

function AdunRow({ a, onOpen }) {
  const pct = pctOf(a);
  return (
    <button type="button" className="cell" onClick={() => onOpen(a)}>
      <AdunAvatar a={a} />
      <span className="cell-copy">
        <span className="cell-title">{a.isMB ? "Menteri Besar · " : ""}{a.nama}</span>
        <span className="cell-sub">{a.dun} · {a.div}</span>
      </span>
      <span className="cell-trail">
        <span className={`tone-${rTone(a.rating)}`}>{a.rating.toFixed(1)}</span>
        <span className="cell-sub">{pct}%</span>
      </span>
    </button>
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
              <div className="row-between">
                <span>Kadar penyelesaian</span>
                <b className={`tone-${pctTone(pct)}`}>{pct}%</b>
              </div>
              <Progress value={pct} aria-label={`${pct}% selesai`} className="h-2" />
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
  const [tab, setTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [divisi, setDivisi] = useState("Semua");
  const [parti, setParti] = useState("Semua");
  const [sort, setSort] = useState("dun");
  const [view, setView] = useState("grid");
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState(false);
  const [done, setDone] = useState(() => new Set());
  const [collapsed, setCollapsed] = useState(true);

  const totals = useMemo(() => {
    const aduan = sum(ALL_ADUN, "aduan");
    const siap = sum(ALL_ADUN, "siap");
    const hotspot = sum(ALL_ADUN, "hotspot");
    const prog = sum(ALL_ADUN, "prog");
    const projek = sum(ALL_ADUN, "projek");
    const rating = (sum(ALL_ADUN, "rating") / ALL_ADUN.length).toFixed(2);
    return { aduan, siap, hotspot, prog, projek, rating, pct: Math.round((siap / aduan) * 100) };
  }, []);

  const june = STATE_TREND[5];
  const may = STATE_TREND[4];
  const delta = {
    n: june.selesai - may.selesai,
    pct: (((june.selesai - may.selesai) / may.selesai) * 100).toFixed(1),
  };
  const juneOpen = june.aduan - june.selesai;

  const filtered = useMemo(() => {
    let d = [...ALL_ADUN];
    const q = search.trim().toLowerCase();
    if (q) d = d.filter((a) => a.nama.toLowerCase().includes(q) || a.dun.toLowerCase().includes(q));
    if (divisi !== "Semua") d = d.filter((a) => a.div === divisi);
    if (parti !== "Semua") d = d.filter((a) => a.parti === parti);
    if (sort === "rating") d.sort((a, b) => b.rating - a.rating);
    if (sort === "aduan") d.sort((a, b) => b.aduan - a.aduan);
    if (sort === "siap") d.sort((a, b) => b.siap / b.aduan - a.siap / a.aduan);
    if (sort === "dun") d.sort((a, b) => a.id - b.id);
    return d;
  }, [search, divisi, parti, sort]);

  const ranked = useMemo(() => [...ALL_ADUN].sort((a, b) => b.rating - a.rating || b.siap / b.aduan - a.siap / a.aduan), []);
  const top5 = ranked.slice(0, 5);
  const bot5 = ranked.slice(-5).reverse();
  const critical = useMemo(() => ALL_ADUN.filter((a) => a.hotspot >= 3).sort((a, b) => b.hotspot - a.hotspot || b.aduan - a.aduan), []);

  const byDiv = useMemo(() => DIVISI.slice(1).map((d) => {
    const members = ALL_ADUN.filter((a) => a.div === d);
    return {
      div: d,
      label: d.length > 11 ? `${d.slice(0, 10)}…` : d,
      aduan: sum(members, "aduan"),
      adun: members.length,
    };
  }).filter((d) => d.aduan > 0).sort((a, b) => b.aduan - a.aduan), []);

  const openAdun = (a) => setSelected(a);
  const go = (id) => setTab(id);

  const copySummary = async () => {
    const text = `Johor: ${fmt(totals.siap)} aduan selesai (${totals.pct}%). ${fmt(delta.n)} lebih selesai pada Jun berbanding Mei.`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard may be blocked; the button state still confirms the attempt */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const toggleDone = (id) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const ink = "#6d7596";
  const grid = "rgba(1,0,102,0.08)";

  return (
    <TooltipProvider>
    <div className="app" data-collapsed={collapsed ? "true" : "false"}>
      <a className="skip" href="#kandungan">Langkau ke kandungan</a>
      <aside className="sidebar" aria-label="Menu">
        <div className="brand">
          <button type="button" className="brand-name" onClick={() => go("overview")}>myDUN.</button>
          <span className="brand-mark" aria-hidden="true"><Icon name="square" size={16} /></span>
        </div>
        <p className="brand-sub">Julai 2026 · PRN ke-16</p>
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
          <Hint>
            <TooltipTrigger asChild>
              <button type="button" className={tab === "bantuan" ? "nav-item is-active" : "nav-item"} aria-label="Bantuan" onClick={() => go("bantuan")}>
                <Icon name="help" /><span>Bantuan</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" hidden={!collapsed}>Bantuan</TooltipContent>
          </Hint>
          <Hint>
            <TooltipTrigger asChild>
              <button type="button" className={tab === "panduan" ? "nav-item is-active" : "nav-item"} aria-label="Panduan" onClick={() => go("panduan")}>
                <Icon name="book" /><span>Panduan</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" hidden={!collapsed}>Panduan</TooltipContent>
          </Hint>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="user" aria-label="Onn H.">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-[#010066] text-[#ffcc00] text-xs font-bold">OH</AvatarFallback>
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
          <span>myDUN.</span>
          <button type="button" onClick={() => go("bantuan")}>Bantuan</button>
          <button type="button" onClick={() => go("panduan")}>Panduan</button>
        </div>
        <header className="page-head">
          <h1>{TITLES[tab]}</h1>
        </header>

        <div key={tab} className="view-body">
        {tab === "overview" && (
          <div className="stack">
            <div className="hero">
              <Wallet
                totalSiap={totals.siap}
                pctSiap={totals.pct}
                onOpen={go}
                onCopy={copySummary}
                copied={copied}
              />
              <section className="card earn">
                <div className="row-between">
                  <h2>Aduan Jun</h2>
                  <span className="quiet">2024</span>
                </div>
                <p className="earn-value">{fmt(june.selesai)}</p>
                <p className="earn-compare">
                  {fmt(delta.n)} selesai berbanding Mei
                  <span className="pill">↗ {delta.pct}%</span>
                </p>
                <div
                  className="split-bar"
                  role="img"
                  aria-label={`Jun: ${fmt(june.selesai)} selesai dan ${fmt(juneOpen)} masih terbuka daripada ${fmt(june.aduan)} aduan`}
                >
                  <span style={{ flex: june.selesai }} />
                  <span style={{ flex: juneOpen }} />
                </div>
                <div className="legend">
                  <span><i className="swatch swatch-done" /> Selesai <b>{fmt(june.selesai)}</b></span>
                  <span><i className="swatch swatch-open" /> Terbuka <b>{fmt(juneOpen)}</b></span>
                </div>
                <dl className="quiet-stats">
                  <div><dt>ADUN BN</dt><dd>48</dd></div>
                  <div><dt>UMNO / MCA / MIC</dt><dd>37 / 8 / 3</dd></div>
                  <div><dt>Hotspot</dt><dd>{totals.hotspot}</dd></div>
                  <div><dt>Purata rating</dt><dd>{totals.rating}</dd></div>
                </dl>
              </section>
            </div>

            <div className="split">
              <section className="card">
                <div className="row-between">
                  <h2>Perlu dibuat</h2>
                  <button type="button" className="text-btn" onClick={() => go("kritikal")} aria-label="Lihat kawasan kritikal">
                    <Icon name="arrow" size={18} />
                  </button>
                </div>
                <div className="tasks">
                  {critical.slice(0, 4).map((a) => {
                    const checked = done.has(a.id);
                    return (
                      <div key={a.id} className="task">
                        <button
                          type="button"
                          className={checked ? "check is-on" : "check"}
                          aria-pressed={checked}
                          aria-label={checked ? `Tanda semula ${a.dun}` : `Tanda ${a.dun} sudah disemak`}
                          onClick={() => toggleDone(a.id)}
                        >
                          {checked ? <Icon name="check" size={14} /> : null}
                        </button>
                        <button type="button" className="task-copy" onClick={() => openAdun(a)}>
                          <span>Semak {a.hotspot} hotspot di {a.dun.replace(/^N\d+\s/, "")}</span>
                          <small>{shortName(a.nama)} · {a.aduan - a.siap} aduan masih terbuka</small>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="recommend">
                <div className="row-between">
                  <h2>Disyorkan</h2>
                  <button type="button" className="text-btn" onClick={() => go("ranking")} aria-label="Lihat ranking">
                    <Icon name="arrow" size={18} />
                  </button>
                </div>
                {top5.slice(0, 3).map((a) => (
                  <button key={a.id} type="button" className="rec" onClick={() => openAdun(a)}>
                    <AdunAvatar a={a} />
                    <span>
                      <span className="cell-title">{shortName(a.nama)}</span>
                      <small>{a.dun} · rating {a.rating.toFixed(1)}</small>
                    </span>
                  </button>
                ))}
              </section>
            </div>

            <div className="charts">
              <section className="card" role="img" aria-label="Trend aduan masuk dan selesai, Januari hingga Jun 2024">
                <h2>Trend aduan</h2>
                <p className="quiet">Januari hingga Jun 2024</p>
                <div className="chart">
                  <ResponsiveContainer width="100%" height={210}>
                    <AreaChart data={STATE_TREND} margin={{ left: 0, right: 8, top: 12, bottom: 0 }}>
                      <defs>
                        <linearGradient id="masuk" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#cc0001" stopOpacity={0.28} />
                          <stop offset="100%" stopColor="#cc0001" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="siap" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#010066" stopOpacity={0.28} />
                          <stop offset="100%" stopColor="#010066" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke={grid} vertical={false} />
                      <XAxis dataKey="bln" tick={{ fill: ink, fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: ink, fontSize: 12 }} axisLine={false} tickLine={false} width={42} />
                      <Tooltip content={<Tip />} />
                      <Area dataKey="aduan" name="Masuk" stroke="#cc0001" fill="url(#masuk)" strokeWidth={2} />
                      <Area dataKey="selesai" name="Selesai" stroke="#010066" fill="url(#siap)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="card">
                <h2>Kerusi BN</h2>
                <p className="quiet">48 daripada 56 DUN</p>
                <div className="seat-row">
                  <div className="chart donut" role="img" aria-label="UMNO 37 kerusi, MCA 8, MIC 3">
                    <ResponsiveContainer width="100%" height={150}>
                      <PieChart>
                        <Pie data={PARTI_SEATS} dataKey="value" innerRadius={46} outerRadius={68} stroke="none">
                          {PARTI_SEATS.map((e) => <Cell key={e.name} fill={e.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="seat-list">
                    {PARTI_SEATS.map((p) => (
                      <div key={p.name}>
                        <div className="row-between">
                          <span>{p.name}</span>
                          <b>{p.value}</b>
                        </div>
                        <Meter value={p.value} max={48} tone={p.name === "UMNO" ? "warm" : p.name === "MCA" ? "low" : "mid"} />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            <section className="card" role="img" aria-label="Jumlah aduan mengikut bahagian">
              <h2>Aduan mengikut bahagian</h2>
              <div className="chart">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={byDiv} margin={{ left: 0, right: 8, top: 12, bottom: 0 }}>
                    <CartesianGrid stroke={grid} vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: ink, fontSize: 11 }} axisLine={false} tickLine={false} interval={0} />
                    <YAxis tick={{ fill: ink, fontSize: 12 }} axisLine={false} tickLine={false} width={42} />
                    <Tooltip content={<Tip />} />
                    <Bar dataKey="aduan" name="Aduan" fill="#010066" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
        )}

        {tab === "adun" && (
          <div className="stack">
            <div className="filters">
              <label className="search">
                <Icon name="search" size={18} />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama atau DUN"
                  aria-label="Cari nama atau DUN"
                  type="search"
                  className="h-11 border-0 bg-transparent shadow-none focus-visible:ring-0"
                />
              </label>
              <Select value={divisi} onValueChange={setDivisi}>
                <SelectTrigger className="h-11 w-auto min-w-36" aria-label="Bahagian"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DIVISI.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={parti} onValueChange={setParti}>
                <SelectTrigger className="h-11 w-auto min-w-28" aria-label="Parti"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PARTI_LIST.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="h-11 w-auto min-w-32" aria-label="Susunan"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SORTS.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Tabs value={view} onValueChange={setView}>
                <TabsList className="h-11">
                  <TabsTrigger value="grid">Kad</TabsTrigger>
                  <TabsTrigger value="list">Senarai</TabsTrigger>
                </TabsList>
              </Tabs>
              <p className="count">{filtered.length} daripada 48</p>
            </div>
            {filtered.length === 0 ? (
              <div className="empty">
                <h2>Tiada ADUN sepadan</h2>
                <p>Cuba nama lain, atau set semula bahagian dan parti kepada Semua.</p>
                <Button type="button" onClick={() => { setSearch(""); setDivisi("Semua"); setParti("Semua"); }}>
                  Set semula penapis
                </Button>
              </div>
            ) : view === "grid" ? (
              <div className="adun-grid">
                {filtered.map((a) => <AdunCard key={a.id} a={a} onOpen={openAdun} />)}
              </div>
            ) : (
              <div className="list">
                {filtered.map((a) => <AdunRow key={a.id} a={a} onOpen={openAdun} />)}
              </div>
            )}
          </div>
        )}

        {tab === "ranking" && (
          <div className="stack">
            <div className="split">
              <section className="card">
                <h2>Prestasi terbaik</h2>
                <ol className="rank">
                  {top5.map((a, i) => (
                    <li key={a.id}>
                      <button type="button" onClick={() => openAdun(a)}>
                        <span className="rank-no">{i + 1}</span>
                        <span className="cell-copy">
                          <span className="cell-title">{a.nama}</span>
                          <span className="cell-sub">{a.dun}</span>
                        </span>
                        <span className="cell-trail">
                          <b className={`tone-${rTone(a.rating)}`}>{a.rating.toFixed(1)}</b>
                          <span className="cell-sub">{pctOf(a)}% siap</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              </section>
              <section className="card">
                <h2>Perlu perhatian</h2>
                <ol className="rank">
                  {bot5.map((a, i) => (
                    <li key={a.id}>
                      <button type="button" onClick={() => openAdun(a)}>
                        <span className="rank-no">{i + 1}</span>
                        <span className="cell-copy">
                          <span className="cell-title">{a.nama}</span>
                          <span className="cell-sub">{a.dun}</span>
                        </span>
                        <span className="cell-trail">
                          <b className={`tone-${rTone(a.rating)}`}>{a.rating.toFixed(1)}</b>
                          <span className="cell-sub">{pctOf(a)}% siap</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
            <section className="card table-card">
              <h2>Semua 48 ADUN</h2>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      {["#", "DUN", "Nama", "Parti", "Aduan", "Selesai", "Rating", "Trend"].map((h) => <th key={h} scope="col">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {ranked.map((a, i) => {
                      const pct = pctOf(a);
                      return (
                        <tr key={a.id} className={a.isMB ? "is-mb" : undefined}>
                          <td>{i + 1}</td>
                          <td>{a.dun}</td>
                          <td>
                            <button type="button" className="linkish" onClick={() => openAdun(a)}>{a.nama}</button>
                          </td>
                          <td><Tag parti={a.parti}>{a.parti}</Tag></td>
                          <td>{a.aduan}</td>
                          <td>
                            <span className="table-meter">
                              <Meter value={pct} tone={pctTone(pct)} />
                              <span>{pct}%</span>
                            </span>
                          </td>
                          <td className={`tone-${rTone(a.rating)}`}>{a.rating.toFixed(1)}</td>
                          <td><Trend value={a.trend} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {tab === "kritikal" && (
          <div className="stack">
            <section className="card notice">
              <h2>Kawasan yang perlu perhatian segera</h2>
              <p>ADUN dengan 3 hotspot atau lebih. Buka satu baris untuk lihat aduan, program, dan kadar selesai.</p>
            </section>
            <div className="list">
              {critical.map((a, i) => (
                <button key={a.id} type="button" className="cell cell-alert" onClick={() => openAdun(a)}>
                  <span className="rank-no">{i + 1}</span>
                  <span className="cell-copy">
                    <span className="cell-title">{a.nama}</span>
                    <span className="cell-sub">{a.dun} · {a.div}</span>
                  </span>
                  <span className="mini-stats">
                    <span><b>{a.hotspot}</b> hotspot</span>
                    <span><b>{a.aduan}</b> aduan</span>
                    <span><b>{a.rating.toFixed(1)}</b> rating</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === "bahagian" && (
          <div className="bahagian-grid">
            {DIVISI.slice(1).filter((d) => ALL_ADUN.some((a) => a.div === d)).map((d) => {
              const members = ALL_ADUN.filter((a) => a.div === d);
              const aduan = sum(members, "aduan");
              const siap = sum(members, "siap");
              const hot = sum(members, "hotspot");
              const avg = (sum(members, "rating") / members.length).toFixed(1);
              const pct = Math.round((siap / aduan) * 100);
              const counts = ["UMNO", "MCA", "MIC"].map((p) => [p, members.filter((a) => a.parti === p).length]).filter(([, n]) => n > 0);
              return (
                <button
                  key={d}
                  type="button"
                  className="card bahagian"
                  onClick={() => { setDivisi(d); setParti("Semua"); go("adun"); }}
                >
                  <span className="row-between">
                    <span>
                      <span className="quiet">Bahagian</span>
                      <span className="bahagian-name">{d}</span>
                    </span>
                    <span className="bahagian-count">{members.length}<small>ADUN</small></span>
                  </span>
                  <span className="stat3">
                    <span><b>{fmt(aduan)}</b><small>Aduan</small></span>
                    <span><b>{hot}</b><small>Hotspot</small></span>
                    <span><b>{avg}</b><small>Rating</small></span>
                  </span>
                  <span className="adun-meter">
                    <Meter value={pct} tone={pctTone(pct)} />
                    <span>{pct}%</span>
                  </span>
                  <span className="tag-row">
                    {counts.map(([p, n]) => <Tag key={p} parti={p}>{p} {n}</Tag>)}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {tab === "bantuan" && (
          <section className="card prose">
            <h2>Cara guna papan pemuka ini</h2>
            <ol>
              <li>Gambaran menunjukkan aduan selesai dan kawasan yang perlu disemak dahulu.</li>
              <li>ADUN membolehkan carian mengikut nama, DUN, bahagian, atau parti.</li>
              <li>Buka mana-mana ADUN untuk lihat hotspot, program, dan kadar selesai.</li>
              <li>Kritikal menyenaraikan DUN dengan 3 hotspot atau lebih.</li>
              <li>Bahagian membuka senarai ADUN bagi bahagian itu.</li>
            </ol>
          </section>
        )}

        {tab === "panduan" && (
          <section className="card prose">
            <h2>Apa yang nombor ini maksudkan</h2>
            <dl className="facts">
              <div><dt>Aduan</dt><dd>Jumlah aduan rakyat yang diterima DUN itu.</dd></div>
              <div><dt>Selesai</dt><dd>Aduan yang sudah ditutup. Peratus ialah selesai dibahagi jumlah aduan.</dd></div>
              <div><dt>Hotspot</dt><dd>Kawasan dalam DUN yang masih aktif dan perlu lawatan.</dd></div>
              <div><dt>Rating</dt><dd>Purata prestasi ADUN. 4.7 ke atas dikira baik.</dd></div>
              <div><dt>Program</dt><dd>Program komuniti yang sedang berjalan.</dd></div>
              <div><dt>Projek</dt><dd>Projek negeri yang berkaitan dengan DUN itu.</dd></div>
            </dl>
          </section>
        )}
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
