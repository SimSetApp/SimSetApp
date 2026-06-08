import { useState, useRef, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MobileHeader from "../components/MobileHeader";
import { base44 } from "@/api/base44Client";
import { SIM_TITLES, CAR_LISTS, TRACK_LISTS } from "../lib/simData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import SearchableSelect from "../components/SearchableSelect";
import { Send, Bot, User, Loader2, Zap, ChevronRight, RotateCcw, Headphones } from "lucide-react";
import ReactMarkdown from "react-markdown";

const QUICK_QUESTIONS = [
  "My car understeers badly in slow corners — what should I change?",
  "The rear snaps out on corner exit when I apply throttle",
  "I'm losing too much time under braking — car feels unstable",
  "My tyres are overheating on the front edges — how do I fix this?",
  "The car bounces over kerbs and feels very stiff",
  "I'm struggling with traction in slow hairpins",
  "The car feels too nervous at high speed — especially through fast sweepers",
  "What's a good baseline setup for qualifying vs race?",
];

function MessageBubble({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot className="w-4 h-4 text-primary" />
        </div>
      )}
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isUser
          ? "bg-primary text-primary-foreground rounded-tr-sm"
          : "bg-card border border-border rounded-tl-sm"
      }`}>
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <ReactMarkdown
            className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_strong]:text-primary [&_ul]:pl-4 [&_li]:my-0.5"
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>
      {isUser && (
        <div className="h-8 w-8 rounded-xl bg-secondary border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

export default function RaceEngineer() {
  const [sim, setSim] = useState("");
  const [car, setCar] = useState("");
  const [track, setTrack] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const carGroups = useMemo(() => {
    if (!sim || !CAR_LISTS[sim]) return [];
    return Object.entries(CAR_LISTS[sim]).map(([label, items]) => ({ label, items }));
  }, [sim]);

  const trackItems = useMemo(() => {
    if (!sim || !TRACK_LISTS[sim]) return [];
    return TRACK_LISTS[sim];
  }, [sim]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const buildSystemContext = () => {
    const context = [];
    if (sim) context.push(`Sim: ${sim}`);
    if (car) context.push(`Car: ${car}`);
    if (track) context.push(`Track: ${track}`);
    return context.join(" | ");
  };

  const buildHistory = () =>
    messages.map(m => `${m.role === "user" ? "Driver" : "Engineer"}: ${m.content}`).join("\n\n");

  const sendMessage = async (text) => {
    const userMessage = text || input.trim();
    if (!userMessage) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    const context = buildSystemContext();
    const history = buildHistory();

    const prompt = `You are an expert sim racing race engineer and setup specialist. You have deep knowledge of all major racing simulators including iRacing, Assetto Corsa Competizione, Assetto Corsa, Assetto Corsa Evo, Le Mans Ultimate, Automobilista 2, and Gran Turismo 7.

${context ? `Current context: ${context}\n` : ""}${history ? `Conversation so far:\n${history}\n\n` : ""}Driver question: ${userMessage}

Respond as a professional race engineer. Be specific and practical:
- Give concrete parameter adjustments with numbers/directions where possible
- Explain WHY a change will help (brief physics reasoning)
- Prioritize the most impactful changes first
- Keep it focused and actionable — drivers want to get back on track
- Use bullet points for lists of changes
- If you need more context (which sim, car, track) to give better advice, ask for it

Do not be overly verbose. Quality over quantity.`;

    try {
      const response = await base44.integrations.Core.InvokeLLM({ prompt });
      setMessages([...newMessages, { role: "assistant", content: response }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const reset = () => {
    setMessages([]);
    setSim("");
    setCar("");
    setTrack("");
    setInput("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <MobileHeader title="AI Race Engineer" />
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-6 pb-24 gap-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
              <Bot className="w-6 h-6 text-primary" />
              AI Race Engineer
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Describe your handling problem — get specific setup advice</p>
          </div>
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={reset} className="text-muted-foreground">
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              New Session
            </Button>
          )}
        </div>

        {/* Context strip */}
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium">Sim</label>
            <Select value={sim} onValueChange={(v) => { setSim(v); setCar(""); }}>
              <SelectTrigger className="bg-secondary text-sm h-9"><SelectValue placeholder="Select sim…" /></SelectTrigger>
              <SelectContent>
                {SIM_TITLES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium">Car <span className="text-muted-foreground/50">(optional)</span></label>
            <SearchableSelect
              value={car}
              onValueChange={setCar}
              placeholder="Any car"
              disabled={!sim}
              groups={carGroups}
              searchPlaceholder="Search cars…"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium">Track <span className="text-muted-foreground/50">(optional)</span></label>
            <SearchableSelect
              value={track}
              onValueChange={setTrack}
              placeholder="Any track"
              disabled={!sim}
              items={trackItems}
              searchPlaceholder="Search tracks…"
            />
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-h-0">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-8">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-heading text-lg font-semibold mb-1">Ready to engineer your lap time</h2>
              <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
                Tell me what your car is doing wrong and I'll give you specific setup changes to fix it.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-2xl">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-left px-3 py-2.5 rounded-xl border border-border bg-card hover:bg-secondary hover:border-primary/30 transition-all text-xs text-muted-foreground hover:text-foreground flex items-start gap-2 group"
                  >
                    <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0 text-primary/50 group-hover:text-primary transition-colors" />
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-4 py-2 pr-1">
              {messages.map((m, i) => (
                <MessageBubble key={i} message={m} />
              ))}
              {loading && (
                <div className="flex gap-3 justify-start">
                  <div className="h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground">Analysing your setup…</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your handling problem… (Enter to send)"
              rows={2}
              className="w-full rounded-xl border border-input bg-secondary px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none leading-relaxed"
            />
          </div>
          <Button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="h-[74px] px-4 rounded-xl"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>

        {messages.length === 0 && (
          <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
            <Zap className="w-3 h-3 text-primary" />
            More context = better advice. Select your sim and car above for targeted recommendations.
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
}