/* global React */
// Shared MDS primitives for the reservation detail panel
// Icon font codepoints (Optimus). Names mirror optimus-icons.json.
const ICON = {
  bolt: 0xe97b, profile: 0xea04, print: 0xe9f7, mails: 0xe98c, settings: 0xea45,
  edit: 0xe8f2, task: 0xea6d, resPreview: 0xea1e, resGroup: 0xea1a, bills: 0xe84f,
  contract: 0xe8b1, actionLog: 0xe806, checkin: 0xe895, cardKeys: 0xe875,
  doneCircle: 0xe8e3, done: 0xe8e4, alertCircle: 0xe811, problematic: 0xe9f9,
  info: 0xe962, paymentCard: 0xe9d4, payments: 0xe9da, key: 0xe971, idCard: 0xe956,
  passport: 0xe9cc, food: 0xe931, bed: 0xe8ea, broom: 0xe858, time: 0xea84,
  magic: 0xe98a, stars: 0xea5d, lock: 0xe982, loyalty: 0xe986, chevDown: 0xe899,
  chevUp: 0xe89f, chevRight: 0xe89d, chevLeft: 0xe89b, more: 0xe9b7, plus: 0xe9ec, guestInHouse: 0xe943,
  cross: 0xe8c1, arrowUp: 0xe825, arrowRight: 0xe821, arrowLeft: 0xe81f,
  // timeline chrome
  property: 0xea08, analytics: 0xe813, calendar: 0xe867, upload: 0xeaab,
  integrations: 0xe968, refresh: 0xea14, menu: 0xe9a4, collapse: 0xe8a9,
  notifications: 0xe9c3, message: 0xe9a8, search: 0xea3a, filter: 0xe925,
  checkout: 0xe897, reservations: 0xea24, help: 0xe949, home: 0xe94f,
  dashboard: 0xe8cf, hide: 0xe94b, show: 0xea4b, logout: 0xe984,
};

function Ic({ c, s = 16, style, className = "" }) {
  return (
    <i className={"mews-icon " + className} style={{ fontSize: s, ...style }}>
      {String.fromCharCode(c)}
    </i>
  );
}

// Underlined standalone link
function ALink({ children, strong = true, size = 14, onClick }) {
  return (
    <span
      onClick={onClick}
      style={{
        color: "var(--mews-text-primary-action)",
        textDecoration: "underline",
        textUnderlineOffset: 2,
        textDecorationColor: "var(--mews-indigo-200)",
        fontWeight: strong ? 600 : 400,
        fontSize: size,
        cursor: "pointer",
      }}
    >
      {children}
    </span>
  );
}

// Generic small pill (status-indicator style)
function Pill({ children, tone = "basic", outlined = false, icon, style }) {
  const tones = {
    info:    { bg: "var(--mews-blue-25)",   bd: "var(--mews-blue-100)",   fg: "var(--mews-blue-700)" },
    success: { bg: "var(--mews-green-25)",  bd: "var(--mews-green-100)",  fg: "var(--mews-green-700)" },
    warning: { bg: "var(--mews-orange-25)", bd: "var(--mews-orange-100)", fg: "var(--mews-orange-800)" },
    danger:  { bg: "var(--mews-red-25)",    bd: "var(--mews-red-100)",    fg: "var(--mews-red-700)" },
    primary: { bg: "var(--mews-indigo-25)", bd: "var(--mews-indigo-100)", fg: "var(--mews-indigo-700)" },
    basic:   { bg: "var(--mews-night-50)",  bd: "var(--mews-night-150)",  fg: "var(--mews-night-700)" },
  };
  const t = tones[tone] || tones.basic;
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 4, height: 24,
        padding: icon ? "0 8px 0 6px" : "0 8px", borderRadius: 4,
        font: "500 12px/1 var(--mews-font-family)", whiteSpace: "nowrap",
        background: outlined ? "transparent" : t.bg,
        border: "1px solid " + (outlined ? "var(--mews-night-200)" : t.bd),
        color: outlined ? "var(--mews-night-700)" : t.fg, ...style,
      }}
    >
      {icon != null && <Ic c={icon} s={14} />}
      {children}
    </span>
  );
}

// Categorical tag (room type / segment) — 20px, neutral by default
function Tag({ children, color = "basicBold", style }) {
  return <span className={"mews-tag mews-tag--" + color} style={style}>{children}</span>;
}

