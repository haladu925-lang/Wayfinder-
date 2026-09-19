export type StrategyType = "incremental" | "lateral" | "inversion" | "direct";

export interface Waypoint {
  id: string;
  order: number;
  title: string;
  description: string;
  obstacleBypass: string;
  checkpointProof: string;
  isCompleted?: boolean;
  completedAt?: string;
  notes?: string;
}

export interface CatalystAction {
  title: string;
  durationMinutes: number;
  instructions: string;
  expectedOutcome: string;
}

export interface Pathway {
  id: string;
  name: string;
  strategyType: StrategyType;
  tagline: string;
  description: string;
  estimatedTimeline: string;
  riskLevel: "Low" | "Medium" | "High" | "Medium-High";
  catalystAction: CatalystAction;
  waypoints: Waypoint[];
  pitfallsToAvoid: string[];
}

export interface CompassBearing {
  direction: string;
  principle: string;
  anchorThought: string;
}

export interface WayfindingPlan {
  id: string;
  title: string;
  summary: string;
  coreInsight: string;
  compassBearing: CompassBearing;
  pathways: Pathway[];
  affirmationOfResourcefulness: string;
  createdAt: string;
  originalQuery: {
    situation: string;
    obstacle: string;
    destination: string;
    focusArea: string;
  };
}

export interface CrossroadsAnalysis {
  reversibility: string;
  optionAAnalysis: {
    upside: string;
    hiddenCost: string;
    riskRating: string;
  };
  optionBAnalysis: {
    upside: string;
    hiddenCost: string;
    riskRating: string;
  };
  theThirdWay: string;
  recommendedPosture: string;
  catalystAction: string;
}

export interface EmergencyReset {
  breathAnchor: string;
  realityCheck: string;
  oneInchMove: {
    action: string;
    duration: string;
    whyItWorks: string;
  };
  thingsToIgnoreForNow: string[];
}

export interface ProgressSnapshot {
  timestamp: string; // ISO string
  completedCount: number;
  totalCount: number;
  percent: number;
  label?: string; // e.g. "Started", "Cleared WP 1"
}

export interface SavedJourney {
  plan: WayfindingPlan;
  activePathwayId: string;
  completedWaypointIds: string[];
  notesByWaypointId: Record<string, string>;
  savedAt: string;
  lastProgressAt: string;
  progressHistory?: ProgressSnapshot[];
}
