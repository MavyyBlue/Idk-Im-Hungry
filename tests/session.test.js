import test from 'node:test';
import assert from 'node:assert/strict';
import { foods, foodById } from '../src/data/foods.js';
import {
  activeCandidates, applyReaction, beginRefinement, createSession, getNextQuestion,
  getShortlist, noteShortlistShown, rejectFood, replaceShortlistItem
} from '../src/engine/session.js';
import { reactionWeight, sliderMood, sliderWeight } from '../src/engine/reactions.js';
import { selectTraitQuestion } from '../src/engine/questions.js';

const profile = {
  selectedFoods:{}, rejectedFoods:{}, familyAffinity:{}, tagAffinity:{}, safeFoods:[], unsafeKeywords:[],
  ambiguousLearning:{ shrug:{matched:0,total:0}, ehhh:{matched:0,total:0}, nnngh:{matched:0,total:0} }
};

function answerTime(session, reaction=78) {
  const q = getNextQuestion(session);
  assert.equal(q.type, 'time-context');
  applyReaction(session, q, reaction);
}

test('dataset expands to at least 500 specific candidates with unique ids', () => {
  assert.ok(foods.length >= 500);
  assert.equal(new Set(foods.map((food) => food.id)).size, foods.length);
  assert.ok(foods.every((food) => food.family && food.subfamily && Array.isArray(food.tags)));
});

test('Walmart Chantilly cake exists as a specific berry/cream cake leaf', () => {
  const cake = foodById['walmart-chantilly-berries-cake'];
  assert.ok(cake);
  assert.equal(cake.family, 'cake');
  assert.ok(cake.tags.includes('berries'));
  assert.ok(cake.tags.includes('whipped-frosting'));
  assert.ok(cake.restaurants.includes('walmart'));
});

test('slider starts neutral at Ehhh and ends at hard semantic poles', () => {
  assert.equal(sliderMood(0).id, 'absolutely-not');
  assert.equal(sliderMood(50).id, 'ehhh');
  assert.equal(sliderMood(100).id, 'absolutely-yes');
  assert.equal(sliderWeight(profile, 50), 0);
});

test('negative slider evidence is harsher than symmetric positive evidence', () => {
  assert.ok(Math.abs(sliderWeight(profile, 20)) > sliderWeight(profile, 80));
  assert.ok(sliderWeight(profile, 20) < 0);
  assert.ok(sliderWeight(profile, 80) > 0);
});

test('legacy ambiguous vocabulary stays ordered and learnable', () => {
  assert.ok(reactionWeight(profile, 'shrug') > reactionWeight(profile, 'ehhh'));
  assert.ok(reactionWeight(profile, 'ehhh') > reactionWeight(profile, 'nnngh'));
  assert.ok(reactionWeight(profile, 'nnngh') > reactionWeight(profile, 'no'));
  const learned = structuredClone(profile);
  learned.ambiguousLearning.ehhh = { matched:8, total:10 };
  assert.ok(reactionWeight(learned, 'ehhh') > reactionWeight(profile, 'ehhh'));
  assert.equal(reactionWeight(learned, 'no'), reactionWeight(profile, 'no'));
});

test('time of day is always the first question', () => {
  const session = createSession({ profile, fastMode:false, localHour:18 });
  const q = getNextQuestion(session);
  assert.equal(q.type, 'time-context');
  assert.equal(q.daypart, 'dinner');
});

test('evening dinner preference does not hard-eliminate breakfast foods', () => {
  const session = createSession({ profile, fastMode:false, localHour:18 });
  answerTime(session, 84);
  assert.ok(activeCandidates(session).some((food) => food.tags.includes('breakfast-food')));
});

test('below-middle trait response lowers matching foods without eliminating them', () => {
  const session = createSession({ profile, fastMode:false });
  const chicken = session.candidates.find((food) => food.tags.includes('chicken'));
  const before = chicken.score;
  applyReaction(session, { id:'chicken', type:'trait', tag:'chicken', dimension:'family', prompt:'Chicken?' }, 28);
  assert.ok(chicken.score < before);
  assert.ok(activeCandidates(session).some((food) => food.tags.includes('chicken')));
});

test('far-left trait response hard-eliminates every matching candidate', () => {
  const session = createSession({ profile, fastMode:true });
  applyReaction(session, { id:'sweet', type:'trait', tag:'sweet', dimension:'flavor', prompt:'Sweet?' }, 0);
  assert.ok(activeCandidates(session).every((food) => !food.tags.includes('sweet')));
});

test('negative evidence does not give unrelated candidates a free score boost', () => {
  const session = createSession({ profile, fastMode:false });
  const chicken = session.candidates.find((food) => food.tags.includes('chicken'));
  const unrelated = session.candidates.find((food) => !food.tags.includes('chicken'));
  const beforeChicken = chicken.score;
  const beforeUnrelated = unrelated.score;
  applyReaction(session, { id:'chicken', type:'trait', tag:'chicken', dimension:'family', prompt:'Chicken?' }, 24);
  assert.ok(chicken.score < beforeChicken);
  assert.equal(unrelated.score, beforeUnrelated);
});