// Ghost icon button (32px)
function GhostBtn({ icon, s = 16, title, onClick, active = false, style }) {
  return (
    <button
      title={title} onClick={onClick}
      style={{
        width: 32, height: 32, display: "inline-flex", alignItems: "center",
        justifyContent: "center", border: "1px solid var(--mews-border-secondary-action)",
        background: active ? "var(--mews-indigo-25)" : "var(--mews-bg-flat)",
        color: active ? "var(--mews-indigo-600)" : "var(--mews-text-primary)",
        borderRadius: 8, cursor: "pointer", flexShrink: 0,
        transition: "background 120ms ease, border-color 120ms ease", ...style,
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--mews-bg-subtle-hover)"; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "var(--mews-bg-flat)"; }}
    >
      <Ic c={icon} s={s} />
    </button>
  );
}

// Bare ghost icon button (no border) — used for edit pencils / chevrons
function BareBtn({ icon, s = 18, title, onClick, color = "var(--mews-text-primary)", style }) {
  return (
    <button
      title={title} onClick={onClick}
      style={{
        width: 32, height: 32, display: "inline-flex", alignItems: "center",
        justifyContent: "center", border: "none", background: "transparent",
        color, borderRadius: 6, cursor: "pointer", flexShrink: 0,
        transition: "background 120ms ease", ...style,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--mews-bg-subtle-hover)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <Ic c={icon} s={s} />
    </button>
  );
}

// Label / value row
function Field({ label, children, valueColor }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "44% 56%", alignItems: "center", minHeight: 24 }}>
      <span style={{ color: "var(--mews-text-secondary)", fontSize: 14 }}>{label}</span>
      <span style={{ color: valueColor || "var(--mews-text-primary)", fontSize: 14, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        {children}
      </span>
    </div>
  );
}

// Sub-section inside the main card (title + edit, hairline above)
function SubSection({ title, onEdit, first = false, children, titleRight }) {
  return (
    <div style={{ padding: first ? "0" : "16px 0 0", borderTop: first ? "none" : "1px solid var(--mews-border-secondary)", marginTop: first ? 0 : 16 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
        <h3 style={{ margin: 0, font: "600 14px/1.5 var(--mews-font-family)", color: "var(--mews-text-primary)" }}>{title}</h3>
        {titleRight}
        {onEdit && <BareBtn icon={ICON.edit} title="Edit" onClick={onEdit} style={{ marginLeft: "auto" }} />}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{children}</div>
    </div>
  );
}

// Collapsible card (its own bordered card)
function Accordion({ title, badge, subtitle, defaultOpen = true, onEdit, right, icon, children }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div style={{ border: "1px solid var(--mews-border-secondary)", borderRadius: 8, background: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 12px 12px 12px" }}>
        <button
          onClick={() => setOpen(!open)}
          style={{ width: 24, height: 24, border: "none", background: "transparent", cursor: "pointer", color: "var(--mews-text-primary)", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0 }}
        >
          <Ic c={open ? ICON.chevUp : ICON.chevDown} s={20} />
        </button>
        {icon != null && <Ic c={icon} s={18} style={{ color: "var(--mews-text-secondary)" }} />}
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ font: "600 14px/1.4 var(--mews-font-family)", color: "var(--mews-text-primary)" }}>{title}</span>
            {badge != null && (
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 18, height: 18, padding: "0 5px", borderRadius: 999, background: "var(--mews-indigo-500)", color: "#fff", font: "600 11px/1 var(--mews-font-family)" }}>{badge}</span>
            )}
          </div>
          {subtitle && <span style={{ font: "400 12px/1.4 var(--mews-font-family)", color: "var(--mews-text-tertiary)" }}>{subtitle}</span>}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
          {right}
          {onEdit && <BareBtn icon={ICON.edit} title="Edit" onClick={onEdit} />}
        </div>
      </div>
      {open && <div style={{ padding: "0 16px 16px 16px", borderTop: "1px solid var(--mews-border-secondary)" }}>{children}</div>}
    </div>
  );
}

// Lock toggle (room assignment) — indigo, locked + on
function LockToggle({ on = true }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", width: 44, height: 24, borderRadius: 999, background: on ? "var(--mews-indigo-500)" : "var(--mews-night-200)", padding: 2, justifyContent: on ? "flex-end" : "flex-start", position: "relative" }}>
      {on && <Ic c={ICON.lock} s={11} style={{ color: "#fff", position: "absolute", left: 6, top: "50%", transform: "translateY(-50%)" }} />}
      <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,.25)" }} />
    </span>
  );
}

// Circular progress ring
function Ring({ value, total, size = 56, stroke = 6, label }) {
  const pct = total ? value / total : 0;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const done = pct >= 1;
  const col = done ? "var(--mews-green-500)" : "var(--mews-indigo-500)";
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--mews-night-100)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} style={{ transition: "stroke-dashoffset 420ms cubic-bezier(.22,.61,.36,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        {done ? <Ic c={ICON.done} s={22} style={{ color: "var(--mews-green-600)" }} /> : <span style={{ font: "600 14px/1 var(--mews-font-family)", color: "var(--mews-text-primary)" }}>{label != null ? label : `${value}/${total}`}</span>}
      </div>
    </div>
  );
}

Object.assign(window, { ICON, Ic, ALink, Pill, Tag, GhostBtn, BareBtn, Field, SubSection, Accordion, LockToggle, Ring });
