/* global React, ICON, Ic, Pill, GhostBtn, BareBtn, SummaryContent, TodoTab, TodoTabInline, TodoTabPanel, ReadinessCard, LifecyclePrep */
// Reservation detail panel shell — header + tabs + routed content.

const BASE_TABS = ["Summary", "Group", "Items", "Pricing", "Contracts", "Action log"];

// Reservation lifecycle status → header pill tone
const STATUS_TONE = {
  "Future": "basic", "Confirmed": "basic",
  "To check in": "info",
  "Checked in": "success", "In house": "success",
  "Due out": "warning", "To check out": "warning",
  "Check in missed": "warning",
  "Checked out": "basic",
};

// Inline SVG for the "sort tasks" icon (vertical double arrow + 3 list lines)
function SortListIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* up arrow */}
      <path d="M6 4 L3 7 M6 4 L9 7 M6 4 L6 20 M6 20 L3 17 M6 20 L9 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      {/* three list lines */}
      <line x1="13" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="13" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="13" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

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
            {t.icon != null && <Ic c={t.icon} s={16} style={{ color: on ? "var(--mews-text-primary)" : "var(--mews-text-tertiary)" }} />}
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

// ---------- Add task modal ----------

function FormLabel({ children, required }) {
  return (
    <label style={{ display: "block", font: "500 13px/1.3 var(--mews-font-family)", color: "var(--mews-text-secondary)", marginBottom: 6 }}>
      {children}{required && <span style={{ color: "var(--mews-red-600)", marginLeft: 2 }}>*</span>}
    </label>
  );
}

const fieldShellStyle = {
  display: "flex", alignItems: "center", gap: 8,
  width: "100%", height: 40, padding: "0 12px",
  border: "1px solid var(--mews-border-secondary)", borderRadius: 8, background: "#fff",
  font: "400 14px/1 var(--mews-font-family)", color: "var(--mews-text-primary)",
};

function ToolbarSep() {
  return <span style={{ width: 1, height: 18, background: "var(--mews-border-secondary)", margin: "0 4px" }} />;
}

function ToolbarBtn({ children, title }) {
  return (
    <button type="button" title={title}
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 28, border: "none", background: "transparent", color: "var(--mews-text-secondary)", cursor: "pointer", borderRadius: 6 }}
      onMouseEnter={(e) => e.currentTarget.style.background = "var(--mews-night-50)"}
      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
      {children}
    </button>
  );
}

