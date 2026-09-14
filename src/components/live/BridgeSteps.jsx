import { Download, Terminal, Play, Wifi, Info, FolderOpen, HelpCircle, AppWindow } from "lucide-react";
import CopyChip from "@/components/live/CopyChip";

// Host your built .exe (see companion/README.md → "One-click Windows app") and paste
// its public URL here. When set, users get a single download + double-click install.
// e.g. "https://github.com/USER/REPO/releases/latest/download/SimSetAppBridge.exe"
const EXE_URL = "https://github.com/SimSetApp/SimSetApp/releases/latest/download/SimSetAppBridge.exe";

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
    <div className="space-y-4">
      {/* Easiest: one-click exe */}
      <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
            <AppWindow className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-heading text-sm font-semibold mb-0.5">One-click app (Windows) — easiest</h4>
            <p className="text-xs text-muted-foreground mb-3">No Python, no terminal. Just download, double-click, and connect.</p>
            {EXE_URL ? (
              <a href={EXE_URL} download className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium font-heading tracking-wide hover:bg-primary/90 transition-colors">
                <Download className="w-3.5 h-3.5" /> Download SimSetAppBridge.exe
              </a>
            ) : (
              <p className="text-xs text-muted-foreground">
                Ask the app owner for <strong className="text-foreground">SimSetAppBridge.exe</strong>, or build it free with GitHub Actions — see the bridge README.
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-2">Double-click it, leave the window open, then tap <strong className="text-foreground">Connect to bridge</strong> below.</p>
            <div className="flex items-start gap-1.5 rounded-lg bg-secondary/40 border border-border p-2 mt-3">
              <Info className="w-3 h-3 text-primary mt-0.5 shrink-0" />
              <p><strong className="text-foreground">ACC users:</strong> enable <em>Shared Memory</em> in ACC Options, and start a session — telemetry only streams inside practice/qualifying/race, not the main menu.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Supported sims */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h4 className="font-heading text-sm font-semibold mb-1">Supported sims</h4>
        <p className="text-xs text-muted-foreground mb-3">The bridge auto-detects whichever one is running. Most need one setting switched on in-game.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { name: "iRacing", mech: "Shared memory", setup: "Set irsdkEnableMem=1 in app.ini", gotcha: "Install: pip install irsdk" },
            { name: "ACC", mech: "Shared memory", setup: "Enable Shared Memory in Options", gotcha: "Telemetry streams only in a live session" },
            { name: "Assetto Corsa", mech: "Shared memory", setup: "No setting needed", gotcha: "Run bridge as admin if AC runs as admin" },
            { name: "rFactor 2 / LMU", mech: "Shared memory", setup: "Install the rF2 SM plugin", gotcha: "pip install pyrfactor2sharedmemory" },
            { name: "Automobilista 2", mech: "Shared memory", setup: "Set Shared Memory = 'Project CARS 2'", gotcha: "System settings, then restart" },
            { name: "F1 2023 / 2024", mech: "UDP · port 20777", setup: "Enable UDP Telemetry in game", gotcha: "Only one app can hold the UDP port" },
            { name: "Forza FM / FH", mech: "UDP · port 5300", setup: "Enable Data Out = 'Dash'", gotcha: "Windows Store build: allow loopback" },
            { name: "Gran Turismo 7", mech: "UDP · port 33740", setup: "Run with --gt7-ps5-ip <PS5-IP>", gotcha: "PS5 sends to the PC that heartbeats it" },
          ].map((s) => (
            <div key={s.name} className="rounded-md border border-border bg-secondary/30 p-2.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-foreground">{s.name}</span>
                <span className="text-[10px] text-muted-foreground font-mono">{s.mech}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{s.setup}</p>
              <p className="text-[10px] text-muted-foreground/70 mt-0.5">{s.gotcha}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Fallback: run from Python */}
      <details className="text-xs">
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground select-none font-medium">Run from Python instead (any computer)</summary>
        <ol className="space-y-4 mt-3">
          <Step n={1} icon={Download} title="Install Python (if you don't have it)">
            <p>Get <a href="https://www.python.org/downloads/" target="_blank" rel="noreferrer" className="text-primary underline">Python 3.8+</a> from python.org.</p>
            <div className="flex items-start gap-1.5 rounded-lg bg-secondary/40 border border-border p-2">
              <Info className="w-3 h-3 text-primary mt-0.5 shrink-0" />
              <p><strong className="text-foreground">Windows:</strong> in the installer, tick <em>"Add python.exe to PATH"</em> at the bottom before you click Install.</p>
            </div>
            <p>Check it worked — open a terminal and run:</p>
            <CopyChip text="python --version" />
          </Step>

          <Step n={2} icon={Download} title="Download the bridge script">
            <p>One small file — save it somewhere easy to find (e.g. your Desktop).</p>
            <a href="/telemetry_bridge.py" download className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium font-heading tracking-wide hover:bg-primary/90 transition-colors">
              <Download className="w-3.5 h-3.5" /> telemetry_bridge.py
            </a>
          </Step>

          <Step n={3} icon={Terminal} title="Install the two libraries it needs">
            <p>Open a terminal in the same folder as the file you just downloaded:</p>
            <div className="flex items-start gap-1.5 rounded-lg bg-secondary/40 border border-border p-2">
              <FolderOpen className="w-3 h-3 text-primary mt-0.5 shrink-0" />
              <p><strong className="text-foreground">Windows:</strong> File Explorer → go to the folder → click the address bar, type <code className="font-mono">cmd</code>, press Enter.<br /><strong className="text-foreground">Mac:</strong> right-click the folder → Services → "New Terminal at Folder".</p>
            </div>
            <CopyChip text="pip install aiohttp psutil" />
            <div className="flex items-start gap-1.5 rounded-lg bg-secondary/40 border border-border p-2">
              <Info className="w-3 h-3 text-primary mt-0.5 shrink-0" />
              <p>If <code className="font-mono">pip</code> isn't found, try <code className="font-mono">python -m pip install aiohttp psutil</code>. Then add the library for your sim(s): <code className="font-mono">pip install irsdk pyaccsharedmemory pyrfactor2sharedmemory</code> (iRacing, ACC, rFactor 2/LMU). Assetto Corsa and AMS2 need no extra library. For <strong className="text-foreground">GT7</strong> add <code className="font-mono">pip install salsa20</code> and run with <code className="font-mono">--gt7-ps5-ip &lt;your-PS5-IP&gt;</code>. F1 and Forza use UDP — just enable telemetry in-game, no library needed.</p>
            </div>
          </Step>

          <Step n={4} icon={Play} title="Run the bridge">
            <p>In that same terminal, start it — it auto-detects your sim when you launch one:</p>
            <CopyChip text="python telemetry_bridge.py" />
            <div className="flex items-start gap-1.5 rounded-lg bg-secondary/40 border border-border p-2">
              <Info className="w-3 h-3 text-primary mt-0.5 shrink-0" />
              <p>On Mac/Linux use <code className="font-mono">python3</code> instead of <code className="font-mono">python</code>. Leave this window open while you drive.</p>
            </div>
          </Step>

          <Step n={5} icon={Wifi} title="Connect in the app">
            <p>Tap <strong className="text-foreground">Connect to bridge</strong> on this page. You'll see "waiting for your sim" until you start a session — then the dashboard goes live automatically.</p>
          </Step>

          <li className="flex gap-3 pt-2 border-t border-border">
            <div className="pt-0.5">
              <HelpCircle className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="flex-1 text-xs text-muted-foreground space-y-1.5">
              <p className="font-medium text-foreground">Troubleshooting</p>
              <p>• <strong className="text-foreground">"python not found"</strong> — use <code className="font-mono">py</code> (Windows) or <code className="font-mono">python3</code> (Mac/Linux).</p>
              <p>• <strong className="text-foreground">"No module named websockets"</strong> — run the <code className="font-mono">pip install</code> command again in step 3.</p>
              <p>• <strong className="text-foreground">Stuck on "waiting for your sim"</strong> — the bridge is running but your sim isn't detected. Launch the sim and start a session; for iRacing/ACC make sure the matching library (<code className="font-mono">irsdk</code> / <code className="font-mono">pyaccsharedmemory</code>) is installed. For ACC also enable <em>Shared Memory</em> in Options and remember telemetry only streams inside a live session.</p>
              <p>• <strong className="text-foreground">"Connection error"</strong> — the bridge isn't running. Go back to the terminal from step 4 and start it.</p>
            </div>
          </li>
        </ol>
      </details>
    </div>
  );
}