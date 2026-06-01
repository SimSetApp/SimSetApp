import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Fuel, Clock, RotateCcw, AlertTriangle } from "lucide-react";

export default function FuelCalc() {
  const [fuelPerLap, setFuelPerLap] = useState(3.2);
  const [lapCount, setLapCount] = useState(30);
  const [raceMinutes, setRaceMinutes] = useState(60);
  const [lapTimeMin, setLapTimeMin] = useState(2);
  const [lapTimeSec, setLapTimeSec] = useState(5);
  const [safetyMargin, setSafetyMargin] = useState(1);
  const [pitStops, setPitStops] = useState(1);
  const [tankSize, setTankSize] = useState(120);

  const lapResults = useMemo(() => {
    const base = lapCount * fuelPerLap;
    const withMargin = base + safetyMargin * fuelPerLap;
    const stintFuel = withMargin / (pitStops + 1);
    return { base, withMargin, stintFuel };
  }, [lapCount, fuelPerLap, safetyMargin, pitStops]);

  const timedResults = useMemo(() => {
    const lapTimeSecs = lapTimeMin * 60 + lapTimeSec;
    const estimatedLaps = lapTimeSecs > 0 ? Math.ceil((raceMinutes * 60) / lapTimeSecs) : 0;
    const base = estimatedLaps * fuelPerLap;
    const withMargin = base + safetyMargin * fuelPerLap;
    const stintFuel = withMargin / (pitStops + 1);
    return { base, withMargin, stintFuel, estimatedLaps };
  }, [raceMinutes, lapTimeMin, lapTimeSec, fuelPerLap, safetyMargin, pitStops]);

  const ResultCard = ({ label, value, unit, icon: Icon, warning }) => (
    <div className={`rounded-xl border p-4 ${warning ? "border-yellow-500/30 bg-yellow-500/5" : "border-border bg-card"}`}>
      {Icon && <Icon className={`w-4 h-4 mb-1 ${warning ? "text-yellow-400" : "text-primary"}`} />}
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-2xl font-bold font-display mt-1 ${warning ? "text-yellow-400" : "text-primary"}`}>
        {typeof value === "number" ? value.toFixed(1) : value}
      </div>
      <div className="text-xs text-muted-foreground">{unit}</div>
    </div>
  );

  const NumInput = ({ value, onChange, min, max, step = 1 }) => (
    <Input
      type="number"
      value={value}
      onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v))); }}
      className="w-20 h-7 text-xs text-right bg-secondary px-2"
      step={step}
    />
  );

  const SharedInputs = () => (
    <div className="space-y-5 mb-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-muted-foreground">Fuel Per Lap</label>
          <div className="flex items-center gap-1.5">
            <NumInput value={fuelPerLap} onChange={setFuelPerLap} min={1} max={10} step={0.1} />
            <span className="text-xs text-muted-foreground">L</span>
          </div>
        </div>
        <Slider value={[fuelPerLap]} onValueChange={([v]) => setFuelPerLap(v)} min={1} max={10} step={0.1} />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>1 L (economy)</span><span>10 L (heavy)</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-muted-foreground">Safety Margin</label>
            <div className="flex items-center gap-1.5">
              <NumInput value={safetyMargin} onChange={v => setSafetyMargin(Math.round(v))} min={0} max={5} step={1} />
              <span className="text-xs text-muted-foreground">laps</span>
            </div>
          </div>
          <Slider value={[safetyMargin]} onValueChange={([v]) => setSafetyMargin(v)} min={0} max={5} step={1} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-muted-foreground">Pit Stops</label>
            <NumInput value={pitStops} onChange={v => setPitStops(Math.round(v))} min={0} max={5} step={1} />
          </div>
          <Slider value={[pitStops]} onValueChange={([v]) => setPitStops(v)} min={0} max={5} step={1} />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-muted-foreground">Fuel Tank Size</label>
          <div className="flex items-center gap-1.5">
            <NumInput value={tankSize} onChange={setTankSize} min={40} max={200} step={5} />
            <span className="text-xs text-muted-foreground">L</span>
          </div>
        </div>
        <Slider value={[tankSize]} onValueChange={([v]) => setTankSize(v)} min={40} max={200} step={5} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="laps">
        <TabsList className="bg-secondary w-full">
          <TabsTrigger value="laps" className="flex-1 font-heading text-xs tracking-wider">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Lap Count Race
          </TabsTrigger>
          <TabsTrigger value="timed" className="flex-1 font-heading text-xs tracking-wider">
            <Clock className="w-3.5 h-3.5 mr-1.5" /> Timed Race
          </TabsTrigger>
        </TabsList>

        <TabsContent value="laps" className="pt-5">
          <SharedInputs />
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-muted-foreground">Race Laps</label>
              <div className="flex items-center gap-1.5">
                <NumInput value={lapCount} onChange={v => setLapCount(Math.round(v))} min={1} max={200} step={1} />
                <span className="text-xs text-muted-foreground">laps</span>
              </div>
            </div>
            <Slider value={[lapCount]} onValueChange={([v]) => setLapCount(v)} min={1} max={200} step={1} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <ResultCard label="Minimum Fuel" value={lapResults.base} unit="litres" icon={Fuel} />
            <ResultCard
              label="With Safety Margin"
              value={lapResults.withMargin}
              unit="litres"
              icon={Fuel}
              warning={lapResults.withMargin > tankSize}
            />
            <ResultCard label="Per Stint" value={lapResults.stintFuel} unit="litres" icon={RotateCcw} />
          </div>
          {lapResults.withMargin > tankSize && (
            <div className="mt-3 flex items-center gap-2 text-xs text-yellow-400 bg-yellow-500/5 border border-yellow-500/20 rounded-lg px-3 py-2">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              Exceeds tank size! Add at least {Math.ceil((pitStops || 1) + 1)} pit stop{(pitStops || 1) + 1 !== 1 ? "s" : ""} or reduce safety margin.
            </div>
          )}
        </TabsContent>

        <TabsContent value="timed" className="pt-5">
          <SharedInputs />
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="col-span-1">
              <label className="text-xs font-medium text-muted-foreground block mb-2">Race Duration</label>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  value={raceMinutes}
                  onChange={e => setRaceMinutes(Math.max(1, parseInt(e.target.value) || 0))}
                  className="bg-secondary text-center h-10"
                />
                <span className="text-xs text-muted-foreground">min</span>
              </div>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground block mb-2">Lap Time</label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={lapTimeMin}
                    onChange={e => setLapTimeMin(Math.max(0, parseInt(e.target.value) || 0))}
                    className="bg-secondary text-center h-10 w-16"
                  />
                  <span className="text-xs text-muted-foreground">m</span>
                </div>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={lapTimeSec}
                    onChange={e => setLapTimeSec(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                    className="bg-secondary text-center h-10 w-16"
                  />
                  <span className="text-xs text-muted-foreground">s</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ResultCard label="Est. Laps" value={timedResults.estimatedLaps.toString()} unit="laps" icon={RotateCcw} />
            <ResultCard label="Min Fuel" value={timedResults.base} unit="litres" icon={Fuel} />
            <ResultCard
              label="With Margin"
              value={timedResults.withMargin}
              unit="litres"
              icon={Fuel}
              warning={timedResults.withMargin > tankSize}
            />
            <ResultCard label="Per Stint" value={timedResults.stintFuel} unit="litres" icon={Clock} />
          </div>
          {timedResults.withMargin > tankSize && (
            <div className="mt-3 flex items-center gap-2 text-xs text-yellow-400 bg-yellow-500/5 border border-yellow-500/20 rounded-lg px-3 py-2">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              Exceeds tank size! You need at least {Math.ceil(timedResults.withMargin / tankSize) - 1} more pit stop{Math.ceil(timedResults.withMargin / tankSize) - 1 !== 1 ? "s" : ""}.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}