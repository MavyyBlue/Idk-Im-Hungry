import test from 'node:test';
import assert from 'node:assert/strict';
import { foods, foodById } from '../src/data/foods.js';
import {
  activeCandidates, applyReaction, beginRefinement, createSession, getNextQuestion,
  getShortlist, noteShortlistShown, rejectFood
} from '../src/engine/session.js';
import { reactionWeight } from '../src/engine/reactions.js';
import { selectTraitQuestion } from '../src/engine/questions.js';

const profile = {
  selectedFoods:{}, rejectedFoods:{}, familyAffinity:{}, tagAffinity:{}, safeFoods:[],
  ambiguousLearning:{ shrug:{matched:0,total:0}, ehhh:{matched:0,total:0}, nnngh:{matched:0,total:0} }
};

function answerTime(session, reaction='sure') {
  const q = getNextQuestion(session);
  assert.equal(q.type, 'time-context');
  applyReaction(session, q, reaction);
}

test('dataset expands to over 100 specific candidates with unique ids', () => {
  assert.ok(foods.length >= 100);
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

test('ambiguous reactions stay distinct and are not treated as No', () => {
  assert.ok(reactionWeight(profile, 'shrug') > reactionWeight(profile, 'ehhh'));
  assert.ok(reactionWeight(profile, 'ehhh') > reactionWeight(profile, 'nnngh'));
  assert.ok(reactionWeight(profile, 'nnngh') > reactionWeight(profile, 'no'));
});

test('learned ambiguous responses can become more positive', () => {
  const learned = structuredClone(profile);
  learned.ambiguousLearning.ehhh = { matched:8, total:10 };
  assert.ok(reactionWeight(learned, 'ehhh') > reactionWeight(profile, 'ehhh'));
  assert.equal(reactionWeight(learned, 'no'), -2);
});

test('time of day is always the first question', () => {
  const session = createSession({ profile, fastMode:false, localHour:18 });
  const q = getNextQuestion(session);
  assert.equal(q.type, 'time-context');
  assert.equal(q.daypart, 'dinner');
});

test('evening dinner preference does not hard-eliminate breakfast foods', () => {
  const session = createSession({ profile, fastMode:false, localHour:18 });
  answerTime(session, 'sure');
  assert.ok(activeCandidates(session).some((food) => food.tags.includes('breakfast-food')));
});

test('Absolutely Not on a trait removes every matching candidate', () => {
  const session = createSession({ profile, fastMode:true });
  applyReaction(session, { id:'sweet', type:'trait', tag:'sweet', dimension:'flavor', prompt:'Sweet?' }, 'absolutely-not');
  assert.ok(activeCandidates(session).every((food) => !food.tags.includes('sweet')));
});

test('No on an explicit trait eliminates that property for the current session', () => {
  const session = createSession({ profile, fastMode:false });
  applyReaction(session, { id:'chicken', type:'trait', tag:'chicken', dimension:'family', prompt:'Chicken?' }, 'no');
  assert.ok(activeCandidates(session).every((food) => !food.tags.includes('chicken')));
});

test('hard food rejection removes the exact candidate', () => {
  const session = createSession({ profile, fastMode:true });
  rejectFood(session, 'classic-cheeseburger');
  const shortlist = getShortlist(session, foods.length);
  assert.equal(shortlist.some((food) => food.id === 'classic-cheeseburger'), false);
});

test('direct candidate No is authoritative', () => {
  const session = createSession({ profile, fastMode:false });
  applyReaction(session, { id:'candidate:0:bacon-cheeseburger', type:'candidate', candidateId:'bacon-cheeseburger', dimension:'specific-item', prompt:'Bacon cheeseburger?' }, 'no');
  assert.equal(activeCandidates(session).some((food) => food.id === 'bacon-cheeseburger'), false);
});

test('positive crunchy reaction raises crunchy foods', () => {
  const session = createSession({ profile, fastMode:true });
  applyReaction(session, { id:'crunchy', type:'trait', tag:'crunchy', dimension:'texture', prompt:'Crunchy?' }, 'definitely');
  const shortlist = getShortlist(session, 3);
  assert.ok(shortlist.some((food) => food.tags.includes('crunchy')));
});

test('normal mode supports deeper questioning and fast mode stays bounded', () => {
  assert.equal(createSession({ profile, fastMode:false }).maxQuestions, 28);
  assert.equal(createSession({ profile, fastMode:true }).maxQuestions, 8);
});

test('two weak restaurant reactions switch away from restaurant interrogation', () => {
  const session = createSession({ profile, fastMode:false, localHour:12 });
  answerTime(session, 'sure');
  const q1 = getNextQuestion(session);
  assert.equal(q1.type, 'restaurant');
  applyReaction(session, q1, 'ehhh');
  const q2 = getNextQuestion(session);
  assert.equal(q2.type, 'restaurant');
  applyReaction(session, q2, 'nnngh');
  const q3 = getNextQuestion(session);
  assert.notEqual(q3?.type, 'restaurant');
});

test('deep cake questions become eligible inside a cake-heavy branch', () => {
  const cakes = foods.filter((food) => food.family === 'cake');
  const asked = new Set(['trait:sweet','trait:cold','trait:soft','trait:cake','trait:chocolate','trait:fruit']);
  const q = selectTraitQuestion(cakes, asked, [], 17, false);
  assert.ok(q);
  assert.ok(['berries','cream','whipped-frosting','cream-cheese','layered-cake','cheesecake','vanilla','strawberry','frosting','very-sweet'].includes(q.id));
});

test('shown finalists are deliberately deprioritized when Keep Drilling begins', () => {
  const session = createSession({ profile, fastMode:false, localHour:18 });
  answerTime(session, 'sure');
  const first = getShortlist(session, 3);
  noteShortlistShown(session, first.map((food) => food.id));
  beginRefinement(session, first.map((food) => food.id));
  const second = getShortlist(session, 3);
  assert.notDeepEqual(second.map((food) => food.id), first.map((food) => food.id));
});

test('Nope followed by Keep Drilling produces another question and rejected food never returns', () => {
  const session = createSession({ profile, fastMode:false, localHour:18 });
  answerTime(session, 'sure');
  const first = getShortlist(session, 3);
  noteShortlistShown(session, first.map((food) => food.id));
  rejectFood(session, first[0].id);
  beginRefinement(session, first.map((food) => food.id));
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

test('Safe Foods are still eliminated by current-session choice answers', () => {
  const safeProfile = structuredClone(profile);
  safeProfile.safeFoods = [
    { id:'safe-chicken', name:'My chicken thing', emoji:'🍗', family:'chicken', subfamily:'custom', restaurants:[], customTags:['chicken','savory'], tags:['chicken','custom','safe-food','savory'], hidden:false, userAdded:true }
  ];
  const session = createSession({ profile:safeProfile });
  applyReaction(session, { id:'chicken', type:'trait', tag:'chicken', dimension:'family', prompt:'Chicken?' }, 'no');
  assert.equal(activeCandidates(session).some((food) => food.id === 'safe-chicken'), false);
});
