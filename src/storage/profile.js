const LEGACY_KEY = 'idk-im-hungry:profiles:v1';
const ACCOUNT_KEY = 'idk-im-hungry:accounts:v1';

const slugify = (value='') => String(value)
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'food';

export function emptyProfile() {
  return {
    selectedFoods:{},
    rejectedFoods:{},
    restaurantReactions:{},
    familyAffinity:{},
    tagAffinity:{},
    ambiguousLearning:{
      shrug:{ matched:0, total:0 },
      ehhh:{ matched:0, total:0 },
      nnngh:{ matched:0, total:0 }
    },
    recentSelections:[],
    safeFoods:[]
  };
}

function safeReadKey(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function normalizeProfile(raw={}) {
  const base = emptyProfile();
  return {
    ...base,
    ...raw,
    selectedFoods:{...base.selectedFoods, ...(raw.selectedFoods || {})},
    rejectedFoods:{...base.rejectedFoods, ...(raw.rejectedFoods || {})},
    restaurantReactions:{...base.restaurantReactions, ...(raw.restaurantReactions || {})},
    familyAffinity:{...base.familyAffinity, ...(raw.familyAffinity || {})},
    tagAffinity:{...base.tagAffinity, ...(raw.tagAffinity || {})},
    ambiguousLearning:{...base.ambiguousLearning, ...(raw.ambiguousLearning || {})},
    recentSelections:Array.isArray(raw.recentSelections) ? raw.recentSelections : [],
    safeFoods:Array.isArray(raw.safeFoods) ? raw.safeFoods.map(normalizeSafeFood).filter(Boolean) : []
  };
}

function makeAccount(id, name, role, profile={}) {
  return { id, name, role, profile:normalizeProfile(profile) };
}

function defaultAccountState() {
  return {
    version:1,
    activeAccountId:'me',
    accounts:[makeAccount('me','Me','self',{})]
  };
}

function hasMeaningfulLegacy(profile={}) {
  return Object.keys(profile.selectedFoods || {}).length ||
    Object.keys(profile.rejectedFoods || {}).length ||
    (profile.recentSelections || []).length;
}

function migrateLegacy() {
  const legacy = safeReadKey(LEGACY_KEY);
  const accounts = [makeAccount('me','Me','self',legacy.self || {})];
  if (hasMeaningfulLegacy(legacy.partner || {})) {
    accounts.push(makeAccount('someone-else','Someone else','helper',legacy.partner));
  }
  return { version:1, activeAccountId:'me', accounts };
}

function normalizeAccountState(raw={}) {
  const fallback = defaultAccountState();
  const accounts = Array.isArray(raw.accounts) && raw.accounts.length
    ? raw.accounts.map((account, index) => makeAccount(
        String(account.id || `account-${index + 1}`),
        String(account.name || `Account ${index + 1}`),
        account.role === 'helper' ? 'helper' : 'self',
        account.profile || {}
      ))
    : fallback.accounts;
  const activeAccountId = accounts.some((account) => account.id === raw.activeAccountId)
    ? raw.activeAccountId
    : accounts[0].id;
  return { version:1, activeAccountId, accounts };
}

function readAccountState() {
  if (typeof localStorage === 'undefined') return defaultAccountState();
  const raw = safeReadKey(ACCOUNT_KEY);
  if (Array.isArray(raw.accounts) && raw.accounts.length) return normalizeAccountState(raw);
  const migrated = migrateLegacy();
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(migrated));
  return migrated;
}

function writeAccountState(state) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(normalizeAccountState(state)));
}

export function listAccounts() {
  return readAccountState().accounts.map((account) => ({...account, profile:normalizeProfile(account.profile)}));
}

export function getActiveAccount() {
  const state = readAccountState();
  return state.accounts.find((account) => account.id === state.activeAccountId) || state.accounts[0];
}

export function setActiveAccount(accountId) {
  const state = readAccountState();
  if (state.accounts.some((account) => account.id === accountId)) {
    state.activeAccountId = accountId;
    writeAccountState(state);
  }
  return getActiveAccount();
}

export function createAccount(name, role='helper') {
  const cleanName = String(name || '').trim() || 'New account';
  const state = readAccountState();
  const base = slugify(cleanName);
  let id = base;
  let suffix = 2;
  while (state.accounts.some((account) => account.id === id)) id = `${base}-${suffix++}`;
  state.accounts.push(makeAccount(id, cleanName, role === 'self' ? 'self' : 'helper', {}));
  state.activeAccountId = id;
  writeAccountState(state);
  return getActiveAccount();
}

export function renameAccount(accountId, name) {
  const state = readAccountState();
  const account = state.accounts.find((item) => item.id === accountId);
  if (account && String(name || '').trim()) account.name = String(name).trim();
  writeAccountState(state);
  return getActiveAccount();
}

