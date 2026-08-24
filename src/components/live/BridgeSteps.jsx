import { Download, Terminal, Play, Wifi, Info } from "lucide-react";
import CopyChip from "@/components/live/CopyChip";

function Step({ n, icon: Icon, title, children }) {
  return (
    <li className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">{n}</div>
      </div>
      <div className="flex-1 pt-0.5">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="w-3.5 h-3.5 text-primary" />
          <span className="text-sm font-medium text-foreground">{title}</span>
        </div>
        <div className="text-xs text-muted-foreground space-y-2">{children}</div>
      </div>
    </li>
  );
}

export default function BridgeSteps() {
  return (
    <ol className="space-y-4">
      <Step n={1} icon={Download} title="Download the bridge script">
        <p>A single Python file — no app or account needed.</p>
        <a href="/telemetry_bridge.py" download className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium font-heading tracking-wide hover:bg-primary/90 transition-colors">
          <Download className="w-3.5 h-3.5" /> telemetry_bridge.py
        </a>
      </Step>
      <Step n={2} icon={Terminal} title="Install Python & the WebSocket library">
        <p>Requires <a href="https://www.python.org/downloads/" target="_blank" rel="noreferrer" className="text-primary underline">Python 3.8+</a>. Open a terminal and run:</p>
        <CopyChip text="pip install websockets" />
      </Step>
      <Step n={3} icon={Play} title="Run the bridge">
        <p>Start it in mock mode — works with no sim running:</p>
        <CopyChip text="python telemetry_bridge.py" />
        <div className="flex items-start gap-1.5 rounded-lg bg-secondary/40 border border-border p-2 mt-1">
          <Info className="w-3 h-3 text-primary mt-0.5 shrink-0" />
          <p>For <strong className="text-foreground">iRacing</strong>: <code className="font-mono text-foreground">pip install irsdk</code>, then <code className="font-mono text-foreground">python telemetry_bridge.py --sim iracing</code>. ACC uses shared memory — see the script header.</p>
        </div>
      </Step>
      <Step n={4} icon={Wifi} title="The dashboard connects automatically">
        <p>As soon as the bridge is running, this page detects it and goes live — no need to press Connect. Use <span className="text-foreground font-medium">Advanced</span> below only if your bridge runs on a different port.</p>
      </Step>
    </ol>
  );
}