test('weak survivors are allowed to display genuinely low compatibility', () => {
  const session = createSession({ profile, fastMode:false });
  for (const candidate of session.candidates) candidate.score = -5;
  const shortlist = getShortlist(session, 3);
  assert.ok(shortlist.every((food) => food.compatibility < 38));
});

test('hard food rejection sets the exact candidate to zero-session viability', () => {
  const session = createSession({ profile, fastMode:true });
  rejectFood(session, 'classic-cheeseburger');
  const candidate = session.candidates.find((food) => food.id === 'classic-cheeseburger');
  assert.equal(candidate.score, -999);
  const shortlist = getShortlist(session, foods.length);
  assert.equal(shortlist.some((food) => food.id === 'classic-cheeseburger'), false);
});

test('direct candidate only hard-rejects at the far-left slider zone', () => {
  const soft = createSession({ profile, fastMode:false });
  applyReaction(soft, { id:'candidate:0:bacon-cheeseburger', type:'candidate', candidateId:'bacon-cheeseburger', dimension:'specific-item', prompt:'Bacon cheeseburger?' }, 18);
  assert.equal(activeCandidates(soft).some((food) => food.id === 'bacon-cheeseburger'), true);

  const hard = createSession({ profile, fastMode:false });
  applyReaction(hard, { id:'candidate:0:bacon-cheeseburger', type:'candidate', candidateId:'bacon-cheeseburger', dimension:'specific-item', prompt:'Bacon cheeseburger?' }, 0);
  assert.equal(activeCandidates(hard).some((food) => food.id === 'bacon-cheeseburger'), false);
});

test('positive crunchy reaction raises crunchy foods', () => {
  const session = createSession({ profile, fastMode:true });
  applyReaction(session, { id:'crunchy', type:'trait', tag:'crunchy', dimension:'texture', prompt:'Crunchy?' }, 92);
  const shortlist = getShortlist(session, 3);
  assert.ok(shortlist.some((food) => food.tags.includes('crunchy')));
});

test('normal mode supports deeper questioning and fast mode stays bounded', () => {
  assert.equal(createSession({ profile, fastMode:false }).maxQuestions, 28);
  assert.equal(createSession({ profile, fastMode:true }).maxQuestions, 8);
});

test('two adverse restaurant reactions switch away from restaurant interrogation', () => {
  const session = createSession({ profile, fastMode:false, localHour:12 });
  answerTime(session, 76);
  const q1 = getNextQuestion(session);
  assert.equal(q1.type, 'restaurant');
  applyReaction(session, q1, 42);
  const q2 = getNextQuestion(session);
  assert.equal(q2.type, 'restaurant');
  applyReaction(session, q2, 30);
  const q3 = getNextQuestion(session);
  assert.notEqual(q3?.type, 'restaurant');
});

test('an answered question cannot immediately reappear', () => {
  const session = createSession({ profile, fastMode:true, localHour:12 });
  answerTime(session, 50);
  const q1 = getNextQuestion(session);
  assert.ok(q1);
  applyReaction(session, q1, 32);
  const q2 = getNextQuestion(session);
  assert.ok(q2);
  assert.notEqual(q2.id, q1.id);
});

test('deep cake questions become eligible inside a cake-heavy branch', () => {
  const cakes = foods.filter((food) => food.family === 'cake');
  const asked = new Set(['trait:sweet','trait:cold','trait:soft','trait:cake','trait:chocolate','trait:fruit']);
  const q = selectTraitQuestion(cakes, asked, [], 17, false, {});
  assert.ok(q);
  assert.ok(['berries','cream','whipped-frosting','cream-cheese','layered-cake','cheesecake','vanilla','strawberry','frosting','very-sweet'].includes(q.id));
});

test('shown finalists are deliberately deprioritized when Keep Drilling begins', () => {
  const session = createSession({ profile, fastMode:false, localHour:18 });
  answerTime(session, 78);
  const first = getShortlist(session, 3);
  noteShortlistShown(session, first.map((food) => food.id));
  beginRefinement(session, first.map((food) => food.id));
  const second = getShortlist(session, 3);
  assert.notDeepEqual(second.map((food) => food.id), first.map((food) => food.id));
});

test('Nope replaces only the rejected shortlist slot and preserves the other two', () => {
  const session = createSession({ profile, fastMode:false, localHour:18 });
  answerTime(session, 78);
  const first = getShortlist(session, 3);
  const ids = first.map((food) => food.id);
  noteShortlistShown(session, ids);
  rejectFood(session, ids[1]);
  const nextIds = replaceShortlistItem(session, ids, ids[1]);
  assert.equal(nextIds[0], ids[0]);
  assert.equal(nextIds[2], ids[2]);
  assert.notEqual(nextIds[1], ids[1]);
  assert.equal(getShortlist(session, foods.length).some((food) => food.id === ids[1]), false);
});