export function deleteAccount(accountId) {
  const state = readAccountState();
  if (state.accounts.length <= 1) return getActiveAccount();
  state.accounts = state.accounts.filter((account) => account.id !== accountId);
  if (!state.accounts.some((account) => account.id === state.activeAccountId)) {
    state.activeAccountId = state.accounts[0].id;
  }
  writeAccountState(state);
  return getActiveAccount();
}

export function loadProfile(accountId) {
  const state = readAccountState();
  const id = accountId || state.activeAccountId;
  const account = state.accounts.find((item) => item.id === id) || state.accounts[0];
  return normalizeProfile(account.profile);
}

export function saveProfile(accountId, profile) {
  if (typeof localStorage === 'undefined') return;
  const state = readAccountState();
  const id = accountId || state.activeAccountId;
  const account = state.accounts.find((item) => item.id === id) || state.accounts[0];
  account.profile = normalizeProfile(profile);
  writeAccountState(state);
}

function normalizeKeyword(value='') {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function parseKeywords(value) {
  const source = Array.isArray(value) ? value : String(value || '').split(',');
  return [...new Set(source.map(normalizeKeyword).filter(Boolean))];
}

export function normalizeSafeFood(food) {
  if (!food || !food.id || !food.name) return null;
  const customTags = parseKeywords(food.customTags || food.tags || []);
  const family = normalizeKeyword(food.family || customTags.find((tag) => [
    'chicken','burger','mexican','pizza','pasta','sandwich','seafood','breakfast','cake','bakery-sweet','frozen-dessert','snack-side','asian-style','comfort','fresh'
  ].includes(tag)) || 'safe-food');
  const subfamily = normalizeKeyword(food.subfamily || 'custom');
  return {
    id:String(food.id),
    name:String(food.name).trim(),
    emoji:String(food.emoji || '🍴').trim() || '🍴',
    family,
    subfamily,
    restaurants:[],
    sourceLabel:String(food.sourceLabel || '').trim(),
    customTags,
    tags:[...new Set([family, subfamily, 'safe-food', ...customTags])],
    hidden:Boolean(food.hidden),
    userAdded:true,
    createdAt:Number(food.createdAt || Date.now())
  };
}

export function upsertSafeFood(accountId, input) {
  const profile = loadProfile(accountId);
  const existing = input.id ? profile.safeFoods.find((food) => food.id === input.id) : null;
  const baseId = existing?.id || `safe-${Date.now()}-${slugify(input.name).slice(0,24)}`;
  const food = normalizeSafeFood({
    ...existing,
    ...input,
    id:baseId,
    customTags:parseKeywords(input.keywords ?? input.customTags ?? existing?.customTags ?? []),
    createdAt:existing?.createdAt || Date.now()
  });
  profile.safeFoods = [food, ...profile.safeFoods.filter((item) => item.id !== food.id)];
  saveProfile(accountId, profile);
  return food;
}

export function deleteSafeFood(accountId, foodId) {
  const profile = loadProfile(accountId);
  profile.safeFoods = profile.safeFoods.filter((food) => food.id !== foodId);
  saveProfile(accountId, profile);
  return profile;
}

export function toggleSafeFoodHidden(accountId, foodId) {
  const profile = loadProfile(accountId);
  const food = profile.safeFoods.find((item) => item.id === foodId);
  if (food) food.hidden = !food.hidden;
  saveProfile(accountId, profile);
  return profile;
}

export function recordSelection(accountId, profile, candidate, session) {
  const next = structuredClone(normalizeProfile(profile));
  next.selectedFoods[candidate.id] = (next.selectedFoods[candidate.id] || 0) + 1;
  next.familyAffinity[candidate.family] = (next.familyAffinity[candidate.family] || 0) + 1;
  for (const tag of new Set(candidate.tags)) next.tagAffinity[tag] = (next.tagAffinity[tag] || 0) + 1;
  next.recentSelections = [candidate.id, ...(next.recentSelections || []).filter((id) => id !== candidate.id)].slice(0, 5);

  for (const answer of session.answers) {
    if (!['shrug','ehhh','nnngh'].includes(answer.reactionId)) continue;
    const bucket = next.ambiguousLearning[answer.reactionId] || { matched:0, total:0 };
    bucket.total += 1;
    if (answer.matchesCandidate(candidate)) bucket.matched += 1;
    next.ambiguousLearning[answer.reactionId] = bucket;
  }

  saveProfile(accountId, next);
  return next;
}

export function recordFoodRejection(accountId, profile, candidateId) {
  const next = structuredClone(normalizeProfile(profile));
  next.rejectedFoods[candidateId] = (next.rejectedFoods[candidateId] || 0) + 1;
  saveProfile(accountId, next);
  return next;
}
