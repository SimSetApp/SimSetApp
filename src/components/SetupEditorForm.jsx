import { useState, useEffect, useRef } from "react";
import { SIM_SETUP_PARAMS } from "../lib/simData";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const GROUP_COLORS = [
  { bg: "bg-amber-400/10",  border: "border-amber-400/30",  text: "text-amber-400",  slider: "[&_[role=slider]]:bg-amber-400 [&_[role=slider]]:border-amber-400 [&>span>span]:bg-amber-400" },
  { bg: "bg-blue-400/10",   border: "border-blue-400/30",   text: "text-blue-400",   slider: "[&_[role=slider]]:bg-blue-400 [&_[role=slider]]:border-blue-400 [&>span>span]:bg-blue-400" },
  { bg: "bg-green-400/10",  border: "border-green-400/30",  text: "text-green-400",  slider: "[&_[role=slider]]:bg-green-400 [&_[role=slider]]:border-green-400 [&>span>span]:bg-green-400" },
  { bg: "bg-violet-400/10", border: "border-violet-400/30", text: "text-violet-400", slider: "[&_[role=slider]]:bg-violet-400 [&_[role=slider]]:border-violet-400 [&>span>span]:bg-violet-400" },
  { bg: "bg-orange-400/10", border: "border-orange-400/30", text: "text-orange-400", slider: "[&_[role=slider]]:bg-orange-400 [&_[role=slider]]:border-orange-400 [&>span>span]:bg-orange-400" },
  { bg: "bg-rose-400/10",   border: "border-rose-400/30",   text: "text-rose-400",   slider: "[&_[role=slider]]:bg-rose-400 [&_[role=slider]]:border-rose-400 [&>span>span]:bg-rose-400" },
  { bg: "bg-cyan-400/10",   border: "border-cyan-400/30",   text: "text-cyan-400",   slider: "[&_[role=slider]]:bg-cyan-400 [&_[role=slider]]:border-cyan-400 [&>span>span]:bg-cyan-400" },
];

