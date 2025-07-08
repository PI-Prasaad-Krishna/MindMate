import vader from "vader-sentiment";

export type MoodScore = { score: number; tip: string };

const tips = {
  positive: [
    "Celebrate a small win today!",
    "Share your good vibe with someone.",
  ],
  neutral: [
    "Take a mindful pause.",
    "Stay present and hydrated.",
  ],
  negative: [
    "Try a 2‑minute breathing exercise.",
    "Step outside for fresh air.",
  ],
};

/** Primary helper – returns both score and a random tip */
export function analyse(text: string): MoodScore {
  const { compound } =
    vader.SentimentIntensityAnalyzer.polarity_scores(text);

  let band: keyof typeof tips = "neutral";
  if (compound > 0.2) band = "positive";
  if (compound < -0.2) band = "negative";

  const tipArr = tips[band];
  const tip = tipArr[Math.floor(Math.random() * tipArr.length)];

  return { score: compound, tip };
}

/** Compat helper expected by older code – returns only the score */
export function analyzeSentiment(text: string): number {
  return analyse(text).score;
}

/** Compat helper – get a tip from an existing score */
export function getCopingTip(score: number): string {
  if (score > 0.2) {
    const list = tips.positive;
    return list[Math.floor(Math.random() * list.length)];
  } else if (score < -0.2) {
    const list = tips.negative;
    return list[Math.floor(Math.random() * list.length)];
  }
  const list = tips.neutral;
  return list[Math.floor(Math.random() * list.length)];
}
