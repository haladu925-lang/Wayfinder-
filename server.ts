import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI client lazily or safely
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback generator for Find a Way when no API key is provided or on error
function generateFallbackWayfinding(situation: string, obstacle: string, destination: string, focusArea: string) {
  const sit = situation || "Facing a complex hurdle";
  const obs = obstacle || "Unclear direction and self-doubt";
  const dest = destination || "Finding clarity and making meaningful progress";

  return {
    id: "plan-" + Date.now(),
    title: `Navigating Through: ${sit.slice(0, 50)}...`,
    summary: `A structured 3-way exploration designed to dismantle "${obs}" and establish a direct trajectory toward "${dest}".`,
    coreInsight: `The obstacle "${obs}" is not a dead end; it is a boundary condition highlighting where old tactics must give way to smarter leverage.`,
    compassBearing: {
      direction: "Forward & Grounded",
      principle: "Progress over perfection: action creates clarity, not vice versa.",
      anchorThought: "Every major path in history was carved by someone taking a single step through uncertainty.",
    },
    pathways: [
      {
        id: "path-1",
        name: "The Incremental Foothold Path",
        strategyType: "incremental",
        tagline: "Minimum friction, steady compound momentum",
        description: "Bypasses overwhelm by decomposing the destination into small, undeniable daily advances that require zero heroic willpower.",
        estimatedTimeline: "14 – 30 Days",
        riskLevel: "Low",
        catalystAction: {
          title: "The 15-Minute Foothold",
          durationMinutes: 15,
          instructions: `Set a timer for 15 minutes right now. Write down exactly 3 physical, verifiable tasks needed to chip away at "${obs}". Complete the simplest one before the timer rings.`,
          expectedOutcome: "Immediate breaking of inertia and dopamine restoration.",
        },
        waypoints: [
          {
            id: "wp-1-1",
            order: 1,
            title: "Isolate & Decouple the Bottleneck",
            description: `Separate the emotional frustration of "${obs}" from the factual mechanics. What is the single specific bottleneck right now?`,
            obstacleBypass: "Write the obstacle on paper to get it out of your working memory.",
            checkpointProof: "A single sentence defining the exact constraint.",
          },
          {
            id: "wp-1-2",
            order: 2,
            title: "Construct a Low-Stakes Sandbox",
            description: "Build an experiment where failure costs almost nothing. Test a prototype or micro-version of your goal.",
            obstacleBypass: "Lower the bar until it feels ridiculously easy to begin.",
            checkpointProof: "First low-stakes test executed without fear of judgment.",
          },
          {
            id: "wp-1-3",
            order: 3,
            title: "Lock in an Accountable Cadence",
            description: "Establish a 20-minute daily rhythm protected from all interruptions.",
            obstacleBypass: "Stack this action directly after an already ingrained daily habit.",
            checkpointProof: "3 consecutive days of progress logged.",
          },
          {
            id: "wp-1-4",
            order: 4,
            title: "Expand Foothold into Highway",
            description: `Transition from defensive surviving to offensive thriving toward "${dest}".`,
            obstacleBypass: "Double down on what produced the best signal in step 2.",
            checkpointProof: "Milestone reached and next horizon mapped.",
          },
        ],
        pitfallsToAvoid: [
          "Waiting for total certainty before taking the first step",
          "Taking on too many adjustments at the same time",
          "Mistaking nervous research for real physical action",
        ],
      },
      {
        id: "path-2",
        name: "The Lateral Flank / Pivot Door",
        strategyType: "lateral",
        tagline: "Don't ram the closed front gate; look for the open side window",
        description: "Instead of attacking the obstacle head-on, reframe the rules of engagement. Leverage alternative assets, alliances, or unconventional entries.",
        estimatedTimeline: "7 – 21 Days",
        riskLevel: "Medium",
        catalystAction: {
          title: "The Inversion Question",
          durationMinutes: 10,
          instructions: `Ask: 'If I were strictly forbidden from solving this the normal way, how would an outsider get to "${dest}" in 48 hours?' Jot 3 wild possibilities.`,
          expectedOutcome: "Unlocks lateral perspectives that bypass the conventional bottleneck.",
        },
        waypoints: [
          {
            id: "wp-2-1",
            order: 1,
            title: "Identify Hidden Allies & Precedents",
            description: "Who has faced this exact roadblock before and bypassed it effortlessly? Study their unorthodox workaround.",
            obstacleBypass: "Reach out with a hyper-specific, respectful question to someone one step ahead.",
            checkpointProof: "At least 2 validated precedent models identified.",
          },
          {
            id: "wp-2-2",
            order: 2,
            title: "Offer Value Upstream",
            description: "Trade a skill or strength you already have to dismantle the barrier.",
            obstacleBypass: "Stop focusing on what you lack; inventory what you have in surplus.",
            checkpointProof: "One high-leverage outreach or creative trade launched.",
          },
          {
            id: "wp-2-3",
            order: 3,
            title: "The Trojan Horse Maneuver",
            description: "Enter through a tangential project or adjacent domain that delivers you directly to the destination.",
            obstacleBypass: "Avoid direct gatekeepers by joining the community organically.",
            checkpointProof: "Inside access established.",
          },
        ],
        pitfallsToAvoid: [
          "Comparing your messy middle to another's curated highlight reel",
          "Abandoning the core destination just because the entrance changed",
        ],
      },
      {
        id: "path-3",
        name: "The Radical Inversion (The Obstacle IS the Way)",
        strategyType: "inversion",
        tagline: "Turn the impediment into fuel and the barrier into a competitive moat",
        description: "What if the obstacle is not blocking the path, but is the exact training ground you need to reach your destination?",
        estimatedTimeline: "30 – 60 Days",
        riskLevel: "Medium-High",
        catalystAction: {
          title: "The Advantage Audit",
          durationMinutes: 12,
          instructions: `List 3 distinct ways that dealing with "${obs}" will make you stronger, smarter, or more resilient than those who had an easy ride.`,
          expectedOutcome: "Transforms victim mindset into strategic sovereignty.",
        },
        waypoints: [
          {
            id: "wp-3-1",
            order: 1,
            title: "Embrace the Constraint as a Filter",
            description: `Acknowledge that "${obs}" discourages 95% of people. Overcoming it creates an insurmountable advantage.`,
            obstacleBypass: "Treat friction as confirmation of a worthwhile journey.",
            checkpointProof: "Psychological resilience shift documented.",
          },
          {
            id: "wp-3-2",
            order: 2,
            title: "Build Systems Under Stress",
            description: "Design routines that work even on your lowest energy, highest stress days.",
            obstacleBypass: "Automate or eliminate non-essential commitments.",
            checkpointProof: "System survived a high-friction day.",
          },
          {
            id: "wp-3-3",
            order: 3,
            title: "Convert Scar Tissue into Mastery",
            description: `Document the journey so you can teach others or turn this struggle into your defining narrative.`,
            obstacleBypass: "Reflect on how much ground you've covered.",
            checkpointProof: "Milestone achieved and wisdom distilled.",
          },
        ],
        pitfallsToAvoid: [
          "Glorifying suffering without optimizing for efficiency",
          "Refusing help out of misplaced pride",
        ],
      },
    ],
    affirmationOfResourcefulness: `You do not need to see the entire 1,000 miles ahead. You only need enough light to illuminate the next 10 feet. Keep moving.`,
  };
}

