import React, { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Flag,
  Share2,
  Trash2,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  Edit3,
  Save,
  Trophy
} from "lucide-react";
import { SavedJourney } from "../types";
import { CatalystTimer } from "./CatalystTimer";
import { JourneyMomentumChart } from "./JourneyMomentumChart";
import confetti from "canvas-confetti";

interface ActiveJourneyTrailProps {
  journey: SavedJourney;
  onToggleWaypoint: (waypointId: string) => void;
  onUpdateWaypointNotes: (waypointId: string, notes: string) => void;
  onClearJourney: () => void;
  onReturnToPlan: () => void;
}

export const ActiveJourneyTrail: React.FC<ActiveJourneyTrailProps> = ({
  journey,
  onToggleWaypoint,
  onUpdateWaypointNotes,
  onClearJourney,
  onReturnToPlan,
}) => {
  const { plan, activePathwayId, completedWaypointIds, notesByWaypointId } = journey;
  const pathway =
    plan.pathways.find((p) => p.id === activePathwayId) || plan.pathways[0];

  const totalWaypoints = pathway.waypoints.length;
  const completedCount = pathway.waypoints.filter((w) =>
    completedWaypointIds.includes(w.id)
  ).length;
  const progressPercent = Math.round((completedCount / totalWaypoints) * 100);

  const [activeEditingNoteId, setActiveEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [showTimer, setShowTimer] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleToggle = (id: string) => {
    const isNowCompleted = !completedWaypointIds.includes(id);
    onToggleWaypoint(id);
    if (isNowCompleted) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
      if (completedCount + 1 === totalWaypoints) {
        setTimeout(() => {
          confetti({
            particleCount: 120,
            spread: 100,
            origin: { y: 0.6 },
          });
        }, 300);
      }
    }
  };

  const startEditingNotes = (id: string, currentNotes = "") => {
    setActiveEditingNoteId(id);
    setNoteDraft(currentNotes || "");
  };

  const saveNotes = (id: string) => {
    onUpdateWaypointNotes(id, noteDraft);
    setActiveEditingNoteId(null);
  };

  const handleCopyExpeditionLog = () => {
    const text = `ACTIVE WAYFINDER TRAIL
Mission: ${plan.title}
Selected Path: ${pathway.name} (${progressPercent}% Cleared)

Waypoints Progress:
${pathway.waypoints
  .map(
    (w) =>
      `[${completedWaypointIds.includes(w.id) ? "X" : " "}] ${w.order}. ${w.title}\n   Notes: ${notesByWaypointId[w.id] || "No notes logged yet."}`
  )
  .join("\n\n")}

Core Reframe: ${plan.coreInsight}
Mantra: ${plan.compassBearing.principle}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Active Trail Status Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-7 border border-stone-800 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Active Expedition Trail
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyExpeditionLog}
              className="text-xs px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? "Copied Log!" : "Copy Trail Log"}</span>
            </button>
            <button
              onClick={onReturnToPlan}
              className="text-xs px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>All 3 Paths</span>
            </button>
            <button
              onClick={onClearJourney}
              className="text-xs px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-rose-950 text-stone-400 hover:text-rose-300 transition-colors flex items-center gap-1.5"
              title="Reset active trail"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
            {pathway.name}
          </h2>
          <p className="text-stone-300 text-sm mt-1 max-w-2xl leading-relaxed">
            {pathway.description}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-stone-300">
              Waypoints Cleared: {completedCount} of {totalWaypoints}
            </span>
            <span className="text-amber-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-stone-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {progressPercent === 100 && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              All expedition waypoints conquered! You found a way through the obstacle.
            </span>
          </div>
        )}
      </div>

      {/* Progress Chart over Time using Recharts */}
      <JourneyMomentumChart journey={journey} pathway={pathway} />

      {/* Immediate Catalyst Focus Box */}
      <div className="bg-amber-50/80 rounded-2xl border border-amber-200 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Active Inertia Breaker</span>
            </div>
            <h3 className="font-display font-bold text-lg text-stone-900">
              {pathway.catalystAction.title} ({pathway.catalystAction.durationMinutes} Minutes)
            </h3>
            <p className="text-stone-700 text-xs sm:text-sm mt-1 max-w-2xl">
              {pathway.catalystAction.instructions}
            </p>
          </div>

          <button
            onClick={() => setShowTimer(!showTimer)}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-stone-900 text-stone-50 hover:bg-stone-800 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm shrink-0"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{showTimer ? "Hide Timer" : "Launch Catalyst Timer"}</span>
          </button>
        </div>

        {showTimer && (
          <div className="mt-4 pt-4 border-t border-amber-200">
            <CatalystTimer
              initialMinutes={pathway.catalystAction.durationMinutes}
              actionTitle={pathway.catalystAction.title}
            />
          </div>
        )}
      </div>

      {/* Interactive Waypoint Trail Checklist */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-5 sm:p-7 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <Flag className="w-3.5 h-3.5 text-stone-700" />
            <span>Trail Checkpoints & Field Notes</span>
          </h3>
          <span className="text-xs text-stone-400">Click circle to verify completion</span>
        </div>

        <div className="space-y-4">
          {pathway.waypoints.map((waypoint, index) => {
            const isDone = completedWaypointIds.includes(waypoint.id);
            const notes = notesByWaypointId[waypoint.id] || "";
            const isEditingNote = activeEditingNoteId === waypoint.id;

            return (
              <div
                key={waypoint.id}
                className={`p-4 sm:p-5 rounded-xl border transition-all ${
                  isDone
                    ? "bg-emerald-50/40 border-emerald-200/80"
                    : "bg-white border-stone-200 hover:border-stone-300"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => handleToggle(waypoint.id)}
                    className="mt-0.5 text-stone-400 hover:text-emerald-600 transition-colors shrink-0"
                    title={isDone ? "Mark as in-progress" : "Mark as completed"}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-6 h-6 text-stone-300 hover:text-stone-400" />
                    )}
                  </button>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h4
                        className={`font-display font-bold text-base sm:text-lg transition-colors ${
                          isDone ? "text-emerald-950 line-through decoration-emerald-500/50" : "text-stone-900"
                        }`}
                      >
                        {waypoint.order}. {waypoint.title}
                      </h4>
                      {isDone && (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-200">
                          Cleared
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {waypoint.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-2 rounded-lg bg-stone-50 border border-stone-200/60 text-stone-700">
                        <span className="font-semibold text-stone-900 block mb-0.5">
                          Obstacle Bypass:
                        </span>
                        <span>{waypoint.obstacleBypass}</span>
                      </div>

                      <div className="p-2 rounded-lg bg-stone-50 border border-stone-200/60 text-stone-700">
                        <span className="font-semibold text-stone-900 block mb-0.5">
                          Verification Proof:
                        </span>
                        <span>{waypoint.checkpointProof}</span>
                      </div>
                    </div>

                    {/* Field Notes Section */}
                    <div className="pt-2">
                      {isEditingNote ? (
                        <div className="space-y-2 mt-2">
                          <textarea
                            rows={2}
                            value={noteDraft}
                            onChange={(e) => setNoteDraft(e.target.value)}
                            placeholder="Add your trail discoveries, contacts made, or real-world outcomes..."
                            className="w-full px-3 py-2 text-xs text-stone-800 rounded-lg border border-stone-300 focus:border-stone-800 focus:ring-1 focus:ring-stone-800 resize-none"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => saveNotes(waypoint.id)}
                              className="px-3 py-1 rounded-md bg-stone-900 text-stone-50 text-xs font-medium flex items-center gap-1 hover:bg-stone-800"
                            >
                              <Save className="w-3 h-3" />
                              <span>Save Note</span>
                            </button>
                            <button
                              onClick={() => setActiveEditingNoteId(null)}
                              className="px-2.5 py-1 rounded-md text-stone-500 hover:text-stone-700 text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-xs pt-1">
                          {notes ? (
                            <div className="bg-amber-50/60 border border-amber-200/50 rounded-lg p-2 text-stone-700 text-xs flex-1 mr-2">
                              <span className="font-semibold text-amber-900 block mb-0.5">
                                Trail Note:
                              </span>
                              <span>{notes}</span>
                            </div>
                          ) : (
                            <span className="text-stone-400 text-[11px] italic">
                              No field notes logged yet
                            </span>
                          )}

                          <button
                            onClick={() => startEditingNotes(waypoint.id, notes)}
                            className="text-stone-500 hover:text-stone-900 transition-colors p-1 flex items-center gap-1 text-[11px] font-medium"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>{notes ? "Edit Note" : "+ Log Note"}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
