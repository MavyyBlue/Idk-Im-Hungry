export const sliderMoods = [
  { id:'absolutely-not', label:'Absolutely Not', emoji:'😖', max:8, representative:0, tone:'hard-negative', baseWeight:-6.5 },
  { id:'no', label:'No', emoji:'🙅', max:22, representative:16, tone:'negative', baseWeight:-3.6 },
  { id:'nnngh', label:'Nnngh', emoji:'😣', max:38, representative:32, tone:'uncertain-negative', baseWeight:-1.65 },
  { id:'ehhh', label:'Ehhh', emoji:'😐', max:57, representative:50, tone:'uncertain', baseWeight:0 },
  { id:'shrug', label:'Shrug', emoji:'🤷', max:70, representative:64, tone:'uncertain-positive', baseWeight:0.65 },
  { id:'sure', label:'Sure', emoji:'🙂', max:87, representative:80, tone:'positive', baseWeight:1.75 },
  { id:'definitely', label:'Definitely', emoji:'😍', max:96, representative:92, tone:'strong-positive', baseWeight:3.05 },
  { id:'absolutely-yes', label:'Absolutely Yes', emoji:'🤩', max:100, representative:100, tone:'strong-positive', baseWeight:4.1 }
];

// Kept as a semantic vocabulary for persistence, tests, and legacy sessions.
export const reactions = sliderMoods.map(({ max, representative, emoji, ...reaction }) => reaction);
export const reactionById = Object.fromEntries(sliderMoods.map((reaction) => [reaction.id, reaction]));
export const ambiguousReactionIds = new Set(['shrug','ehhh','nnngh']);

export function clampSliderValue(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 50;
  return Math.max(0, Math.min(100, Math.round(numeric)));
}

export function sliderMood(value) {
  const score = clampSliderValue(value);
  return sliderMoods.find((mood) => score <= mood.max) || sliderMoods.at(-1);
}

export function reactionValueForId(reactionId) {
  return reactionById[reactionId]?.representative ?? 50;
}

function learnedAmbiguousDelta(profile, reactionId) {
  if (!ambiguousReactionIds.has(reactionId)) return 0;
  const learned = profile?.ambiguousLearning?.[reactionId];
  if (!learned || learned.total < 2) return 0;
  const rate = learned.matched / learned.total;
  return (rate - 0.5) * 0.9;
}

// Continuous scoring is deliberately asymmetric: dislike carries more information than mild approval.
export function sliderWeight(profile, value) {
  const score = clampSliderValue(value);
  const normalized = (score - 50) / 50;
  const mood = sliderMood(score);
  let weight = 0;

  if (normalized < 0) {
    weight = -6.5 * Math.pow(Math.abs(normalized), 1.16);
  } else if (normalized > 0) {
    weight = 4.1 * Math.pow(normalized, 1.24);
  }

  // Ambiguous zones still learn per person, but only nudge rather than override the live slider.
  weight += learnedAmbiguousDelta(profile, mood.id);
  return Math.max(-6.5, Math.min(4.1, weight));
}

// Legacy semantic lookup remains available so old tests/history and saved ambiguity learning still work.
export function reactionWeight(profile, reactionId) {
  const reaction = reactionById[reactionId];
  if (!reaction) return 0;
  return sliderWeight(profile, reaction.representative);
}

export function resolveReaction(profile, reactionOrValue) {
  const value = typeof reactionOrValue === 'number'
    ? clampSliderValue(reactionOrValue)
    : reactionValueForId(reactionOrValue);
  const mood = sliderMood(value);
  return {
    value,
    reactionId:mood.id,
    mood,
    weight:sliderWeight(profile, value),
    adverse:value < 50,
    hardReject:value <= 8,
    severity:value < 50 ? (50 - value) / 50 : 0
  };
}
