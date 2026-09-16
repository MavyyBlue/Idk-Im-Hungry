import { foods } from '../data/foods.js';
import { restaurantById } from '../data/restaurants.js';
import { resolveReaction } from './reactions.js';
import { makeCandidateQuestion, makeDaypartQuestion, makeRestaurantQuestion, restaurantQuestionOrder, selectCustomTagQuestion, selectTraitQuestion } from './questions.js';

const profileBias = (profile, food) => {
  const selected = (profile?.selectedFoods?.[food.id] || 0) * 0.18;
  const rejected = (profile?.rejectedFoods?.[food.id] || 0) * 0.12;
  const family = Math.min(0.55, (profile?.familyAffinity?.[food.family] || 0) * 0.07);
  const tags = (food.tags || []).reduce((sum, tag) => sum + Math.min(0.06, (profile?.tagAffinity?.[tag] || 0) * 0.008), 0);
  return selected + family + Math.min(0.35, tags) - rejected;
};

function visibleSafeFoods(profile) {
  return (profile?.safeFoods || []).filter((food) => food && !food.hidden).map((food) => ({...food, userAdded:true}));
}

function candidateUniverse(profile) {
  const custom = visibleSafeFoods(profile);
  const ids = new Set(custom.map((food) => food.id));
  return [...custom, ...foods.filter((food) => !ids.has(food.id))];
}

const cloneCandidates = (profile) => candidateUniverse(profile).map((food) => ({ ...food, score:profileBias(profile, food) }));

export function createSession({ mode='self', fastMode=false, profile, localHour=new Date().getHours() }) {
  return {
    mode,
    fastMode,
    profile,
    localHour,
    candidates:cloneCandidates(profile),
    answers:[],
    askedIds:new Set(),
    rejectedRestaurants:new Set(),
    hardExcludedTags:new Set(),
    hardRejectedFoods:new Set(),
    questionCount:0,
    restaurantQuestionsAsked:0,
    weakRestaurantReactions:0,
    maxQuestions:fastMode ? 8 : 28,
    lastDimensions:[],
    adverseDimensions:{},
    timeQuestionAsked:false,
    refinementMode:false,
    refinementRound:0,
    lastShortlistIds:[],
    visibleShortlistIds:[],
    shortlistExposure:{},
    refinementPenalty:{}
  };
}

function availableCandidates(session) {
  return session.candidates.filter((candidate) => {
    if (session.hardRejectedFoods.has(candidate.id)) return false;
    if ([...session.hardExcludedTags].some((tag) => candidate.tags.includes(tag))) return false;
    if (candidate.restaurants?.length && candidate.restaurants.every((id) => session.rejectedRestaurants.has(id))) return false;
    return true;
  });
}

function rankingScore(session, candidate) {
  const exposure = session.shortlistExposure[candidate.id] || 0;
  const novelty = exposure * 0.82;
  const refinement = session.refinementPenalty[candidate.id] || 0;
  return candidate.score - novelty - refinement;
}

function rankedCandidates(session) {
  return availableCandidates(session)
    .map((candidate) => ({ ...candidate, _rankingScore:rankingScore(session, candidate) }))
    .sort((a,b) => b._rankingScore - a._rankingScore || b.score - a.score || a.name.localeCompare(b.name));
}

function bestCandidateForDirectQuestion(session, active) {
  return [...active]
    .filter((candidate) => !session.askedIds.has(`candidate:${session.refinementRound}:${candidate.id}`))
    .sort((a,b) => rankingScore(session, b) - rankingScore(session, a) || a.name.localeCompare(b.name))[0] || null;
}

export function getNextQuestion(session) {
  const active = availableCandidates(session);
  if (!session.timeQuestionAsked) return makeDaypartQuestion(session.localHour);
  if (session.questionCount >= session.maxQuestions) return null;
  if (active.length <= 3 && !session.refinementMode) return null;

  if (session.refinementMode && active.length <= 6) {
    const direct = bestCandidateForDirectQuestion(session, active);
    if (direct) return makeCandidateQuestion(direct, session.refinementRound);
  }

  if (!session.fastMode && session.questionCount < 5 && session.restaurantQuestionsAsked < 3 && session.weakRestaurantReactions < 2) {
    const restaurantId = restaurantQuestionOrder(active, session.askedIds)[0];
    if (restaurantId) return makeRestaurantQuestion(restaurantId);
  }

  if (!session.fastMode && session.questionCount >= 10 && active.length <= 14) {
    const candidate = bestCandidateForDirectQuestion(session, active);
    if (candidate) return makeCandidateQuestion(candidate, session.refinementRound);
  }

  const trait = selectTraitQuestion(
    active,
    session.askedIds,
    session.lastDimensions.slice(-2),
    session.questionCount,
    session.fastMode,
    session.adverseDimensions
  );
  if (trait) return { ...trait, type:'trait' };

  const customTrait = selectCustomTagQuestion(active, session.askedIds, session.questionCount);
  if (customTrait) return customTrait;

  if (!session.fastMode) {
    const candidate = bestCandidateForDirectQuestion(session, active);
    if (candidate) return makeCandidateQuestion(candidate, session.refinementRound);
  }
  return null;
}

