/* global React, ICON, Ic, ALink, Pill, Tag, BareBtn, Ring, SummaryContent, getFlow */
// Preparation-phase task model + the three exploration UIs.

const STAGES = [
  { id: "before", label: "Before check-in", hint: "Preparation" },
  { id: "during", label: "During stay", hint: "In house" },
  { id: "after", label: "Before check-out", hint: "Departure" },
];

// A1 / A2 split the preparation phase into Before check-in + At check-in
const STAGES_SPLIT = [
  { id: "before", label: "Before check-in", hint: "Preparation", match: (t) => t.stage === "before" && !t.atCheckin },
  { id: "atcheckin", label: "At check-in", hint: "Arrival", match: (t) => t.stage === "before" && t.atCheckin },
  { id: "during", label: "During stay", hint: "In house", match: (t) => t.stage === "during" },
  { id: "after", label: "Before check-out", hint: "Departure", match: (t) => t.stage === "after" },
];

// tone: danger (blocking) · warning · todo · done
// system tasks mirror the Tasks module: source, assignee, deadline, description, task no.
const TASKS = [
  { id: "settle-fail", stage: "before", tone: "danger", icon: ICON.payments, title: "Automatic settlement failed", system: true, source: "Auto", taskNo: "3713",
    detail: "Failed to settle Stay 3713 (Selma Willson, 01/08 – 07/08, APT 208) automatically. Collect payment manually or send a payment request.",
    assignee: "Luca O", deadline: "Today, 18:00", meta: "€ 257.50", action: "Take payment", action2: "Send request", deep: "Pricing", blocking: true },
  { id: "expired-req", stage: "before", tone: "warning", icon: ICON.payments, title: "Review expired payment request", system: true, source: "System", taskNo: "3719",
    detail: "Payment request for Selma, amounting to € 97.56, expired on 19/07 14:21. Please action it.",
    assignee: null, deadline: "Overdue", overdue: true, action: "Resend request", deep: "Pricing" },
  { id: "card", stage: "before", tone: "warning", icon: ICON.paymentCard, title: "Add a valid payment method", detail: "No card on file for this reservation", action: "Add card", deep: "Pricing", blocking: true },
  { id: "registration", stage: "before", atCheckin: true, tone: "todo", icon: ICON.idCard, title: "Complete guest registration", detail: "3 of 4 guests registered", action: "Open registration", deep: "Group" },
  { id: "id", stage: "before", atCheckin: true, tone: "todo", icon: ICON.passport, title: "Verify guest identity", detail: "Selma Willson — ID not yet scanned", action: "Scan ID", deep: "Group" },
  { id: "eta", stage: "before", tone: "todo", icon: ICON.time, title: "Confirm estimated arrival time", detail: "Arrival Mon 01/08 — ETA not set", action: "Set ETA", deep: "Summary" },
  { id: "room", stage: "before", tone: "done", icon: ICON.bed, title: "Assign a room", detail: "APT 208 · Inspected", done: true },
  { id: "key", stage: "before", tone: "done", icon: ICON.cardKeys, title: "Prepare digital key", detail: "Digital key ready to send", done: true },
  { id: "pillows", stage: "during", tone: "todo", icon: ICON.broom, title: "Deliver 2 extra pillows", detail: "Guest request · housekeeping", action: "Assign task", deep: "Group" },
  { id: "cot", stage: "during", tone: "todo", icon: ICON.bed, title: "Add a travel cot to the room", detail: "Channel manager request", action: "Assign task", deep: "Group" },
  { id: "breakfast", stage: "during", tone: "todo", icon: ICON.food, title: "Offer breakfast add-on", detail: "Smart tip · Selma usually adds breakfast", action: "Add breakfast", deep: "Items" },
  { id: "final", stage: "after", tone: "todo", icon: ICON.bills, title: "Settle final balance", detail: "Review charges before departure", action: "Open bill", deep: "Pricing" },
  { id: "invoice", stage: "after", tone: "todo", icon: ICON.contract, title: "Send invoice to Mews", detail: "Company billing · invoiceable", action: "Send invoice", deep: "Contracts" },
];

