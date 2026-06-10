/* global React, ICON, Ic */
// Reservations timeline (PMS Operations) — recreated from the product screenshot.
// Clicking a reservation opens the A1 detail panel as a right drawer.

const DAYS = ["Mon 18", "Tue 19", "Wed 20", "Thu 21", "Fri 22", "Sat 23", "Sun 24", "Mon 25"];
const NCOLS = DAYS.length;
const NOW_PCT = (2 / NCOLS) * 100; // line after Tue 19

const BAR_ICON = {
  lock: ICON.lock, arrival: ICON.checkin, departure: ICON.checkout,
  home: ICON.home, question: ICON.help, cancel: ICON.cross,
  calendar: ICON.calendar, key: ICON.key, alert: ICON.problematic,
};

// status code → text + background colors (tag-style)
const ST_TONE = {
  INS: { fg: "var(--mews-green-700)", bg: "var(--mews-green-25)" },
  CLE: { fg: "var(--mews-night-700)", bg: "var(--mews-night-50)" },
  DIR: { fg: "var(--mews-orange-800)", bg: "var(--mews-orange-25)" },
  OOS: { fg: "var(--mews-red-700)", bg: "var(--mews-red-25)" },
};

const BAR_TONE = {
  default: { bg: "#fff", bd: "var(--mews-night-200)", fg: "var(--mews-text-primary)", icon: "var(--mews-text-tertiary)", hatch: true },
  blue: { bg: "var(--mews-blue-25)", bd: "var(--mews-blue-100)", fg: "var(--mews-blue-800)", icon: "var(--mews-blue-600)", hatch: true },
  red: { bg: "var(--mews-red-25)", bd: "var(--mews-red-100)", fg: "var(--mews-red-700)", icon: "var(--mews-red-600)" },
  orange: { bg: "var(--mews-orange-25)", bd: "var(--mews-orange-100)", fg: "var(--mews-orange-800)", icon: "var(--mews-orange-700)" },
};

const HATCH = "repeating-linear-gradient(135deg, rgba(33,33,46,.035) 0 1px, transparent 1px 7px)";

// Reservation lifecycle status derived from position relative to "now" (Tue 19/Wed 20 line).
const NOW = 2; // day units
function statusFor(r) {
  if (r.tone === "blue") return "To check in";
  if (r.tone === "orange") return "Due out";
  if (r.e <= NOW) return "Checked out";
  if (r.s >= NOW) return r.s <= 3 ? "To check in" : "Confirmed";
  return r.e <= 3 ? "Due out" : "Checked in";
}