function daypartMatcher(daypart) {
  if (daypart === 'breakfast') return (candidate) => candidate.tags.includes('breakfast-food') || candidate.tags.includes('breakfast');
  if (daypart === 'lunch') return (candidate) => candidate.tags.includes('lunch') || (candidate.tags.includes('meal') && !candidate.tags.includes('breakfast-food'));
  if (daypart === 'dinner') return (candidate) => candidate.tags.includes('dinner') || (candidate.tags.includes('meal') && !candidate.tags.includes('breakfast-food'));
  return (candidate) => candidate.tags.includes('late-night') || candidate.tags.includes('snack') || candidate.tags.includes('quick');
}

function answerMatcher(question) {
  if (question.type === 'time-context') return daypartMatcher(question.daypart);
  if (question.type === 'restaurant') return (candidate) => candidate.restaurants.includes(question.restaurantId);
  if (question.type === 'candidate') return (candidate) => candidate.id === question.candidateId;
  return (candidate) => candidate.tags.includes(question.tag);
}

function similarityPenalty(target, candidate) {
  if (!target || target.id === candidate.id) return 0;
  let penalty = target.family === candidate.family ? 0.5 : 0;
  if (target.subfamily === candidate.subfamily) penalty += 0.38;
  const overlap = (target.tags || []).filter((tag) => candidate.tags.includes(tag)).length;
  penalty += Math.min(0.45, overlap * 0.04);
  return penalty;
}

export function applyReaction(session, question, reactionOrValue) {
  const matches = answerMatcher(question);
  const reaction = resolveReaction(session.profile, reactionOrValue);
  const { value, reactionId, weight, adverse, hardReject, severity } = reaction;

  session.questionCount += 1;
  session.askedIds.add(question.id?.startsWith('candidate:') ? question.id : question.id?.includes(':') ? question.id : `trait:${question.id}`);
  if (question.type === 'time-context') session.timeQuestionAsked = true;
  if (question.type === 'restaurant') session.restaurantQuestionsAsked += 1;
  if (question.dimension) session.lastDimensions.push(question.dimension);

  if (adverse && question.dimension) {
    session.adverseDimensions[question.dimension] = Math.max(session.adverseDimensions[question.dimension] || 0, severity);
  }

  if (question.type === 'restaurant' && adverse) session.weakRestaurantReactions += 1;
  if (question.type === 'restaurant' && hardReject) session.rejectedRestaurants.add(question.restaurantId);
  if (question.type === 'trait' && hardReject) session.hardExcludedTags.add(question.tag);
  if (question.type === 'candidate' && hardReject) session.hardRejectedFoods.add(question.candidateId);

  // Matching foods take the full signal. Negative evidence never gives unrelated foods a free boost.
  for (const candidate of session.candidates) {
    if (matches(candidate)) {
      candidate.score += weight;
    } else if (weight > 0.75) {
      candidate.score -= weight * 0.08;
    }
  }

  // Time is context only. A strong dislike re-ranks breakfast/dinner/etc.; it never bans the opposite time-of-day food.
  if (question.type === 'time-context') {
    session.hardExcludedTags.delete(question.daypart);
  }

  if (question.type === 'restaurant' && adverse) {
    const restaurant = restaurantById[question.restaurantId];
    const categorySeverity = severity * (hardReject ? 0.9 : 0.42);
    for (const candidate of session.candidates) {
      const categoryOverlap = restaurant?.categories?.some((category) => candidate.tags.includes(category));
      if (categoryOverlap) candidate.score -= categorySeverity;
    }
  }

  // Direct-item dislike bleeds into very similar foods proportionally, while only the far-left zone hard-eliminates the item.
  if (question.type === 'candidate' && adverse) {
    const target = session.candidates.find((candidate) => candidate.id === question.candidateId);
    const similarityScale = severity * (hardReject ? 1.35 : 0.72);
    for (const candidate of session.candidates) {
      if (candidate.id !== question.candidateId) candidate.score -= similarityPenalty(target, candidate) * similarityScale;
    }
  }

  session.answers.push({ question:{ ...question }, reactionId, sliderValue:value, weight, matchesCandidate:matches });
  return session;
}

