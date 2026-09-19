import React from "react";
import { Compass, Footprints, GitFork, LifeBuoy, BookOpen } from "lucide-react";

export type NavTab = "finder" | "active" | "crossroads" | "reset" | "wisdom";

interface NavigationHeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  hasActiveJourney: boolean;
  completedCount: number;
  totalCount: number;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  activeTab,
  setActiveTab,
  hasActiveJourney,
  completedCount,
  totalCount,
}) => {
  return (
    <header className="border-b border-stone-200/80 bg-stone-50/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          id="brand-logo"
          onClick={() => setActiveTab("finder")}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
            <Compass className="w-5 h-5 animate-[spin_20s_linear_infinite]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-xl tracking-tight text-stone-900">
                Wayfinder
              </span>
              <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-900 border border-amber-200/60">
                Forward Motion
              </span>
            </div>
            <p className="text-xs text-stone-500 font-sans hidden sm:block">
              There is always a way through
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 no-scrollbar">
          <button
            id="nav-finder"
            onClick={() => setActiveTab("finder")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === "finder"
                ? "bg-stone-900 text-stone-50 shadow-sm"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Find a Way</span>
          </button>

          <button
            id="nav-active"
            onClick={() => setActiveTab("active")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap relative ${
              activeTab === "active"
                ? "bg-stone-900 text-stone-50 shadow-sm"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            }`}
          >
            <Footprints className="w-4 h-4" />
            <span>Active Trail</span>
            {hasActiveJourney && (
              <span className={`ml-1 text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                activeTab === "active"
                  ? "bg-amber-400 text-stone-950"
                  : "bg-amber-100 text-amber-900 border border-amber-300"
              }`}>
                {completedCount}/{totalCount}
              </span>
            )}
          </button>

          <button
            id="nav-crossroads"
            onClick={() => setActiveTab("crossroads")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === "crossroads"
                ? "bg-stone-900 text-stone-50 shadow-sm"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            }`}
          >
            <GitFork className="w-4 h-4" />
            <span>Crossroads</span>
          </button>

          <button
            id="nav-reset"
            onClick={() => setActiveTab("reset")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === "reset"
                ? "bg-amber-600 text-amber-50 shadow-sm"
                : "text-amber-800 bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200/50"
            }`}
          >
            <LifeBuoy className="w-4 h-4" />
            <span>Grounding</span>
          </button>

          <button
            id="nav-wisdom"
            onClick={() => setActiveTab("wisdom")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === "wisdom"
                ? "bg-stone-900 text-stone-50 shadow-sm"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden md:inline">Wayfarer Wisdom</span>
            <span className="md:hidden">Wisdom</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
