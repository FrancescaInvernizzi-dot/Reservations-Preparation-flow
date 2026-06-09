/* global React, ICON, Ic, Pill */
// Task-resolution forms — shared by A1 (inline) and A2 (floating panel).
// Each entry: { title, subtitle, icon, Body, primary, secondary }

function FieldRow({ label, children, help, full = true }) {
  return (
    <label className="mews-input-group" style={{ flex: full ? "1 1 100%" : "1 1 0", minWidth: 0 }}>
      <span className="mews-input-label">{label}</span>
      {children}
      {help && <span className="mews-input-help">{help}</span>}
    </label>
  );
}

function TextField({ label, placeholder, value, defaultValue, lead, full, help }) {
  if (lead != null) {
    return (
      <label className="mews-input-group" style={{ flex: full ? "1 1 100%" : "1 1 0", minWidth: 0 }}>
        <span className="mews-input-label">{label}</span>
        <span className="mews-input-affixed">
          <span className="mews-input-affixed__lead"><Ic c={lead} s={16} /></span>
          <input className="mews-input-affixed__field" placeholder={placeholder} defaultValue={defaultValue} />
        </span>
        {help && <span className="mews-input-help">{help}</span>}
      </label>
    );
  }
  return (
    <FieldRow label={label} help={help} full={full}>
      <input className="mews-input" placeholder={placeholder} defaultValue={defaultValue} />
    </FieldRow>
  );
}

// Fake select (display only)
function SelectField({ label, value, full }) {
  return (
    <FieldRow label={label} full={full}>
      <span className="mews-select">
        <span className="mews-select__value">{value}</span>
        <span className="mews-select__btn mews-select__chevron"><Ic c={ICON.chevDown} s={16} /></span>
      </span>
    </FieldRow>
  );
}

function Segmented({ label, options, active = 0 }) {
  const [sel, setSel] = React.useState(active);
  return (
    <FieldRow label={label}>
      <div style={{ display: "flex", gap: 0, border: "1px solid var(--mews-border-input)", borderRadius: 8, padding: 3, background: "var(--mews-night-25)" }}>
        {options.map((o, i) => (
          <button key={o} onClick={() => setSel(i)} style={{ flex: 1, height: 30, border: "none", borderRadius: 6, cursor: "pointer",
            background: sel === i ? "#fff" : "transparent", boxShadow: sel === i ? "var(--mews-shadow-100)" : "none",
            font: (sel === i ? "600" : "500") + " 13px/1 var(--mews-font-family)", color: sel === i ? "var(--mews-text-primary)" : "var(--mews-text-secondary)" }}>{o}</button>
        ))}
      </div>
    </FieldRow>
  );
}

function Pair({ children }) {
  return <div style={{ display: "flex", gap: 12 }}>{children}</div>;
}

function Callout({ tone = "info", icon, children }) {
  const map = {
    info: { bg: "var(--mews-blue-25)", bd: "var(--mews-blue-100)", fg: "var(--mews-blue-700)" },
    danger: { bg: "var(--mews-red-25)", bd: "var(--mews-red-100)", fg: "var(--mews-red-700)" },
  };
  const t = map[tone];
  return (
    <div style={{ display: "flex", gap: 8, padding: "10px 12px", background: t.bg, border: "1px solid " + t.bd, borderRadius: 8 }}>
      <Ic c={icon || ICON.info} s={16} style={{ color: t.fg, flexShrink: 0, marginTop: 1 }} />
      <span style={{ font: "400 13px/1.45 var(--mews-font-family)", color: "var(--mews-text-primary)" }}>{children}</span>
    </div>
  );
}

// ---- Form bodies ----
function AddCardForm() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <TextField label="Cardholder name" placeholder="Name on card" defaultValue="Selma Willson" />
      <TextField label="Card number" placeholder="0000 0000 0000 0000" lead={ICON.paymentCard} />
      <Pair>
        <TextField label="Expiry" placeholder="MM / YY" full={false} />
        <TextField label="CVC" placeholder="123" full={false} />
      </Pair>
      <SelectField label="Card purpose" value="Guarantee + payment" />
      <Callout icon={ICON.lock}>Card details are tokenized and stored securely. No raw PAN is retained.</Callout>
    </div>
  );
}

