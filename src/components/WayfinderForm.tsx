import React, { useState } from "react";
import { Compass, Sparkles, ArrowRight, HelpCircle, Loader2 } from "lucide-react";
import { WAYFINDING_PRESETS, WayfindingPreset } from "../data/presets";

interface WayfinderFormProps {
  onSubmit: (data: {
    situation: string;
    obstacle: string;
    destination: string;
    focusArea: string;
    urgency: string;
  }) => void;
  isLoading: boolean;
}

export const WayfinderForm: React.FC<WayfinderFormProps> = ({ onSubmit, isLoading }) => {
  const [situation, setSituation] = useState("");
  const [obstacle, setObstacle] = useState("");
  const [destination, setDestination] = useState("");
  const [focusArea, setFocusArea] = useState("Career");
  const [urgency, setUrgency] = useState("moderate");
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  const focusAreas = ["Career", "Personal / Life", "Creative Project", "Conflict / Boundary", "Financial", "Health / Habits"];

  const handleApplyPreset = (preset: WayfindingPreset) => {
    setSelectedPresetId(preset.id);
    setSituation(preset.situation);
    setObstacle(preset.obstacle);
    setDestination(preset.destination);
    if (preset.category.includes("Career")) setFocusArea("Career");
    else if (preset.category.includes("Creative")) setFocusArea("Creative Project");
    else if (preset.category.includes("Conflict")) setFocusArea("Conflict / Boundary");
    else setFocusArea("Personal / Life");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim() && !obstacle.trim()) return;
    onSubmit({
      situation: situation.trim(),
      obstacle: obstacle.trim(),
      destination: destination.trim(),
      focusArea,
      urgency,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-5 sm:p-7 md:p-8">
      {/* Intro Heading */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 text-xs font-semibold uppercase tracking-wider mb-2.5">
          <Compass className="w-3.5 h-3.5 text-amber-600" />
          <span>Navigational Protocol</span>
        </div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
          When the front door is barred, we map three new ways through.
        </h1>
        <p className="text-stone-600 text-sm sm:text-base mt-2 leading-relaxed max-w-3xl">
          State your current position, the barrier blocking you, and your intended destination. Wayfinder breaks through analysis paralysis with lateral bypasses, micro-footholds, and radical reframing.
        </p>
      </div>

      {/* Preset Scenarios */}
      <div className="mb-6 pb-6 border-b border-stone-100">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Quick Exploration Templates
          </span>
          <span className="text-xs text-stone-400">Click to load realistic impasse</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {WAYFINDING_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all text-left ${
                selectedPresetId === preset.id
                  ? "bg-stone-900 text-stone-50 border-stone-900 shadow-sm"
                  : "bg-stone-50/80 text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300"
              }`}
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Step 1: Current Position */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            1. Current Position (Where are you right now?)
          </label>
          <textarea
            id="input-situation"
            required
            rows={2}
            value={situation}
            onChange={(e) => {
              setSituation(e.target.value);
              setSelectedPresetId(null);
            }}
            placeholder="e.g. I am 32, working in operations, feeling burned out. I want to build my own consulting practice but feel paralyzed about where to begin..."
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-stone-800 focus:ring-1 focus:ring-stone-800 text-sm text-stone-800 placeholder-stone-400 transition-colors resize-none"
          />
        </div>

        {/* Step 2: The Obstacle */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            2. The Obstacle / The Fog (What is standing in the way?)
          </label>
          <textarea
            id="input-obstacle"
            required
            rows={2}
            value={obstacle}
            onChange={(e) => {
              setObstacle(e.target.value);
              setSelectedPresetId(null);
            }}
            placeholder="e.g. No savings safety net, fear of what colleagues will think, complete overwhelm when looking at marketing and legal setup..."
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-stone-800 focus:ring-1 focus:ring-stone-800 text-sm text-stone-800 placeholder-stone-400 transition-colors resize-none"
          />
        </div>

        {/* Step 3: Desired Destination */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            3. Intended Destination (Where must you arrive?)
          </label>
          <input
            id="input-destination"
            type="text"
            required
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              setSelectedPresetId(null);
            }}
            placeholder="e.g. Signing my first 2 paying advisory clients and proving the model works..."
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-stone-800 focus:ring-1 focus:ring-stone-800 text-sm text-stone-800 placeholder-stone-400 transition-colors"
          />
        </div>

        {/* Focus Area & Urgency Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
              Focus Domain
            </label>
            <div className="flex flex-wrap gap-1.5">
              {focusAreas.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => setFocusArea(area)}
                  className={`px-2.5 py-1 text-xs rounded-md border font-medium transition-all ${
                    focusArea === area
                      ? "bg-amber-100 text-amber-950 border-amber-300 font-semibold"
                      : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
              Urgency / Timeframe
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: "immediate", label: "Immediate (Unfreeze)" },
                { id: "moderate", label: "Active (14–30d)" },
                { id: "strategic", label: "Horizon (90d+)" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setUrgency(item.id)}
                  className={`px-2 py-1 text-xs rounded-md border font-medium text-center transition-all ${
                    urgency === item.id
                      ? "bg-stone-900 text-stone-50 border-stone-900 font-semibold"
                      : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 flex items-center justify-between gap-4">
          <div className="text-xs text-stone-500 hidden sm:flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-stone-400" />
            <span>Generates 3 tactical pathways: Incremental, Lateral, and Inversion</span>
          </div>

          <button
            id="find-a-way-submit-btn"
            type="submit"
            disabled={isLoading || (!situation.trim() && !obstacle.trim())}
            className="w-full sm:w-auto ml-auto px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed text-stone-50 font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                <span>Charting Paths Forward...</span>
              </>
            ) : (
              <>
                <span>Plot Ways Through</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
