import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import { Input } from "@/components/ui/input";

/**
 * SearchableSelect — a lightweight searchable dropdown.
 *
 * Props:
 *   value        string  — current value
 *   onValueChange fn     — called with the selected value
 *   placeholder  string
 *   disabled     bool
 *   groups       [{ label, items: [string] }]  — grouped items
 *   items        [string]                       — flat items (used if no groups)
 *   searchPlaceholder string
 *   className    string  — extra classes on the trigger
 */
export default function SearchableSelect({
  value,
  onValueChange,
  placeholder = "Select…",
  disabled = false,
  groups,
  items,
  searchPlaceholder = "Search…",
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else setSearch("");
  }, [open]);

  const q = search.toLowerCase();

  const filteredGroups = groups
    ? groups.map(g => ({ ...g, items: g.items.filter(i => i.toLowerCase().includes(q)) })).filter(g => g.items.length > 0)
    : null;

  const filteredItems = !groups && items
    ? items.filter(i => i.toLowerCase().includes(q))
    : null;

  const displayValue = value || placeholder;
  const hasValue = !!value;

  const handleSelect = (val) => {
    onValueChange(val);
    setOpen(false);
  };

  const totalResults = filteredGroups
    ? filteredGroups.reduce((s, g) => s + g.items.length, 0)
    : (filteredItems?.length ?? 0);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(o => !o)}
        className={`flex h-9 w-full items-center justify-between rounded-md border border-input bg-secondary px-3 py-2 text-sm shadow-sm transition-colors
          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
          disabled:cursor-not-allowed disabled:opacity-50
          ${hasValue ? "text-foreground" : "text-muted-foreground"}`}
      >
        <span className="truncate">{displayValue}</span>
        <ChevronDown className={`w-4 h-4 flex-shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full min-w-[220px] rounded-md border border-border bg-popover shadow-lg">
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                ref={inputRef}
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-7 h-8 text-sm bg-muted border-0 focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto overscroll-contain rounded-b-md">
            {totalResults === 0 && (
              <p className="px-4 py-3 text-xs text-muted-foreground text-center">No results found</p>
            )}

            {filteredGroups && filteredGroups.map(group => (
              <div key={group.label}>
                <div className="px-3 py-1.5 text-xs font-semibold text-primary bg-muted/60 border-b border-border/40">{group.label}</div>
                {group.items.map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className="flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                  >
                    <span>{item}</span>
                    {value === item && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                  </button>
                ))}
              </div>
            ))}

            {filteredItems && filteredItems.map(item => (
              <button
                key={item}
                type="button"
                onClick={() => handleSelect(item)}
                className="flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors text-left"
              >
                <span>{item}</span>
                {value === item && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}