import React, { useState, useEffect } from "react";
import { LifeBuoy, Wind, ShieldCheck, ArrowRight, CheckCircle2, Sparkles, RefreshCw } from "lucide-react";
import { EmergencyReset } from "../types";

export const GroundingResetView: React.FC = () => {
  const [feeling, setFeeling] = useState("paralyzed by overwhelm and indecision");
  const [challenge, setChallenge] = useState("too many conflicting emergencies");
  const [breathPhase, setBreathPhase] = useState<"Inhale" | "Hold" | "Exhale">("Inhale");
  const [breathSeconds, setBreathSeconds] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(true);

  const [resetData, setResetData] = useState<EmergencyReset | null>({
    breathAnchor: "Take a slow, deep breath: 4 seconds in through the nose, pause for 4, then a smooth 6-second exhale through the mouth.",
    realityCheck: "You are biologically safe right now in this room. The brain interprets uncertainty as physical danger. It is not danger; it is merely an unsolved puzzle.",
    oneInchMove: {
      action: "Fill a large glass of water, drink half, and stand up to stretch your shoulders for 60 seconds.",
      duration: "2 Minutes",
      whyItWorks: "Disrupts the sympathetic freeze-loop and signals bodily safety to your amygdala.",
    },
    thingsToIgnoreForNow: [
      "Any email that arrived in the last 2 hours",
      "The entire outcome of next month",
      "What anyone else thinks about your pace right now",
    ],
  });

  const [isLoading, setIsLoading] = useState(false);

  // Breathing pacer loop
  useEffect(() => {
    if (!isBreathingActive) return;
    const interval = setInterval(() => {
      setBreathSeconds((prev) => {
        if (prev <= 1) {
          if (breathPhase === "Inhale") {
            setBreathPhase("Hold");
            return 4;
          } else if (breathPhase === "Hold") {
            setBreathPhase("Exhale");
            return 6;
          } else {
            setBreathPhase("Inhale");
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [breathPhase, isBreathingActive]);

  const fetchCustomReset = async (feelingVal: string, challengeVal: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/emergency-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feeling: feelingVal, challenge: challengeVal }),
      });
      const data = await res.json();
      setResetData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const presetFeelings = [
    { label: "Overwhelmed & Frozen", feel: "paralyzed by too many tasks", chal: "infinite to-do list and zero focus" },
    { label: "Fear of Failure", feel: "scared of making a mistake", chal: "high stakes project and imposter syndrome" },
    { label: "Hit an Impasse / Wall", feel: "defeated after effort failed", chal: "tried everything and nothing worked" },
    { label: "Exhausted & Drained", feel: "zero energy or motivation", chal: "burnout and relentless demands" },
  ];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 border border-stone-800 shadow-md">
        <div className="flex items-center gap-2 text-amber-400 mb-2">
          <LifeBuoy className="w-5 h-5 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Grounding First Aid • The 1-Inch Move
          </span>
        </div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
          When paralyzed, do not plan 10 steps. Take a 1-inch breath.
        </h2>
        <p className="text-stone-300 text-sm sm:text-base mt-2 leading-relaxed max-w-2xl">
          Paralysis is a biological defense mechanism, not a personal flaw. Regain your nervous system footing before making decisions.
        </p>

        {/* Breathing Circle Widget */}
        <div className="mt-8 flex flex-col items-center justify-center p-6 rounded-2xl bg-stone-950/60 border border-stone-800">
          <div className="relative flex items-center justify-center w-36 h-36">
            <div
              className={`absolute inset-0 rounded-full border-2 transition-all duration-1000 ease-in-out ${
                breathPhase === "Inhale"
                  ? "border-amber-400 scale-110 bg-amber-400/10"
                  : breathPhase === "Hold"
                  ? "border-emerald-400 scale-110 bg-emerald-400/10"
                  : "border-stone-500 scale-90 bg-transparent"
              }`}
            />
            <div className="text-center z-10">
              <span className="text-xs uppercase tracking-widest text-stone-400 block font-mono">
                {breathPhase}
              </span>
              <span className="text-3xl font-bold font-mono text-stone-100">
                {breathSeconds}s
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className="text-xs px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
            >
              {isBreathingActive ? "Pause Pacer" : "Resume Pacer"}
            </button>
            <span className="text-xs text-stone-400">Box rhythm: 4s Inhale • 4s Hold • 6s Exhale</span>
          </div>
        </div>
      </div>

      {/* Feeling Selectors */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 sm:p-7 space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
          Select Your Current Internal State:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {presetFeelings.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setFeeling(p.feel);
                setChallenge(p.chal);
                fetchCustomReset(p.feel, p.chal);
              }}
              className="p-3 text-xs text-left rounded-xl border border-stone-200 hover:border-stone-800 hover:bg-stone-50 transition-all font-medium text-stone-800"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Reset Protocol Cards */}
        {resetData && (
          <div className="pt-4 border-t border-stone-100 space-y-4">
            {/* Reality Check */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5 mb-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Cognitive Reality Check</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                {resetData.realityCheck}
              </p>
            </div>

            {/* The 1-Inch Move */}
            <div className="p-5 rounded-xl bg-stone-900 text-stone-100">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4" />
                <span>The 1-Inch Physical Action ({resetData.oneInchMove.duration})</span>
              </div>
              <h4 className="text-base sm:text-lg font-display font-bold text-white mb-1">
                {resetData.oneInchMove.action}
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                <strong className="text-amber-400">Why this works:</strong> {resetData.oneInchMove.whyItWorks}
              </p>
            </div>

            {/* The Explicit Ignore List */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2">
                Permission to Ignore For the Next 60 Minutes:
              </span>
              <ul className="space-y-1.5 text-xs text-stone-700">
                {resetData.thingsToIgnoreForNow.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