function TakePaymentForm() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Callout tone="danger" icon={ICON.problematic}>Automatic settlement failed. Collect the outstanding balance manually.</Callout>
      <Pair>
        <TextField label="Amount" defaultValue="257.50" lead={ICON.payments} full={false} />
        <SelectField label="Currency" value="EUR €" full={false} />
      </Pair>
      <SelectField label="Payment method" value="Card · Visa ···· 4242" />
      <Segmented label="Settlement" options={["Charge now", "Send request"]} />
      <TextField label="Note (optional)" placeholder="Reference shown on the bill" />
    </div>
  );
}

function SendRequestForm() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <TextField label="Send to" defaultValue="selma.willson@email.com" lead={ICON.mails} />
      <Pair>
        <TextField label="Amount" defaultValue="97.56" lead={ICON.payments} full={false} />
        <TextField label="Expires in" defaultValue="48 hours" full={false} />
      </Pair>
      <TextField label="Message" placeholder="Add a short note for the guest" />
      <Callout icon={ICON.info}>The guest receives a secure link to complete payment. You will be notified when it is settled.</Callout>
    </div>
  );
}

function RegistrationForm() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Callout icon={ICON.info}>3 of 4 guests registered. Complete the remaining guest below.</Callout>
      <SelectField label="Guest" value="Guest 4 — not registered" />
      <Pair>
        <TextField label="First name" placeholder="First name" full={false} />
        <TextField label="Last name" placeholder="Last name" full={false} />
      </Pair>
      <Pair>
        <SelectField label="Nationality" value="Select" full={false} />
        <TextField label="Date of birth" placeholder="DD / MM / YYYY" full={false} />
      </Pair>
      <TextField label="Address" placeholder="Street, city, country" />
    </div>
  );
}

function VerifyIdForm() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <SelectField label="Document type" value="Passport" />
      <TextField label="Document number" placeholder="Document number" lead={ICON.passport} />
      <div style={{ display: "flex", gap: 12, padding: 16, border: "1.5px dashed var(--mews-border-input)", borderRadius: 10, alignItems: "center", justifyContent: "center", flexDirection: "column", background: "var(--mews-night-25)", textAlign: "center" }}>
        <span style={{ width: 36, height: 36, borderRadius: 9, background: "var(--mews-indigo-25)", color: "var(--mews-indigo-600)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Ic c={ICON.idCard} s={20} /></span>
        <div style={{ font: "500 13px/1.4 var(--mews-font-family)", color: "var(--mews-text-primary)" }}>Scan or upload ID document</div>
        <div style={{ font: "400 12px/1.4 var(--mews-font-family)", color: "var(--mews-text-tertiary)" }}>Drop a file, or use a connected scanner</div>
      </div>
    </div>
  );
}

function EtaForm() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Pair>
        <TextField label="Arrival date" defaultValue="Mon 01/08/2025" full={false} />
        <TextField label="Estimated time" placeholder="16:00" lead={ICON.time} full={false} />
      </Pair>
      <SelectField label="Arriving by" value="Not specified" />
      <TextField label="Note for front desk" placeholder="e.g. late arrival, airport pickup" />
    </div>
  );
}

function GenericForm({ task }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Callout icon={ICON.info}>{task.detail}</Callout>
      <TextField label="Assignee" defaultValue="Luca O" lead={ICON.profile} />
      <SelectField label="Department" value="Front office" />
      <TextField label="Note" placeholder="Add a note" />
    </div>
  );
}

// Map an action label → resolution flow
function getFlow(task) {
  const a = (task.action || "").toLowerCase();
  if (a.includes("add card")) return { title: "Add payment method", icon: ICON.paymentCard, Body: AddCardForm, primary: "Save card" };
  if (a.includes("take payment")) return { title: "Take payment", icon: ICON.payments, Body: TakePaymentForm, primary: "Charge € 257.50" };
  if (a.includes("resend") || a.includes("send request") || a.includes("send payment")) return { title: "Send payment request", icon: ICON.mails, Body: SendRequestForm, primary: "Send request" };
  if (a.includes("registration")) return { title: "Complete registration", icon: ICON.idCard, Body: RegistrationForm, primary: "Save guest" };
  if (a.includes("scan id") || a.includes("verify")) return { title: "Verify guest identity", icon: ICON.passport, Body: VerifyIdForm, primary: "Save document" };
  if (a.includes("eta")) return { title: "Set estimated arrival", icon: ICON.time, Body: EtaForm, primary: "Save ETA" };
  return { title: task.title, icon: task.icon, Body: () => <GenericForm task={task} />, primary: "Save" };
}

Object.assign(window, { getFlow });
