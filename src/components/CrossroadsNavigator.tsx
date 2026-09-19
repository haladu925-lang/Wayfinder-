import React, { useState } from "react";
import { GitFork, ArrowRight, ShieldCheck, HelpCircle, Loader2, Sparkles, Scale, DoorOpen } from "lucide-react";
import { CrossroadsAnalysis } from "../types";

export const CrossroadsNavigator: React.FC = () => {
  const [decisionTitle, setDecisionTitle] = useState("");
  const [optionATitle, setOptionATitle] = useState("");
  const [optionAPros, setOptionAPros] = useState("");
  const [optionACons, setOptionACons] = useState("");

  const [optionBTitle, setOptionBTitle] = useState("");
  const [optionBPros, setOptionBPros] = useState("");
  const [optionBCons, setOptionBCons] = useState("");

  const [coreValues, setCoreValues] = useState<string>("Autonomy, Growth, Financial Stability");
  const [worstFear, setWorstFear] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<CrossroadsAnalysis | null>(null);

  const loadPreset = (type: "career" | "relocation") => {
    if (type === "career") {
      setDecisionTitle("Stable Corporate Lead vs. Risky Early-Stage Co-founder");
      setOptionATitle("Stay in Corporate Leadership");
      setOptionAPros("Predictable salary, low variance, established prestige, great benefits");
      setOptionACons("Slow bureaucracy, creeping regret of never building my own thing, stagnation");
      setOptionBTitle("Join Seed-Stage Startup as Co-founder");
      setOptionBPros("Total ownership, rapid learning, massive upside, high autonomy");
      setOptionBCons("Runway is 14 months, intense hours, risk of market failure");
      setCoreValues("Autonomy, Mastery, Long-term Wealth");
      setWorstFear("Running out of money in 12 months and feeling foolish");
    } else {
      setDecisionTitle("Stay in Hometown Close to Family vs. Move to New Tech Hub");
      setOptionATitle("Stay in Current City");
      setOptionAPros("Deep community roots, close to aging parents, lower living expenses");
      setOptionACons("Limited local professional circles, feeling like life has plateaued");
      setOptionBTitle("Relocate to Berlin / London");
      setOptionBPros("Global network, exponential serendipity, fresh adventure and self-discovery");
      setOptionBCons("High rent, feeling isolated in the first 6 months, distant from family");
      setCoreValues("Growth, Family, Adventure");
      setWorstFear("Being deeply lonely in a foreign city and regretting leaving family");
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decisionTitle.trim() || !optionATitle.trim() || !optionBTitle.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/crossroads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decisionTitle,
          optionA: { title: optionATitle, pros: optionAPros, cons: optionACons },
          optionB: { title: optionBTitle, pros: optionBPros, cons: optionBCons },
          coreValues: coreValues.split(",").map((v) => v.trim()),
          worstFear,
        }),
      });
      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 sm:p-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 text-xs font-semibold uppercase tracking-wider mb-2.5">
          <GitFork className="w-3.5 h-3.5 text-amber-600" />
          <span>Crossroads Navigation Engine</span>
        </div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
          Paralyzed between two paths? Find the hidden third way.
        </h2>
        <p className="text-stone-600 text-sm sm:text-base mt-2 leading-relaxed max-w-2xl">
          Most paralysis comes from treating reversible two-way doors as permanent traps, or failing to synthesize a hybrid test. Let decision science illuminate the trajectory.
        </p>

        {/* Quick Presets */}
        <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap items-center gap-2">
          <span className="text-xs text-stone-500 font-medium">Try a crossroads example:</span>
          <button
            type="button"
            onClick={() => loadPreset("career")}
            className="text-xs px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
          >
            Corporate vs. Startup
          </button>
          <button
            type="button"
            onClick={() => loadPreset("relocation")}
            className="text-xs px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
          >
            Stay Local vs. Big Move
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleAnalyze} className="mt-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              The Decision at Stake
            </label>
            <input
              id="crossroads-title"
              type="text"
              required
              value={decisionTitle}
              onChange={(e) => setDecisionTitle(e.target.value)}
              placeholder="e.g. Choosing between renewing my lease or giving up the apartment to travel..."
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-stone-800 focus:ring-1 focus:ring-stone-800 text-sm text-stone-800 placeholder-stone-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Option A */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                Fork A
              </span>
              <input
                id="option-a-title"
                type="text"
                required
                value={optionATitle}
                onChange={(e) => setOptionATitle(e.target.value)}
                placeholder="Option A Title (e.g. Stay at current job)"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 bg-white"
              />
              <textarea
                rows={2}
                value={optionAPros}
                onChange={(e) => setOptionAPros(e.target.value)}
                placeholder="Key upside / pros of Option A..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white resize-none"
              />
              <textarea
                rows={2}
                value={optionACons}
                onChange={(e) => setOptionACons(e.target.value)}
                placeholder="Lingering downside / hidden price of Option A..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white resize-none"
              />
            </div>

            {/* Option B */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                Fork B
              </span>
              <input
                id="option-b-title"
                type="text"
                required
                value={optionBTitle}
                onChange={(e) => setOptionBTitle(e.target.value)}
                placeholder="Option B Title (e.g. Make the bold leap)"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 bg-white"
              />
              <textarea
                rows={2}
                value={optionBPros}
                onChange={(e) => setOptionBPros(e.target.value)}
                placeholder="Key upside / pros of Option B..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white resize-none"
              />
              <textarea
                rows={2}
                value={optionBCons}
                onChange={(e) => setOptionBCons(e.target.value)}
                placeholder="Lingering downside / hidden price of Option B..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Guiding Values (What matters most to you?)
              </label>
              <input
                type="text"
                value={coreValues}
                onChange={(e) => setCoreValues(e.target.value)}
                placeholder="e.g. Freedom, Family, Creative expression"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                The Core Fear / Nightmare Scenario
              </label>
              <input
                type="text"
                value={worstFear}
                onChange={(e) => setWorstFear(e.target.value)}
                placeholder="e.g. Burning out or looking back with deep regret"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              id="analyze-crossroads-btn"
              type="submit"
              disabled={isLoading || !decisionTitle.trim()}
              className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-stone-50 font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Evaluating Trajectories...</span>
                </>
              ) : (
                <>
                  <span>Evaluate Crossroads</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Door Reversibility Banner */}
          <div className="p-4 rounded-xl bg-stone-900 text-stone-100 flex items-start gap-3">
            <DoorOpen className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
                Reversibility Assessment
              </span>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                {analysis.reversibility}
              </p>
            </div>
          </div>

          {/* Comparative Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-2">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Trajectory A Assessment
              </span>
              <p className="text-xs text-stone-700">
                <strong className="text-stone-900">True Upside:</strong> {analysis.optionAAnalysis.upside}
              </p>
              <p className="text-xs text-stone-700">
                <strong className="text-stone-900">Hidden Toll:</strong> {analysis.optionAAnalysis.hiddenCost}
              </p>
              <div className="text-[11px] font-semibold text-stone-500 pt-1">
                Risk Rating: {analysis.optionAAnalysis.riskRating}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-2">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Trajectory B Assessment
              </span>
              <p className="text-xs text-stone-700">
                <strong className="text-stone-900">True Upside:</strong> {analysis.optionBAnalysis.upside}
              </p>
              <p className="text-xs text-stone-700">
                <strong className="text-stone-900">Hidden Toll:</strong> {analysis.optionBAnalysis.hiddenCost}
              </p>
              <div className="text-[11px] font-semibold text-stone-500 pt-1">
                Risk Rating: {analysis.optionBAnalysis.riskRating}
              </div>
            </div>
          </div>

          {/* The Third Way (Synthesis) */}
          <div className="p-5 rounded-xl bg-amber-50/80 border border-amber-200">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-900 mb-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>The Third Way (The Hidden Synthesis)</span>
            </div>
            <p className="text-stone-900 text-sm font-medium leading-relaxed">
              {analysis.theThirdWay}
            </p>
            <div className="mt-3 pt-3 border-t border-amber-200/80 text-xs text-stone-700">
              <span className="font-bold text-stone-900">Guiding Posture:</span>{" "}
              {analysis.recommendedPosture}
            </div>
          </div>

          {/* 24-Hour Experiment */}
          <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-800">
            <span className="font-bold text-stone-900 uppercase tracking-wider block mb-1">
              Catalyst Experiment (Next 24 Hours)
            </span>
            <p>{analysis.catalystAction}</p>
          </div>
        </div>
      )}
    </div>
  );
};
