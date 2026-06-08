import { useState, useMemo } from "react";
import { CAR_LISTS, SIM_TITLES } from "../lib/simData";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Car, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function CarSelector({ sim, setSim, car, setCar }) {
  const [search, setSearch] = useState("");
  const [activeClass, setActiveClass] = useState("All");

  const classNames = useMemo(() => {
    if (!sim || !CAR_LISTS[sim]) return [];
    return Object.keys(CAR_LISTS[sim]);
  }, [sim]);

  const carGroups = useMemo(() => {
    if (!sim || !CAR_LISTS[sim]) return {};
    const result = {};
    const seenCars = new Set();
    Object.entries(CAR_LISTS[sim]).forEach(([category, cars]) => {
      if (activeClass !== "All" && category !== activeClass) return;
      const matches = (search
        ? cars.filter(c => c.toLowerCase().includes(search.toLowerCase()))
        : cars
      ).filter(c => {
        if (activeClass === "All") {
          if (seenCars.has(c)) return false;
          seenCars.add(c);
        }
        return true;
      });
      if (matches.length > 0) result[category] = matches;
    });
    return result;
  }, [sim, search, activeClass]);

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
          <Select value={sim} onValueChange={(v) => { setSim(v); setCar(""); setSearch(""); setActiveClass("All"); }}>
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue placeholder="Choose your sim" />
            </SelectTrigger>
            <SelectContent>
              {SIM_TITLES.map(title => (
                <SelectItem key={title} value={title}>
                  <div className="flex items-center justify-between w-full gap-3">
                    <span>{title}</span>
                    <Badge variant="outline" className="text-xs ml-2">
                      {Object.values(CAR_LISTS[title]).reduce((s, c) => s + c.length, 0)} cars
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

          <Select value={car} onValueChange={setCar} disabled={!sim}>
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue placeholder={sim ? "Select a car" : "Pick a sim first"} />
            </SelectTrigger>
            <SelectContent>
              <div className="px-2 pb-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search cars..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-7 h-8 text-sm bg-muted"
                  />
                </div>
              </div>
              {Object.entries(carGroups).map(([category, cars]) => (
                <SelectGroup key={category}>
                  <SelectLabel className="flex items-center gap-2 text-primary">
                    <Car className="w-3 h-3" />
                    {category}
                    <span className="text-muted-foreground font-normal">({cars.length})</span>
                  </SelectLabel>
                  {cars.map(c => (
                    <SelectItem key={`${category}__${c}`} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
              {Object.keys(carGroups).length === 0 && (
                <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                  No cars found
                </div>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}