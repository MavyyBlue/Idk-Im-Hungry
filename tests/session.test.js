import test from 'node:test';
import assert from 'node:assert/strict';
import { createSession, applyReaction, getShortlist, rejectFood } from '../src/engine/session.js';
import { reactionWeight } from '../src/engine/reactions.js';

const profile = {
  selectedFoods:{}, rejectedFoods:{},
  ambiguousLearning:{ shrug:{matched:0,total:0}, ehhh:{matched:0,total:0}, nnngh:{matched:0,total:0} }
};

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

test('Absolutely Not on a trait removes matching foods from shortlist', () => {
  const session = createSession({ profile, fastMode:true });
  applyReaction(session, { id:'sweet', type:'trait', tag:'sweet', dimension:'flavor', prompt:'Sweet?' }, 'absolutely-not');
  const shortlist = getShortlist(session, 20);
  assert.ok(shortlist.every((food) => !food.tags.includes('sweet')));
});

test('hard food rejection removes the exact candidate', () => {
  const session = createSession({ profile, fastMode:true });
  rejectFood(session, 'burger');
  const shortlist = getShortlist(session, 40);
  assert.equal(shortlist.some((food) => food.id === 'burger'), false);
});

test('positive crunchy reaction raises crunchy foods', () => {
  const session = createSession({ profile, fastMode:true });
  applyReaction(session, { id:'crunchy', type:'trait', tag:'crunchy', dimension:'texture', prompt:'Crunchy?' }, 'definitely');
  const shortlist = getShortlist(session, 3);
  assert.ok(shortlist.some((food) => food.tags.includes('crunchy')));
});