function AddTaskModal({ onClose }) {
  const [closing, setClosing] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setMounted(true), 10); return () => clearTimeout(t); }, []);
  const close = React.useCallback(() => { setClosing(true); setTimeout(onClose, 200); }, [onClose]);
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);
  const shown = mounted && !closing;
  return ReactDOM.createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 60, fontFamily: "var(--mews-font-family)" }}>
      <div onClick={close} style={{ position: "absolute", inset: 0, background: "rgba(15,15,25,.75)", opacity: shown ? 1 : 0, transition: "opacity 200ms ease" }} />
      <div style={{ position: "absolute", top: 80, right: 0, bottom: 24,
        transform: `translateX(${shown ? 0 : 100}%)`,
        transition: "transform 260ms cubic-bezier(.22,.61,.36,1)",
        width: 720, maxWidth: "100vw", background: "#fff",
        borderRadius: "14px 0 0 14px", boxShadow: "var(--mews-shadow-300)",
        display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px" }}>
          <GhostBtn icon={ICON.cross} title="Close" onClick={close} />
          <span style={{ font: "600 18px/1.3 var(--mews-font-family)", color: "var(--mews-text-primary)" }}>Task</span>
        </div>
        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "4px 20px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <FormLabel>Assignee</FormLabel>
            <div style={fieldShellStyle}>
              <Ic c={ICON.search} s={16} style={{ color: "var(--mews-text-tertiary)" }} />
              <input type="text" placeholder="" style={{ flex: 1, border: "none", outline: "none", font: "inherit", color: "inherit", background: "transparent" }} />
            </div>
          </div>

          <div>
            <FormLabel>Department</FormLabel>
            <div style={{ ...fieldShellStyle, position: "relative" }}>
              <select style={{ flex: 1, border: "none", outline: "none", font: "inherit", color: "inherit", background: "transparent", appearance: "none", cursor: "pointer" }}>
                <option value=""></option>
                <option>Front office</option>
                <option>Housekeeping</option>
                <option>F&amp;B</option>
                <option>Maintenance</option>
              </select>
              <Ic c={ICON.chevDown} s={16} style={{ color: "var(--mews-text-tertiary)", position: "absolute", right: 12, pointerEvents: "none" }} />
            </div>
          </div>

          <div>
            <FormLabel required>Task name</FormLabel>
            <div style={fieldShellStyle}>
              <input type="text" style={{ flex: 1, border: "none", outline: "none", font: "inherit", color: "inherit", background: "transparent" }} />
            </div>
          </div>

          <div>
            <FormLabel>Description</FormLabel>
            <div style={{ border: "1px solid var(--mews-border-secondary)", borderRadius: 8, overflow: "hidden", background: "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", padding: "6px 6px", background: "var(--mews-night-25)", borderBottom: "1px solid var(--mews-border-secondary)" }}>
                <ToolbarBtn title="Heading"><span style={{ font: "700 14px/1 var(--mews-font-family)" }}>H</span></ToolbarBtn>
                <ToolbarBtn title="Bold"><span style={{ font: "700 14px/1 var(--mews-font-family)" }}>B</span></ToolbarBtn>
                <ToolbarBtn title="Italic"><span style={{ font: "italic 600 14px/1 var(--mews-font-family)" }}>I</span></ToolbarBtn>
                <ToolbarSep />
                <ToolbarBtn title="Bulleted list"><Ic c={ICON.menu} s={16} /></ToolbarBtn>
                <ToolbarBtn title="Numbered list"><span style={{ font: "600 12px/1 var(--mews-font-family)" }}>1≣</span></ToolbarBtn>
                <ToolbarBtn title="Quote"><span style={{ font: "700 16px/1 Georgia, serif" }}>“</span></ToolbarBtn>
                <ToolbarSep />
                <ToolbarBtn title="Link"><Ic c={ICON.externalLink} s={16} /></ToolbarBtn>
                <ToolbarBtn title="Image"><Ic c={ICON.camera} s={16} /></ToolbarBtn>
              </div>
              <textarea placeholder="Add a description for the task"
                style={{ display: "block", width: "100%", minHeight: 140, padding: 12, border: "none", outline: "none", resize: "vertical", font: "400 14px/1.5 var(--mews-font-family)", color: "var(--mews-text-primary)", background: "#fff", boxSizing: "border-box" }} />
            </div>
          </div>

          <div>
            <FormLabel>Reservation</FormLabel>
            <div style={{ ...fieldShellStyle, gap: 10 }}>
              <Ic c={ICON.search} s={16} style={{ color: "var(--mews-text-tertiary)" }} />
              <span style={{ font: "500 14px/1 var(--mews-font-family)", color: "var(--mews-text-primary)" }}>John Smith</span>
              <span style={{ font: "400 14px/1 var(--mews-font-family)", color: "var(--mews-text-secondary)" }}>29/11/2025 - 01/12/2025</span>
              <span style={{ font: "400 14px/1 var(--mews-font-family)", color: "var(--mews-text-tertiary)" }}>Confirmed</span>
              <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
                <BareBtn icon={ICON.cross} s={14} title="Clear" color="var(--mews-text-tertiary)" />
                <BareBtn icon={ICON.externalLink} s={14} title="Open reservation" color="var(--mews-text-tertiary)" />
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <FormLabel required>Deadline</FormLabel>
              <div style={{ ...fieldShellStyle, paddingRight: 8 }}>
                <input type="text" defaultValue="20/10/2024" style={{ flex: 1, border: "none", outline: "none", font: "inherit", color: "inherit", background: "transparent" }} />
                <Ic c={ICON.calendar} s={16} style={{ color: "var(--mews-text-tertiary)" }} />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <FormLabel>&nbsp;</FormLabel>
              <div style={{ ...fieldShellStyle, paddingRight: 8 }}>
                <input type="text" defaultValue="09:15" style={{ flex: 1, border: "none", outline: "none", font: "inherit", color: "inherit", background: "transparent" }} />
                <Ic c={ICON.time} s={16} style={{ color: "var(--mews-text-tertiary)" }} />
              </div>
            </div>
          </div>

          <button type="button"
            style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 12px", border: "1px solid var(--mews-border-secondary)", borderRadius: 8, background: "#fff", color: "var(--mews-text-primary)", font: "500 13px/1 var(--mews-font-family)", cursor: "pointer" }}>
            <Ic c={ICON.plus} s={14} />Add another task
          </button>
        </div>
        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 20px", borderTop: "1px solid var(--mews-border-secondary)", background: "#fff" }}>
          <button className="mews-btn mews-btn--tertiary" onClick={close}>Go back</button>
          <button className="mews-btn" onClick={close}>Add task</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function ResPanel({ variant = "ref", guest, status, onClose }) {
  const [addOpen, setAddOpen] = React.useState(false);

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
    const openAdd = () => setAddOpen(true);
    body = variant === "A1" ? <TodoTabInline status={status} onAddTask={openAdd} /> : variant === "A2" ? <TodoTabPanel status={status} onAddTask={openAdd} /> : <TodoTab onDeep={onDeep} />;
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
        {onClose && <GhostBtn icon={ICON.cross} title="Close" onClick={onClose} style={{ flexShrink: 0 }} />}
        <span style={{ font: "500 16px/1.5 var(--mews-font-family)", color: "var(--mews-text-primary)", whiteSpace: "nowrap", flexShrink: 0 }}>4 x</span>
        <span style={{ color: "var(--mews-text-primary)", textDecoration: "underline", textUnderlineOffset: 2, textDecorationColor: "var(--mews-night-150)", fontWeight: 600, fontSize: 16, cursor: "pointer", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{guest || "Selma Willson"}</span>
        <Pill tone={STATUS_TONE[status] || "info"} style={{ flexShrink: 0 }}>{status || "To check in"}</Pill>
        <Pill tone="basic" style={{ flexShrink: 0 }}>Digital key ready</Pill>
        <GhostBtn icon={ICON.bolt} title="Quick actions" active s={14} style={{ width: 24, height: 24, borderRadius: 4, flexShrink: 0 }} />
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <button title="Sort tasks"
            style={{ width: 32, height: 32, display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--mews-border-secondary-action)", background: "var(--mews-bg-flat)", color: "var(--mews-text-primary)", borderRadius: 8, cursor: "pointer", flexShrink: 0, padding: 0 }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--mews-bg-subtle-hover)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "var(--mews-bg-flat)"}>
            <SortListIcon size={18} />
          </button>
          <button className="mews-btn mews-btn--tertiary mews-btn--sm" style={{ height: 32 }}>Billing</button>
        </div>
      </div>
      {/* Tabs */}
      <Tabs tabs={tabs} active={active} setActive={setActive} />
      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", padding: 16, background: "#fff" }}>
        {body}
      </div>
      {addOpen && <AddTaskModal onClose={() => setAddOpen(false)} />}
    </div>
  );
}

Object.assign(window, { ResPanel });
