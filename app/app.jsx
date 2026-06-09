/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard, ResPanel */
// Lays the reference panel + three explorations onto the design canvas.

const W = 800;
const H = 924;

function Frame({ variant }) {
  return (
    <div style={{ width: "100%", height: "100%", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
      <ResPanel variant={variant} />
    </div>
  );
}

function App() {
  return (
    <DesignCanvas>
      <DCSection id="ref" title="Reference" subtitle="The current reservation Summary, recreated from the Figma">
        <DCArtboard id="current" label="00 · Current — Summary" width={W} height={H}>
          <Frame variant="ref" />
        </DCArtboard>
      </DCSection>

      <DCSection id="explorations" title="Explorations — surfacing the preparation tasks" subtitle="Three directions for showing what staff must resolve before a guest checks in">
        <DCArtboard id="a" label="A · “To do” tab — tasks grouped by reservation stage" width={W} height={H}>
          <Frame variant="A" />
        </DCArtboard>
        <DCArtboard id="b" label="B · Readiness card — inline on Summary, no new tab" width={W} height={H}>
          <Frame variant="B" />
        </DCArtboard>
        <DCArtboard id="c" label="C · Lifecycle stepper — stage progress + gated prep" width={W} height={H}>
          <Frame variant="C" />
        </DCArtboard>
      </DCSection>

      <DCSection id="resolve" title="From A — how a task gets resolved" subtitle="Same “To do” tab, two ways to action a task. Expand a task and hit its CTA to see the flow.">
        <DCArtboard id="a1" label="A1 · Resolve inline — fields open inside the row" width={W} height={H}>
          <Frame variant="A1" />
        </DCArtboard>
        <DCArtboard id="a2" label="A2 · Resolve in a floating panel — slides over the panel" width={W} height={H}>
          <Frame variant="A2" />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