function ParamRow({ param, value, onChange, onRemove, sliderClass = "", isCustom = false }) {
  const [inputVal, setInputVal] = useState("");
  const [editing, setEditing] = useState(false);

  const decimals = param.step < 1 ? 2 : 0;
  const displayVal = typeof value === "number" ? value.toFixed(decimals) : String(value);

  const commitInput = (raw) => {
    const n = parseFloat(raw);
    if (!isNaN(n)) {
      const clamped = Math.min(param.max, Math.max(param.min, n));
      const rounded = Math.round(clamped / param.step) * param.step;
      onChange(param.key, parseFloat(rounded.toFixed(decimals)));
    }
    setEditing(false);
  };

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-1.5 gap-2">
        <span className="text-xs text-muted-foreground flex-1 truncate">{param.label}{isCustom && <span className="ml-1 text-primary/60">(custom)</span>}</span>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {editing ? (
            <input
              type="number"
              className="w-20 h-7 rounded-md border border-primary/50 bg-background px-2 text-xs font-mono text-center focus:outline-none focus:ring-1 focus:ring-primary"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onBlur={e => commitInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") commitInput(inputVal); if (e.key === "Escape") setEditing(false); }}
              min={param.min} max={param.max} step={param.step}
              autoFocus
            />
          ) : (
            <button
              className="min-w-[60px] h-7 rounded-md border border-border bg-secondary px-2 text-xs font-mono hover:border-primary/50 hover:bg-primary/5 transition-colors text-center"
              onClick={() => { setInputVal(displayVal); setEditing(true); }}
              title="Click to type a value"
            >
              {displayVal}{param.unit}
            </button>
          )}
          {isCustom && (
            <button onClick={() => onRemove(param.key)} className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-rose-400 hover:bg-rose-400/10 transition-colors" title="Remove field">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(param.key, v)}
        min={param.min} max={param.max} step={param.step}
        className={`w-full ${sliderClass}`}
      />
      <div className="flex justify-between text-[10px] text-muted-foreground/60 mt-0.5">
        <span>{param.min}{param.unit}</span>
        <span>{param.max}{param.unit}</span>
      </div>
    </div>
  );
}

function AddCustomFieldForm({ colorText, onAdd, onCancel }) {
  const [label, setLabel] = useState("");
  const [unit, setUnit] = useState("");
  const [min, setMin] = useState("0");
  const [max, setMax] = useState("100");
  const [step, setStep] = useState("1");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = label.trim();
    if (!trimmed) return;
    const minN = parseFloat(min) || 0;
    const maxN = parseFloat(max) || 100;
    const stepN = parseFloat(step) || 1;
    // Generate a unique key from the label
    const key = "custom_" + trimmed.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "") + "_" + Date.now();
    onAdd({ key, label: trimmed, unit: unit.trim(), min: minN, max: maxN, step: stepN, default: minN });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 p-3 rounded-lg bg-muted/40 border border-border space-y-2">
      <p className={`text-xs font-semibold ${colorText} mb-2`}>Add Custom Field</p>
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <label className="text-[10px] text-muted-foreground mb-0.5 block">Field Name *</label>
          <input
            className="w-full h-7 rounded-md border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="e.g. Ballast Position"
            value={label}
            onChange={e => setLabel(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground mb-0.5 block">Unit</label>
          <input
            className="w-full h-7 rounded-md border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="e.g. kg, °, mm"
            value={unit}
            onChange={e => setUnit(e.target.value)}
          />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground mb-0.5 block">Step</label>
          <input
            type="number"
            className="w-full h-7 rounded-md border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            value={step}
            onChange={e => setStep(e.target.value)}
            min="0.01"
          />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground mb-0.5 block">Min</label>
          <input
            type="number"
            className="w-full h-7 rounded-md border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            value={min}
            onChange={e => setMin(e.target.value)}
          />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground mb-0.5 block">Max</label>
          <input
            type="number"
            className="w-full h-7 rounded-md border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            value={max}
            onChange={e => setMax(e.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button type="submit" className="flex-1 h-7 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
          Add Field
        </button>
        <button type="button" onClick={onCancel} className="flex-1 h-7 rounded-md border border-border bg-transparent text-xs text-muted-foreground hover:bg-muted transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

function GroupSection({ group, values, onChange, onAddCustom, onRemoveCustom, customFields = [], colorIndex = 0 }) {
  const color = GROUP_COLORS[colorIndex % GROUP_COLORS.length];
  const [open, setOpen] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const allParams = [...group.params, ...customFields];

  return (
    <div className={`rounded-xl border ${color.border} bg-card overflow-hidden`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/40 transition-colors"
      >
        <span className={`font-heading text-xs font-semibold tracking-wider ${color.text}`}>{group.group}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{allParams.length} params</span>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
            transition={{ duration: 0.2 }} className="overflow-hidden"
          >
            <div className="px-4 pb-3 divide-y divide-border">
              {group.params.map(param => (
                <ParamRow
                  key={param.key}
                  param={param}
                  value={values[param.key] ?? param.default}
                  onChange={onChange}
                  sliderClass={color.slider}
                />
              ))}
              {customFields.map(param => (
                <ParamRow
                  key={param.key}
                  param={param}
                  value={values[param.key] ?? param.default}
                  onChange={onChange}
                  onRemove={(key) => onRemoveCustom(group.group, key)}
                  sliderClass={color.slider}
                  isCustom
                />
              ))}
            </div>
            <div className="px-4 pb-3">
              {showAddForm ? (
                <AddCustomFieldForm
                  colorText={color.text}
                  onAdd={(field) => { onAddCustom(group.group, field); setShowAddForm(false); }}
                  onCancel={() => setShowAddForm(false)}
                />
              ) : (
                <button
                  onClick={() => setShowAddForm(true)}
                  className={`w-full h-7 rounded-md border border-dashed ${color.border} text-xs ${color.text} flex items-center justify-center gap-1.5 hover:bg-muted/40 transition-colors`}
                >
                  <Plus className="w-3 h-3" /> Add custom field
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SetupEditorForm({ sim, parameters, onChange }) {
  const groups = sim ? SIM_SETUP_PARAMS[sim] : null;
  // customFields: { [groupName]: [{ key, label, unit, min, max, step, default }] }
  const [customFields, setCustomFields] = useState({});

  // Initialize defaults when sim changes
  useEffect(() => {
    if (!groups) return;
    setCustomFields({});
    const defaults = {};
    groups.forEach(g => g.params.forEach(p => {
      if (parameters[p.key] === undefined) {
        defaults[p.key] = p.default;
      }
    }));
    if (Object.keys(defaults).length > 0) {
      onChange({ ...parameters, ...defaults });
    }
  }, [sim]);

  const handleChange = (key, value) => {
    onChange({ ...parameters, [key]: value });
  };

  const handleAddCustom = (groupName, field) => {
    setCustomFields(prev => ({
      ...prev,
      [groupName]: [...(prev[groupName] || []), field]
    }));
    onChange({ ...parameters, [field.key]: field.default });
  };

  const handleRemoveCustom = (groupName, key) => {
    setCustomFields(prev => ({
      ...prev,
      [groupName]: (prev[groupName] || []).filter(f => f.key !== key)
    }));
    const updated = { ...parameters };
    delete updated[key];
    onChange(updated);
  };

  if (!groups) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        Select a sim to see available setup parameters
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {groups.map((group, idx) => (
        <GroupSection
          key={group.group}
          group={group}
          values={parameters}
          onChange={handleChange}
          onAddCustom={handleAddCustom}
          onRemoveCustom={handleRemoveCustom}
          customFields={customFields[group.group] || []}
          colorIndex={idx}
        />
      ))}
    </div>
  );
}