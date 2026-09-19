import React, { useState } from "react";
import {
  Compass,
  ArrowRight,
  ShieldAlert,
  CheckCircle,
  Flag,
  Share2,
  BookmarkPlus,
  Zap,
  Clock,
  Sparkles,
  ChevronRight,
  Repeat
} from "lucide-react";
import { WayfindingPlan, Pathway } from "../types";
import { CatalystTimer } from "./CatalystTimer";

interface WayfindingResultsProps {
  plan: WayfindingPlan;
  onSelectPathway: (pathwayId: string) => void;
  activePathwayId?: string;
  onNewSearch: () => void;
}

export const WayfindingResults: React.FC<WayfindingResultsProps> = ({
  plan,
  onSelectPathway,
  activePathwayId,
  onNewSearch,
}) => {
  const [selectedPathId, setSelectedPathId] = useState<string>(
    activePathwayId || plan.pathways[0]?.id || "path-1"
  );
  const [showTimer, setShowTimer] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const currentPathway =
    plan.pathways.find((p) => p.id === selectedPathId) || plan.pathways[0];

  const handleShareBriefing = () => {
    const text = `WAYFINDER EXPEDITION BRIEFING
Title: ${plan.title}
Compass Bearing: ${plan.compassBearing.direction} - ${plan.compassBearing.principle}
Core Reframe: ${plan.coreInsight}

Selected Path: ${currentPathway.name} (${currentPathway.tagline})
Catalyst Action: ${currentPathway.catalystAction.title} - ${currentPathway.catalystAction.instructions}

Waypoints:
${currentPathway.waypoints.map((w) => `${w.order}. ${w.title}: ${w.description}`).join("\n")}

Anchor Thought: "${plan.compassBearing.anchorThought}"
Generated via Wayfinder`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getStrategyBadge = (type: string) => {
    switch (type) {
      case "incremental":
        return {
          bg: "bg-emerald-50 text-emerald-900 border-emerald-200",
          label: "Low Friction • Steady Foothold",
        };
      case "lateral":
        return {
          bg: "bg-amber-50 text-amber-900 border-amber-200",
          label: "Lateral Reframe • Side Door",
        };
      case "inversion":
        return {
          bg: "bg-purple-50 text-purple-900 border-purple-200",
          label: "Obstacle As Leverage",
        };
      default:
        return {
          bg: "bg-stone-50 text-stone-900 border-stone-200",
          label: "Strategic Advance",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Compass Bearing & Reframe Card */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-7 border border-stone-800 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2 text-amber-400">
            <Compass className="w-5 h-5 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Compass Bearing: {plan.compassBearing.direction}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareBriefing}
              className="text-xs px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? "Copied Briefing!" : "Copy Briefing"}</span>
            </button>
            <button
              onClick={onNewSearch}
              className="text-xs px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors flex items-center gap-1.5"
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>Chart Another</span>
            </button>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
            {plan.title}
          </h2>
          <p className="text-stone-300 text-sm sm:text-base mt-2 leading-relaxed">
            {plan.summary}
          </p>
        </div>

        {/* The Core Reframe */}
        <div className="mt-5 p-4 rounded-xl bg-stone-800/80 border border-stone-700/60">
          <div className="text-xs uppercase font-semibold tracking-wider text-amber-400 flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Core Reframe (Dismantling the Wall)</span>
          </div>
          <p className="text-stone-200 text-sm font-medium leading-relaxed italic">
            "{plan.coreInsight}"
          </p>
          <div className="mt-2 text-xs text-stone-400">
            <span className="text-stone-300 font-semibold">Navigational Mantra:</span>{" "}
            {plan.compassBearing.principle}
          </div>
        </div>
      </div>

      {/* Pathways Selector Tabs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            3 Distinct Paths Forward (Select One to Explore)
          </h3>
          <span className="text-xs text-stone-400">Different angles of approach</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {plan.pathways.map((pathway) => {
            const isSelected = selectedPathId === pathway.id;
            const badge = getStrategyBadge(pathway.strategyType);
            const isCurrentActive = activePathwayId === pathway.id;

            return (
              <div
                key={pathway.id}
                onClick={() => setSelectedPathId(pathway.id)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all relative ${
                  isSelected
                    ? "bg-white border-stone-900 shadow-md ring-1 ring-stone-900"
                    : "bg-white/80 border-stone-200 hover:border-stone-300 hover:bg-white"
                }`}
              >
                {isCurrentActive && (
                  <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 font-bold text-[10px] uppercase tracking-wider shadow-sm">
                    Current Active Trail
                  </span>
                )}

                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${badge.bg}`}>
                    {pathway.strategyType}
                  </span>
                  <span className="text-[11px] font-semibold text-stone-500">
                    {pathway.estimatedTimeline}
                  </span>
                </div>

                <h4 className="font-display font-bold text-stone-900 text-base mb-1">
                  {pathway.name}
                </h4>
                <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed">
                  {pathway.tagline}
                </p>

                <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-medium">
                  <span className="text-stone-400">Risk: {pathway.riskLevel}</span>
                  <span className={`flex items-center gap-1 ${isSelected ? "text-stone-900 font-semibold" : "text-stone-500"}`}>
                    Inspect Path <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Pathway Deep Inspection */}
      {currentPathway && (
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Header of Pathway */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                  {currentPathway.strategyType} Approach
                </span>
                <span className="text-xs text-stone-400">•</span>
                <span className="text-xs text-stone-500 font-medium">
                  Est. Horizon: {currentPathway.estimatedTimeline}
                </span>
              </div>
              <h3 className="font-display font-bold text-2xl text-stone-900 tracking-tight">
                {currentPathway.name}
              </h3>
              <p className="text-stone-600 text-sm mt-1 leading-relaxed max-w-2xl">
                {currentPathway.description}
              </p>
            </div>

            {/* Embark Button */}
            <div className="flex flex-col sm:items-end gap-2">
              <button
                id="embark-pathway-btn"
                onClick={() => onSelectPathway(currentPathway.id)}
                className={`px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] ${
                  activePathwayId === currentPathway.id
                    ? "bg-amber-100 text-amber-950 border border-amber-300 hover:bg-amber-200"
                    : "bg-stone-900 hover:bg-stone-800 text-stone-50"
                }`}
              >
                <BookmarkPlus className="w-4 h-4 text-amber-400" />
                <span>
                  {activePathwayId === currentPathway.id
                    ? "Viewing Active Trail in Tracker"
                    : "Embark on This Path & Track"}
                </span>
              </button>
              <span className="text-[11px] text-stone-400">
                Saves waypoints to your expedition log
              </span>
            </div>
          </div>

          {/* Immediate Catalyst Action */}
          <div className="p-4 sm:p-5 rounded-xl bg-amber-50/70 border border-amber-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 text-amber-950">
                <div className="w-7 h-7 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center font-bold text-xs">
                  <Zap className="w-4 h-4 fill-stone-950" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
                    Immediate Catalyst (Break Inertia Right Now)
                  </span>
                  <span className="font-display font-bold text-base text-stone-900">
                    {currentPathway.catalystAction.title} ({currentPathway.catalystAction.durationMinutes} Minutes)
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowTimer(!showTimer)}
                className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-950 hover:bg-amber-100/50 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>{showTimer ? "Hide Timer" : "Open 15-Min Timer"}</span>
              </button>
            </div>

            <p className="text-stone-700 text-xs sm:text-sm leading-relaxed mt-2">
              {currentPathway.catalystAction.instructions}
            </p>

            <div className="mt-2.5 text-xs text-amber-900 font-medium flex items-center gap-1.5">
              <span className="font-bold">Expected Shift:</span>
              <span>{currentPathway.catalystAction.expectedOutcome}</span>
            </div>

            {/* Embedded Timer if toggled */}
            {showTimer && (
              <div className="mt-4 pt-4 border-t border-amber-200/60">
                <CatalystTimer
                  initialMinutes={currentPathway.catalystAction.durationMinutes}
                  actionTitle={currentPathway.catalystAction.title}
                />
              </div>
            )}
          </div>

          {/* Sequential Waypoints */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-stone-700" />
                Expedition Waypoints (The Structured Steps)
              </h4>
              <span className="text-xs text-stone-400">Step by step</span>
            </div>

            <div className="space-y-3">
              {currentPathway.waypoints.map((waypoint, idx) => (
                <div
                  key={waypoint.id || idx}
                  className="p-4 rounded-xl border border-stone-200/80 bg-stone-50/50 hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-stone-900 text-stone-50 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {waypoint.order || idx + 1}
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h5 className="font-display font-bold text-stone-900 text-sm sm:text-base">
                          {waypoint.title}
                        </h5>
                      </div>

                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                        {waypoint.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                        <div className="p-2 rounded-lg bg-stone-100/80 text-stone-700 border border-stone-200/60">
                          <span className="font-semibold text-stone-900 block mb-0.5">
                            Bypass Resistance:
                          </span>
                          <span>{waypoint.obstacleBypass}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-stone-100/80 text-stone-700 border border-stone-200/60">
                          <span className="font-semibold text-stone-900 block mb-0.5">
                            Checkpoint Proof:
                          </span>
                          <span>{waypoint.checkpointProof}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pitfalls to Avoid */}
          {currentPathway.pitfallsToAvoid && currentPathway.pitfallsToAvoid.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/60">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5 mb-2">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
                <span>Navigational Hazards & Pitfalls to Avoid</span>
              </div>
              <ul className="space-y-1 text-xs sm:text-sm text-rose-950">
                {currentPathway.pitfallsToAvoid.map((pitfall, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{pitfall}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Bottom Affirmation */}
          <div className="pt-2 text-center text-xs text-stone-500 italic">
            "{plan.affirmationOfResourcefulness}"
          </div>
        </div>
      )}
    </div>
  );
};
