/* global React, ICON, Ic, GhostBtn, TimelineGrid, statusFor, ResPanel */
// App chrome (app bar + side rail + toolbar) and the slide-in detail drawer.

function RailIcon({ icon, active, title }) {
  return (
    <button title={title} style={{
      width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
      border: "none", borderRadius: 10, cursor: "pointer",
      background: active ? "var(--mews-indigo-25)" : "transparent",
      color: active ? "var(--mews-indigo-600)" : "var(--mews-night-500)",
      transition: "background 120ms ease",
    }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--mews-night-50)"; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}>
      <Ic c={icon} s={22} />
    </button>
  );
}

function SideRail() {
  return (
    <div style={{ width: 64, flexShrink: 0, borderRight: "1px solid var(--mews-border-secondary)", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 0", gap: 4 }}>
      <RailIcon icon={ICON.property} active title="Property" />
      <RailIcon icon={ICON.profile} title="Guests" />
      <RailIcon icon={ICON.time} title="History" />
      <RailIcon icon={ICON.calendar} title="Calendar" />
      <RailIcon icon={ICON.task} title="Tasks" />
      <RailIcon icon={ICON.analytics} title="Reports" />
      <RailIcon icon={ICON.upload} title="Exports" />
      <RailIcon icon={ICON.refresh} title="Sync" />
      <RailIcon icon={ICON.integrations} title="Integrations" />
      <RailIcon icon={ICON.settings} title="Settings" />
      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <RailIcon icon={ICON.logout} title="Open in new" />
        <span style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", background: "var(--mews-indigo-100)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--mews-indigo-700)", font: "600 12px/1 var(--mews-font-family)" }}>JD</span>
      </div>
    </div>
  );
}

function AppBar() {
  return (
    <div style={{ height: 56, flexShrink: 0, display: "flex", alignItems: "center", gap: 12, padding: "0 14px", borderBottom: "1px solid var(--mews-border-secondary)", background: "#fff" }}>
      <span style={{ width: 36, height: 36, borderRadius: 9, background: "var(--mews-night-900)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <img src={(window.__resources && window.__resources.mewsIcon) || "assets/mews_icon.png"} alt="Mews" style={{ width: 20, height: 20, filter: "invert(1)" }} />
      </span>
      <GhostBtn icon={ICON.menu} title="Collapse" style={{ border: "none" }} />
      <div style={{ flex: 1, maxWidth: 760, height: 40, display: "flex", alignItems: "center", gap: 10, padding: "0 12px", border: "1px solid var(--mews-border-secondary)", borderRadius: 10, background: "var(--mews-night-25)" }}>
        <Ic c={ICON.search} s={18} style={{ color: "var(--mews-text-tertiary)" }} />
        <span style={{ flex: 1, font: "400 14px/1 var(--mews-font-family)", color: "var(--mews-text-tertiary)" }}>Search through the property</span>
        <span style={{ display: "flex", gap: 4 }}>
          {["Alt", "F"].map((k) => <span key={k} style={{ font: "500 11px/1 var(--mews-font-family)", color: "var(--mews-text-tertiary)", border: "1px solid var(--mews-border-secondary)", borderRadius: 4, padding: "3px 5px", background: "#fff" }}>{k}</span>)}
        </span>
      </div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ position: "relative" }}>
          <GhostBtn icon={ICON.magic} title="Mews AI" style={{ border: "none" }} />
          <span style={{ position: "absolute", top: 0, right: 0, minWidth: 16, height: 16, borderRadius: 999, background: "var(--mews-indigo-600)", color: "#fff", font: "600 10px/16px var(--mews-font-family)", textAlign: "center", padding: "0 3px" }}>3</span>
        </div>
        <GhostBtn icon={ICON.message} title="Messages" style={{ border: "none" }} />
        <GhostBtn icon={ICON.notifications} title="Notifications" style={{ border: "none" }} />
        <button className="mews-btn mews-btn--icon" title="Create" style={{ width: 36, height: 36 }}><Ic c={ICON.plus} s={18} /></button>
      </div>
    </div>
  );
}

function ToolBtn({ children, caret, icon, style }) {
  return (
    <button style={{ height: 36, display: "inline-flex", alignItems: "center", gap: 8, padding: "0 12px", border: "1px solid var(--mews-border-secondary)", borderRadius: 8, background: "#fff", cursor: "pointer", font: "500 14px/1 var(--mews-font-family)", color: "var(--mews-text-primary)", whiteSpace: "nowrap", ...style }}>
      {icon != null && <Ic c={icon} s={16} style={{ color: "var(--mews-text-secondary)" }} />}
      {children}
      {caret && <Ic c={ICON.chevDown} s={16} style={{ color: "var(--mews-text-tertiary)" }} />}
    </button>
  );
}

function Toolbar() {
  return (
    <div style={{ height: 56, flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "0 16px", borderBottom: "1px solid var(--mews-border-secondary)", background: "#fff" }}>
      <ToolBtn icon={ICON.dashboard} style={{ width: 36, padding: 0, justifyContent: "center" }} />
      <ToolBtn caret>Sort by <strong style={{ fontWeight: 600 }}>Week</strong></ToolBtn>
      <ToolBtn caret>View as <strong style={{ fontWeight: 600 }}>Week</strong></ToolBtn>
      <div style={{ display: "flex", gap: 0 }}>
        <ToolBtn style={{ width: 36, padding: 0, justifyContent: "center", borderRadius: "8px 0 0 8px" }} icon={ICON.chevLeft} />
        <ToolBtn style={{ width: 36, padding: 0, justifyContent: "center", borderRadius: "0 8px 8px 0", marginLeft: -1 }} icon={ICON.chevRight} />
      </div>
      <ToolBtn>Today</ToolBtn>
      <ToolBtn style={{ width: 36, padding: 0, justifyContent: "center" }} icon={ICON.calendar} />
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
        <ToolBtn style={{ width: 36, padding: 0, justifyContent: "center" }} icon={ICON.search} />
        <ToolBtn icon={ICON.filter}>Filters</ToolBtn>
        <ToolBtn caret>Shortcuts <strong style={{ fontWeight: 600 }}>Check in</strong></ToolBtn>
        <span style={{ width: 1, height: 24, background: "var(--mews-border-secondary)", margin: "0 2px" }} />
        <ToolBtn style={{ width: 36, padding: 0, justifyContent: "center" }} icon={ICON.filter} />
        <ToolBtn style={{ width: 36, padding: 0, justifyContent: "center" }} icon={ICON.more} />
      </div>
    </div>
  );
}

const ICON_CHEVLEFT = ICON.chevLeft;

const APP_BAR_H = 56;

function Drawer({ sel, onClose, variant }) {
  const [closing, setClosing] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setMounted(true), 10); return () => clearTimeout(t); }, []);
  const close = React.useCallback(() => { setClosing(true); setTimeout(onClose, 240); }, [onClose]);
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);
  const shown = mounted && !closing;
  return (
    <div style={{ position: "fixed", top: APP_BAR_H, right: 0, bottom: 0, width: 720, maxWidth: "94vw", background: "#fff",
      borderLeft: "1px solid var(--mews-border-secondary)", boxShadow: "var(--mews-shadow-300)", zIndex: 45,
      transform: shown ? "translateX(0)" : "translateX(100%)", transition: "transform 260ms cubic-bezier(.22,.61,.36,1)", display: "flex", flexDirection: "column" }}>
      <ResPanel key={sel.guest + sel.status} variant={variant} guest={sel.guest} status={sel.status} onClose={close} />
    </div>
  );
}

function TimelineApp() {
  const variant = (document.getElementById("root").dataset.variant) || "A1";
  const [sel, setSel] = React.useState(null);
  const onOpen = (r, room) => setSel({ guest: r.guest, status: statusFor(r), room: room.no });
  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", background: "var(--mews-bg-flat)", fontFamily: "var(--mews-font-family)" }}>
      <AppBar />
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <SideRail />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <Toolbar />
          <TimelineGrid onOpen={onOpen} />
        </div>
      </div>
      {/* Floating Mews AI button */}
      <button title="Mews AI" style={{ position: "fixed", right: 24, bottom: 24, width: 56, height: 56, borderRadius: "50%", border: "none", background: "var(--mews-night-900)", boxShadow: "var(--mews-shadow-300)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
        <img src={(window.__resources && window.__resources.mewsIcon) || "assets/mews_icon.png"} alt="Mews" style={{ width: 26, height: 26, filter: "invert(1)" }} />
      </button>
      {sel && <Drawer sel={sel} onClose={() => setSel(null)} variant={variant} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<TimelineApp />);
