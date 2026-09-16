const STORAGE_KEY = 'idk-im-hungry:profiles:v1';

function emptyProfile() {
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
    recentSelections:[]
  };
}

function safeRead() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function normalizeProfile(raw={}) {
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
    recentSelections:Array.isArray(raw.recentSelections) ? raw.recentSelections : []
  };
}

export function loadProfile(mode = 'self') {
  if (typeof localStorage === 'undefined') return emptyProfile();
  const all = safeRead();
  return normalizeProfile(all[mode] || {});
}

export function saveProfile(mode, profile) {
  if (typeof localStorage === 'undefined') return;
  const all = safeRead();
  all[mode] = normalizeProfile(profile);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function recordSelection(mode, profile, candidate, session) {
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

  saveProfile(mode, next);
  return next;
}

export function recordFoodRejection(mode, profile, candidateId) {
  const next = structuredClone(normalizeProfile(profile));
  next.rejectedFoods[candidateId] = (next.rejectedFoods[candidateId] || 0) + 1;
  saveProfile(mode, next);
  return next;
}
