import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createAccount, deleteSafeFood, getActiveAccount, listAccounts, loadProfile,
  parseKeywords, setActiveAccount, toggleSafeFoodHidden, upsertSafeFood
} from '../src/storage/profile.js';

class MemoryStorage {
  constructor() { this.data = new Map(); }
  getItem(key) { return this.data.has(key) ? this.data.get(key) : null; }
  setItem(key, value) { this.data.set(key, String(value)); }
  removeItem(key) { this.data.delete(key); }
  clear() { this.data.clear(); }
}

globalThis.localStorage = new MemoryStorage();

test('legacy V0.2 self profile migrates into the local Me account', () => {
  localStorage.clear();
  localStorage.setItem('idk-im-hungry:profiles:v1', JSON.stringify({ self:{ selectedFoods:{'classic-cheeseburger':2}, recentSelections:['classic-cheeseburger'] } }));
  const account = getActiveAccount();
  assert.equal(account.name, 'Me');
  assert.equal(loadProfile(account.id).selectedFoods['classic-cheeseburger'], 2);
});

test('accounts can be created and selected independently', () => {
  localStorage.clear();
  getActiveAccount();
  const helper = createAccount('Sam','helper');
  assert.equal(helper.name, 'Sam');
  assert.equal(helper.role, 'helper');
  assert.ok(listAccounts().length >= 2);
  setActiveAccount('me');
  assert.equal(getActiveAccount().id, 'me');
});

test('Safe Foods support keywords, edit, hide, unhide, and delete', () => {
  localStorage.clear();
  const account = getActiveAccount();
  const food = upsertSafeFood(account.id, {
    name:'My exact thing', family:'burger', sourceLabel:'Home', keywords:'salty, savory, handheld, dinner'
  });
  assert.deepEqual(parseKeywords('salty, savory, salty'), ['salty','savory']);
  let profile = loadProfile(account.id);
  assert.equal(profile.safeFoods.length, 1);
  assert.ok(profile.safeFoods[0].tags.includes('dinner'));

  upsertSafeFood(account.id, { id:food.id, name:'My edited exact thing', family:'burger', keywords:['salty','handheld'] });
  profile = loadProfile(account.id);
  assert.equal(profile.safeFoods[0].name, 'My edited exact thing');

  toggleSafeFoodHidden(account.id, food.id);
  assert.equal(loadProfile(account.id).safeFoods[0].hidden, true);
  toggleSafeFoodHidden(account.id, food.id);
  assert.equal(loadProfile(account.id).safeFoods[0].hidden, false);

  deleteSafeFood(account.id, food.id);
  assert.equal(loadProfile(account.id).safeFoods.length, 0);
});
