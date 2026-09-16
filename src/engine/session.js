import { foods } from '../data/foods.js';
import { restaurantById } from '../data/restaurants.js';
import { reactionWeight } from './reactions.js';
import { makeCandidateQuestion, makeDaypartQuestion, makeRestaurantQuestion, restaurantQuestionOrder, selectCustomTagQuestion, selectTraitQuestion } from './questions.js';

const profileBias = (profile, food) => {
  const selected = (profile?.selectedFoods?.[food.id] || 0) * 0.18;
  const rejected = (profile?.rejectedFoods?.[food.id] || 0) * 0.08;
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
    timeQuestionAsked:false,
    refinementMode:false,
    refinementRound:0,
    lastShortlistIds:[],
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
  const novelty = exposure * 1.05;
  const refinement = session.refinementPenalty[candidate.id] || 0;
  return candidate.score - novelty - refinement;
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

  // Restaurant probing stays brief. Two weak establishment reactions switch strategy.
  if (!session.fastMode && session.questionCount < 5 && session.restaurantQuestionsAsked < 3 && session.weakRestaurantReactions < 2) {
    const restaurantId = restaurantQuestionOrder(active, session.askedIds)[0];
    if (restaurantId) return makeRestaurantQuestion(restaurantId);
  }

  // Once the pool is narrow enough, exact-item questions are more useful than broad family labels.
  if (!session.fastMode && session.questionCount >= 10 && active.length <= 14) {
    const candidate = bestCandidateForDirectQuestion(session, active);
    if (candidate) return makeCandidateQuestion(candidate, session.refinementRound);
  }

  const trait = selectTraitQuestion(active, session.askedIds, session.lastDimensions.slice(-2), session.questionCount, session.fastMode);
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
  let penalty = target.family === candidate.family ? 0.42 : 0;
  if (target.subfamily === candidate.subfamily) penalty += 0.32;
  const overlap = (target.tags || []).filter((tag) => candidate.tags.includes(tag)).length;
  penalty += Math.min(0.36, overlap * 0.035);
  return penalty;
}

export function applyReaction(session, question, reactionId) {
  const matches = answerMatcher(question);
  const weight = reactionWeight(session.profile, reactionId);

  session.questionCount += 1;
  session.askedIds.add(question.id?.startsWith('candidate:') ? question.id : question.id?.includes(':') ? question.id : `trait:${question.id}`);
  if (question.type === 'time-context') session.timeQuestionAsked = true;
  if (question.type === 'restaurant') session.restaurantQuestionsAsked += 1;
  if (question.dimension) session.lastDimensions.push(question.dimension);

  if (question.type === 'restaurant' && ['ehhh','nnngh','no','absolutely-not'].includes(reactionId)) session.weakRestaurantReactions += 1;
  if (question.type === 'restaurant' && ['no','absolutely-not'].includes(reactionId)) session.rejectedRestaurants.add(question.restaurantId);
  if (question.type === 'trait' && ['no','absolutely-not'].includes(reactionId)) session.hardExcludedTags.add(question.tag);
  if (question.type === 'candidate' && ['no','absolutely-not'].includes(reactionId)) session.hardRejectedFoods.add(question.candidateId);

  for (const candidate of session.candidates) {
    if (matches(candidate)) {
      candidate.score += weight;
    } else if (weight > 0.6) {
      candidate.score -= weight * 0.12;
    } else if (weight < -0.5) {
      candidate.score += Math.min(0.35, Math.abs(weight) * 0.08);
    }
  }

  // Time of day is context, not a hard restriction. Even Absolutely Not only re-ranks.
  if (question.type === 'time-context') {
    session.hardExcludedTags.delete(question.daypart);
  }

  if (question.type === 'restaurant' && reactionId === 'absolutely-not') {
    const restaurant = restaurantById[question.restaurantId];
    for (const candidate of session.candidates) {
      const categoryOverlap = restaurant?.categories?.some((category) => candidate.tags.includes(category));
      if (categoryOverlap) candidate.score -= 0.45;
    }
  }

  if (question.type === 'candidate' && reactionId === 'absolutely-not') {
    const target = session.candidates.find((candidate) => candidate.id === question.candidateId);
    for (const candidate of session.candidates) candidate.score -= similarityPenalty(target, candidate);
  }

  session.answers.push({ question:{ ...question }, reactionId, matchesCandidate:matches });
  return session;
}

export function rejectFood(session, candidateId) {
  session.hardRejectedFoods.add(candidateId);
  const candidate = session.candidates.find((item) => item.id === candidateId);
  if (candidate) candidate.score = -999;
}

export function noteShortlistShown(session, candidateIds=[]) {
  session.lastShortlistIds = [...candidateIds];
  for (const id of candidateIds) session.shortlistExposure[id] = (session.shortlistExposure[id] || 0) + 1;
}

export function beginRefinement(session, candidateIds=session.lastShortlistIds) {
  session.refinementMode = true;
  session.refinementRound += 1;
  session.lastShortlistIds = [...candidateIds];
  session.maxQuestions = Math.max(session.maxQuestions, session.questionCount + 6);
  for (const id of candidateIds) {
    if (!session.hardRejectedFoods.has(id)) session.refinementPenalty[id] = (session.refinementPenalty[id] || 0) + 0.8;
  }
  return session;
}

export function getShortlist(session, limit=3) {
  const active = availableCandidates(session)
    .map((candidate) => ({ ...candidate, _rankingScore:rankingScore(session, candidate) }))
    .sort((a,b) => b._rankingScore - a._rankingScore || b.score - a.score || a.name.localeCompare(b.name));

  const top = active.slice(0, limit);
  if (!top.length) return [];
  const high = top[0]._rankingScore;
  const low = top[top.length - 1]._rankingScore;
  const span = Math.max(1, high - low);

  return top.map((candidate, index) => {
    const relative = top.length === 1 ? 1 : (candidate._rankingScore - low) / span;
    const compatibility = Math.round(Math.max(38, Math.min(96, 58 + candidate.score * 6 + relative * 16)));
    const label = index === 0 && compatibility >= 74 ? 'Strong Match' : compatibility >= 62 ? 'Good Match' : 'Possible Match';
    const viableRestaurants = (candidate.restaurants || []).filter((id) => !session.rejectedRestaurants.has(id));
    const { _rankingScore, ...clean } = candidate;
    return { ...clean, compatibility, label, viableRestaurants };
  });
}

export function remainingCount(session) {
  return availableCandidates(session).length;
}

export function activeCandidates(session) {
  return availableCandidates(session).map((candidate) => ({...candidate}));
}
