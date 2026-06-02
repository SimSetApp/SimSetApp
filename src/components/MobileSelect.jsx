import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Renders a bottom-sheet picker on mobile and a standard Radix Select on desktop.
 * Props mirror a simplified Radix Select API:
 *   value, onValueChange, placeholder, options: [{value, label}], className
 */
export default function MobileSelect({ value, onValueChange, placeholder, options = [], className = "", triggerClassName = "" }) {
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const selectedLabel = options.find(o => o.value === value)?.label ?? placeholder ?? "Select...";

  if (isMobile) {
    return (
      <>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className={`flex items-center justify-between gap-2 h-10 px-3 rounded-md border border-input bg-background text-sm touch-manipulation active:opacity-70 ${triggerClassName}`}
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <span className="truncate text-foreground">{selectedLabel}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        </button>
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{placeholder ?? "Select an option"}</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-8 space-y-1 max-h-72 overflow-y-auto">
              {options.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => { onValueChange(option.value); setDrawerOpen(false); }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm text-left hover:bg-muted active:bg-muted/80 touch-manipulation transition-colors"
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  <span>{option.label}</span>
                  {option.value === value && <Check className="w-4 h-4 text-primary" />}
                </button>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={triggerClassName || className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}