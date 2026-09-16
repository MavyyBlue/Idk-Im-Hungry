import { foods } from '../data/foods.js';
import { restaurantById } from '../data/restaurants.js';
import { reactionWeight } from './reactions.js';
import { makeRestaurantQuestion, restaurantQuestionOrder, selectTraitQuestion } from './questions.js';

const cloneCandidates = (profile) => foods.map((food) => ({
  ...food,
  score: ((profile?.selectedFoods?.[food.id] || 0) * 0.18) - ((profile?.rejectedFoods?.[food.id] || 0) * 0.08)
}));

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
    maxQuestions:fastMode ? 6 : 9,
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

export function getNextQuestion(session) {
  const active = availableCandidates(session);
  if (session.questionCount >= session.maxQuestions || active.length <= 3) return null;

  if (!session.fastMode && session.restaurantQuestionsAsked < 4) {
    const restaurantId = restaurantQuestionOrder(active, session.askedIds)[0];
    if (restaurantId) return makeRestaurantQuestion(restaurantId);
  }

  const trait = selectTraitQuestion(active, session.askedIds, session.lastDimensions.slice(-2));
  if (!trait) return null;
  return { ...trait, type:'trait' };
}

function answerMatcher(question) {
  if (question.type === 'restaurant') {
    return (candidate) => candidate.restaurants.includes(question.restaurantId);
  }
  return (candidate) => candidate.tags.includes(question.tag);
}

export function applyReaction(session, question, reactionId) {
  const matches = answerMatcher(question);
  const weight = reactionWeight(session.profile, reactionId);

  session.questionCount += 1;
  session.askedIds.add(question.type === 'restaurant' ? question.id : `trait:${question.id}`);
  if (question.type === 'restaurant') session.restaurantQuestionsAsked += 1;
  if (question.dimension) session.lastDimensions.push(question.dimension);

  if (question.type === 'restaurant' && ['no','absolutely-not'].includes(reactionId)) {
    session.rejectedRestaurants.add(question.restaurantId);
  }
  if (question.type === 'trait' && reactionId === 'absolutely-not') {
    session.hardExcludedTags.add(question.tag);
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
      const categoryOverlap = restaurant.categories.some((category) => candidate.tags.includes(category));
      if (categoryOverlap) candidate.score -= 0.45;
    }
  }

  session.answers.push({
    question:{ ...question },
    reactionId,
    matchesCandidate:matches
  });
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
