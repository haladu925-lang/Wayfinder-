/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { NavigationHeader, NavTab } from "./components/NavigationHeader";
import { WayfinderForm } from "./components/WayfinderForm";
import { WayfindingResults } from "./components/WayfindingResults";
import { ActiveJourneyTrail } from "./components/ActiveJourneyTrail";
import { CrossroadsNavigator } from "./components/CrossroadsNavigator";
import { GroundingResetView } from "./components/GroundingResetView";
import { WayfarerWisdomView } from "./components/WayfarerWisdomView";
import { WayfindingPlan, SavedJourney } from "./types";
import { Compass, Footprints, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>("finder");
  const [currentPlan, setCurrentPlan] = useState<WayfindingPlan | null>(null);
  const [activeJourney, setActiveJourney] = useState<SavedJourney | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Restore active journey from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("wayfinder_active_journey");
      if (saved) {
        const parsed: SavedJourney = JSON.parse(saved);
        setActiveJourney(parsed);
        if (!currentPlan) {
          setCurrentPlan(parsed.plan);
        }
      }
    } catch (e) {
      console.error("Failed to parse saved journey:", e);
    }
  }, []);

  // Sync active journey to localStorage
  const syncJourney = (updated: SavedJourney | null) => {
    setActiveJourney(updated);
    if (updated) {
      localStorage.setItem("wayfinder_active_journey", JSON.stringify(updated));
    } else {
      localStorage.removeItem("wayfinder_active_journey");
    }
  };

  const handleGenerateWayfinding = async (formData: {
    situation: string;
    obstacle: string;
    destination: string;
    focusArea: string;
    urgency: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/find-a-way", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to chart paths forward. Please try again.");
      }

      const plan: WayfindingPlan = await response.json();
      setCurrentPlan(plan);
      setActiveTab("finder");

      // Smooth scroll down to results after short render delay
      setTimeout(() => {
        window.scrollTo({ top: 380, behavior: "smooth" });
      }, 150);
    } catch (err: unknown) {
      console.error("Error generating wayfinding:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong generating paths. Please retry."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPathway = (pathwayId: string) => {
    if (!currentPlan) return;

    const pathway = currentPlan.pathways.find((p) => p.id === pathwayId) || currentPlan.pathways[0];
    const initialHistory = [
      {
        timestamp: new Date().toISOString(),
        completedCount: 0,
        totalCount: pathway.waypoints.length,
        percent: 0,
        label: "Expedition Started",
      },
    ];

    const newJourney: SavedJourney = {
      plan: currentPlan,
      activePathwayId: pathwayId,
      completedWaypointIds: activeJourney?.activePathwayId === pathwayId ? activeJourney.completedWaypointIds : [],
      notesByWaypointId: activeJourney?.activePathwayId === pathwayId ? activeJourney.notesByWaypointId : {},
      savedAt: new Date().toISOString(),
      lastProgressAt: new Date().toISOString(),
      progressHistory: activeJourney?.activePathwayId === pathwayId && activeJourney.progressHistory ? activeJourney.progressHistory : initialHistory,
    };

    syncJourney(newJourney);
    setActiveTab("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleWaypoint = (waypointId: string) => {
    if (!activeJourney) return;

    const exists = activeJourney.completedWaypointIds.includes(waypointId);
    const updatedIds = exists
      ? activeJourney.completedWaypointIds.filter((id) => id !== waypointId)
      : [...activeJourney.completedWaypointIds, waypointId];

    const pathway =
      activeJourney.plan.pathways.find((p) => p.id === activeJourney.activePathwayId) ||
      activeJourney.plan.pathways[0];
    const totalWaypoints = pathway ? pathway.waypoints.length : 1;
    const completedCount = updatedIds.length;
    const percent = Math.round((completedCount / totalWaypoints) * 100);
    const nowIso = new Date().toISOString();

    const previousHistory = activeJourney.progressHistory || [
      {
        timestamp: activeJourney.savedAt || nowIso,
        completedCount: exists ? 1 : 0,
        totalCount: totalWaypoints,
        percent: exists ? Math.round((1 / totalWaypoints) * 100) : 0,
        label: "Started",
      },
    ];

    const toggledWaypoint = pathway?.waypoints.find((w) => w.id === waypointId);
    const snapshotLabel = exists
      ? `Reopened WP ${toggledWaypoint?.order || ""}`
      : `Cleared WP ${toggledWaypoint?.order || ""}: ${toggledWaypoint?.title.slice(0, 16) || ""}`;

    const newHistory = [
      ...previousHistory,
      {
        timestamp: nowIso,
        completedCount,
        totalCount: totalWaypoints,
        percent,
        label: snapshotLabel,
      },
    ];

    const updated: SavedJourney = {
      ...activeJourney,
      completedWaypointIds: updatedIds,
      lastProgressAt: nowIso,
      progressHistory: newHistory,
    };

    syncJourney(updated);
  };

  const handleUpdateWaypointNotes = (waypointId: string, notes: string) => {
    if (!activeJourney) return;

    const updated: SavedJourney = {
      ...activeJourney,
      notesByWaypointId: {
        ...activeJourney.notesByWaypointId,
        [waypointId]: notes,
      },
      lastProgressAt: new Date().toISOString(),
    };

    syncJourney(updated);
  };

  const handleClearJourney = () => {
    if (window.confirm("Are you sure you want to clear your active expedition trail?")) {
      syncJourney(null);
      setActiveTab("finder");
    }
  };

  const completedCount = activeJourney?.completedWaypointIds.length || 0;
  const activePathway = activeJourney?.plan.pathways.find(
    (p) => p.id === activeJourney.activePathwayId
  );
  const totalWaypoints = activePathway?.waypoints.length || 0;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Navigation Header */}
      <NavigationHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasActiveJourney={!!activeJourney}
        completedCount={completedCount}
        totalCount={totalWaypoints}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs underline hover:text-rose-950 ml-4 font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab 1: Find a Way (Core Wayfinding Engine) */}
        {activeTab === "finder" && (
          <div className="space-y-10">
            <WayfinderForm
              onSubmit={handleGenerateWayfinding}
              isLoading={isLoading}
            />

            {currentPlan && (
              <div id="wayfinding-results-section" className="pt-2">
                <WayfindingResults
                  plan={currentPlan}
                  onSelectPathway={handleSelectPathway}
                  activePathwayId={activeJourney?.activePathwayId}
                  onNewSearch={() => {
                    setCurrentPlan(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Active Expedition Trail */}
        {activeTab === "active" && (
          <div>
            {activeJourney ? (
              <ActiveJourneyTrail
                journey={activeJourney}
                onToggleWaypoint={handleToggleWaypoint}
                onUpdateWaypointNotes={handleUpdateWaypointNotes}
                onClearJourney={handleClearJourney}
                onReturnToPlan={() => {
                  if (activeJourney.plan) {
                    setCurrentPlan(activeJourney.plan);
                  }
                  setActiveTab("finder");
                }}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center mx-auto shadow-2xs">
                  <Footprints className="w-7 h-7" />
                </div>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-stone-900">
                  No Active Trail Yet
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  Chart your current hurdle in the Wayfinder engine and select one of the three pathways to embark on an active expedition checklist.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab("finder")}
                    className="px-5 py-2.5 rounded-xl bg-stone-900 text-stone-50 hover:bg-stone-800 text-xs sm:text-sm font-semibold inline-flex items-center gap-2 shadow-sm transition-all"
                  >
                    <span>Chart a Path Forward</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: The Crossroads Decision Navigator */}
        {activeTab === "crossroads" && <CrossroadsNavigator />}

        {/* Tab 4: Grounding & Emergency Reset */}
        {activeTab === "reset" && <GroundingResetView />}

        {/* Tab 5: Wayfarer Wisdom */}
        {activeTab === "wisdom" && <WayfarerWisdomView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/80 bg-stone-50 py-6 text-center text-xs text-stone-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-600" />
            <span className="font-display font-semibold text-stone-800">Wayfinder</span>
            <span>— The impediment to action advances action.</span>
          </div>
          <div className="text-stone-400">
            Action creates clarity. Take the next 10 feet.
          </div>
        </div>
      </footer>
    </div>
  );
}
