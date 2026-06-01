import { useState } from "react";
import { TUNING_ARTICLES } from "../lib/tuningGuideData";
import Navbar from "../components/Navbar";
import { BookOpen, Clock, ChevronRight, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

const categoryColors = {
  Mechanical: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Aerodynamics: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Tyres: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Drivetrain: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Geometry: "bg-green-500/10 text-green-400 border-green-500/20",
  Advanced: "bg-red-500/10 text-red-400 border-red-500/20",
  Brakes: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Process: "bg-primary/10 text-primary border-primary/20",
};

function ArticleView({ article, onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Guide
      </button>

      <div className="mb-6">
        <Badge variant="outline" className={`text-xs mb-3 ${categoryColors[article.category] || ""}`}>
          {article.category}
        </Badge>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-2">{article.title}</h1>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {article.readTime} read</span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-2xl">{article.summary}</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {article.sections.map((section, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <h2 className="font-heading text-sm font-bold tracking-wide mb-3 text-primary">{section.heading}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{section.body}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function TuningGuide() {
  const [selected, setSelected] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...new Set(TUNING_ARTICLES.map(a => a.category))];
  const filtered = activeCategory === "All" ? TUNING_ARTICLES : TUNING_ARTICLES.filter(a => a.category === activeCategory);

  if (selected) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <ArticleView article={selected} onBack={() => setSelected(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xs font-bold tracking-widest text-primary uppercase">Tuning Encyclopedia</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Deep-Dive Tuning Articles
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl">
            {TUNING_ARTICLES.length} in-depth articles covering every aspect of race car setup — from basics to advanced concepts like weight jacking and aero sensitivity.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
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

        {/* Article grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(article => (
            <button
              key={article.id}
              onClick={() => setSelected(article)}
              className="group rounded-2xl border border-border bg-card p-5 text-left hover:border-primary/30 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <Badge variant="outline" className={`text-xs flex-shrink-0 ${categoryColors[article.category] || ""}`}>
                  {article.category}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1 flex-shrink-0">
                  <Clock className="w-3 h-3" /> {article.readTime}
                </span>
              </div>
              <h3 className="font-heading text-sm font-semibold mb-2 group-hover:text-primary transition-colors">
                {article.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{article.summary}</p>
              <div className="flex items-center gap-1 mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Read article <ChevronRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}