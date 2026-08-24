import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { SIM_SETUP_PARAMS } from "../lib/simData";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, SlidersHorizontal, Clock, Car, MapPin, GitBranch } from "lucide-react";
import SessionForm from "./SessionForm";
import SessionCard from "./SessionCard";
import SetupVersionHistory from "./SetupVersionHistory";
import SetupPerformanceChart from "./SetupPerformanceChart";

function SetupParamsReadOnly({ sim, parameters }) {
  const groups = sim && SIM_SETUP_PARAMS[sim];
  if (!groups || !parameters || !Object.keys(parameters).length) {
    return <p className="text-sm text-muted-foreground py-4 text-center">No parameters saved for this setup.</p>;
  }
  return (
    <div className="space-y-3">
      {groups.map((group, gi) => {
        const vals = group.params.filter(p => parameters[p.key] !== undefined);
        if (!vals.length) return null;
        return (
          <div key={group.group} className="rounded-xl border border-border bg-secondary p-3">
            <p className="text-xs font-semibold text-primary mb-2">{group.group}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {vals.map(p => (
                <div key={p.key} className="text-xs">
                  <span className="text-muted-foreground">{p.label}: </span>
                  <span className="font-mono font-medium">{typeof parameters[p.key] === 'number' && parameters[p.key] % 1 !== 0 ? parameters[p.key].toFixed(1) : parameters[p.key]}{p.unit}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function SetupDetailSheet({ setup, open, onOpenChange }) {
  const queryClient = useQueryClient();
  const [addingSession, setAddingSession] = useState(false);
  const [editingSession, setEditingSession] = useState(null);

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["sessions", setup?.id],
    queryFn: () => base44.entities.SessionLog.filter({ setup_id: setup.id }, "-created_date"),
    enabled: !!setup?.id && open,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.SessionLog.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sessions", setup?.id] }),
  });

  if (!setup) return null;

  const showForm = addingSession || !!editingSession;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 z-10">
          <SheetTitle className="font-heading tracking-wide text-base">{setup.title}</SheetTitle>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Car className="w-3 h-3 text-primary" />{setup.car}
            </span>
            <span className="text-xs text-border">•</span>
            <span className="text-xs text-muted-foreground">{setup.sim_title}</span>
            {setup.track && <>
              <span className="text-xs text-border">•</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />{setup.track}
              </span>
            </>}
          </div>
        </div>

        <div className="p-6">
          {showForm ? (
            <div>
              <h3 className="font-heading text-sm font-semibold tracking-wide mb-4">
                {editingSession ? "Edit Session" : "New Session Log"}
              </h3>
              <SessionForm
                setupId={setup.id}
                editSession={editingSession}
                onDone={() => { setAddingSession(false); setEditingSession(null); }}
              />
            </div>
          ) : (
            <Tabs defaultValue="sessions">
              <TabsList className="bg-secondary w-full mb-5">
                <TabsTrigger value="sessions" className="flex-1 text-xs font-heading tracking-wider">
                  <Clock className="w-3.5 h-3.5 mr-1.5" />
                  Sessions {sessions.length > 0 && <Badge className="ml-1.5 h-4 px-1.5 text-xs">{sessions.length}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="params" className="flex-1 text-xs font-heading tracking-wider">
                  <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
                  Setup
                </TabsTrigger>
                <TabsTrigger value="versions" className="flex-1 text-xs font-heading tracking-wider">
                  <GitBranch className="w-3.5 h-3.5 mr-1.5" />
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sessions">
                <div className="flex justify-end mb-4">
                  <Button size="sm" onClick={() => setAddingSession(true)} className="font-heading text-xs tracking-wider">
                    <Plus className="w-3.5 h-3.5 mr-1.5" /> Log Session
                  </Button>
                </div>

                {!isLoading && sessions.length > 1 && (
                  <div className="mb-4">
                    <SetupPerformanceChart sessions={sessions} />
                  </div>
                )}

                {isLoading && (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                )}

                {!isLoading && sessions.length === 0 && (
                  <div className="text-center py-12">
                    <Clock className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm font-medium">No sessions logged yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Log your first session to track lap times, weather and pit strategy.</p>
                    <Button size="sm" className="mt-4 font-heading text-xs" onClick={() => setAddingSession(true)}>
                      <Plus className="w-3.5 h-3.5 mr-1.5" /> Log First Session
                    </Button>
                  </div>
                )}

                {!isLoading && sessions.length > 0 && (
                  <div className="space-y-3">
                    {sessions.map(session => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        onEdit={(s) => { setEditingSession(s); }}
                        onDelete={(id) => deleteMutation.mutate(id)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="params">
                <SetupParamsReadOnly sim={setup.sim_title} parameters={setup.parameters} />
                {setup.notes && (
                  <div className="mt-4 rounded-xl border border-border bg-secondary px-4 py-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Setup Notes</p>
                    <p className="text-sm leading-relaxed">{setup.notes}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="versions">
                <SetupVersionHistory setup={setup} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}