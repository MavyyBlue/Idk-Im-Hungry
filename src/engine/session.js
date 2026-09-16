import { foods } from '../data/foods.js';
import { restaurantById } from '../data/restaurants.js';
import { reactionWeight } from './reactions.js';
import { makeCandidateQuestion, makeRestaurantQuestion, restaurantQuestionOrder, selectTraitQuestion } from './questions.js';

const profileBias = (profile, food) => {
  const selected = (profile?.selectedFoods?.[food.id] || 0) * 0.18;
  const rejected = (profile?.rejectedFoods?.[food.id] || 0) * 0.08;
  const family = Math.min(0.55, (profile?.familyAffinity?.[food.family] || 0) * 0.07);
  const tags = food.tags.reduce((sum, tag) => sum + Math.min(0.06, (profile?.tagAffinity?.[tag] || 0) * 0.008), 0);
  return selected + family + Math.min(0.35, tags) - rejected;
};

const cloneCandidates = (profile) => foods.map((food) => ({ ...food, score:profileBias(profile, food) }));

export function createSession({ mode='self', fastMode=false, profile }) {
  return {
    mode,
    fastMode,
    profile,
    candidates:cloneCandidates(profile),
    answers:[],
    askedIds:new Set(),
    rejectedRestaurants:new Set(),
    hardExcludedTags:new Set(),
    hardRejectedFoods:new Set(),
    questionCount:0,
    restaurantQuestionsAsked:0,
    weakRestaurantReactions:0,
    maxQuestions:fastMode ? 7 : 24,
    lastDimensions:[]
  };
}

function availableCandidates(session) {
  return session.candidates.filter((candidate) => {
    if (session.hardRejectedFoods.has(candidate.id)) return false;
    if ([...session.hardExcludedTags].some((tag) => candidate.tags.includes(tag))) return false;
    if (candidate.restaurants.length && candidate.restaurants.every((id) => session.rejectedRestaurants.has(id))) return false;
    return true;
  });
}

function bestCandidateForDirectQuestion(session, active) {
  return [...active]
    .filter((candidate) => !session.askedIds.has(`candidate:${candidate.id}`))
    .sort((a,b) => b.score - a.score || a.name.localeCompare(b.name))[0] || null;
}

export function getNextQuestion(session) {
  const active = availableCandidates(session);
  if (session.questionCount >= session.maxQuestions || active.length <= 3) return null;

  // Restaurant probing is intentionally brief. Two weak establishment reactions
  // switch strategy instead of repeatedly throwing restaurant names at the user.
  if (!session.fastMode && session.questionCount < 4 && session.restaurantQuestionsAsked < 3 && session.weakRestaurantReactions < 2) {
    const restaurantId = restaurantQuestionOrder(active, session.askedIds)[0];
    if (restaurantId) return makeRestaurantQuestion(restaurantId);
  }

  // Once the pool is meaningfully narrow, ask about exact foods/items rather than
  // stopping at a family such as "cake" or "burger".
  if (!session.fastMode && session.questionCount >= 9 && active.length <= 12) {
    const candidate = bestCandidateForDirectQuestion(session, active);
    if (candidate) return makeCandidateQuestion(candidate);
  }

  const trait = selectTraitQuestion(active, session.askedIds, session.lastDimensions.slice(-2), session.questionCount, session.fastMode);
  if (trait) return { ...trait, type:'trait' };

  if (!session.fastMode) {
    const candidate = bestCandidateForDirectQuestion(session, active);
    if (candidate) return makeCandidateQuestion(candidate);
  }
  return null;
}

function answerMatcher(question) {
  if (question.type === 'restaurant') return (candidate) => candidate.restaurants.includes(question.restaurantId);
  if (question.type === 'candidate') return (candidate) => candidate.id === question.candidateId;
  return (candidate) => candidate.tags.includes(question.tag);
}

function similarityPenalty(target, candidate) {
  if (!target || target.id === candidate.id) return 0;
  let penalty = target.family === candidate.family ? 0.42 : 0;
  if (target.subfamily === candidate.subfamily) penalty += 0.32;
  const overlap = target.tags.filter((tag) => candidate.tags.includes(tag)).length;
  penalty += Math.min(0.36, overlap * 0.035);
  return penalty;
}

export function applyReaction(session, question, reactionId) {
  const matches = answerMatcher(question);
  const weight = reactionWeight(session.profile, reactionId);

  session.questionCount += 1;
  session.askedIds.add(question.id?.includes(':') ? question.id : `trait:${question.id}`);
  if (question.type === 'restaurant') session.restaurantQuestionsAsked += 1;
  if (question.dimension) session.lastDimensions.push(question.dimension);

  if (question.type === 'restaurant' && ['ehhh','nnngh','no','absolutely-not'].includes(reactionId)) {
    session.weakRestaurantReactions += 1;
  }
  if (question.type === 'restaurant' && ['no','absolutely-not'].includes(reactionId)) {
    session.rejectedRestaurants.add(question.restaurantId);
  }
  if (question.type === 'trait' && ['no','absolutely-not'].includes(reactionId)) {
    session.hardExcludedTags.add(question.tag);
  }
  if (question.type === 'candidate' && ['no','absolutely-not'].includes(reactionId)) {
    session.hardRejectedFoods.add(question.candidateId);
  }

  for (const candidate of session.candidates) {
    if (matches(candidate)) {
      candidate.score += weight;
    } else if (weight > 0.6) {
      candidate.score -= weight * 0.12;
    } else if (weight < -0.5) {
      candidate.score += Math.min(0.35, Math.abs(weight) * 0.08);
    }
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

export function getShortlist(session, limit=3) {
  const active = availableCandidates(session)
    .map((candidate) => ({ ...candidate }))
    .sort((a,b) => b.score - a.score || a.name.localeCompare(b.name));

  const top = active.slice(0, limit);
  if (!top.length) return [];
  const high = top[0].score;
  const low = top[top.length - 1].score;
  const span = Math.max(1, high - low);

  return top.map((candidate, index) => {
    const relative = top.length === 1 ? 1 : (candidate.score - low) / span;
    const compatibility = Math.round(Math.max(38, Math.min(96, 58 + candidate.score * 6 + relative * 16)));
    const label = index === 0 && compatibility >= 74 ? 'Strong Match' : compatibility >= 62 ? 'Good Match' : 'Possible Match';
    const viableRestaurants = candidate.restaurants.filter((id) => !session.rejectedRestaurants.has(id));
    return { ...candidate, compatibility, label, viableRestaurants };
  });
}

export function remainingCount(session) {
  return availableCandidates(session).length;
}

export function activeCandidates(session) {
  return availableCandidates(session).map((candidate) => ({...candidate}));
}
