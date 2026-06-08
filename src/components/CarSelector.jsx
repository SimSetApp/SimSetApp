import { useState, useMemo } from "react";
import { CAR_LISTS, SIM_TITLES } from "../lib/simData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import SearchableSelect from "./SearchableSelect";

export default function CarSelector({ sim, setSim, car, setCar }) {
  const [activeClass, setActiveClass] = useState("All");

  const classNames = useMemo(() => {
    if (!sim || !CAR_LISTS[sim]) return [];
    return Object.keys(CAR_LISTS[sim]);
  }, [sim]);

  const carGroups = useMemo(() => {
    if (!sim || !CAR_LISTS[sim]) return [];
    return Object.entries(CAR_LISTS[sim])
      .filter(([cls]) => activeClass === "All" || cls === activeClass)
      .map(([label, items]) => ({ label, items }));
  }, [sim, activeClass]);

  const totalCars = useMemo(() => {
    if (!sim || !CAR_LISTS[sim]) return 0;
    return Object.values(CAR_LISTS[sim]).reduce((sum, cars) => sum + cars.length, 0);
  }, [sim]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Sim Title
          </label>
          <Select value={sim} onValueChange={(v) => { setSim(v); setCar(""); setActiveClass("All"); }}>
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue placeholder="Choose your sim" />
            </SelectTrigger>
            <SelectContent>
              {SIM_TITLES.map(title => (
                <SelectItem key={title} value={title}>
                  <div className="flex items-center justify-between w-full gap-3">
                    <span>{title}</span>
                    <Badge variant="outline" className="text-xs ml-2">
                      {Object.values(CAR_LISTS[title] || {}).reduce((s, c) => s + c.length, 0)} cars
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Car {totalCars > 0 && <span className="text-primary">({totalCars} available)</span>}
          </label>

          {classNames.length > 0 && (
            <Select value={activeClass} onValueChange={(v) => { setActiveClass(v); setCar(""); }}>
              <SelectTrigger className="bg-secondary border-border h-8 text-xs">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Classes</SelectItem>
                {classNames.map(cls => (
                  <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <SearchableSelect
            value={car}
            onValueChange={setCar}
            placeholder={sim ? "Select a car…" : "Pick a sim first"}
            disabled={!sim}
            groups={carGroups}
            searchPlaceholder="Search cars…"
          />
        </div>
      </div>
    </div>
  );
}