const TONE = {
  danger:  { bg: "var(--mews-red-25)",    fg: "var(--mews-red-600)" },
  warning: { bg: "var(--mews-orange-25)", fg: "var(--mews-orange-700)" },
  todo:    { bg: "var(--mews-indigo-25)", fg: "var(--mews-indigo-600)" },
  done:    { bg: "var(--mews-green-25)",  fg: "var(--mews-green-600)" },
};

// Reservation status → active to-do phase (index into STAGES_SPLIT).
// Earlier phases are shown completed.
const PHASE_INDEX = {
  "Future": 0, "Confirmed": 0,
  "To check in": 0,
  "Checked in": 2, "In house": 2,
  "Due out": 3, "To check out": 3,
  "Checked out": 4,
};

function useTasks(seedDoneIds) {
  const seed = seedDoneIds || [];
  const [done, setDone] = React.useState(() => {
    const s = {}; TASKS.forEach((t) => (s[t.id] = !!t.done || seed.indexOf(t.id) !== -1)); return s;
  });
  const toggle = (id) => setDone((d) => ({ ...d, [id]: !d[id] }));
  const markDone = (id) => setDone((d) => ({ ...d, [id]: true }));
  return [done, toggle, markDone];
}

// Phase-aware readiness strip atop the To-do tab
function ReadinessStrip({ stage, done }) {
  if (!stage) {
    return (
      <div className="mews-card" style={{ padding: 16, borderColor: "var(--mews-border-secondary)", display: "flex", alignItems: "center", gap: 16 }}>
        <Ring value={1} total={1} size={54} />
        <div style={{ flex: 1 }}>
          <div style={{ font: "600 16px/1.3 var(--mews-font-family)", color: "var(--mews-text-primary)" }}>Stay complete</div>
          <div style={{ fontSize: 13, color: "var(--mews-text-secondary)", marginTop: 2 }}>All tasks across the stay are done</div>
        </div>
      </div>
    );
  }
  const items = TASKS.filter(stage.match);
  const left = items.filter((t) => !done[t.id]).length;
  const totalLeft = TASKS.filter((t) => !done[t.id]).length;
  const blocking = items.filter((t) => t.blocking && !done[t.id]).length;
  const milestone = stage.id === "after" || stage.id === "during" ? "check-out" : "check-in";
  const heading = blocking
    ? `${blocking} task${blocking > 1 ? "s" : ""} blocking ${milestone}`
    : left ? `${stage.label} in progress` : `${stage.label} complete`;
  return (
    <div className="mews-card" style={{ padding: 16, borderColor: "var(--mews-border-secondary)", display: "flex", alignItems: "center", gap: 16 }}>
      <Ring value={items.length - left} total={items.length} size={54} tone={blocking ? "warning" : undefined} />
      <div style={{ flex: 1 }}>
        <div style={{ font: "600 16px/1.3 var(--mews-font-family)", color: "var(--mews-text-primary)" }}>{heading}</div>
        <div style={{ fontSize: 13, color: "var(--mews-text-secondary)", marginTop: 2 }}>
          {left ? `${left} of ${items.length} ${stage.hint.toLowerCase()} task${items.length > 1 ? "s" : ""} remaining` : "All tasks in this phase complete"} · {totalLeft} open across the stay
        </div>
      </div>
    </div>
  );
}

function Checkbox({ checked, onChange }) {
  return (
    <input type="checkbox" className="mews-checkbox" checked={checked} onChange={onChange}
      style={{ width: 18, height: 18, marginTop: 2 }} onClick={(e) => e.stopPropagation()} />
  );
}

