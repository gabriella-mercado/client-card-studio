import { useState, useMemo, useRef, useEffect } from "react";
import Papa from "papaparse";
import {
  Cake,
  Sunset,
  PartyPopper,
  Baby,
  Flower2,
  Snowflake,
  Download,
  Copy,
  Check,
  Info,
  CalendarDays,
  ArrowRight,
  PenLine,
  Upload,
  FileDown,
  RotateCcw,
  ClipboardList,
  Trash2,
  MailCheck,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Sample template library (placeholder copy — pending approval)      */
/*  Tokens: {name} always available. {detail} only when usesDetail.    */
/* ------------------------------------------------------------------ */

const OCCASIONS = [
  {
    key: "birthday",
    label: "Birthday",
    Icon: Cake,
    templates: [
      {
        text:
          "Happy Birthday, {name}! Wishing you a wonderful day filled with joy and the people you love, and a year ahead full of health and happiness.",
      },
      {
        text:
          "Warmest birthday wishes, {name}! May this new year bring you continued success, cherished moments, and plenty of reasons to celebrate.",
      },
      {
        text:
          "Happy Birthday, {name}! It's a privilege to be part of your journey. Here's to a day as special as you are.",
      },
    ],
  },
  {
    key: "retirement",
    label: "Retirement",
    Icon: Sunset,
    templates: [
      {
        text:
          "Congratulations on your retirement, {name}! After {detail}, you've earned every moment of what comes next. Wishing you relaxation, adventure, and joy ahead.",
        usesDetail: true,
        detailLabel: "Years of service (optional)",
        detailPlaceholder: "e.g. 30 years of service",
        detailDefault: "your career",
      },
      {
        text:
          "Happy Retirement, {name}! This is a well-deserved new chapter. May it be filled with the people, passions, and pursuits that bring you the most happiness.",
      },
      {
        text:
          "Congratulations, {name}! Retirement is the start of something wonderful. Here's to more time for the things, and people, you love most.",
      },
    ],
  },
  {
    key: "congratulations",
    label: "Congratulations",
    Icon: PartyPopper,
    templates: [
      {
        text:
          "Congratulations, {name}! Your hard work has truly paid off, and we're so happy to celebrate {detail} with you.",
        usesDetail: true,
        detailLabel: "What's the occasion? (optional)",
        detailPlaceholder: "e.g. your new home",
        detailDefault: "this milestone",
      },
      {
        text:
          "Way to go, {name}! This is a moment worth celebrating, and we couldn't be happier for you. Wishing you continued success in all that lies ahead.",
      },
      {
        text:
          "Congratulations, {name}! Achievements like this reflect your effort and character. We're proud to celebrate alongside you.",
      },
    ],
  },
  {
    key: "grandchild",
    label: "New grandchild",
    Icon: Baby,
    templates: [
      {
        text:
          "Congratulations on your new grandchild, {name}! Welcoming {detail} into the family is such a joyful milestone. Wishing your growing family love and happiness.",
        usesDetail: true,
        detailLabel: "Grandchild's name (optional)",
        detailPlaceholder: "e.g. Emma",
        detailDefault: "your new grandchild",
      },
      {
        text:
          "What wonderful news, {name}! Congratulations on becoming a grandparent. May this new addition bring your family endless joy and love.",
      },
      {
        text:
          "Congratulations, {name}! There's nothing quite like the joy of a new grandchild. Wishing you many treasured moments in the years to come.",
      },
    ],
  },
  {
    key: "condolences",
    label: "Condolences",
    Icon: Flower2,
    templates: [
      {
        text:
          "With heartfelt sympathy, {name}. Please know you are in our thoughts during this difficult time. We are here for you, now and always.",
      },
      {
        text:
          "Dear {name}, we are deeply sorry for your loss. May you find comfort in the memories you hold and the support of those who care for you.",
      },
      {
        text:
          "{name}, our thoughts are with you and your family. Please accept our sincere condolences.",
      },
    ],
  },
  {
    key: "holidays",
    label: "Holidays",
    Icon: Snowflake,
    templates: [
      {
        text:
          "Wishing you a joyful holiday season, {name}! May your days be filled with warmth, good company, and happy memories, and the new year with bright things.",
      },
      {
        text:
          "Happy Holidays, {name}! As the year draws to a close, we're grateful to work with you. Wishing you peace, joy, and all good things this season.",
      },
      {
        text:
          "Season's Greetings, {name}! May this time of year bring you rest, celebration, and moments of joy with the people who matter most.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Sample client roster (fake data — birthday finder, Phase 2)        */
/*  Mirrors the scoping doc's record shape. No real client data.       */
/* ------------------------------------------------------------------ */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const CLIENTS = [
  { id: "0001", first: "Margaret", last: "Chen", dob: "1955-01-08" },
  { id: "0002", first: "Robert", last: "Ellison", dob: "1962-02-21" },
  { id: "0003", first: "Patricia", last: "Nguyen", dob: "1948-03-30" },
  { id: "0004", first: "David", last: "Okafor", dob: "1970-04-12" },
  { id: "0005", first: "Susan", last: "Reyes", dob: "1958-04-27" },
  { id: "0006", first: "James", last: "Calloway", dob: "1953-05-05" },
  { id: "0007", first: "Linda", last: "Marchetti", dob: "1961-06-09" },
  { id: "0008", first: "Thomas", last: "Bauer", dob: "1949-06-22" },
  { id: "0009", first: "Grace", last: "Sullivan", dob: "1975-06-30" },
  { id: "0010", first: "Henry", last: "Whitfield", dob: "1957-07-14" },
  { id: "0011", first: "Dorothy", last: "Kim", dob: "1944-08-19" },
  { id: "0012", first: "Frank", last: "Delgado", dob: "1966-10-03" },
  { id: "0013", first: "Eleanor", last: "Voss", dob: "1952-10-25" },
  { id: "0014", first: "Walter", last: "Brennan", dob: "1959-11-11" },
  { id: "0015", first: "Catherine", last: "Lowe", dob: "1968-12-18" },
];

const dobMonth = (dob) => Number(dob.slice(5, 7)) - 1;
const dobDay = (dob) => Number(dob.slice(8, 10));
const dobYear = (dob) => Number(dob.slice(0, 4));

// Normalized roster shape used by the finder: { id, first, last, month (0-11), day, year|null }
const SAMPLE_ROSTER = CLIENTS.map((c) => ({
  id: c.id,
  first: c.first,
  last: c.last,
  month: dobMonth(c.dob),
  day: dobDay(c.dob),
  year: dobYear(c.dob),
}));

// Accepts a month as a number (1-12) or a name/abbreviation ("June", "jun"). Returns 0-11 or -1.
function parseMonth(value) {
  const v = String(value || "").trim().toLowerCase();
  if (!v) return -1;
  if (/^\d+$/.test(v)) {
    const n = Number(v) - 1;
    return n >= 0 && n <= 11 ? n : -1;
  }
  return MONTHS.findIndex((m) => m.toLowerCase().startsWith(v.slice(0, 3)));
}

// Turn parsed CSV rows into normalized clients. Forgiving about header names and messy rows.
function normalizeRosterRows(rows) {
  const clients = [];
  let skipped = 0;
  rows.forEach((raw, i) => {
    const row = {};
    Object.keys(raw || {}).forEach((k) => {
      row[k.trim().toLowerCase()] = typeof raw[k] === "string" ? raw[k].trim() : raw[k];
    });
    const first = row.first || row.firstname || row["first name"] || row.first_name || "";
    const last = row.last || row.lastname || row["last name"] || row.last_name || "";
    const month = parseMonth(row.month);
    const day = Number(row.day);
    const year = row.year ? Number(row.year) : null;
    if (!first || month < 0 || !Number.isInteger(day) || day < 1 || day > 31) {
      skipped += 1;
      return;
    }
    clients.push({
      id: `up-${i}`,
      first,
      last,
      month,
      day,
      year: Number.isInteger(year) ? year : null,
    });
  });
  return { clients, skipped };
}

function buildSampleCsv() {
  return [
    "first,last,month,day,year",
    "Jane,Doe,June,14,1959",
    "John,Smith,3,2,",
    "Maria,Alvarez,November,30,1962",
  ].join("\n");
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function fillTemplate(tpl, name, detail) {
  const n = (name || "").trim() || "[Client name]";
  let out = tpl.text.split("{name}").join(n);
  if (tpl.usesDetail) {
    const d = (detail || "").trim() || tpl.detailDefault;
    out = out.split("{detail}").join(d);
  }
  return out;
}

function wrapText(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    if (!line) line = w;
    else if ((line + " " + w).length <= maxChars) line += " " + w;
    else {
      lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function escapeXml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function starPoints(cx, cy, outerR, innerR, points, rotDeg) {
  const rot = ((rotDeg || 0) * Math.PI) / 180;
  const pts = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = rot + (i * Math.PI) / points;
    pts.push(`${(cx + r * Math.sin(a)).toFixed(1)},${(cy - r * Math.cos(a)).toFixed(1)}`);
  }
  return pts.join(" ");
}

function plus(x, y, s) {
  return `<line x1="${x - s}" y1="${y}" x2="${x + s}" y2="${y}"/><line x1="${x}" y1="${y - s}" x2="${x}" y2="${y + s}"/>`;
}

function motifMarkup(key) {
  switch (key) {
    case "birthday":
      return (
        `<ellipse cx="250" cy="118" rx="32" ry="39"/>` +
        `<path d="M243 155 L250 165 L257 155 Z"/>` +
        `<path d="M250 165 q -14 24 4 50"/>` +
        plus(200, 116, 6) +
        plus(304, 100, 6)
      );
    case "retirement":
      return (
        `<path d="M214 168 A36 36 0 0 1 286 168"/>` +
        `<line x1="196" y1="168" x2="304" y2="168"/>` +
        `<line x1="250" y1="116" x2="250" y2="100"/>` +
        `<line x1="220" y1="126" x2="211" y2="114"/>` +
        `<line x1="280" y1="126" x2="289" y2="114"/>` +
        `<line x1="206" y1="150" x2="192" y2="145"/>` +
        `<line x1="294" y1="150" x2="308" y2="145"/>`
      );
    case "congratulations":
      return (
        `<polygon points="${starPoints(250, 138, 42, 12, 4, 0)}"/>` +
        plus(198, 110, 6) +
        plus(302, 122, 6) +
        plus(214, 176, 5)
      );
    case "grandchild":
      return (
        `<polygon points="${starPoints(250, 136, 36, 15, 5, 0)}"/>` +
        plus(202, 116, 6) +
        plus(300, 150, 5)
      );
    case "condolences":
      return (
        `<path d="M250 96 C 250 124, 250 152, 250 184"/>` +
        `<ellipse cx="0" cy="0" rx="13" ry="6" transform="translate(236 120) rotate(-32)"/>` +
        `<ellipse cx="0" cy="0" rx="13" ry="6" transform="translate(264 134) rotate(32)"/>` +
        `<ellipse cx="0" cy="0" rx="12" ry="5.5" transform="translate(238 150) rotate(-30)"/>` +
        `<ellipse cx="0" cy="0" rx="12" ry="5.5" transform="translate(262 164) rotate(30)"/>`
      );
    case "holidays": {
      const cx = 250,
        cy = 140,
        r = 42;
      let s = "";
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const ex = cx + r * Math.cos(a);
        const ey = cy + r * Math.sin(a);
        s += `<line x1="${cx}" y1="${cy}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}"/>`;
        const bx = cx + 0.6 * r * Math.cos(a);
        const by = cy + 0.6 * r * Math.sin(a);
        for (const da of [Math.PI / 6, -Math.PI / 6]) {
          const lx = bx + 0.24 * r * Math.cos(a + da);
          const ly = by + 0.24 * r * Math.sin(a + da);
          s += `<line x1="${bx.toFixed(1)}" y1="${by.toFixed(1)}" x2="${lx.toFixed(1)}" y2="${ly.toFixed(1)}"/>`;
        }
      }
      return s;
    }
    default:
      return "";
  }
}

function buildCardSVG(key, message, signature) {
  // 5x7 card, landscape orientation: 700 x 500 viewBox.
  const lines = wrapText(message, 32);
  const lh = 46;
  const blockH = lines.length * lh;
  const centerY = 290;
  const startY = centerY - blockH / 2 + 30;
  const texts = lines
    .map(
      (ln, i) =>
        `<text x="350" y="${(startY + i * lh).toFixed(0)}" text-anchor="middle" font-family="'Dancing Script', 'Segoe Script', cursive" font-size="38" fill="#20304A">${escapeXml(
          ln
        )}</text>`
    )
    .join("");

  const sig = (signature || "").trim();
  const sigBlock = sig
    ? `<line x1="300" y1="430" x2="400" y2="430" stroke="#9C7B3F" stroke-width="1"/>` +
      `<text x="350" y="455" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="13" letter-spacing="2" fill="#9C7B3F">${escapeXml(
        sig.toUpperCase()
      )}</text>`
    : "";

  return `<svg viewBox="0 0 700 500" xmlns="http://www.w3.org/2000/svg" width="100%" preserveAspectRatio="xMidYMid meet">
  <!-- Card front (5x7 landscape). Set up for Cricut: import as SVG, then convert the
       message text to a single-line / "Draw" font to pen-write it. Line art is stroke-only. -->
  <rect x="6" y="6" width="688" height="488" rx="14" fill="#FBFAF4" stroke="#E7E2D4" stroke-width="2"/>
  <rect x="30" y="30" width="640" height="440" rx="8" fill="none" stroke="#2F5D50" stroke-opacity="0.22" stroke-width="1.5"/>
  <g transform="translate(100,-30)" fill="none" stroke="#2F5D50" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${motifMarkup(
    key
  )}</g>
  ${texts}
  ${sigBlock}
</svg>`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const STORE_PREFIX = "clientCardStudio:";

function loadSaved(key, fallback) {
  try {
    const raw = localStorage.getItem(STORE_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveValue(key, value) {
  try {
    localStorage.setItem(STORE_PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage unavailable — fail quietly */
  }
}

export default function ClientCardStudio() {
  const [occKey, setOccKey] = useState("birthday");
  const [tplIndex, setTplIndex] = useState(0);
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [signature, setSignature] = useState("Your team at Northcrest Wealth");
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState("create");
  const [finderMonth, setFinderMonth] = useState(() => new Date().getMonth());
  const [roster, setRoster] = useState(() => loadSaved("roster", SAMPLE_ROSTER));
  const [rosterSource, setRosterSource] = useState(() => loadSaved("rosterSource", { type: "sample", name: "" }));
  const [rosterStatus, setRosterStatus] = useState(null); // { ok: boolean, text: string }
  const [cardLog, setCardLog] = useState(() => loadSaved("cardLog", [])); // saved record of cards made
  const [activeClientId, setActiveClientId] = useState(null); // links a card to a roster person
  const fileRef = useRef(null);

  // Save the user's data to this browser whenever it changes (Option A).
  useEffect(() => saveValue("roster", roster), [roster]);
  useEffect(() => saveValue("rosterSource", rosterSource), [rosterSource]);
  useEffect(() => saveValue("cardLog", cardLog), [cardLog]);

  const thisYear = new Date().getFullYear();

  const monthClients = useMemo(
    () => roster.filter((c) => c.month === finderMonth).sort((a, b) => a.day - b.day),
    [roster, finderMonth]
  );

  // Most recent log entry per linked client (cardLog is newest-first, so first match wins).
  const statusByClient = useMemo(() => {
    const m = {};
    cardLog.forEach((e) => {
      if (e.clientId && !m[e.clientId]) m[e.clientId] = e;
    });
    return m;
  }, [cardLog]);

  function handleRosterFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        const { clients, skipped } = normalizeRosterRows(res.data || []);
        if (clients.length === 0) {
          setRosterStatus({
            ok: false,
            text: "No valid rows found. Expected columns: first, last, month, day.",
          });
        } else {
          setRoster(clients);
          setRosterSource({ type: "upload", name: file.name });
          setRosterStatus({
            ok: true,
            text:
              `Loaded ${clients.length} client${clients.length === 1 ? "" : "s"}` +
              (skipped ? `, skipped ${skipped} unreadable row${skipped === 1 ? "" : "s"}.` : "."),
          });
        }
        if (fileRef.current) fileRef.current.value = "";
      },
      error: () => {
        setRosterStatus({ ok: false, text: "Could not read that file. Please upload a .csv." });
        if (fileRef.current) fileRef.current.value = "";
      },
    });
  }

  function useSampleRoster() {
    setRoster(SAMPLE_ROSTER);
    setRosterSource({ type: "sample", name: "" });
    setRosterStatus(null);
  }

  function downloadSampleCsv() {
    const blob = new Blob([buildSampleCsv()], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "client-roster-template.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function makeCardFor(client) {
    setOccKey("birthday");
    setTplIndex(0);
    setDetail("");
    setName(`${client.first} ${client.last}`);
    setActiveClientId(client.id);
    setMode("create");
  }

  function handleNameChange(value) {
    setName(value);
    setActiveClientId(null); // a hand-typed name no longer reliably matches a roster person
  }

  const occasion = OCCASIONS.find((o) => o.key === occKey);
  const template = occasion.templates[tplIndex];

  const message = useMemo(
    () => fillTemplate(template, name, detail),
    [template, name, detail]
  );

  const svg = useMemo(
    () => buildCardSVG(occKey, message, signature),
    [occKey, message, signature]
  );

  function chooseOccasion(key) {
    setOccKey(key);
    setTplIndex(0);
    setDetail("");
  }

  function downloadSVG() {
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safeName = (name.trim() || "client").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    a.href = url;
    a.download = `card-${occKey}-${safeName}.svg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    // The download is our signal that a card was made. Record it for this session.
    const entry = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      ts: new Date().toISOString(),
      clientId: activeClientId,
      name: name.trim() || "[Client name]",
      occasionKey: occKey,
      occasionLabel: occasion.label,
      templateIndex: tplIndex,
      mailed: false,
    };
    setCardLog((prev) => [entry, ...prev]);
  }

  function toggleMailed(id) {
    setCardLog((prev) =>
      prev.map((e) => (e.id === id ? { ...e, mailed: !e.mailed } : e))
    );
  }

  function clearLog() {
    setCardLog([]);
  }

  function exportLog() {
    const header = "timestamp,client_id,name,occasion,template,mailed";
    const rows = cardLog.map((e) =>
      [
        e.ts,
        e.clientId || "manual",
        `"${e.name.replace(/"/g, '""')}"`,
        e.occasionLabel,
        e.templateIndex + 1,
        e.mailed ? "yes" : "no",
      ].join(",")
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "card-log.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function fmtDateTime(ts) {
    return new Date(ts).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
    } catch {
      /* clipboard unavailable in this context */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="cc-root">
      <style>{styles}</style>

      <header className="cc-header">
        <div>
          <p className="cc-eyebrow">Client Card Program</p>
          <h1 className="cc-title">Client Card Studio</h1>
        </div>
        <span className="cc-badge">
          <Info size={13} strokeWidth={2.2} />
          Saved in this browser
        </span>
      </header>

      <div className="cc-tabwrap">
        <div className="cc-tabs" role="tablist" aria-label="Mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "create"}
            className={`cc-tab ${mode === "create" ? "is-active" : ""}`}
            onClick={() => setMode("create")}
          >
            <PenLine size={15} strokeWidth={2} />
            Create a card
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "finder"}
            className={`cc-tab ${mode === "finder" ? "is-active" : ""}`}
            onClick={() => setMode("finder")}
          >
            <CalendarDays size={15} strokeWidth={2} />
            Birthday finder
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "log"}
            className={`cc-tab ${mode === "log" ? "is-active" : ""}`}
            onClick={() => setMode("log")}
          >
            <ClipboardList size={15} strokeWidth={2} />
            Card log
            {cardLog.length > 0 && <span className="cc-tab-count">{cardLog.length}</span>}
          </button>
        </div>
      </div>

      {mode === "create" && (
      <div className="cc-layout">
        {/* ---------------- Controls ---------------- */}
        <section className="cc-panel cc-controls" aria-label="Card options">
          <div className="cc-field">
            <span className="cc-label">Occasion</span>
            <div className="cc-occ-grid" role="radiogroup" aria-label="Occasion">
              {OCCASIONS.map((o) => {
                const Active = o.key === occKey;
                const I = o.Icon;
                return (
                  <button
                    key={o.key}
                    type="button"
                    role="radio"
                    aria-checked={Active}
                    className={`cc-occ ${Active ? "is-active" : ""}`}
                    onClick={() => chooseOccasion(o.key)}
                  >
                    <I size={18} strokeWidth={1.9} />
                    <span>{o.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="cc-field">
            <label className="cc-label" htmlFor="cc-name">
              Client name
            </label>
            <input
              id="cc-name"
              className="cc-input"
              value={name}
              placeholder="e.g. Jane Doe"
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>

          <div className="cc-field">
            <span className="cc-label">Message template</span>
            <div className="cc-tpl-list">
              {occasion.templates.map((t, i) => {
                const active = i === tplIndex;
                return (
                  <button
                    key={i}
                    type="button"
                    className={`cc-tpl ${active ? "is-active" : ""}`}
                    onClick={() => setTplIndex(i)}
                    aria-pressed={active}
                  >
                    <span className="cc-tpl-num">{i + 1}</span>
                    <span className="cc-tpl-text">{fillTemplate(t, name, detail)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {template.usesDetail && (
            <div className="cc-field">
              <label className="cc-label" htmlFor="cc-detail">
                {template.detailLabel}
              </label>
              <input
                id="cc-detail"
                className="cc-input"
                value={detail}
                placeholder={template.detailPlaceholder}
                onChange={(e) => setDetail(e.target.value)}
              />
            </div>
          )}

          <div className="cc-field">
            <label className="cc-label" htmlFor="cc-sig">
              Signature line
            </label>
            <input
              id="cc-sig"
              className="cc-input"
              value={signature}
              placeholder="Your team at [Firm name]"
              onChange={(e) => setSignature(e.target.value)}
            />
          </div>
        </section>

        {/* ---------------- Preview ---------------- */}
        <section className="cc-panel cc-preview" aria-label="Card preview">
          <div className="cc-card-stage">
            <div
              className="cc-card"
              dangerouslySetInnerHTML={{ __html: svg }}
              aria-label="Card preview"
            />
          </div>

          <div className="cc-actions">
            <button type="button" className="cc-btn cc-btn-primary" onClick={downloadSVG}>
              <Download size={16} strokeWidth={2.1} />
              Download SVG for Cricut
            </button>
            <button type="button" className="cc-btn cc-btn-ghost" onClick={copyMessage}>
              {copied ? (
                <>
                  <Check size={16} strokeWidth={2.1} /> Copied
                </>
              ) : (
                <>
                  <Copy size={16} strokeWidth={2.1} /> Copy message
                </>
              )}
            </button>
          </div>

          <p className="cc-note">
            In Cricut Design Space, choose <strong>Upload</strong>, select this SVG, then{" "}
            <strong>Make It</strong>. To pen-write the message, switch the text layer to a
            single-line “Draw” font before cutting.
          </p>
        </section>
      </div>
      )}

      {mode === "finder" && (
        <div className="cc-finder">
          <section className="cc-panel">
            <div className="cc-roster-bar">
              <div className="cc-roster-src">
                <span className="cc-src-label">Data source</span>
                <span className="cc-src-value">
                  {rosterSource.type === "sample"
                    ? "Sample roster (15 fake clients)"
                    : `Uploaded: ${rosterSource.name}`}
                </span>
              </div>
              <div className="cc-roster-tools">
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleRosterFile}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  className="cc-btn cc-btn-primary cc-btn-sm"
                  onClick={() => fileRef.current && fileRef.current.click()}
                >
                  <Upload size={15} strokeWidth={2.1} />
                  Load roster (CSV)
                </button>
                <button
                  type="button"
                  className="cc-btn cc-btn-ghost cc-btn-sm"
                  onClick={downloadSampleCsv}
                >
                  <FileDown size={15} strokeWidth={2.1} />
                  Template
                </button>
                {rosterSource.type === "upload" && (
                  <button
                    type="button"
                    className="cc-btn cc-btn-ghost cc-btn-sm"
                    onClick={useSampleRoster}
                  >
                    <RotateCcw size={15} strokeWidth={2.1} />
                    Use sample
                  </button>
                )}
              </div>
            </div>

            <p className="cc-roster-help">
              CSV columns: <code>first, last, month, day</code> (an optional <code>year</code>{" "}
              enables the “turning” age). Month can be a number or name. Files are read in your
              browser only — nothing is uploaded or saved.
            </p>

            {rosterStatus && (
              <p className={`cc-roster-status ${rosterStatus.ok ? "is-ok" : "is-err"}`}>
                {rosterStatus.text}
              </p>
            )}

            <div className="cc-field">
              <span className="cc-label">Birthday month</span>
              <div className="cc-month-grid" role="radiogroup" aria-label="Month">
                {MONTHS.map((m, i) => (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={i === finderMonth}
                    className={`cc-month ${i === finderMonth ? "is-active" : ""}`}
                    onClick={() => setFinderMonth(i)}
                  >
                    {m.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div className="cc-roster-head">
              <span>{MONTHS[finderMonth]} birthdays</span>
              <span className="cc-count">{monthClients.length}</span>
            </div>

            {monthClients.length === 0 ? (
              <div className="cc-empty">
                <CalendarDays size={24} strokeWidth={1.5} />
                <p>
                  No client birthdays in {MONTHS[finderMonth]}. Pick another month, or load a
                  roster to see who&apos;s coming up.
                </p>
              </div>
            ) : (
              <ul className="cc-client-list">
                {monthClients.map((c) => {
                  const turning = c.year ? thisYear - c.year : null;
                  const status = statusByClient[c.id];
                  return (
                    <li key={c.id} className="cc-client">
                      <div className="cc-client-date">
                        <span className="cc-client-mon">{MONTHS[finderMonth].slice(0, 3)}</span>
                        <span className="cc-client-day">{c.day}</span>
                      </div>
                      <div className="cc-client-info">
                        <span className="cc-client-name">
                          {c.first} {c.last}
                        </span>
                        <span className="cc-client-meta">
                          {turning != null ? `Turning ${turning}` : `${MONTHS[finderMonth]} ${c.day}`}
                          {status && (
                            <span className={`cc-tag ${status.mailed ? "is-mailed" : "is-made"}`}>
                              {status.mailed ? "Mailed" : "Card made"} · {fmtDateTime(status.ts)}
                            </span>
                          )}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="cc-btn cc-btn-primary cc-make"
                        onClick={() => makeCardFor(c)}
                      >
                        <Cake size={15} strokeWidth={2.1} />
                        {status ? "Make again" : "Make card"}
                        <ArrowRight size={15} strokeWidth={2.1} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      )}

      {mode === "log" && (
        <div className="cc-finder">
          <section className="cc-panel">
            <div className="cc-roster-bar">
              <div className="cc-roster-src">
                <span className="cc-src-label">Cards made this session</span>
                <span className="cc-src-value">
                  {cardLog.length} card{cardLog.length === 1 ? "" : "s"}
                  {cardLog.length > 0 &&
                    ` · ${cardLog.filter((e) => e.mailed).length} marked mailed`}
                </span>
              </div>
              {cardLog.length > 0 && (
                <div className="cc-roster-tools">
                  <button
                    type="button"
                    className="cc-btn cc-btn-primary cc-btn-sm"
                    onClick={exportLog}
                  >
                    <FileDown size={15} strokeWidth={2.1} />
                    Export CSV
                  </button>
                  <button
                    type="button"
                    className="cc-btn cc-btn-ghost cc-btn-sm"
                    onClick={clearLog}
                  >
                    <Trash2 size={15} strokeWidth={2.1} />
                    Clear log
                  </button>
                </div>
              )}
            </div>

            <p className="cc-roster-help">
              A card is logged when its Cricut file is downloaded — that records it was{" "}
              <em>made</em>. Tick <strong>Mailed</strong> once it actually goes out. This log is
              held in your browser for this session only; nothing is uploaded or saved.
            </p>

            {cardLog.length === 0 ? (
              <div className="cc-empty">
                <ClipboardList size={24} strokeWidth={1.5} />
                <p>
                  No cards logged yet. Download a card&apos;s Cricut file and it will appear here,
                  linked to the client when chosen from the roster.
                </p>
              </div>
            ) : (
              <ul className="cc-log-list">
                {cardLog.map((e) => (
                  <li key={e.id} className="cc-log-row">
                    <div className="cc-log-main">
                      <span className="cc-log-name">{e.name}</span>
                      <span className="cc-log-meta">
                        {e.occasionLabel} · template {e.templateIndex + 1} ·{" "}
                        {e.clientId ? "Roster" : "Manual"} · {fmtDateTime(e.ts)}
                      </span>
                    </div>
                    <label className={`cc-mailed ${e.mailed ? "is-on" : ""}`}>
                      <input
                        type="checkbox"
                        checked={e.mailed}
                        onChange={() => toggleMailed(e.id)}
                      />
                      <MailCheck size={14} strokeWidth={2.1} />
                      Mailed
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      <footer className="cc-footer">
        Placeholder copy for review. Final templates pending supervisor and Compliance approval.
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');

.cc-root{
  --paper:#FBFAF4; --app:#EEF1EF; --panel:#FFFFFF; --ink:#20304A;
  --ink-soft:#5C6B7C; --accent:#2F5D50; --accent-soft:#E7EFEB;
  --brass:#9C7B3F; --line:#E0E5E2;
  font-family:'Inter',system-ui,sans-serif;
  color:var(--ink); background:var(--app);
  min-height:100%; box-sizing:border-box; padding:28px 22px 36px;
  -webkit-font-smoothing:antialiased;
}
.cc-root *{box-sizing:border-box;}

.cc-header{
  display:flex; align-items:flex-end; justify-content:space-between;
  gap:16px; flex-wrap:wrap; max-width:1060px; margin:0 auto 22px;
}
.cc-eyebrow{
  margin:0 0 6px; font-size:11.5px; letter-spacing:1.6px; text-transform:uppercase;
  color:var(--accent); font-weight:600;
}
.cc-title{
  margin:0; font-family:'Fraunces',Georgia,serif; font-weight:600;
  font-size:30px; letter-spacing:-0.3px; line-height:1;
}
.cc-badge{
  display:inline-flex; align-items:center; gap:6px;
  font-size:12px; color:var(--ink-soft); background:var(--panel);
  border:1px solid var(--line); border-radius:999px; padding:6px 12px;
}

.cc-layout{
  max-width:1060px; margin:0 auto;
  display:grid; grid-template-columns:1fr 1fr; gap:18px; align-items:start;
}
.cc-panel{
  background:var(--panel); border:1px solid var(--line);
  border-radius:16px; padding:20px;
}

.cc-field{margin-bottom:18px;}
.cc-field:last-child{margin-bottom:0;}
.cc-label{
  display:block; font-size:12px; font-weight:600; letter-spacing:0.3px;
  color:var(--ink-soft); margin-bottom:8px;
}

.cc-occ-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:8px;}
.cc-occ{
  display:flex; flex-direction:column; align-items:center; gap:6px;
  padding:12px 6px; border:1px solid var(--line); border-radius:11px;
  background:#fff; color:var(--ink-soft); cursor:pointer;
  font-size:12px; font-weight:500; font-family:inherit;
  transition:border-color .15s, background .15s, color .15s, transform .12s;
}
.cc-occ:hover{border-color:var(--accent); color:var(--ink);}
.cc-occ.is-active{
  border-color:var(--accent); background:var(--accent-soft); color:var(--accent);
}
.cc-occ span{line-height:1.1; text-align:center;}

.cc-input{
  width:100%; padding:10px 12px; font-family:inherit; font-size:14px;
  color:var(--ink); background:#fff; border:1px solid var(--line);
  border-radius:10px; transition:border-color .15s, box-shadow .15s;
}
.cc-input::placeholder{color:#A9B2BC;}
.cc-input:focus{outline:none; border-color:var(--accent);
  box-shadow:0 0 0 3px var(--accent-soft);}

.cc-tpl-list{display:flex; flex-direction:column; gap:9px;}
.cc-tpl{
  display:flex; gap:11px; text-align:left; padding:12px 13px;
  border:1px solid var(--line); border-radius:11px; background:#fff;
  cursor:pointer; font-family:inherit; transition:border-color .15s, background .15s;
}
.cc-tpl:hover{border-color:var(--accent);}
.cc-tpl.is-active{border-color:var(--accent); background:var(--accent-soft);}
.cc-tpl-num{
  flex:0 0 auto; width:20px; height:20px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  font-size:11px; font-weight:600; color:var(--accent);
  border:1px solid var(--accent); margin-top:1px;
}
.cc-tpl.is-active .cc-tpl-num{background:var(--accent); color:#fff;}
.cc-tpl-text{font-size:13px; line-height:1.45; color:var(--ink);}

.cc-preview{
  position:sticky; top:18px;
  display:flex; flex-direction:column; gap:16px;
}
.cc-card-stage{
  display:flex; justify-content:center;
  padding:8px; border-radius:12px;
  background:linear-gradient(160deg,#F6F8F6,#E9EDEA);
}
.cc-card{
  width:100%; max-width:430px;
  filter:drop-shadow(0 10px 22px rgba(32,48,74,0.16));
}
.cc-card svg{display:block; width:100%; height:auto; border-radius:14px;}

.cc-actions{display:flex; gap:10px; flex-wrap:wrap;}
.cc-btn{
  flex:1 1 160px; display:inline-flex; align-items:center; justify-content:center;
  gap:8px; padding:11px 14px; border-radius:10px; font-family:inherit;
  font-size:13.5px; font-weight:600; cursor:pointer; border:1px solid transparent;
  transition:background .15s, border-color .15s, transform .12s;
}
.cc-btn:active{transform:translateY(1px);}
.cc-btn-primary{background:var(--accent); color:#fff;}
.cc-btn-primary:hover{background:#274d43;}
.cc-btn-ghost{background:#fff; color:var(--ink); border-color:var(--line);}
.cc-btn-ghost:hover{border-color:var(--accent); color:var(--accent);}

.cc-note{
  margin:0; font-size:12.5px; line-height:1.5; color:var(--ink-soft);
  background:var(--accent-soft); border-radius:10px; padding:11px 13px;
}
.cc-note strong{color:var(--accent); font-weight:600;}

.cc-footer{
  max-width:1060px; margin:22px auto 0; text-align:center;
  font-size:12px; color:var(--ink-soft);
}

/* ---- Mode tabs ---- */
.cc-tabwrap{max-width:1060px; margin:0 auto 18px;}
.cc-tabs{
  display:inline-flex; gap:4px; padding:4px;
  background:var(--panel); border:1px solid var(--line); border-radius:12px;
}
.cc-tab{
  display:inline-flex; align-items:center; gap:7px;
  padding:8px 16px; border:none; border-radius:9px; cursor:pointer;
  font-family:inherit; font-size:13.5px; font-weight:600;
  color:var(--ink-soft); background:transparent;
  transition:background .15s, color .15s;
}
.cc-tab:hover{color:var(--ink);}
.cc-tab.is-active{background:var(--accent); color:#fff;}
.cc-tab-count{
  display:inline-flex; align-items:center; justify-content:center;
  min-width:18px; height:18px; padding:0 5px; border-radius:999px;
  font-size:11px; font-weight:700; background:var(--brass); color:#fff;
}
.cc-tab.is-active .cc-tab-count{background:rgba(255,255,255,0.28);}

/* ---- Status tag (finder rows) ---- */
.cc-tag{
  display:inline-block; margin-left:8px; padding:1px 8px; border-radius:999px;
  font-size:11px; font-weight:600; vertical-align:middle;
}
.cc-tag.is-made{background:var(--accent-soft); color:var(--accent);}
.cc-tag.is-mailed{background:#E7EFEB; color:#1f6f4f; border:1px solid #BFD8CC;}

/* ---- Card log ---- */
.cc-log-list{list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:8px;}
.cc-log-row{
  display:flex; align-items:center; justify-content:space-between; gap:14px;
  padding:11px 13px; border:1px solid var(--line); border-radius:11px; background:#fff;
}
.cc-log-main{display:flex; flex-direction:column; gap:3px; min-width:0;}
.cc-log-name{font-size:14.5px; font-weight:600; color:var(--ink);}
.cc-log-meta{font-size:12px; color:var(--ink-soft);}
.cc-mailed{
  display:inline-flex; align-items:center; gap:6px; flex:0 0 auto;
  padding:7px 11px; border:1px solid var(--line); border-radius:9px;
  font-size:12.5px; font-weight:600; color:var(--ink-soft); cursor:pointer;
  transition:border-color .15s, background .15s, color .15s;
}
.cc-mailed input{margin:0; cursor:pointer;}
.cc-mailed.is-on{background:#E7EFEB; border-color:#BFD8CC; color:#1f6f4f;}

/* ---- Birthday finder ---- */
.cc-finder{max-width:1060px; margin:0 auto;}

.cc-roster-bar{
  display:flex; align-items:center; justify-content:space-between; gap:14px;
  flex-wrap:wrap; padding-bottom:16px; margin-bottom:16px;
  border-bottom:1px solid var(--line);
}
.cc-roster-src{display:flex; flex-direction:column; gap:2px;}
.cc-src-label{
  font-size:11px; font-weight:600; letter-spacing:0.4px;
  text-transform:uppercase; color:var(--ink-soft);
}
.cc-src-value{font-size:14px; font-weight:600; color:var(--ink);}
.cc-roster-tools{display:flex; gap:8px; flex-wrap:wrap;}
.cc-btn-sm{flex:0 0 auto; padding:8px 12px; font-size:12.5px;}

.cc-roster-help{
  margin:0 0 14px; font-size:12.5px; line-height:1.5; color:var(--ink-soft);
}
.cc-roster-help code{
  font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:12px;
  background:var(--accent-soft); color:var(--accent);
  padding:1px 6px; border-radius:5px;
}
.cc-roster-status{
  margin:0 0 14px; font-size:13px; font-weight:500;
  padding:9px 12px; border-radius:9px;
}
.cc-roster-status.is-ok{background:var(--accent-soft); color:var(--accent);}
.cc-roster-status.is-err{background:#FBECEC; color:#A23B3B;}

.cc-month-grid{display:grid; grid-template-columns:repeat(6,1fr); gap:7px;}
.cc-month{
  padding:9px 4px; border:1px solid var(--line); border-radius:9px;
  background:#fff; color:var(--ink-soft); cursor:pointer;
  font-family:inherit; font-size:12.5px; font-weight:600;
  transition:border-color .15s, background .15s, color .15s;
}
.cc-month:hover{border-color:var(--accent); color:var(--ink);}
.cc-month.is-active{border-color:var(--accent); background:var(--accent); color:#fff;}

.cc-roster-head{
  display:flex; align-items:center; gap:10px; margin:22px 0 12px;
  font-family:'Fraunces',Georgia,serif; font-size:18px; font-weight:600;
}
.cc-count{
  display:inline-flex; align-items:center; justify-content:center;
  min-width:24px; height:24px; padding:0 7px; border-radius:999px;
  background:var(--accent-soft); color:var(--accent);
  font-family:'Inter',sans-serif; font-size:12.5px; font-weight:600;
}

.cc-client-list{list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:9px;}
.cc-client{
  display:flex; align-items:center; gap:14px;
  padding:11px 13px; border:1px solid var(--line); border-radius:12px; background:#fff;
}
.cc-client-date{
  flex:0 0 auto; width:48px; text-align:center; line-height:1;
  border-right:1px solid var(--line); padding-right:12px;
}
.cc-client-mon{
  display:block; font-size:10.5px; font-weight:600; letter-spacing:1px;
  text-transform:uppercase; color:var(--accent);
}
.cc-client-day{
  display:block; margin-top:3px; font-family:'Fraunces',Georgia,serif;
  font-size:22px; font-weight:600; color:var(--ink);
}
.cc-client-info{display:flex; flex-direction:column; gap:2px; flex:1 1 auto; min-width:0;}
.cc-client-name{font-size:14.5px; font-weight:600; color:var(--ink);}
.cc-client-meta{font-size:12.5px; color:var(--ink-soft);}
.cc-make{flex:0 0 auto;}

.cc-empty{
  display:flex; flex-direction:column; align-items:center; gap:10px;
  text-align:center; padding:34px 20px; color:var(--ink-soft);
  border:1px dashed var(--line); border-radius:12px; background:#FAFBFA;
}
.cc-empty p{margin:0; font-size:13.5px; max-width:320px; line-height:1.5;}

.cc-btn:focus-visible,.cc-occ:focus-visible,.cc-tpl:focus-visible,
.cc-tab:focus-visible,.cc-month:focus-visible{
  outline:2px solid var(--accent); outline-offset:2px;
}

@media (max-width:760px){
  .cc-layout{grid-template-columns:1fr;}
  .cc-preview{position:static;}
  .cc-occ-grid{grid-template-columns:repeat(2,1fr);}
  .cc-tabs{display:flex; width:100%;}
  .cc-tab{flex:1;}
  .cc-client{flex-wrap:wrap;}
  .cc-make{width:100%; justify-content:center; margin-top:4px;}
}
@media (prefers-reduced-motion:reduce){
  .cc-root *{transition:none !important;}
}
`;
