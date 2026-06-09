/* global React, ICON, Ic, ALink, Pill, Tag, Field, SubSection, Accordion, LockToggle, BareBtn */
// Faithful recreation of the Summary tab content from the Figma.

function MoneyRow({ label, qty, amount, sub, indent }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "8px 0", borderTop: sub ? "none" : "1px solid var(--mews-border-secondary)" }}>
      <Ic c={ICON.chevDown} s={18} style={{ color: "var(--mews-text-tertiary)", marginRight: 8 }} />
      <span style={{ fontSize: 14, color: "var(--mews-text-primary)" }}>
        {qty && <strong style={{ fontWeight: 600 }}>{qty} </strong>}{label}
      </span>
      <span style={{ marginLeft: "auto", fontSize: 14, fontVariantNumeric: "tabular-nums", color: "var(--mews-text-primary)" }}>{amount}</span>
    </div>
  );
}

function SmartTip({ children, action }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: 16, border: "1px dashed var(--mews-indigo-200)", borderRadius: 8, background: "var(--mews-indigo-0)" }}>
      <span style={{ width: 28, height: 28, borderRadius: 8, background: "var(--mews-indigo-50)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Ic c={ICON.magic} s={16} style={{ color: "var(--mews-indigo-600)" }} />
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ font: "600 11px/1.4 var(--mews-font-family)", letterSpacing: ".06em", color: "var(--mews-indigo-600)", marginBottom: 6 }}>SMART TIP</div>
        <p style={{ margin: "0 0 12px", fontSize: 14, lineHeight: 1.5, color: "var(--mews-text-primary)" }}>{children}</p>
        {action}
      </div>
    </div>
  );
}