// Full task row (used by To-do tab + lifecycle prep panel)
function TaskRow({ task, done, onToggle, onDeep, onAction, active, compact = false }) {
  const fire = () => (onAction ? onAction(task) : onDeep && onDeep(task.deep));
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: compact ? "10px 0" : "12px 4px", opacity: done ? 0.66 : 1, transition: "opacity 160ms ease" }}>
      <Checkbox checked={done} onChange={() => onToggle(task.id)} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ font: "500 14px/1.4 var(--mews-font-family)", color: "var(--mews-text-primary)", textDecoration: done ? "line-through" : "none" }}>{task.title}</span>
          {!done && task.blocking && <Pill tone="danger" style={{ height: 18, fontSize: 11, padding: "0 6px" }}>Blocks check-in</Pill>}
        </div>
        <div style={{ font: "400 12px/1.4 var(--mews-font-family)", color: "var(--mews-text-tertiary)", marginTop: 2 }}>{task.detail}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        {task.meta && !done && <span style={{ font: "600 14px/1 var(--mews-font-family)", fontVariantNumeric: "tabular-nums", color: task.tone === "danger" ? "var(--mews-red-600)" : "var(--mews-text-primary)" }}>{task.meta}</span>}
        {done ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, font: "500 12px/1 var(--mews-font-family)", color: "var(--mews-green-600)" }}><Ic c={ICON.doneCircle} s={15} />Done</span>
        ) : (
          <button className={"mews-btn mews-btn--sm " + (active ? "mews-btn--primary" : "mews-btn--tertiary")} onClick={fire}>
            {active ? <Ic c={ICON.chevUp} s={15} /> : null}{task.action}
          </button>
        )}
      </div>
    </div>
  );
}

// Initials avatar
function Avatar({ name, size = 20 }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <span style={{ width: size, height: size, borderRadius: "50%", background: "var(--mews-night-100)", color: "var(--mews-night-700)", display: "inline-flex", alignItems: "center", justifyContent: "center", font: "600 10px/1 var(--mews-font-family)", flexShrink: 0 }}>{initials}</span>
  );
}

// Meta chip used in the system-task meta line
function MetaItem({ icon, children, color }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, font: "400 12px/1 var(--mews-font-family)", color: color || "var(--mews-text-tertiary)" }}>
      {icon != null && <Ic c={icon} s={13} />}{children}
    </span>
  );
}

