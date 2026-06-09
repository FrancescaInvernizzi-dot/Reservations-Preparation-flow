/* global React, ICON, Ic, Pill, GhostBtn, SummaryContent, TodoTab, TodoTabInline, TodoTabPanel, ReadinessCard, LifecyclePrep */
// Reservation detail panel shell — header + tabs + routed content.

const BASE_TABS = ["Summary", "Group", "Items", "Pricing", "Contracts", "Action log"];

// Reservation lifecycle status → header pill tone
const STATUS_TONE = {
  "Future": "basic", "Confirmed": "basic",
  "To check in": "info",
  "Checked in": "success", "In house": "success",
  "Due out": "warning", "To check out": "warning",
  "Checked out": "basic",
};

function EmptyTab({ name }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: "72px 24px", textAlign: "center" }}>
      <span style={{ width: 56, height: 56, borderRadius: 14, background: "var(--mews-night-25)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <Ic c={ICON.resPreview} s={26} style={{ color: "var(--mews-text-tertiary)" }} />
      </span>
      <div style={{ font: "600 16px/1.3 var(--mews-font-family)", color: "var(--mews-text-primary)" }}>{name}</div>
      <div style={{ fontSize: 13, color: "var(--mews-text-tertiary)", maxWidth: 320 }}>
        The {name.toLowerCase()} view is unchanged in this exploration.
      </div>
    </div>
  );
}

function Tabs({ tabs, active, setActive }) {
  return (
    <div className="mews-tabs-scroll" style={{ display: "flex", gap: 2, padding: "0 16px", borderBottom: "1px solid var(--mews-border-primary)", overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}>
      {tabs.map((t) => {
        const on = t.name === active;
        return (
          <button key={t.name} onClick={() => setActive(t.name)}
            style={{ border: "none", background: "none", cursor: "pointer", padding: "12px 8px", marginBottom: -1, display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
              font: (on ? "600" : "500") + " 14px/1.4 var(--mews-font-family)",
              color: on ? "var(--mews-text-primary)" : "var(--mews-text-secondary)",
              borderBottom: "2px solid " + (on ? "var(--mews-indigo-500)" : "transparent") }}>
            {t.icon != null && <Ic c={t.icon} s={16} style={{ color: on ? "var(--mews-indigo-600)" : "var(--mews-text-tertiary)" }} />}
            {t.name}
            {t.badge != null && (
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 18, height: 18, padding: "0 5px", borderRadius: 999,
                background: t.badge > 0 ? "var(--mews-indigo-500)" : "var(--mews-night-100)", color: t.badge > 0 ? "#fff" : "var(--mews-text-secondary)", font: "600 11px/1 var(--mews-font-family)" }}>{t.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function ResPanel({ variant = "ref", guest, status, onClose }) {
  const tabs = React.useMemo(() => {
    const t = BASE_TABS.map((name) => ({ name }));
    if (variant === "A" || variant === "A1" || variant === "A2") {
      const openCount = window.TASKS.filter((x) => x.stage === "before" && !x.done).length;
      return [{ name: "To do", icon: ICON.task, badge: openCount }, ...t];
    }
    return t;
  }, [variant]);

  const isTodo = variant === "A" || variant === "A1" || variant === "A2";
  const [active, setActive] = React.useState(isTodo ? "To do" : "Summary");
  const onDeep = (name) => { if (tabs.some((t) => t.name === name)) setActive(name); };

  let body;
  if (active === "To do") {
    body = variant === "A1" ? <TodoTabInline status={status} /> : variant === "A2" ? <TodoTabPanel status={status} /> : <TodoTab onDeep={onDeep} />;
  } else if (active === "Summary") {
    body = (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {variant === "B" && <ReadinessCard onDeep={onDeep} />}
        {variant === "C" && <LifecyclePrep onDeep={onDeep} />}
        <SummaryContent />
      </div>
    );
  } else body = <EmptyTab name={active} />;

  return (
    <div style={{ background: "#fff", display: "flex", flexDirection: "column", height: "100%", position: "relative", fontFamily: "var(--mews-font-family)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px" }}>
        {onClose && <GhostBtn icon={ICON.cross} title="Close" onClick={onClose} style={{ border: "none", marginLeft: -6, flexShrink: 0 }} />}
        <span style={{ font: "500 16px/1.5 var(--mews-font-family)", color: "var(--mews-text-primary)", whiteSpace: "nowrap", flexShrink: 0 }}>4 x</span>
        <span style={{ color: "var(--mews-text-primary)", textDecoration: "underline", textUnderlineOffset: 2, textDecorationColor: "var(--mews-night-150)", fontWeight: 600, fontSize: 16, cursor: "pointer", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{guest || "Selma Willson"}</span>
        <Pill tone={STATUS_TONE[status] || "info"} style={{ flexShrink: 0 }}>{status || "To check in"}</Pill>
        <GhostBtn icon={ICON.bolt} title="Quick actions" style={{ flexShrink: 0 }} />
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <GhostBtn icon={ICON.settings} title="View settings" />
          <button className="mews-btn mews-btn--tertiary mews-btn--sm" style={{ height: 32 }}>Billing</button>
        </div>
      </div>
      {/* Tabs */}
      <Tabs tabs={tabs} active={active} setActive={setActive} />
      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", padding: 16, background: "#fff" }}>
        {body}
      </div>
    </div>
  );
}

Object.assign(window, { ResPanel });
