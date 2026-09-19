export interface WayfindingPreset {
  id: string;
  category: "Career" | "Creative" | "Life & Dilemma" | "Friction & Conflict" | "Personal Reset";
  iconName: string;
  title: string;
  situation: string;
  obstacle: string;
  destination: string;
}

export const WAYFINDING_PRESETS: WayfindingPreset[] = [
  {
    id: "preset-career-pivot",
    category: "Career",
    iconName: "Compass",
    title: "The Mid-Career Pivot",
    situation: "Trapped in an established role that drains me, but I have no formal pedigree in the new field I want to enter.",
    obstacle: "Lack of direct experience, imposter syndrome, and fear of taking an unbearable pay cut.",
    destination: "Securing my first paid client or full-time offer in the new industry within 6 months while staying financially secure.",
  },
  {
    id: "preset-creative-rut",
    category: "Creative",
    iconName: "Sparkles",
    title: "The Creative Block & Perfectionism",
    situation: "Have a major personal project 70% finished that has been sitting idle for four months.",
    obstacle: "Paralyzing perfectionism, fear that it isn't good enough, and exhaustion whenever opening the draft.",
    destination: "Ship the minimum lovable version to a real audience by next Friday and regain creative joy.",
  },
  {
    id: "preset-hard-conversation",
    category: "Friction & Conflict",
    iconName: "ShieldAlert",
    title: "The Dreaded Confrontation",
    situation: "A collaborator / family member has been repeatedly overstepping boundaries and taking advantage of my leniency.",
    obstacle: "Extreme conflict aversion, fear of an explosive blowout, and rehearsing arguments in my head all day.",
    destination: "Establish a clear, calm, unbreakable boundary in a 15-minute conversation with zero guilt.",
  },
  {
    id: "preset-overwhelmed-plate",
    category: "Personal Reset",
    iconName: "Layers",
    title: "Overwhelmed & Inactive",
    situation: "30 urgent tasks competing for attention, feeling frozen on the couch scrolling instead of starting.",
    obstacle: "Cognitive overload, decision fatigue, and dread that starting any single task leaves 29 others neglected.",
    destination: "Clear the panic, eliminate 20 non-critical items, and finish the top 2 dominoes with deep focus.",
  },
  {
    id: "preset-financial-squeeze",
    category: "Life & Dilemma",
    iconName: "Anchor",
    title: "The Financial Bottleneck",
    situation: "Unexpected costs have drained cash buffers; income feels capped at my primary job.",
    obstacle: "Time scarcity after 9-to-5, fatigue, and not knowing what monetizable skill can produce cash quickly.",
    destination: "Generate an initial $500–$1,000 emergency buffer within 30 days without taking on high-interest debt.",
  },
];

export interface MentalModel {
  title: string;
  originator: string;
  mantra: string;
  insight: string;
  application: string;
}

export const WAYFINDER_MENTAL_MODELS: MentalModel[] = [
  {
    title: "The Obstacle Is the Way",
    originator: "Marcus Aurelius",
    mantra: "The impediment to action advances action. What stands in the way becomes the way.",
    insight: "When a path is blocked, the blockage forces you to develop the exact leverage, patience, or skill you previously lacked.",
    application: "Instead of asking 'How do I remove this barrier?', ask: 'How does this barrier train me to be unstoppable?'",
  },
  {
    title: "Two-Way Doors vs. One-Way Doors",
    originator: "Decision Architecture",
    mantra: "Most decisions are reversible; treat them like lightweight experiments, not death sentences.",
    insight: "People freeze because they treat reversible (Type 2) decisions as if they were permanent (Type 1) traps.",
    application: "If walking through a door allows you to walk back out with minimal damage, make the decision within 15 minutes.",
  },
  {
    title: "The 1-Inch Domino (Local Traction)",
    originator: "Kinetic Psychology",
    mantra: "Inertia cannot resist a small enough physical action.",
    insight: "Motivation is not the prerequisite for action; motivation is the chemical byproduct of physical movement.",
    application: "Shrink the first step until it is so small that resistance is biologically impossible to maintain.",
  },
  {
    title: "The Lateral Side-Door",
    originator: "Alex Banayan & Lateral Thinking",
    mantra: "There is always a Third Door: ditch the queue, run down the alley, and knock on the kitchen window.",
    insight: "When everyone stands in line waiting for official permission, the resourceful person creates value upstream.",
    application: "Identify who already has the outcome you want, and solve their single most annoying bottleneck for free.",
  },
];
