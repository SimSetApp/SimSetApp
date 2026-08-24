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
          </div>
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
              <p>If <code className="font-mono">pip</code> isn't found, try <code className="font-mono">python -m pip install aiohttp psutil</code>. For <strong className="text-foreground">iRacing</strong> add <code className="font-mono">pip install irsdk</code>; ACC uses shared memory (see the script header).</p>
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
              <p>• <strong className="text-foreground">Stuck on "waiting for your sim"</strong> — the bridge is running but your sim isn't detected. Launch the sim and start a session; for iRacing/ACC make sure the matching library (<code className="font-mono">irsdk</code> / ACC shared-memory binding) is installed.</p>
              <p>• <strong className="text-foreground">"Connection error"</strong> — the bridge isn't running. Go back to the terminal from step 4 and start it.</p>
            </div>
          </li>
        </ol>
      </details>
    </div>
  );
}