// ---- DATA ----
const GROUPS = [
  {
    name: "DBL", avail: ["5 out of 7", "5 out of 7", "5 out of 7", "5 out of 7", "5 out of 7", "5 out of 7", "5 out of 7", "5 out of 7"],
    rooms: [
      { no: "101", st: "INS", res: [{ s: -0.5, e: 1, guest: "Sandra Marshall", lead: ["home"] }] },
      { no: "102", st: "CLE", res: [
        { s: 1.5, e: 3.5, guest: "Jennifer Hans", tone: "blue", lead: ["lock", "arrival"], vip: true, recur: true, tip: "To check in" },
        { s: 6.5, e: 8.2, guest: "Frank Sinny", lead: ["calendar"] }] },
      { no: "103", st: "INS", res: [
        { s: -0.5, e: 1.5, guest: "Katia Andersson", vip: true, recur: true },
        { s: 2.5, e: 5.5, guest: "Marco Barbieri", lead: ["lock", "question"] },
        { s: 6.5, e: 8.5, guest: "Jack Smith", lead: ["lock", "calendar"], recur: true }] },
      { no: "104", st: "DIR", res: [{ s: 1.5, e: 4.5, guest: "Anthony Camillo", lead: ["lock", "departure"] }] },
      { no: "105", st: "DIR", res: [
        { s: -0.5, e: 2.5, label: "Out of order", tone: "red", lead: ["alert"] },
        { s: 5.5, e: 8.5, guest: "Piotr Pattersson", lead: ["question"], recur: true }] },
      { no: "106", st: "CLE", res: [
        { s: 0.5, e: 2.5, guest: "Patricia Velasquez", lead: ["lock", "home"] },
        { s: 2.5, e: 5.6, guest: "Tom Luciano", lead: ["lock", "cancel"], recur: true },
        { s: 6.5, e: 8.5, label: "House use", tone: "red", lead: ["home"], recur: true }] },
      { no: "107", st: "DIR", res: [{ s: 2.5, e: 5.5, guest: "Tatiana Monteros", lead: ["lock", "calendar"] }] },
    ],
  },
  {
    name: "DBL DLX", avail: ["5 out of 7", { t: "2 out of 7", eye: true }, "5 out of 7", "5 out of 7", "5 out of 7", "5 out of 7", "5 out of 7", "5 out of 7"],
    rooms: [
      { no: "108", st: "DIR", res: [{ s: 1.5, e: 4.5, guest: "Lukas Becker", tone: "orange", lead: ["lock", "arrival"] }] },
      { no: "109", st: "CLE", res: [
        { s: -0.5, e: 1, guest: "Sofia Rossi", tone: "blue", vip: true, recur: true },
        { s: 1.5, e: 4.5, guest: "Diego Hernandez", lead: ["lock", "calendar"] }] },
      { no: "110", st: "INS", res: [
        { s: -0.5, e: 1.5, guest: "Yuki Tanaka", lead: ["home"] },
        { s: 5.5, e: 8.5, label: "House use", tone: "red", lead: ["home"] }] },
      { no: "111", st: "CLE", res: [{ s: 1.5, e: 8.5, guest: "Erik Andersen", lead: ["calendar"] }] },
      { no: "112", st: "INS", res: [] },
      { no: "113", st: "CLE", res: [
        { s: 0.5, e: 2.5, guest: "Maya Patel", lead: ["lock", "arrival"] },
        { s: 2.5, e: 6, guest: "Oliver Brown", lead: ["cancel"] },
        { s: 6.5, e: 8.5, guest: "Lena Schmidt", lead: ["lock", "cancel"] }] },
      { no: "114", st: "DIR", res: [
        { s: 1.5, e: 3.5, guest: "Ahmed Hassan", lead: ["lock", "calendar"], recur: true },
        { s: 3.5, e: 6.5, guest: "Clara Dubois", lead: ["lock", "calendar"] }] },
    ],
  },
  {
    name: "TRL", avail: ["5 out of 7", "5 out of 7", "5 out of 7", "5 out of 7", "5 out of 7", "5 out of 7", "5 out of 7", "5 out of 7"],
    rooms: [
      { no: "115", st: "CLE", res: [] },
      { no: "116", st: "INS", res: [
        { s: 2, e: 4.5, guest: "Nora Holm", tone: "blue", lead: ["lock", "arrival"] },
        { s: 6.5, e: 8.5, guest: "Hugo Martin", lead: ["lock", "question"] }] },
      { no: "117", st: "OOS", res: [
        { s: -0.5, e: 2, guest: "Wei Chen", lead: ["home"] },
        { s: 2.5, e: 5.5, label: "Out of order", tone: "red", lead: ["alert"] },
        { s: 6.5, e: 8.5, guest: "Ines Ferreira", lead: ["lock", "calendar"] }] },
      { no: "118", st: "CLE", res: [{ s: 2.5, e: 6.5, guest: "Liam O'Brien", lead: ["lock", "arrival"] }] },
      { no: "119", st: "DIR", res: [
        { s: -0.5, e: 2, guest: "Saskia Berg", tone: "orange", lead: ["departure"] },
        { s: 6.5, e: 8.5, guest: "Felix Mayer", lead: ["lock", "calendar"], recur: true }] },
      { no: "120", st: "DIR", res: [
        { s: 0.5, e: 2.5, guest: "Maja Kowalska", lead: ["lock", "home"] },
        { s: 2.5, e: 5.5, guest: "Theo Lambert", lead: ["lock", "cancel"], vip: true },
        { s: 6.5, e: 8.5, guest: "Aiko Yamada", lead: ["lock", "calendar"] }] },
      { no: "121", st: "DIR", res: [{ s: 2.5, e: 5.5, label: "House use", tone: "red", lead: ["home"] }] },
    ],
  },
  {
    name: "TRL DLX", avail: ["5 out of 7", "5 out of 7", "5 out of 7", "5 out of 7", "5 out of 7", "5 out of 7", "5 out of 7", "5 out of 7"],
    rooms: [
      { no: "122", st: "INS", res: [{ s: 1.5, e: 4.5, guest: "Camilla Conti", lead: ["lock", "arrival"] }] },
      { no: "123", st: "CLE", res: [{ s: -0.5, e: 1.5, guest: "Noah Petersen", lead: ["lock", "arrival"] }] },
    ],
  },
];

