import React, { useState } from "react";
import { BookOpen, Sparkles, ArrowRight, Lightbulb, Compass, Quote } from "lucide-react";
import { WAYFINDER_MENTAL_MODELS, MentalModel } from "../data/presets";

interface WayfarerWisdomViewProps {
  onApplyPromptToFinder?: (promptSituation: string) => void;
}

export const WayfarerWisdomView: React.FC<WayfarerWisdomViewProps> = ({
  onApplyPromptToFinder,
}) => {
  const [activeModel, setActiveModel] = useState<MentalModel>(
    WAYFINDER_MENTAL_MODELS[0]
  );
  const [reflectionAnswer, setReflectionAnswer] = useState("");

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 sm:p-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 text-xs font-semibold uppercase tracking-wider mb-2.5">
          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
          <span>Navigation Principles</span>
        </div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
          Wisdom of the Wayfarers
        </h2>
        <p className="text-stone-600 text-sm sm:text-base mt-2 leading-relaxed max-w-2xl">
          When history’s greatest problem solvers hit dead ends, they didn't push harder in the wrong direction — they shifted their mental frame.
        </p>

        {/* Model Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          {WAYFINDER_MENTAL_MODELS.map((model) => (
            <div
              key={model.title}
              onClick={() => setActiveModel(model)}
              className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                activeModel.title === model.title
                  ? "bg-stone-900 text-stone-50 border-stone-900 shadow-md"
                  : "bg-stone-50/70 border-stone-200 text-stone-800 hover:bg-stone-100"
              }`}
            >
              <div className="text-[10px] uppercase font-bold tracking-wider opacity-70 mb-1">
                {model.originator}
              </div>
              <h4 className="font-display font-bold text-sm mb-1.5">{model.title}</h4>
              <p
                className={`text-xs line-clamp-2 leading-relaxed ${
                  activeModel.title === model.title ? "text-stone-300" : "text-stone-500"
                }`}
              >
                {model.mantra}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Deep Dive into Active Model */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Principle Spotlight • {activeModel.originator}</span>
          </div>
          <h3 className="font-display font-bold text-2xl text-stone-900">
            {activeModel.title}
          </h3>
        </div>

        {/* Quote Block */}
        <div className="p-5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
          <Quote className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="font-display font-medium text-stone-900 text-sm sm:text-base leading-relaxed italic">
            "{activeModel.mantra}"
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
              Core Mental Insight
            </span>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {activeModel.insight}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
              Real-World Application
            </span>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {activeModel.application}
            </p>
          </div>
        </div>

        {/* Self-Reflection Prompt */}
        <div className="pt-4 border-t border-stone-100">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
            Apply "{activeModel.title}" to Your Current Problem:
          </label>
          <textarea
            rows={2}
            value={reflectionAnswer}
            onChange={(e) => setReflectionAnswer(e.target.value)}
            placeholder={`How would adopting this principle change what you do in the next 24 hours?`}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-stone-800 text-xs sm:text-sm text-stone-800 placeholder-stone-400 resize-none"
          />
          {reflectionAnswer && (
            <p className="text-[11px] text-stone-500 mt-1 italic">
              Your insight: "{reflectionAnswer}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
