import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MobileHeader from "../components/MobileHeader";
import { LEARNING_PATH } from "../lib/learningPathData";
import { Sprout, Wrench, GraduationCap, ChevronRight, Clock, ArrowRight, CheckCircle2, Circle } from "lucide-react";

const iconMap = { Sprout, Wrench, GraduationCap };

export default function LearningPath() {
  const [completed, setCompleted] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("learning-progress") || "[]");
    } catch {
      return [];
    }
  });

  const toggleComplete = (moduleId) => {
    setCompleted(prev => {
      const next = prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId];
      localStorage.setItem("learning-progress", JSON.stringify(next));
      return next;
    });
  };

  const totalModules = LEARNING_PATH.reduce((s, l) => s + l.modules.length, 0);
  const progress = Math.round((completed.length / totalModules) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <MobileHeader title="Learning Path" />
      <div className="max-w-3xl mx-auto px-4 py-8 pb-24">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold tracking-tight">Setup Learning Path</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Progress from beginner to advanced — one concept at a time. Track your progress as you go.
          </p>
        </div>

        {/* Progress bar */}
        <div className="rounded-2xl border border-border bg-card p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Your Progress</span>
            <span className="text-sm font-bold tabular-nums text-primary">{completed.length} / {totalModules} modules</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">{progress}% complete</div>
        </div>

        {/* Levels */}
        <div className="space-y-6">
          {LEARNING_PATH.map((level, li) => {
            const Icon = iconMap[level.icon] || Sprout;
            const levelModules = level.modules.map((m, mi) => `${li}-${mi}`);
            const levelCompleted = levelModules.filter(id => completed.includes(id)).length;
            const levelProgress = Math.round((levelCompleted / level.modules.length) * 100);

            return (
              <div key={li}>
                {/* Level header */}
                <div className={`rounded-2xl border ${level.border} ${level.bg} p-4 mb-3`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${level.bg} flex items-center justify-center shrink-0 border ${level.border}`}>
                      <Icon className={`w-5 h-5 ${level.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className={`font-heading text-base font-bold ${level.color}`}>{level.level}</h2>
                        <span className="text-xs text-muted-foreground">• {levelCompleted}/{level.modules.length} done</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{level.description}</p>
                    </div>
                    <div className="text-2xl font-bold tabular-nums text-muted-foreground">{levelProgress}%</div>
                  </div>
                </div>

                {/* Modules */}
                <div className="space-y-2 ml-1">
                  {level.modules.map((module, mi) => {
                    const moduleId = `${li}-${mi}`;
                    const isDone = completed.includes(moduleId);
                    return (
                      <div key={moduleId} className="rounded-xl border border-border bg-card p-4 hover:border-primary/20 transition-all">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleComplete(moduleId)}
                            className="mt-0.5 shrink-0"
                          >
                            {isDone ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <Circle className="w-5 h-5 text-muted-foreground" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-heading text-sm font-semibold ${isDone ? "text-muted-foreground" : "text-foreground"}`}>
                                {module.title}
                              </h3>
                              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground shrink-0">
                                <Clock className="w-2.5 h-2.5" /> {module.duration}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed mb-3">{module.summary}</p>

                            {/* Key takeaways */}
                            <div className="space-y-1 mb-3">
                              {module.keyTakeaways.map((kt, i) => (
                                <div key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                  <span className="mt-1 w-1 h-1 rounded-full bg-primary shrink-0" />
                                  <span>{kt}</span>
                                </div>
                              ))}
                            </div>

                            {/* Action link */}
                            {module.action && (
                              <Link
                                to={module.action.href}
                                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:gap-2 transition-all"
                              >
                                {module.action.label} <ArrowRight className="w-3 h-3" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}