// Track wrapper: column separators + now-line, children float above
function Track({ children, style }) {
  return (
    <div style={{ position: "relative", flex: 1, minWidth: 0, alignSelf: "stretch",
      backgroundImage: `repeating-linear-gradient(to right, transparent 0, transparent calc(${100 / NCOLS}% - 1px), var(--mews-border-secondary) calc(${100 / NCOLS}% - 1px), var(--mews-border-secondary) ${100 / NCOLS}%)`,
      ...style }}>
      <div style={{ position: "absolute", left: NOW_PCT + "%", top: 0, bottom: 0, width: 2, background: "var(--mews-night-800)", zIndex: 1 }} />
      {children}
    </div>
  );
}

function Bar({ r, onOpen }) {
  const t = BAR_TONE[r.tone || "default"];
  const left = (r.s / NCOLS) * 100;
  const width = ((r.e - r.s) / NCOLS) * 100;
  const clickable = !!r.guest;
  return (
    <div
      onClick={clickable ? () => onOpen(r) : undefined}
      title={r.tip}
      style={{
        position: "absolute", left: `calc(${left}% + 4px)`, width: `calc(${width}% - 8px)`,
        top: 5, height: 28, display: "flex", alignItems: "center", gap: 5, padding: "0 8px",
        background: t.hatch ? `${HATCH}, ${t.bg}` : t.bg, border: "1px solid " + t.bd,
        borderRadius: 7, cursor: clickable ? "pointer" : "default", overflow: "hidden",
        zIndex: 2, transition: "box-shadow 120ms ease, transform 80ms ease",
      }}
      onMouseEnter={(e) => { if (clickable) { e.currentTarget.style.boxShadow = "var(--mews-shadow-200)"; e.currentTarget.style.borderColor = "var(--mews-indigo-300)"; } }}
      onMouseLeave={(e) => { if (clickable) { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = t.bd; } }}
    >
      {(r.lead || []).map((k, i) => <Ic key={i} c={BAR_ICON[k]} s={14} style={{ color: t.icon, flexShrink: 0 }} />)}
      <span style={{ font: "500 13px/1 var(--mews-font-family)", color: t.fg, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>{r.guest || r.label}</span>
      {r.vip && <span style={{ font: "700 9px/1 var(--mews-font-family)", letterSpacing: ".04em", color: "var(--mews-night-800)", background: "var(--mews-night-100)", borderRadius: 3, padding: "3px 4px", flexShrink: 0 }}>VIP</span>}
      {r.recur && <Ic c={ICON.refresh} s={14} style={{ color: t.icon, flexShrink: 0 }} />}
    </div>
  );
}

function RoomRow({ room, onOpen }) {
  return (
    <div style={{ display: "flex", borderBottom: "1px solid var(--mews-border-secondary)", minHeight: 38 }}>
      <div style={{ width: 220, flexShrink: 0, display: "flex", alignItems: "center", gap: 12, padding: "0 16px", borderRight: "1px solid var(--mews-border-secondary)" }}>
        {(() => { const tn = ST_TONE[room.st] || ST_TONE.CLE; return (
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 18, padding: "0 6px", borderRadius: 4, font: "600 10px/1 var(--mews-font-family)", letterSpacing: ".04em", color: tn.fg, background: tn.bg, flexShrink: 0 }}>{room.st}</span>
        ); })()}
        <span style={{ font: "500 14px/1 var(--mews-font-family)", color: "var(--mews-text-primary)" }}>{room.no}</span>
      </div>
      <Track>
        {room.res.map((r, i) => <Bar key={i} r={r} onOpen={onOpen} />)}
      </Track>
    </div>
  );
}