test('Nope followed by Keep Drilling produces another question and rejected food never returns', () => {
  const session = createSession({ profile, fastMode:false, localHour:18 });
  answerTime(session, 78);
  const first = getShortlist(session, 3);
  noteShortlistShown(session, first.map((food) => food.id));
  rejectFood(session, first[0].id);
  const stableIds = replaceShortlistItem(session, first.map((food) => food.id), first[0].id);
  beginRefinement(session, stableIds);
  const q = getNextQuestion(session);
  assert.ok(q);
  assert.equal(getShortlist(session, foods.length).some((food) => food.id === first[0].id), false);
});

test('visible Safe Foods join the candidate universe and hidden Safe Foods do not', () => {
  const safeProfile = structuredClone(profile);
  safeProfile.safeFoods = [
    { id:'safe-visible', name:'Visible safe food', emoji:'🍴', family:'burger', subfamily:'custom', restaurants:[], customTags:['savory','handheld'], tags:['burger','custom','safe-food','savory','handheld'], hidden:false, userAdded:true },
    { id:'safe-hidden', name:'Hidden safe food', emoji:'🍴', family:'cake', subfamily:'custom', restaurants:[], customTags:['sweet'], tags:['cake','custom','safe-food','sweet'], hidden:true, userAdded:true }
  ];
  const session = createSession({ profile:safeProfile });
  const ids = new Set(activeCandidates(session).map((food) => food.id));
  assert.equal(ids.has('safe-visible'), true);
  assert.equal(ids.has('safe-hidden'), false);
});

test('Safe Foods obey the same far-left elimination rules as built-ins', () => {
  const safeProfile = structuredClone(profile);
  safeProfile.safeFoods = [
    { id:'safe-chicken', name:'My chicken thing', emoji:'🍗', family:'chicken', subfamily:'custom', restaurants:[], customTags:['chicken','savory'], tags:['chicken','custom','safe-food','savory'], hidden:false, userAdded:true }
  ];
  const session = createSession({ profile:safeProfile });
  applyReaction(session, { id:'chicken', type:'trait', tag:'chicken', dimension:'family', prompt:'Chicken?' }, 0);
  assert.equal(activeCandidates(session).some((food) => food.id === 'safe-chicken'), false);
});


test('Literal Unsafe Foods removes shellfish without banning ordinary fish', () => {
  const unsafeProfile = structuredClone(profile);
  unsafeProfile.unsafeKeywords = ['shellfish'];
  const session = createSession({ profile:unsafeProfile });
  const active = activeCandidates(session);
  assert.equal(active.some((food) => food.tags.includes('shellfish') || food.tags.includes('shrimp') || food.tags.includes('crab') || food.tags.includes('lobster')), false);
  assert.equal(active.some((food) => food.tags.includes('salmon') || food.tags.includes('fish')), true);
});

test('peanut butter unsafe keyword removes peanut and peanut-butter candidates', () => {
  const unsafeProfile = structuredClone(profile);
  unsafeProfile.unsafeKeywords = ['peanut-butter'];
  const session = createSession({ profile:unsafeProfile });
  const active = activeCandidates(session);
  assert.equal(active.some((food) => food.tags.includes('peanut') || food.tags.includes('peanut-butter')), false);
});

test('Literal Unsafe Foods overrides a matching Safe Food', () => {
  const unsafeProfile = structuredClone(profile);
  unsafeProfile.unsafeKeywords = ['shellfish'];
  unsafeProfile.safeFoods = [
    { id:'safe-shrimp', name:'My safe shrimp', emoji:'🍤', family:'seafood', subfamily:'custom', restaurants:[], customTags:['shrimp','shellfish'], tags:['seafood','custom','safe-food','shrimp','shellfish'], hidden:false, userAdded:true }
  ];
  const session = createSession({ profile:unsafeProfile });
  assert.equal(activeCandidates(session).some((food) => food.id === 'safe-shrimp'), false);
});

test('focused questioning can still reach the niche Walmart Chantilly cake inside the 500+ catalog', () => {
  const target = foodById['walmart-chantilly-berries-cake'];
  const session = createSession({ profile, fastMode:false, localHour:18 });
  const targetMatches = (question) => {
    if (question.type === 'candidate') return question.candidateId === target.id;
    if (question.type === 'restaurant') return target.restaurants.includes(question.restaurantId);
    if (question.type === 'time-context') return question.daypart === 'dinner' ? target.tags.includes('meal') : target.tags.includes(question.daypart);
    return target.tags.includes(question.tag);
  };
  for (let i=0; i<session.maxQuestions; i += 1) {
    const question = getNextQuestion(session);
    if (!question) break;
    applyReaction(session, question, targetMatches(question) ? 92 : 22);
  }
  const shortlist = getShortlist(session, 3);
  assert.ok(shortlist.some((food) => food.id === target.id));
});

test('expanded catalog has unique display names as well as unique ids', () => {
  assert.equal(new Set(foods.map((food) => food.name.toLowerCase())).size, foods.length);
});
