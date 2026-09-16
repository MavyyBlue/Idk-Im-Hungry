export const reactions = [
  { id:'definitely', label:'Definitely', short:'Yes!', baseWeight:3.0, tone:'strong-positive' },
  { id:'sure', label:'Sure', short:'Sure', baseWeight:1.5, tone:'positive' },
  { id:'shrug', label:'Shrug', short:'Shrug', baseWeight:0.55, tone:'uncertain-positive' },
  { id:'ehhh', label:'Ehhh', short:'Ehhh', baseWeight:0.25, tone:'uncertain' },
  { id:'nnngh', label:'Nnngh', short:'Nnngh', baseWeight:-0.15, tone:'uncertain-negative' },
  { id:'no', label:'No', short:'No', baseWeight:-2.0, tone:'negative' },
  { id:'absolutely-not', label:'Absolutely Not', short:'Absolutely not', baseWeight:-4.0, tone:'hard-negative' }
];
export const reactionById = Object.fromEntries(reactions.map((reaction) => [reaction.id, reaction]));
export const ambiguousReactionIds = new Set(['shrug','ehhh','nnngh']);
export function reactionWeight(profile, reactionId) {
  const reaction = reactionById[reactionId];
  if (!reaction) return 0;
  if (!ambiguousReactionIds.has(reactionId)) return reaction.baseWeight;
  const learned = profile?.ambiguousLearning?.[reactionId];
  if (!learned || learned.total < 2) return reaction.baseWeight;
  const rate = learned.matched / learned.total;
  const learnedDelta = (rate - 0.5) * 1.2;
  return Math.max(-0.7, Math.min(1.2, reaction.baseWeight + learnedDelta));
}