export function rejectFood(session, candidateId) {
  session.hardRejectedFoods.add(candidateId);
  const candidate = session.candidates.find((item) => item.id === candidateId);
  if (candidate) candidate.score = -999;
}

function noteExposure(session, candidateIds=[]) {
  for (const id of candidateIds) session.shortlistExposure[id] = (session.shortlistExposure[id] || 0) + 1;
}

export function noteShortlistShown(session, candidateIds=[]) {
  session.lastShortlistIds = [...candidateIds];
  session.visibleShortlistIds = [...candidateIds];
  noteExposure(session, candidateIds);
}

export function replaceShortlistItem(session, currentIds=session.visibleShortlistIds, rejectedId) {
  const ids = [...currentIds];
  const slot = ids.indexOf(rejectedId);
  const survivors = ids.filter((id) => id !== rejectedId && !session.hardRejectedFoods.has(id));
  const replacement = rankedCandidates(session).find((candidate) => !survivors.includes(candidate.id));

  if (slot >= 0) {
    if (replacement) ids[slot] = replacement.id;
    else ids.splice(slot, 1);
  }

  const next = ids.filter((id, index) => id && ids.indexOf(id) === index && !session.hardRejectedFoods.has(id));
  session.lastShortlistIds = [...next];
  session.visibleShortlistIds = [...next];
  if (replacement) noteExposure(session, [replacement.id]);
  return next;
}

export function beginRefinement(session, candidateIds=session.visibleShortlistIds.length ? session.visibleShortlistIds : session.lastShortlistIds) {
  session.refinementMode = true;
  session.refinementRound += 1;
  session.lastShortlistIds = [...candidateIds];
  session.visibleShortlistIds = [];
  session.maxQuestions = Math.max(session.maxQuestions, session.questionCount + 6);
  for (const id of candidateIds) {
    if (!session.hardRejectedFoods.has(id)) session.refinementPenalty[id] = (session.refinementPenalty[id] || 0) + 1.05;
  }
  return session;
}

function decorateCandidates(session, candidates) {
  if (!candidates.length) return [];
  const ranked = rankedCandidates(session);
  const high = ranked[0]?._rankingScore ?? 0;
  const low = ranked[Math.min(ranked.length - 1, 8)]?._rankingScore ?? high - 1;
  const span = Math.max(1, high - low);

  return candidates.map((candidate) => {
    const relative = Math.max(0, Math.min(1, (candidate._rankingScore - low) / span));
    // Unlike V0.3, weak survivors are allowed to look weak; there is no artificial 38% floor.
    const compatibility = Math.round(Math.max(1, Math.min(99, 48 + candidate._rankingScore * 8.5 + relative * 9)));
    const label = compatibility >= 82 ? 'Strong Match'
      : compatibility >= 66 ? 'Good Match'
      : compatibility >= 49 ? 'Possible Match'
      : compatibility >= 28 ? 'Weak Match'
      : 'Barely Hanging On';
    const viableRestaurants = (candidate.restaurants || []).filter((id) => !session.rejectedRestaurants.has(id));
    const { _rankingScore, ...clean } = candidate;
    return { ...clean, compatibility, label, viableRestaurants };
  });
}

export function getShortlist(session, limit=3, preferredIds=[]) {
  const ranked = rankedCandidates(session);
  let top;

  if (preferredIds?.length) {
    const byId = new Map(ranked.map((candidate) => [candidate.id, candidate]));
    top = preferredIds.map((id) => byId.get(id)).filter(Boolean).slice(0, limit);
    const used = new Set(top.map((candidate) => candidate.id));
    for (const candidate of ranked) {
      if (top.length >= limit) break;
      if (!used.has(candidate.id)) {
        top.push(candidate);
        used.add(candidate.id);
      }
    }
  } else {
    top = ranked.slice(0, limit);
  }

  return decorateCandidates(session, top);
}

export function remainingCount(session) {
  return availableCandidates(session).length;
}

export function activeCandidates(session) {
  return availableCandidates(session).map((candidate) => ({...candidate}));
}