function SummaryContent() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* MAIN CARD */}
      <div className="mews-card" style={{ padding: 20, borderColor: "var(--mews-border-secondary)" }}>
        {/* Guest header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
              <h2 style={{ margin: 0, font: "600 22px/1.3 var(--mews-font-family)", color: "var(--mews-text-primary)" }}>Selma Willson</h2>
              <Ic c={ICON.guestInHouse} s={18} style={{ color: "var(--mews-text-tertiary)" }} />
              <Pill tone="basic" icon={ICON.loyalty}>Gold Loyalty</Pill>
            </div>
            <span style={{ fontSize: 12, color: "var(--mews-text-tertiary)" }}>Reservation created: 05/04/2025</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <GhostBtn icon={ICON.idCard} title="Scan ID" />
            <GhostBtn icon={ICON.print} title="Print" />
            <GhostBtn icon={ICON.mails} title="Email" />
          </div>
        </div>

        <SubSection title="" first>
          <Field label="Confirmation number">3713</Field>
          <Field label="Status"><Pill tone="info">To check in</Pill><BareBtn icon={ICON.edit} title="Edit status" s={16} style={{ width: 24, height: 24 }} /></Field>
          <Field label="Policy"><ALink>View policies</ALink></Field>
        </SubSection>

        <SubSection title="Dates" onEdit={() => {}}>
          <Field label="Arrival">Monday, 01/08/2025, 16:00</Field>
          <Field label="Departure">Sunday, 07/08/2025, 12:00</Field>
        </SubSection>

        <SubSection title="Space" onEdit={() => {}}>
          <Field label="Space name">
            <ALink>APT 208</ALink>
            <span style={{ width: 18, height: 18, borderRadius: "50%", border: "1px solid var(--mews-night-200)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Ic c={ICON.arrowUp} s={11} style={{ color: "var(--mews-text-secondary)" }} /></span>
            <Pill tone="success">Inspected</Pill>
          </Field>
          <Field label="Requested category">Family Quad</Field>
          <Field label="Room assignment"><LockToggle on /></Field>
        </SubSection>

        <SubSection title="Additional details" onEdit={() => {}}>
          <Field label="Booker"><ALink>Sandra Blue</ALink></Field>
          <Field label="Purchase order number">6579</Field>
          <Field label="Voucher">Mews2025</Field>
        </SubSection>
      </div>

      {/* Reservation notes */}
      <Accordion title="Reservation notes" badge={4} onEdit={() => {}}>
        <div style={{ paddingTop: 16, display: "flex", flexDirection: "column" }}>
          <div style={{ paddingBottom: 12 }}>
            <div style={{ fontSize: 14, color: "var(--mews-text-primary)" }}>Guests asked for 2 extra pillows in the room</div>
            <div style={{ fontSize: 12, color: "var(--mews-text-tertiary)", marginTop: 4 }}>General, 11/04/2025 8:48:01 PM</div>
          </div>
          <div style={{ borderTop: "1px dashed var(--mews-border-primary)", paddingTop: 12 }}>
            <div style={{ fontSize: 14, color: "var(--mews-text-primary)" }}>Guest want to add a travel cot in the room</div>
            <div style={{ fontSize: 12, color: "var(--mews-text-tertiary)", marginTop: 4 }}>Channel manager, 10/04/2025 11:32:06 AM</div>
          </div>
          <div style={{ marginTop: 14 }}><ALink size={13}>View more</ALink></div>
        </div>
      </Accordion>

      {/* Guests and occupancy */}
      <Accordion title="Guests and occupancy" right={<span style={{ display: "flex", gap: 6, marginRight: 4 }}><Tag>3 adults</Tag><Tag>1 toddler</Tag></span>} onEdit={() => {}}>
        <div style={{ paddingTop: 16 }}>
          <div style={{ fontSize: 12, color: "var(--mews-text-tertiary)", marginBottom: 8 }}>Guest 1</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <ALink>Selma Willson</ALink>
            <Ic c={ICON.guestInHouse} s={16} style={{ color: "var(--mews-text-tertiary)" }} />
            <Ic c={ICON.loyalty} s={16} style={{ color: "var(--mews-text-tertiary)" }} />
            <ALink size={13}>+4</ALink>
            <Pill tone="basic" icon={ICON.loyalty}>Gold Loyalty</Pill>
            <Tag>owner</Tag>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <button className="mews-btn mews-btn--icon mews-btn--sm" title="Take payment"><Ic c={ICON.payments} s={16} /></button>
              <GhostBtn icon={ICON.paymentCard} title="Payment card" />
              <GhostBtn icon={ICON.more} title="More" />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 14, marginBottom: 14 }}>
            <span style={{ fontSize: 14, color: "var(--mews-text-secondary)" }}>To be paid</span>
            <span style={{ marginLeft: "auto", font: "600 16px/1 var(--mews-font-family)", fontVariantNumeric: "tabular-nums" }}>€ 257.50</span>
          </div>
          <SmartTip action={<button className="mews-btn mews-btn--secondary mews-btn--sm">Add breakfast</button>}>
            Selma usually adds breakfast during her stays. She prefers quiet rooms on the 3rd floor.
          </SmartTip>
        </div>
      </Accordion>

      {/* Corporate rate */}
      <Accordion title="Corporate rate" subtitle="Mon 01/08 – Fri 05/08" onEdit={() => {}}>
        <div style={{ paddingTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
          <Field label="Booking purpose">Business</Field>
          <Field label="Segment">Corporate</Field>
          <Field label="Origin">Email</Field>
          <Field label="Reservation source">Channel</Field>
          <Field label="Company"><ALink>Mews</ALink><Pill tone="info" icon={ICON.bills}>Invoiceable</Pill></Field>
          <Field label="Travel agency"><ALink>Booking.com</ALink></Field>
          <Field label="Travel agency confirmation n.">321654645</Field>
        </div>
      </Accordion>

      {/* Bed and breakfast rate (collapsed) */}
      <Accordion title="Bed and breakfast rate" subtitle="Fri 05/08 – Sun 07/08" defaultOpen={false} onEdit={() => {}}>
        <div style={{ paddingTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
          <Field label="Booking purpose">Leisure</Field>
          <Field label="Segment">Direct</Field>
        </div>
      </Accordion>

      {/* Reservation total breakdown */}
      <Accordion title="Reservation total breakdown" icon={ICON.bills} right={<span style={{ font: "600 16px/1 var(--mews-font-family)", fontVariantNumeric: "tabular-nums", marginRight: 6 }}>€ 257.50</span>}>
        <div style={{ paddingTop: 8 }}>
          <div style={{ fontSize: 12, color: "var(--mews-text-tertiary)", margin: "8px 0 0" }}>Nights</div>
          <MoneyRow qty="4x" label="Corporate rate" amount="€ 132.50" sub />
          <div style={{ fontSize: 12, color: "var(--mews-text-tertiary)", margin: "4px 0 0" }}>Items</div>
          <MoneyRow qty="12x" label="Products" amount="€ 125.00" sub />
          <MoneyRow qty="8x" label="Additional expenses" amount="€ 00.00" />
        </div>
      </Accordion>
    </div>
  );
}

Object.assign(window, { SummaryContent, SmartTip });
