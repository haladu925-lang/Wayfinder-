import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { TrendingUp, Award, Clock } from "lucide-react";
import { SavedJourney, Pathway } from "../types";

interface JourneyMomentumChartProps {
  journey: SavedJourney;
  pathway: Pathway;
}

interface ChartDataPoint {
  timeLabel: string;
  fullTime: string;
  completedPercent: number;
  completedCount: number;
  totalCount: number;
  eventLabel: string;
}

export const JourneyMomentumChart: React.FC<JourneyMomentumChartProps> = ({
  journey,
  pathway,
}) => {
  const { completedWaypointIds, progressHistory, savedAt, lastProgressAt } = journey;
  const totalWaypoints = pathway.waypoints.length;
  const currentCompletedCount = pathway.waypoints.filter((w) =>
    completedWaypointIds.includes(w.id)
  ).length;
  const currentPercent = Math.round((currentCompletedCount / totalWaypoints) * 100);

  // Construct chart data points
  let chartData: ChartDataPoint[] = [];

  const formatShortTime = (isoString?: string) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const formatDetailedTime = (isoString?: string) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString([], { month: "short", day: "numeric" }) + " " +
             date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    } catch {
      return "";
    }
  };

  if (progressHistory && progressHistory.length > 0) {
    chartData = progressHistory.map((item, index) => {
      const shortTime = formatShortTime(item.timestamp);
      return {
        timeLabel: shortTime || `T${index + 1}`,
        fullTime: formatDetailedTime(item.timestamp),
        completedPercent: item.percent,
        completedCount: item.completedCount,
        totalCount: item.totalCount,
        eventLabel: item.label || `Milestone ${index + 1}`,
      };
    });
  } else {
    // Generate logical starting points if progressHistory was not recorded yet
    const startTime = formatShortTime(savedAt);
    const recentTime = formatShortTime(lastProgressAt || savedAt);

    chartData = [
      {
        timeLabel: startTime || "Start",
        fullTime: formatDetailedTime(savedAt) || "Trail Started",
        completedPercent: 0,
        completedCount: 0,
        totalCount: totalWaypoints,
        eventLabel: "Expedition Began",
      },
    ];

    if (currentCompletedCount > 0) {
      chartData.push({
        timeLabel: recentTime || "Now",
        fullTime: formatDetailedTime(lastProgressAt) || "Current Status",
        completedPercent: currentPercent,
        completedCount: currentCompletedCount,
        totalCount: totalWaypoints,
        eventLabel: `Waypoints Cleared (${currentCompletedCount}/${totalWaypoints})`,
      });
    }
  }

  // Momentum velocity calculation
  const isCompleted = currentPercent === 100;
  const milestonesLogged = chartData.length;

  return (
    <div
      id="journey-momentum-chart-card"
      className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5 sm:p-6 space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-900">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            <span>Wayfinding Velocity & Momentum</span>
          </div>
          <p className="text-xs text-stone-500">
            Visual tracking of your completion velocity across checkpoints over time
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200 text-stone-700">
            <Clock className="w-3.5 h-3.5 text-stone-500" />
            <span>{milestonesLogged} {milestonesLogged === 1 ? "Check-in" : "Check-ins"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-semibold">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>{currentPercent}% Conquered</span>
          </div>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="w-full h-52 sm:h-60 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 12, right: 16, left: -18, bottom: 0 }}
          >
            <defs>
              <linearGradient id="momentumGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d97706" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="timeLabel"
              stroke="#a8a29e"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#e7e5e4" }}
              dy={6}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              stroke="#a8a29e"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#e7e5e4" }}
              unit="%"
            />

            <ReferenceLine
              y={100}
              stroke="#10b981"
              strokeDasharray="3 3"
              strokeWidth={1}
              label={{
                value: "100% Target",
                position: "insideTopRight",
                fill: "#059669",
                fontSize: 10,
              }}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as ChartDataPoint;
                  return (
                    <div className="bg-stone-900 text-stone-50 text-xs rounded-xl p-3 shadow-lg border border-stone-800 space-y-1 z-50">
                      <div className="font-semibold text-amber-400">
                        {data.completedPercent}% Waypoint Completion
                      </div>
                      <div className="text-[11px] text-stone-300 font-medium">
                        {data.eventLabel}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {data.completedCount} of {data.totalCount} checkpoints cleared
                      </div>
                      <div className="text-[10px] text-stone-500 pt-0.5 border-t border-stone-800">
                        {data.fullTime}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="completedPercent"
              stroke="#d97706"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#momentumGradient)"
              activeDot={{
                r: 5,
                fill: "#78350f",
                stroke: "#fbbf24",
                strokeWidth: 2,
              }}
              dot={{
                r: 3.5,
                fill: "#d97706",
                stroke: "#ffffff",
                strokeWidth: 1.5,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Momentum Insights Bar */}
      <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-stone-800">Current Momentum Status:</span>
          {isCompleted ? (
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Expedition Completed • Milestone reached!
            </span>
          ) : currentCompletedCount > 0 ? (
            <span className="text-amber-800 font-medium bg-amber-50/80 px-2 py-0.5 rounded-md border border-amber-200/60">
              Steadily advancing through checkpoints
            </span>
          ) : (
            <span className="text-stone-500 italic">
              Awaiting first cleared waypoint. Complete the 15-minute inertia breaker!
            </span>
          )}
        </div>
        <div className="text-[11px] text-stone-400">
          Updates instantly as checkpoints are cleared
        </div>
      </div>
    </div>
  );
};