function GroupHeader({ group, open, onToggle }) {
  return (
    <div style={{ display: "flex", background: "var(--mews-night-25)", borderBottom: "1px solid var(--mews-border-secondary)", minHeight: 40 }}>
      <div style={{ width: 220, flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "0 16px", borderRight: "1px solid var(--mews-border-secondary)" }}>
        <button onClick={onToggle} style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--mews-text-secondary)", display: "inline-flex", padding: 2 }}>
          <Ic c={open ? ICON.chevDown : ICON.chevRight} s={18} />
        </button>
        <span style={{ font: "600 15px/1 var(--mews-font-family)", color: "var(--mews-text-primary)" }}>{group.name}</span>
        <span style={{ marginLeft: "auto", font: "400 12px/1 var(--mews-font-family)", color: "var(--mews-text-tertiary)" }}>Availability</span>
      </div>
      <Track>
        <div style={{ position: "absolute", inset: 0, display: "flex" }}>
          {group.avail.map((a, i) => {
            const txt = typeof a === "string" ? a : a.t;
            const eye = typeof a === "object" && a.eye;
            return (
              <div key={i} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, font: "400 13px/1 var(--mews-font-family)", color: "var(--mews-text-secondary)" }}>
                {txt}{eye && <Ic c={ICON.show} s={15} style={{ color: "var(--mews-text-tertiary)" }} />}
              </div>
            );
          })}
        </div>
      </Track>
    </div>
  );
}

function DayHeader() {
  return (
    <div style={{ display: "flex", borderBottom: "1px solid var(--mews-border-primary)", position: "sticky", top: 0, zIndex: 5, background: "#fff", minHeight: 40 }}>
      <div style={{ width: 220, flexShrink: 0, display: "flex", alignItems: "center", padding: "0 16px", borderRight: "1px solid var(--mews-border-secondary)" }}>
        <span style={{ font: "600 16px/1 var(--mews-font-family)", color: "var(--mews-text-primary)" }}>October 2024</span>
      </div>
      <Track>
        <div style={{ position: "absolute", inset: 0, display: "flex" }}>
          {DAYS.map((d, i) => {
            const today = i === 1, note = i === 2;
            return (
              <div key={i} style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "0 16px" }}>
                {today ? (
                  <span style={{ background: "var(--mews-night-800)", color: "#fff", borderRadius: 6, padding: "3px 8px", font: "600 13px/1 var(--mews-font-family)" }}>{d}</span>
                ) : (
                  <span style={{ font: "600 14px/1 var(--mews-font-family)", color: "var(--mews-text-primary)" }}>{d}</span>
                )}
                {note && <span style={{ marginLeft: "auto", width: 22, height: 22, borderRadius: "50%", background: "var(--mews-indigo-600)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", font: "600 11px/1 var(--mews-font-family)" }}>N</span>}
              </div>
            );
          })}
        </div>
      </Track>
    </div>
  );
}

function TimelineGrid({ onOpen }) {
  const [openGroups, setOpenGroups] = React.useState(() => GROUPS.map(() => true));
  const toggle = (i) => setOpenGroups((g) => g.map((v, j) => (j === i ? !v : v)));
  return (
    <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", background: "#fff" }}>
      <DayHeader />
      {GROUPS.map((g, gi) => (
        <div key={gi}>
          <GroupHeader group={g} open={openGroups[gi]} onToggle={() => toggle(gi)} />
          {openGroups[gi] && g.rooms.map((room) => <RoomRow key={room.no} room={room} onOpen={(r) => onOpen(r, room)} />)}
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { TimelineGrid, statusFor });
