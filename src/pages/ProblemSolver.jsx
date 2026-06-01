import { useState, useMemo } from "react";
import { PROBLEMS, PROBLEM_CATEGORIES } from "../lib/problemSolverData";
import Navbar from "../components/Navbar";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Filter, Search, Wrench, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

const severityConfig = {
  critical: { label: "Critical", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
  high: { label: "High", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
  medium: { label: "Medium", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  low: { label: "Low", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
};

function PriorityBadge({ n }) {
  const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-slate-500", "bg-slate-600"];
  return (
    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold text-white ${colors[n - 1] || colors[5]}`}>
      {n}
    </span>
  );
}

function ProblemCard({ problem }) {
  const [open, setOpen] = useState(false);
  const sev = severityConfig[problem.severity] || severityConfig.medium;

  return (
    <div className={`rounded-2xl border bg-card overflow-hidden transition-all duration-200 ${open ? "border-primary/30" : "border-border hover:border-border/80"}`}>
      <button
        className="w-full text-left p-5 flex items-start gap-4"
        onClick={() => setOpen(!open)}
      >
        <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 mt-2 ${sev.color.replace("text-", "bg-")}`} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-heading text-sm font-semibold">{problem.title}</span>
            <Badge variant="outline" className={`text-xs ${sev.color} border-current`}>
              {sev.label}
            </Badge>
            <Badge variant="outline" className="text-xs text-muted-foreground">{problem.category}</Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">{problem.description}</p>
          <p className="text-xs text-primary/70 mt-1 font-medium">{problem.condition}</p>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-5 pb-5 border-t border-border/50 pt-4 space-y-5">
              {/* Symptoms */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-orange-400" /> Symptoms
                </h4>
                <ul className="space-y-1">
                  {problem.symptoms.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-orange-400 mt-0.5">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Fixes */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-primary" /> Fixes — in priority order
                </h4>
                <div className="space-y-3">
                  {problem.fixes.map((fix, i) => (
                    <div key={i} className="flex gap-3">
                      <PriorityBadge n={fix.priority} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{fix.action}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{fix.why}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Not applicable note */}
              {problem.notApply && (
                <div className="rounded-xl bg-muted/50 border border-border p-3 flex gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed"><span className="font-medium text-foreground">Note: </span>{problem.notApply}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProblemSolver() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return PROBLEMS.filter(p => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.symptoms.some(s => s.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
            </div>
            <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">Problem Solver</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Handling Issue Diagnosis
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl">
            {PROBLEMS.length} common sim racing handling problems with prioritised fixes and explanations of why each adjustment works.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="space-y-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search issues, symptoms..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {["All", ...PROBLEM_CATEGORIES].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-xs text-muted-foreground mb-4">
          Showing {filtered.length} of {PROBLEMS.length} issues
        </p>

        {/* Problem cards */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No matching issues found.</p>
            </div>
          ) : (
            filtered.map(p => <ProblemCard key={p.id} problem={p} />)
          )}
        </div>
      </div>
    </div>
  );
}