// Richer row for system-generated / Tasks-module entities
function SystemTaskRow({ task, done, onToggle, onDeep, onAction, active }) {
  const fire = (which) => (onAction ? onAction(task, which) : onDeep && onDeep(task.deep));
  const primaryActionClass = active
    ? "mews-btn--primary"
    : task.action2 ? "mews-btn--secondary" : "mews-btn--tertiary";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "12px 4px", opacity: done ? 0.6 : 1, transition: "opacity 160ms ease" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <Checkbox checked={done} onChange={() => onToggle(task.id)} />
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexWrap: "wrap", alignItems: "center", columnGap: 10, rowGap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <span
              onClick={() => onDeep && onDeep(task.deep)}
              style={{ font: "600 14px/1.4 var(--mews-font-family)", color: "var(--mews-text-primary)", textDecoration: done ? "line-through" : "underline", textUnderlineOffset: 2, textDecorationColor: "var(--mews-night-150)", cursor: "pointer", whiteSpace: "nowrap" }}
            >
              {task.taskNo} · {task.title}
            </span>
            <Pill subtle tone="primary" icon={task.source === "Auto" ? ICON.bolt : ICON.settings} style={{ height: 18, fontSize: 11, padding: "0 6px 0 5px", flexShrink: 0 }}>{task.source}</Pill>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto", flexShrink: 0 }}>
            {task.meta && !done && <span style={{ font: "600 14px/1 var(--mews-font-family)", fontVariantNumeric: "tabular-nums", color: task.tone === "danger" ? "var(--mews-red-600)" : "var(--mews-text-primary)" }}>{task.meta}</span>}
            {done ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, font: "500 12px/1 var(--mews-font-family)", color: "var(--mews-green-600)" }}><Ic c={ICON.doneCircle} s={15} />Closed</span>
            ) : (
              <div style={{ display: "flex", gap: 6 }}>
                {task.action2 && <button className="mews-btn mews-btn--tertiary mews-btn--sm" onClick={() => fire("action2")}>{task.action2}</button>}
                <button className={"mews-btn mews-btn--sm " + primaryActionClass} onClick={() => fire("action")}>
                  {active ? <Ic c={ICON.chevUp} s={15} /> : null}{task.action}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {!done && task.blocking && (
        <div style={{ paddingLeft: 30 }}>
          <Pill tone="danger" style={{ height: 18, fontSize: 11, padding: "0 6px" }}>Blocks check-in</Pill>
        </div>
      )}
      <div style={{ paddingLeft: 30, font: "400 12px/1.45 var(--mews-font-family)", color: "var(--mews-text-secondary)", textDecoration: done ? "line-through" : "none" }}>{task.detail}</div>
      <div style={{ paddingLeft: 30, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        {task.assignee
          ? <MetaItem><Avatar name={task.assignee} />{task.assignee}</MetaItem>
          : <MetaItem icon={ICON.profile} color="var(--mews-text-tertiary)">Unassigned</MetaItem>}
        <MetaItem icon={ICON.time} color={task.overdue ? "var(--mews-red-600)" : "var(--mews-text-tertiary)"}>{task.deadline}</MetaItem>
      </div>
    </div>
  );
}

// Row chooser
function Row(props) {
  return props.task.system ? <SystemTaskRow {...props} /> : <TaskRow {...props} />;
}

// Inline resolution panel that drops below an expanded row (variant A1)
function InlineResolve({ task, onClose, onResolve }) {
  const flow = getFlow(task);
  const Body = flow.Body;
  return (
    <div style={{ margin: "0 4px 12px", border: "1px solid var(--mews-border-secondary)", borderRadius: 10, overflow: "hidden", background: "var(--mews-indigo-0)", boxShadow: "var(--mews-shadow-100)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderBottom: "1px solid var(--mews-border-secondary)" }}>
        <Ic c={flow.icon} s={16} style={{ color: "var(--mews-text-primary)" }} />
        <span style={{ font: "600 13px/1.3 var(--mews-font-family)", color: "var(--mews-text-primary)" }}>{flow.title}</span>
        <BareBtn icon={ICON.cross} s={16} title="Close" onClick={onClose} color="var(--mews-text-tertiary)" style={{ marginLeft: "auto", width: 26, height: 26 }} />
      </div>
      <div style={{ padding: 16, background: "#fff" }}>
        <Body task={task} />
        <div style={{ display: "flex", gap: 8, marginTop: 18, justifyContent: "flex-end" }}>
          <button className="mews-btn mews-btn--tertiary mews-btn--sm" onClick={onClose}>Cancel</button>
          <button className="mews-btn mews-btn--sm" onClick={() => onResolve(task.id)}>{flow.primary}</button>
        </div>
      </div>
    </div>
  );
}

function StageGroup({ stage, done, onToggle, onDeep, onAction, expandedId, onResolve, defaultOpen }) {
  const items = TASKS.filter(stage.match || ((t) => t.stage === stage.id));
  const left = items.filter((t) => !done[t.id]).length;
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div style={{ border: "1px solid var(--mews-border-secondary)", borderRadius: 8, overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", border: "none", background: "#fff", cursor: "pointer" }}>
        <Ic c={open ? ICON.chevUp : ICON.chevDown} s={18} style={{ color: "var(--mews-text-secondary)" }} />
        <span style={{ font: "600 14px/1 var(--mews-font-family)", color: "var(--mews-text-primary)" }}>{stage.label}</span>
        <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 4, font: "500 12px/1 var(--mews-font-family)", color: left ? "var(--mews-text-secondary)" : "var(--mews-green-600)" }}>
          {left ? `${left} out of ${items.length} to do` : <React.Fragment><Ic c={ICON.doneCircle} s={15} />Completed</React.Fragment>}
        </span>
      </button>
      {open && (
        <div style={{ padding: "2px 14px 8px", borderTop: "1px solid var(--mews-border-secondary)" }}>
          {items.map((t, i) => (
            <div key={t.id} style={{ borderTop: i === 0 ? "none" : "1px solid var(--mews-border-secondary)" }}>
              <Row task={t} done={done[t.id]} onToggle={onToggle} onDeep={onDeep} onAction={onAction} active={expandedId === t.id} />
              {expandedId === t.id && !done[t.id] && (
                <InlineResolve task={t} onClose={() => onAction(t)} onResolve={onResolve} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============ EXPLORATION A — "To do" tab ============ */
function TodoTab({ onDeep }) {
  const [done, toggle] = useTasks();
  const before = TASKS.filter((t) => t.stage === "before");
  const beforeLeft = before.filter((t) => !done[t.id]).length;
  const totalLeft = TASKS.filter((t) => !done[t.id]).length;
  const blocking = before.filter((t) => t.blocking && !done[t.id]).length;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* readiness summary strip */}
      <div className="mews-card" style={{ padding: 16, borderColor: "var(--mews-border-secondary)", display: "flex", alignItems: "center", gap: 16 }}>
        <Ring value={before.length - beforeLeft} total={before.length} size={54} tone={blocking ? "warning" : undefined} />
        <div style={{ flex: 1 }}>
          <div style={{ font: "600 16px/1.3 var(--mews-font-family)", color: "var(--mews-text-primary)" }}>
            {blocking ? `${blocking} task${blocking > 1 ? "s" : ""} blocking check-in` : "Ready to check in"}
          </div>
          <div style={{ fontSize: 13, color: "var(--mews-text-secondary)", marginTop: 2 }}>
            {beforeLeft ? `${beforeLeft} of ${before.length} preparation tasks remaining` : "All preparation tasks complete"} · {totalLeft} open across the stay
          </div>
        </div>
      </div>
      <StageGroup stage={STAGES[0]} done={done} onToggle={toggle} onDeep={onDeep} defaultOpen={true} />
      <StageGroup stage={STAGES[1]} done={done} onToggle={toggle} onDeep={onDeep} defaultOpen={false} />
      <StageGroup stage={STAGES[2]} done={done} onToggle={toggle} onDeep={onDeep} defaultOpen={false} />
    </div>
  );
}

/* ============ EXPLORATION A1 — resolve inline ============ */
function TodoTabInline({ status = "Confirmed" }) {
  const phase = PHASE_INDEX[status] != null ? PHASE_INDEX[status] : 0;
  const seedDone = React.useMemo(
    () => STAGES_SPLIT.filter((s, i) => i < phase).flatMap((s) => TASKS.filter(s.match).map((t) => t.id)),
    [phase]
  );
  const [done, toggle, markDone] = useTasks(seedDone);
  const [expandedId, setExpandedId] = React.useState(null);
  const activeStage = STAGES_SPLIT[phase];
  const onAction = (t) => setExpandedId((id) => (id === t.id ? null : t.id));
  const onResolve = (id) => { markDone(id); setExpandedId(null); };
  const onToggle = (id) => { toggle(id); if (expandedId === id) setExpandedId(null); };
  const groupProps = { done, onToggle, onAction, expandedId, onResolve };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <ReadinessStrip stage={activeStage} done={done} />
      {STAGES_SPLIT.map((s, i) => (
        <StageGroup key={s.id} stage={s} {...groupProps} defaultOpen={i === phase} />
      ))}
    </div>
  );
}

/* ============ EXPLORATION A2 — resolve in a floating panel ============ */
function FloatingPanel({ task, onClose, onResolve }) {
  const flow = getFlow(task);
  const Body = flow.Body;
  const [closing, setClosing] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setMounted(true), 10); return () => clearTimeout(t); }, []);
  const close = () => { setClosing(true); setTimeout(onClose, 200); };
  const shown = mounted && !closing;
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 40 }}>
      <div onClick={close} style={{ position: "absolute", inset: 0, background: "rgba(33,33,46,.28)", opacity: shown ? 1 : 0, transition: "opacity 200ms ease" }} />
      <div style={{ position: "absolute", top: 8, left: 0, right: 0, bottom: 0, width: "100%", background: "#fff", boxShadow: "var(--mews-shadow-300)", borderRadius: "16px 16px 0 0", display: "flex", flexDirection: "column", overflow: "hidden",
        transform: shown ? "translateY(0)" : "translateY(14px)", opacity: shown ? 1 : 0, transition: "transform 220ms cubic-bezier(.22,.61,.36,1), opacity 180ms ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px", borderBottom: "1px solid var(--mews-border-secondary)" }}>
          <span style={{ width: 32, height: 32, borderRadius: 8, background: "var(--mews-night-50)", color: "var(--mews-text-primary)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Ic c={flow.icon} s={18} /></span>
          <div style={{ flex: 1 }}>
            <div style={{ font: "600 16px/1.3 var(--mews-font-family)", color: "var(--mews-text-primary)" }}>{flow.title}</div>
            {task.taskNo && <div style={{ font: "400 12px/1.3 var(--mews-font-family)", color: "var(--mews-text-tertiary)" }}>Task {task.taskNo} · {task.title}</div>}
          </div>
          <BareBtn icon={ICON.cross} s={18} title="Close" onClick={close} color="var(--mews-text-tertiary)" />
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
          <Body task={task} />
        </div>
        <div style={{ display: "flex", gap: 8, padding: 16, borderTop: "1px solid var(--mews-border-secondary)", justifyContent: "flex-end", background: "var(--mews-bg-flat)" }}>
          <button className="mews-btn mews-btn--tertiary" onClick={close}>Cancel</button>
          <button className="mews-btn" onClick={() => { onResolve(task.id); close(); }}>{flow.primary}</button>
        </div>
      </div>
    </div>
  );
}

function TodoTabPanel({ status = "Confirmed" }) {
  const phase = PHASE_INDEX[status] != null ? PHASE_INDEX[status] : 0;
  const seedDone = React.useMemo(
    () => STAGES_SPLIT.filter((s, i) => i < phase).flatMap((s) => TASKS.filter(s.match).map((t) => t.id)),
    [phase]
  );
  const [done, toggle, markDone] = useTasks(seedDone);
  const [panelTask, setPanelTask] = React.useState(null);
  const activeStage = STAGES_SPLIT[phase];
  const onToggle = (id) => { toggle(id); if (panelTask && panelTask.id === id) setPanelTask(null); };
  const groupProps = { done, onToggle, onAction: (t) => setPanelTask(t) };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <ReadinessStrip stage={activeStage} done={done} />
      {STAGES_SPLIT.map((s, i) => (
        <StageGroup key={s.id} stage={s} {...groupProps} defaultOpen={i === phase} />
      ))}
      {panelTask && <FloatingPanel task={panelTask} onClose={() => setPanelTask(null)} onResolve={markDone} />}
    </div>
  );
}

/* ============ EXPLORATION B — readiness card on Summary ============ */
function ReadinessCard({ onDeep }) {
  const [done, toggle] = useTasks();
  const [open, setOpen] = React.useState(true);
  const before = TASKS.filter((t) => t.stage === "before");
  const left = before.filter((t) => !done[t.id]).length;
  const blocking = before.filter((t) => t.blocking && !done[t.id]).length;
  const ready = left === 0;
  return (
    <div className="mews-card" style={{ padding: 0, overflow: "hidden", borderColor: ready ? "var(--mews-green-100)" : "var(--mews-indigo-100)", boxShadow: "var(--mews-shadow-100)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: 16, background: ready ? "var(--mews-green-25)" : "var(--mews-indigo-0)" }}>
        <Ring value={before.length - left} total={before.length} size={52} tone={blocking ? "warning" : undefined} />
        <div style={{ flex: 1 }}>
          <div style={{ font: "600 16px/1.3 var(--mews-font-family)", color: "var(--mews-text-primary)" }}>
            {ready ? "Selma is ready to check in" : `${left} thing${left > 1 ? "s" : ""} to do before check-in`}
          </div>
          <div style={{ fontSize: 13, color: "var(--mews-text-secondary)", marginTop: 2 }}>
            {blocking ? `${blocking} blocking · payment outstanding` : ready ? "Everything is prepared" : "Preparation phase"}
          </div>
        </div>
        <BareBtn icon={open ? ICON.chevUp : ICON.chevDown} title="Toggle" onClick={() => setOpen(!open)} />
      </div>
      {open && !ready && (
        <div style={{ padding: "4px 16px 8px" }}>
          {before.filter((t) => !done[t.id]).map((t) => (
            <div key={t.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 0", borderTop: "1px solid var(--mews-border-secondary)" }}>
              <input type="checkbox" className="mews-checkbox" checked={false} onChange={() => toggle(t.id)} style={{ width: 18, height: 18, marginTop: 2 }} />
              <span style={{ width: 26, height: 26, borderRadius: 7, background: TONE[t.tone].bg, color: TONE[t.tone].fg, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}><Ic c={t.icon} s={15} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ font: "500 14px/1.3 var(--mews-font-family)", color: "var(--mews-text-primary)" }}>{t.system ? `${t.taskNo} · ${t.title}` : t.title}</span>
                  {t.system && <Pill tone="primary" icon={t.source === "Auto" ? ICON.bolt : ICON.settings} style={{ height: 17, fontSize: 10, padding: "0 5px 0 4px" }}>{t.source}</Pill>}
                </div>
                <div style={{ fontSize: 12, color: "var(--mews-text-tertiary)", marginTop: 1 }}>{t.detail}</div>
              </div>
              {t.meta && <span style={{ font: "600 14px/1 var(--mews-font-family)", color: "var(--mews-red-600)", fontVariantNumeric: "tabular-nums", marginTop: 2 }}>{t.meta}</span>}
              <button className="mews-btn mews-btn--secondary mews-btn--sm" onClick={() => onDeep && onDeep(t.deep)}>{t.action}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============ EXPLORATION C — lifecycle stepper + focused prep ============ */
const LIFECYCLE = [
  { label: "Booked", state: "completed" },
  { label: "Confirmed", state: "completed" },
  { label: "Preparation", state: "current" },
  { label: "In house", state: "next" },
  { label: "Checked out", state: "next" },
];

function LifecycleStepper() {
  return (
    <div className="mews-progind" style={{ padding: "4px 8px 0" }}>
      {LIFECYCLE.map((s, i) => (
        <div key={i} className={"mews-progind__step mews-progind__step--" + s.state}>
          <div className="mews-progind__row">
            <span className={"mews-progind__track mews-progind__track--first" + (s.state === "completed" || s.state === "current" ? " mews-progind__track--completed" : "")} />
            <span className="mews-progind__circle">
              {s.state === "completed" ? <Ic c={ICON.done} s={14} /> : s.state === "current" ? i + 1 : ""}
            </span>
            <span className={"mews-progind__track mews-progind__track--last" + (s.state === "completed" ? " mews-progind__track--completed" : "")} />
          </div>
          <span className="mews-progind__label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

function LifecyclePrep({ onDeep }) {
  const [done, toggle] = useTasks();
  const before = TASKS.filter((t) => t.stage === "before");
  const left = before.filter((t) => !done[t.id]).length;
  const blocking = before.filter((t) => t.blocking && !done[t.id]).length;
  const ready = left === 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="mews-card" style={{ padding: 20, borderColor: "var(--mews-border-secondary)" }}>
        <LifecycleStepper />
      </div>
      <div className="mews-card" style={{ padding: 0, overflow: "hidden", borderColor: "var(--mews-border-secondary)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: "1px solid var(--mews-border-secondary)" }}>
          <span style={{ width: 36, height: 36, borderRadius: 9, background: "var(--mews-indigo-25)", color: "var(--mews-indigo-600)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Ic c={ICON.task} s={20} /></span>
          <div style={{ flex: 1 }}>
            <div style={{ font: "600 16px/1.3 var(--mews-font-family)", color: "var(--mews-text-primary)" }}>Preparation tasks</div>
            <div style={{ fontSize: 13, color: "var(--mews-text-secondary)" }}>Complete these to advance to <strong style={{ color: "var(--mews-text-primary)", fontWeight: 600 }}>In house</strong></div>
          </div>
          <Ring value={before.length - left} total={before.length} size={48} tone={blocking ? "warning" : undefined} />
        </div>
        <div style={{ padding: "4px 20px 8px" }}>
          {before.map((t, i) => (
            <div key={t.id} style={{ borderTop: i === 0 ? "none" : "1px solid var(--mews-border-secondary)" }}>
              <Row task={t} done={done[t.id]} onToggle={toggle} onDeep={onDeep} />
            </div>
          ))}
        </div>
        <div style={{ padding: 16, borderTop: "1px solid var(--mews-border-secondary)", background: "var(--mews-night-25)", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: ready ? "var(--mews-green-700)" : "var(--mews-text-secondary)" }}>
            {ready ? "All preparation complete" : blocking ? `${blocking} blocking task${blocking > 1 ? "s" : ""} remaining` : `${left} task${left > 1 ? "s" : ""} remaining`}
          </span>
          <button className="mews-btn" disabled={!ready} style={{ marginLeft: "auto" }}>
            <Ic c={ICON.checkin} s={16} /> Mark ready to check in
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TASKS, STAGES, TodoTab, TodoTabInline, TodoTabPanel, ReadinessCard, LifecyclePrep });