// 1. Find a Way API endpoint
app.post("/api/find-a-way", async (req, res) => {
  try {
    const { situation, obstacle, destination, focusArea, urgency } = req.body;

    if (!situation && !obstacle) {
      return res.status(400).json({ error: "Please describe your situation or obstacle." });
    }

    const ai = getGenAI();
    if (!ai) {
      // Graceful fallback when GEMINI_API_KEY is not configured
      const fallback = generateFallbackWayfinding(situation, obstacle, destination, focusArea);
      return res.json(fallback);
    }

    const prompt = `You are the master Wayfinder — a profound, pragmatic, empathetic guide who helps people find a way forward through life's impasses, career hurdles, personal dilemmas, and impossible-seeming obstacles.
Analyze the user's situation and generate a rigorous, inspiring, actionable navigation blueprint with THREE DISTINCT PATHWAYS to reach their destination.

USER DETAILS:
- Current Situation: "${situation || 'Unspecified struggle'}"
- The Primary Obstacle / Fog: "${obstacle || 'Friction & uncertainty'}"
- Desired Destination / Outcome: "${destination || 'Clarity, resolution, forward momentum'}"
- Focus Area: "${focusArea || 'General life'}"
- Urgency: "${urgency || 'moderate'}"

Return ONLY a valid JSON object (no markdown code fences, no extra text) conforming to this exact structure:
{
  "id": "plan-timestamp",
  "title": "Clear, inspiring title (e.g. 'Breaking the Impasse: From Stalled to Momentum')",
  "summary": "2-3 sentences synthesizing the crux of their journey.",
  "coreInsight": "A sharp, eye-opening reframe of the obstacle that changes how they perceive it.",
  "compassBearing": {
    "direction": "Short phrase describing the navigational posture (e.g. 'Steady Northern Traverse')",
    "principle": "Core philosophical or tactical rule to keep in mind",
    "anchorThought": "A grounding sentence to repeat when doubt strikes"
  },
  "pathways": [
    {
      "id": "path-1",
      "name": "The Direct Foothold Path",
      "strategyType": "incremental",
      "tagline": "Short evocative subtitle",
      "description": "How this path bypasses the obstacle through steady, low-friction micro-actions",
      "estimatedTimeline": "e.g. 14 - 30 days",
      "riskLevel": "Low",
      "catalystAction": {
        "title": "Immediate 15-Minute Action",
        "durationMinutes": 15,
        "instructions": "Specific, friction-free physical step they can take RIGHT NOW to break inertia",
        "expectedOutcome": "What immediate feeling or tangible artifact this produces"
      },
      "waypoints": [
        {
          "id": "wp-1-1",
          "order": 1,
          "title": "Milestone title",
          "description": "Concrete action to take",
          "obstacleBypass": "How to handle resistance here",
          "checkpointProof": "How they know this step is completed"
        },
        {
          "id": "wp-1-2",
          "order": 2,
          "title": "Milestone title",
          "description": "Concrete action to take",
          "obstacleBypass": "How to handle resistance here",
          "checkpointProof": "How they know this step is completed"
        },
        {
          "id": "wp-1-3",
          "order": 3,
          "title": "Milestone title",
          "description": "Concrete action to take",
          "obstacleBypass": "How to handle resistance here",
          "checkpointProof": "How they know this step is completed"
        },
        {
          "id": "wp-1-4",
          "order": 4,
          "title": "Milestone title",
          "description": "Concrete action to take",
          "obstacleBypass": "How to handle resistance here",
          "checkpointProof": "How they know this step is completed"
        }
      ],
      "pitfallsToAvoid": ["Pitfall 1", "Pitfall 2", "Pitfall 3"]
    },
    {
      "id": "path-2",
      "name": "The Lateral Flank / Pivot Door",
      "strategyType": "lateral",
      "tagline": "Short evocative subtitle",
      "description": "How this path attacks from an unconventional angle, finding the open side window instead of the locked front door",
      "estimatedTimeline": "e.g. 7 - 21 days",
      "riskLevel": "Medium",
      "catalystAction": {
        "title": "Lateral Catalyst Action",
        "durationMinutes": 10,
        "instructions": "Quick thought exercise or unconventional outreach",
        "expectedOutcome": "Tangible shift in perspective"
      },
      "waypoints": [
        {
          "id": "wp-2-1",
          "order": 1,
          "title": "Milestone title",
          "description": "Concrete action",
          "obstacleBypass": "Workaround",
          "checkpointProof": "Proof"
        },
        {
          "id": "wp-2-2",
          "order": 2,
          "title": "Milestone title",
          "description": "Concrete action",
          "obstacleBypass": "Workaround",
          "checkpointProof": "Proof"
        },
        {
          "id": "wp-2-3",
          "order": 3,
          "title": "Milestone title",
          "description": "Concrete action",
          "obstacleBypass": "Workaround",
          "checkpointProof": "Proof"
        }
      ],
      "pitfallsToAvoid": ["Pitfall 1", "Pitfall 2"]
    },
    {
      "id": "path-3",
      "name": "The Radical Inversion",
      "strategyType": "inversion",
      "tagline": "The obstacle is the way",
      "description": "How to convert the problem itself into the solution or competitive advantage",
      "estimatedTimeline": "e.g. 30 - 60 days",
      "riskLevel": "Medium-High",
      "catalystAction": {
        "title": "Inversion Audit",
        "durationMinutes": 12,
        "instructions": "Specific exercise converting the obstacle into fuel",
        "expectedOutcome": "Shift from victim to owner mindset"
      },
      "waypoints": [
        {
          "id": "wp-3-1",
          "order": 1,
          "title": "Milestone title",
          "description": "Action",
          "obstacleBypass": "Strategy",
          "checkpointProof": "Proof"
        },
        {
          "id": "wp-3-2",
          "order": 2,
          "title": "Milestone title",
          "description": "Action",
          "obstacleBypass": "Strategy",
          "checkpointProof": "Proof"
        },
        {
          "id": "wp-3-3",
          "order": 3,
          "title": "Milestone title",
          "description": "Action",
          "obstacleBypass": "Strategy",
          "checkpointProof": "Proof"
        }
      ],
      "pitfallsToAvoid": ["Pitfall 1", "Pitfall 2"]
    }
  ],
  "affirmationOfResourcefulness": "A powerful, uplifting reminder of their agency."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    let rawText = response.text || "";
    // Clean potential markdown wrap if any
    rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(rawText);
    res.json(data);
  } catch (error) {
    console.error("Error in /api/find-a-way:", error);
    // Fall back gracefully so user never sees a broken screen
    const fallback = generateFallbackWayfinding(
      req.body?.situation,
      req.body?.obstacle,
      req.body?.destination,
      req.body?.focusArea
    );
    res.json(fallback);
  }
});

// 2. Crossroads / Decision Navigator endpoint
app.post("/api/crossroads", async (req, res) => {
  try {
    const { decisionTitle, optionA, optionB, coreValues, worstFear } = req.body;

    const ai = getGenAI();
    if (!ai) {
      // Fallback decision analysis
      return res.json({
        reversibility: "Type 2 Decision (Reversible door): You can step through, test the waters, and retreat if the feedback is poor.",
        optionAAnalysis: {
          upside: "Known familiarity and lower immediate anxiety.",
          hiddenCost: "Opportunity cost of remaining in status quo tension.",
          riskRating: "Moderate",
        },
        optionBAnalysis: {
          upside: "Higher growth potential and alignment with long-term aspirations.",
          hiddenCost: "Steeper initial learning curve and emotional friction.",
          riskRating: "Elevated short-term, low long-term",
        },
        theThirdWay: "Run a 7-day micro-trial of Option B without severing Option A. Pre-commit to a test window before making an irreversible declaration.",
        recommendedPosture: "Choose the path that maximizes future options rather than the path that merely relieves present discomfort.",
        catalystAction: "Conduct a 20-minute reality test: simulate living with Option B for 48 hours in your schedule.",
      });
    }

    const prompt = `Analyze this tough fork in the road / crossroads dilemma:
Decision Title: "${decisionTitle || 'Crucial Decision'}"
Option A: "${JSON.stringify(optionA)}"
Option B: "${JSON.stringify(optionB)}"
Guiding Values: "${coreValues?.join(', ') || 'Freedom, growth, integrity'}"
Worst Fear / Concern: "${worstFear || 'Making an unfixable mistake'}"

Provide a decision-science breakdown in JSON format without markdown ticks:
{
  "reversibility": "Explain whether this is a Two-Way Door (reversible) or One-Way Door (irreversible) and why.",
  "optionAAnalysis": {
    "upside": "Clear breakdown of true upside",
    "hiddenCost": "The hidden price or regret trap of Option A",
    "riskRating": "Low / Moderate / High"
  },
  "optionBAnalysis": {
    "upside": "Clear breakdown of true upside",
    "hiddenCost": "The hidden price or regret trap of Option B",
    "riskRating": "Low / Moderate / High"
  },
  "theThirdWay": "A creative synthesis or compromise ('The Third Way') that most people miss when trapped in binary either/or thinking.",
  "recommendedPosture": "Compassionate yet rigorous counsel on which path yields highest compounding peace and growth.",
  "catalystAction": "One small experiment to run in the next 24 hours to gain conclusive data before leaping."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    let rawText = response.text || "";
    rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(rawText);
    res.json(data);
  } catch (error) {
    console.error("Error in /api/crossroads:", error);
    res.json({
      reversibility: "Two-way door: Testable with lightweight experiments before committing fully.",
      optionAAnalysis: {
        upside: "Preserves current baseline stability.",
        hiddenCost: "Prolongs lingering doubt.",
        riskRating: "Low",
      },
      optionBAnalysis: {
        upside: "Opens high-ceiling opportunity.",
        hiddenCost: "Requires stepping out of comfort zones.",
        riskRating: "Moderate",
      },
      theThirdWay: "Design a 2-week hybrid test to validate key assumptions.",
      recommendedPosture: "Decide based on the person you want to become 5 years from now.",
      catalystAction: "Write down the non-negotiable criteria on paper today.",
    });
  }
});

// 3. Emergency Grounding / 1-Inch Step endpoint
app.post("/api/emergency-reset", async (req, res) => {
  const { feeling, challenge } = req.body;
  const feelingStr = feeling || "overwhelmed and stuck";
  const challengeStr = challenge || "too many conflicting demands";

  const ai = getGenAI();
  if (!ai) {
    return res.json({
      breathAnchor: "Take a deep breath: 4 seconds in through the nose, hold for 4 seconds, exhale for 6 seconds. Repeat 3 times.",
      realityCheck: `Right now, the fog of feeling ${feelingStr} makes the challenge seem 10x larger than its physical reality. You do not need to solve the whole year today. You only live in the current 10 minutes.`,
      oneInchMove: {
        action: "Clear your desk of everything except one pen and one blank sheet of paper.",
        duration: "3 minutes",
        whyItWorks: "External visual calm immediately lowers amygdala reactivity, restoring access to your prefrontal cortex.",
      },
      thingsToIgnoreForNow: [
        "What other people might think",
        "The complete end result or deadline in the far future",
        "Any decision that does not take effect in the next 60 minutes",
      ],
    });
  }

  try {
    const prompt = `Someone is in acute mental paralysis, distress, or feeling completely stuck:
Feeling: "${feelingStr}"
Challenge: "${challengeStr}"

Provide a swift, soothing, neurologically sound reset protocol to help them find a way out of paralysis immediately.
Return ONLY JSON:
{
  "breathAnchor": "Specific physiological reset instructions (e.g. physiological sigh or box breath).",
  "realityCheck": "Compassionate, razor-sharp reality anchor that disarms catastrophe thinking.",
  "oneInchMove": {
    "action": "A tiny, almost embarrassingly simple physical movement or action to regain agency",
    "duration": "1-3 minutes",
    "whyItWorks": "Scientific or psychological reason this breaks freeze state"
  },
  "thingsToIgnoreForNow": ["Thing 1 to put in the parking lot", "Thing 2 to dismiss right now", "Thing 3"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    let rawText = response.text || "";
    rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    res.json(JSON.parse(rawText));
  } catch (err) {
    console.error("Emergency reset error:", err);
    res.json({
      breathAnchor: "Take a deep double-inhale through your nose, then a long, slow sigh out through your mouth.",
      realityCheck: "You are safe in this physical moment. The problem is a puzzle, not a predator.",
      oneInchMove: {
        action: "Drink a glass of cold water and stretch your arms overhead.",
        duration: "2 minutes",
        whyItWorks: "Hydration and postural shift signal your autonomic nervous system to downregulate fight-or-flight.",
      },
      thingsToIgnoreForNow: [
        "Unsolicited opinions",
        "The worst-case scenario that hasn't happened",
        "The need to feel 100% motivated before acting",
      ],
    });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "Wayfinder" });
});

// Vite middleware for dev or static serving for prod
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Wayfinder server running on http://0.0.0.0:${PORT}`);
  });
}

start();
