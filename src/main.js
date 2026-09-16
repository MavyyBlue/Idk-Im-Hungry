import { foodById } from './data/foods.js';
import { restaurantById } from './data/restaurants.js';
import { sliderMood } from './engine/reactions.js';
import { applyReaction, beginRefinement, createSession, getNextQuestion, getShortlist, noteShortlistShown, rejectFood, remainingCount, replaceShortlistItem } from './engine/session.js';
import {
  createAccount, deleteAccount, deleteSafeFood, getActiveAccount, listAccounts, loadProfile,
  recordFoodRejection, recordSelection, renameAccount, setActiveAccount,
  toggleSafeFoodHidden, upsertSafeFood
} from './storage/profile.js';

const app = document.querySelector('#app');
let account = getActiveAccount();
let profile = loadProfile(account.id);
let session = null;
let currentQuestion = null;

const escapeHtml = (value='') => String(value).replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const titleCase = (value='') => String(value).split('-').map((part) => part ? part[0].toUpperCase() + part.slice(1) : '').join(' ');


const SAFE_FOOD_FAMILIES = [
  ['safe-food','Other'], ['chicken','Chicken'], ['burger','Burger'], ['mexican','Mexican'],
  ['pizza','Pizza'], ['breakfast','Breakfast'], ['pasta','Pasta'], ['sandwich','Sandwich'],
  ['asian-style','Asian-style'], ['seafood','Seafood'], ['comfort','Comfort food'], ['fresh','Fresh'],
  ['snack-side','Snack / side'], ['frozen-dessert','Frozen dessert'], ['cake','Cake'], ['bakery-sweet','Bakery sweet']
];

const SAFE_TAG_GROUPS = [
  { label:'Flavor', tags:[['savory','Savory'],['sweet','Sweet'],['salty','Salty'],['sweet-salty','Sweet + salty'],['spicy','Spicy'],['cheesy','Cheesy'],['bbq','BBQ'],['chocolate','Chocolate'],['vanilla','Vanilla'],['fruit','Fruity']] },
  { label:'Texture', tags:[['crunchy','Crunchy'],['crispy','Crispy'],['soft','Soft'],['chewy','Chewy'],['creamy','Creamy'],['saucy','Saucy']] },
  { label:'Temperature', tags:[['hot','Hot'],['cold','Cold']] },
  { label:'Meal', tags:[['breakfast-food','Breakfast'],['lunch','Lunch'],['dinner','Dinner'],['meal','Meal'],['snack','Snack'],['dessert','Dessert'],['late-night','Late night']] },
  { label:'Protein', tags:[['chicken','Chicken'],['beef','Beef'],['pork','Pork / bacon'],['seafood','Seafood'],['fish','Fish'],['shrimp','Shrimp'],['vegetarian','No meat']] },
  { label:'Format', tags:[['handheld','Handheld'],['bowl','Bowl'],['plate','Plate + fork'],['bread','Bready'],['tortilla','Tortilla'],['rice','Rice'],['noodles','Noodles'],['shareable','Shareable']] },
  { label:'Feel', tags:[['light','Light'],['filling','Filling'],['very-filling','Very filling'],['comfort','Comfort food'],['fresh','Fresh']] },
  { label:'Effort', tags:[['quick','Quick'],['drive-thru','Drive-thru'],['sit-down','Sit-down'],['grocery-bakery','Grocery bakery'],['at-home','At home']] }
];

function familyOptions(selected='safe-food') {
  const options = [...SAFE_FOOD_FAMILIES];
  if (selected && !options.some(([value]) => value === selected)) options.push([selected, titleCase(selected)]);
  return options.map(([value,label]) => `<option value="${value}" ${selected === value ? 'selected' : ''}>${label}</option>`).join('');
}

function keywordGroups(selectedTags=[]) {
  const selected = new Set(selectedTags);
  const known = new Set(SAFE_TAG_GROUPS.flatMap((group) => group.tags.map(([tag]) => tag)));
  const savedCustom = [...selected].filter((tag) => !known.has(tag));
  const groups = savedCustom.length
    ? [...SAFE_TAG_GROUPS, { label:'Saved', tags:savedCustom.map((tag) => [tag, titleCase(tag)]) }]
    : SAFE_TAG_GROUPS;
  return groups.map((group) => `
    <section class="keyword-group">
      <h3>${escapeHtml(group.label)}</h3>
      <div class="keyword-chips">
        ${group.tags.map(([tag,label]) => `<button type="button" class="keyword-chip ${selected.has(tag) ? 'selected' : ''}" data-keyword="${tag}" aria-pressed="${selected.has(tag)}">${escapeHtml(label)}</button>`).join('')}
      </div>
    </section>`).join('');
}

function refreshAccount() {
  account = getActiveAccount();
  profile = loadProfile(account.id);
}

function findFood(id) {
  return session?.candidates?.find((candidate) => candidate.id === id)
    || profile.safeFoods?.find((food) => food.id === id)
    || foodById[id]
    || null;
}

function accountContextLabel() {
  return account.role === 'helper' ? `Helping ${account.name}` : `Choosing for ${account.name}`;
}

function renderStart() {
  refreshAccount();
  session = null;
  currentQuestion = null;
  const recent = (profile.recentSelections || []).map(findFood).filter(Boolean)[0];
  app.innerHTML = `
    <main class="screen start-screen">
      <section class="brand-block">
        <div class="logo-bubble">idk?</div>
        <p class="eyebrow">food, without the interrogation</p>
        <h1>Idk, I’m Hungry</h1>
        <p class="lede">You don’t have to know what you want. Just react.</p>
      </section>

      <button class="account-pill" data-action="accounts">
        <span>${escapeHtml(accountContextLabel())}</span>
        <small>Switch profile</small>
      </button>

      <section class="start-actions">
        <button class="primary-action" data-start="normal">Help me choose</button>
        <button class="panic-action" data-start="fast">
          <span>I’m hungry and nothing sounds good</span>
          <small>A quicker round.</small>
        </button>
      </section>

      <button class="safe-food-entry" data-action="safe-foods">
        <span>🛟 Safe Foods</span>
        <small>${profile.safeFoods?.filter((food) => !food.hidden).length || 0} ready</small>
      </button>

      ${recent ? `<p class="recent-win">Last win: <strong>${escapeHtml(recent.name)}</strong></p>` : ''}
    </main>`;

  app.querySelector('[data-action="accounts"]').addEventListener('click', renderAccounts);
  app.querySelector('[data-action="safe-foods"]').addEventListener('click', renderSafeFoods);
  app.querySelector('[data-start="normal"]').addEventListener('click', () => startSession(false));
  app.querySelector('[data-start="fast"]').addEventListener('click', () => startSession(true));
}

function renderAccounts() {
  const accounts = listAccounts();
  app.innerHTML = `
    <main class="screen manage-screen">
      <header class="page-header">
        <button class="text-button" data-action="home">← Home</button>
        <p class="eyebrow">accounts</p>
        <h1>Who are we feeding?</h1>
        <p>Give each person their own food memory.</p>
      </header>

      <section class="account-list">
        ${accounts.map((item) => `
          <article class="manage-card ${item.id === account.id ? 'selected' : ''}">
            <div>
              <h2>${escapeHtml(item.name)}</h2>
              <p>${item.role === 'helper' ? 'Helping someone choose' : 'Choosing for myself'}</p>
            </div>
            <div class="manage-actions">
              ${item.id === account.id ? '<span class="status-chip">Current</span>' : `<button data-select-account="${item.id}">Use</button>`}
              <button data-rename-account="${item.id}">Rename</button>
              ${accounts.length > 1 ? `<button class="danger-lite" data-delete-account="${item.id}">Delete</button>` : ''}
            </div>
          </article>`).join('')}
      </section>

      <form class="editor-card" data-account-form>
        <h2>Add account</h2>
        <label>Name<input name="name" required maxlength="32" placeholder="Alex, Partner, Me…"></label>
        <label>Mode<select name="role"><option value="helper">Helping someone choose</option><option value="self">Choosing for myself</option></select></label>
        <button class="primary-action compact" type="submit">Add account</button>
      </form>
    </main>`;

  app.querySelector('[data-action="home"]').addEventListener('click', renderStart);
  app.querySelectorAll('[data-select-account]').forEach((button) => button.addEventListener('click', () => {
    setActiveAccount(button.dataset.selectAccount);
    refreshAccount();
    renderStart();
  }));
  app.querySelectorAll('[data-rename-account]').forEach((button) => button.addEventListener('click', () => {
    const target = accounts.find((item) => item.id === button.dataset.renameAccount);
    const next = window.prompt('Account name', target?.name || '');
    if (next?.trim()) renameAccount(button.dataset.renameAccount, next.trim());
    refreshAccount();
    renderAccounts();
  }));
  app.querySelectorAll('[data-delete-account]').forEach((button) => button.addEventListener('click', () => {
    const target = accounts.find((item) => item.id === button.dataset.deleteAccount);
    if (window.confirm(`Delete ${target?.name || 'this account'} and its food history?`)) {
      deleteAccount(button.dataset.deleteAccount);
      refreshAccount();
      renderAccounts();
    }
  }));
  app.querySelector('[data-account-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    createAccount(data.get('name'), data.get('role'));
    refreshAccount();
    renderStart();
  });
}

function renderSafeFoods() {
  refreshAccount();
  const foods = profile.safeFoods || [];
  app.innerHTML = `
    <main class="screen manage-screen">
      <header class="page-header">
        <button class="text-button" data-action="home">← Home</button>
        <p class="eyebrow">${escapeHtml(account.name)} · safe foods</p>
        <h1>Known good options</h1>
        <p>Hide anything that isn’t safe right now.</p>
      </header>

      <button class="primary-action compact" data-action="add-safe">+ Add Safe Food</button>

      <section class="safe-food-list">
        ${foods.length ? foods.map((food) => `
          <article class="manage-card safe-card ${food.hidden ? 'hidden-food' : ''}">
            <div class="safe-food-summary">
              <div class="food-emoji small">${escapeHtml(food.emoji || '🍴')}</div>
              <div>
                <h2>${escapeHtml(food.name)}</h2>
                <p>${food.sourceLabel ? `${escapeHtml(food.sourceLabel)} · ` : ''}${food.customTags.slice(0,5).map((tag) => escapeHtml(titleCase(tag))).join(' · ') || 'No keywords yet'}</p>
                ${food.hidden ? '<span class="status-chip muted-chip">Hidden right now</span>' : '<span class="status-chip">Active</span>'}
              </div>
            </div>
            <div class="manage-actions">
              <button data-edit-safe="${food.id}">Edit</button>
              <button data-hide-safe="${food.id}">${food.hidden ? 'Unhide' : 'Hide'}</button>
              <button class="danger-lite" data-delete-safe="${food.id}">Delete</button>
            </div>
          </article>`).join('') : '<div class="empty-card"><h2>No Safe Foods yet.</h2><p>Add the exact foods you already know can work.</p></div>'}
      </section>
    </main>`;

  app.querySelector('[data-action="home"]').addEventListener('click', renderStart);
  app.querySelector('[data-action="add-safe"]').addEventListener('click', () => renderSafeFoodEditor());
  app.querySelectorAll('[data-edit-safe]').forEach((button) => button.addEventListener('click', () => renderSafeFoodEditor(button.dataset.editSafe)));
  app.querySelectorAll('[data-hide-safe]').forEach((button) => button.addEventListener('click', () => {
    toggleSafeFoodHidden(account.id, button.dataset.hideSafe);
    renderSafeFoods();
  }));
  app.querySelectorAll('[data-delete-safe]').forEach((button) => button.addEventListener('click', () => {
    const food = foods.find((item) => item.id === button.dataset.deleteSafe);
    if (window.confirm(`Delete ${food?.name || 'this Safe Food'}?`)) {
      deleteSafeFood(account.id, button.dataset.deleteSafe);
      renderSafeFoods();
    }
  }));
}

function renderSafeFoodEditor(foodId=null) {
  refreshAccount();
  const food = profile.safeFoods?.find((item) => item.id === foodId) || null;
  app.innerHTML = `
    <main class="screen manage-screen editor-screen">
      <header class="page-header compact-header">
        <button class="text-button" data-action="back">← Safe Foods</button>
        <p class="eyebrow">${food ? 'edit safe food' : 'new safe food'}</p>
        <h1>${food ? escapeHtml(food.name) : 'Add a Safe Food'}</h1>
      </header>
      <form class="editor-card" data-safe-form>
        <label>Food name<input name="name" required maxlength="80" value="${escapeHtml(food?.name || '')}" placeholder="Walmart Chantilly & Berries cake"></label>
        <div class="two-field">
          <label>Emoji<input name="emoji" maxlength="4" value="${escapeHtml(food?.emoji || '🍴')}" placeholder="🍴"></label>
          <label>Category<select name="family">${familyOptions(food?.family || 'safe-food')}</select></label>
        </div>
        <label>Where from? <span>(optional)</span><input name="sourceLabel" maxlength="64" value="${escapeHtml(food?.sourceLabel || '')}" placeholder="Walmart, home, Sonic…"></label>
        <div class="keyword-picker" aria-label="Food keywords">
          ${keywordGroups(food?.customTags || [])}
        </div>
        <button class="primary-action compact" type="submit">Save Safe Food</button>
      </form>
    </main>`;

  app.querySelector('[data-action="back"]').addEventListener('click', renderSafeFoods);
  app.querySelectorAll('[data-keyword]').forEach((chip) => chip.addEventListener('click', () => {
    const next = chip.getAttribute('aria-pressed') !== 'true';
    chip.setAttribute('aria-pressed', String(next));
    chip.classList.toggle('selected', next);
  }));
  app.querySelector('[data-safe-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const keywords = [...event.currentTarget.querySelectorAll('[data-keyword][aria-pressed="true"]')].map((chip) => chip.dataset.keyword);
    upsertSafeFood(account.id, {
      id:food?.id,
      name:data.get('name'),
      emoji:data.get('emoji'),
      family:data.get('family'),
      sourceLabel:data.get('sourceLabel'),
      keywords,
      hidden:food?.hidden || false
    });
    profile = loadProfile(account.id);
    renderSafeFoods();
  });
}

function startSession(fastMode) {
  refreshAccount();
  session = createSession({ mode:account.role, fastMode, profile });
  advance();
}

function advance() {
  currentQuestion = getNextQuestion(session);
  if (!currentQuestion) {
    renderResults();
    return;
  }
  renderQuestion();
}

function renderQuestion() {
  const progress = Math.min(100, Math.round((session.questionCount / session.maxQuestions) * 100));
  const initialMood = sliderMood(50);
  app.innerHTML = `
    <main class="screen question-screen">
      <header class="session-header">
        <button class="text-button" data-action="restart">Start over</button>
        <span>${escapeHtml(accountContextLabel())}</span>
      </header>
      <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
      <p class="possibility-count"><span>${remainingCount(session)}</span> possibilities</p>

      <section class="question-card" aria-live="polite">
        <div class="question-icon">${currentQuestion.icon || '🍴'}</div>
        <h2>${escapeHtml(currentQuestion.prompt)}</h2>
      </section>

      <section class="reaction-slider-panel" aria-label="Gut reaction slider">
        <div class="slider-mood" data-slider-mood style="left:50%">
          <span class="slider-emoji" data-slider-emoji>${initialMood.emoji}</span>
          <strong data-slider-label>${escapeHtml(initialMood.label)}</strong>
        </div>
        <input class="reaction-slider" data-reaction-slider type="range" min="0" max="100" step="1" value="50" aria-label="Reaction from Absolutely Not to Absolutely Yes" style="--slider-pct:50%">
        <div class="slider-ends" aria-hidden="true"><span>Absolutely Not</span><span>Absolutely Yes</span></div>
      </section>
    </main>`;

  app.querySelector('[data-action="restart"]').addEventListener('click', renderStart);
  const slider = app.querySelector('[data-reaction-slider]');
  const moodBubble = app.querySelector('[data-slider-mood]');
  const emoji = app.querySelector('[data-slider-emoji]');
  const label = app.querySelector('[data-slider-label]');
  let lastMoodId = initialMood.id;
  let committed = false;

  const updateMood = () => {
    const value = Number(slider.value);
    const mood = sliderMood(value);
    slider.style.setProperty('--slider-pct', `${value}%`);
    moodBubble.style.left = `${Math.max(8, Math.min(92, value))}%`;
    emoji.textContent = mood.emoji;
    label.textContent = mood.label;
    moodBubble.dataset.tone = mood.tone;
    if (mood.id !== lastMoodId) {
      moodBubble.classList.remove('mood-pop');
      void moodBubble.offsetWidth;
      moodBubble.classList.add('mood-pop');
      lastMoodId = mood.id;
    }
  };

  const commit = () => {
    if (committed) return;
    committed = true;
    const value = Number(slider.value);
    slider.disabled = true;
    moodBubble.classList.add('committed');
    applyReaction(session, currentQuestion, value);
    if (currentQuestion.type === 'candidate' && value <= 8) {
      profile = recordFoodRejection(account.id, profile, currentQuestion.candidateId);
    }
    setTimeout(advance, 140);
  };

  slider.addEventListener('input', updateMood);
  slider.addEventListener('pointerup', commit);
  slider.addEventListener('change', commit);
  updateMood();
}

function renderResults(preferredIds=null, trackExposure=true) {
  const shortlist = getShortlist(session, 3, preferredIds || []);
  if (!shortlist.length) {
    app.innerHTML = `
      <main class="screen results-screen empty-results">
        <div class="logo-bubble small">hmm.</div>
        <h1>Nothing survived.</h1>
        <button class="primary-action" data-action="again">Try again</button>
      </main>`;
    app.querySelector('[data-action="again"]').addEventListener('click', () => startSession(true));
    return;
  }

  const ids = shortlist.map((item) => item.id);
  if (trackExposure) noteShortlistShown(session, ids);
  else {
    session.lastShortlistIds = [...ids];
    session.visibleShortlistIds = [...ids];
  }

  app.innerHTML = `
    <main class="screen results-screen">
      <header class="results-header">
        <p class="eyebrow">top matches</p>
        <h1>Which sounds least bad?</h1>
      </header>
      <section class="shortlist">
        ${shortlist.map((item) => {
          const places = item.sourceLabel || item.viableRestaurants.slice(0, 2).map((id) => restaurantById[id]?.name).filter(Boolean).join(' · ');
          return `<article class="result-card ${item.userAdded ? 'safe-result' : ''}" data-result-id="${item.id}">
            <div class="food-emoji">${item.emoji}</div>
            <div class="result-main">
              <div class="result-title-row"><h2>${escapeHtml(item.name)}</h2><span>${item.compatibility}%</span></div>
              <p class="match-label">${item.label}${item.userAdded ? ' · Safe Food' : ''}</p>
              <div class="match-track"><div class="match-fill" style="width:${item.compatibility}%"></div></div>
              ${places ? `<p class="places">${escapeHtml(places)}</p>` : ''}
              <div class="result-actions">
                <button class="pick-button" data-pick="${item.id}">That’s the one</button>
                <button class="nope-button" data-nope="${item.id}">Nope</button>
              </div>
            </div>
          </article>`;
        }).join('')}
      </section>
      <button class="text-button centered drill-button" data-action="narrow">Keep drilling</button>
    </main>`;

  app.querySelectorAll('[data-pick]').forEach((button) => button.addEventListener('click', () => chooseFood(button.dataset.pick)));
  app.querySelectorAll('[data-nope]').forEach((button) => button.addEventListener('click', () => rejectResult(button.dataset.nope, ids)));
  app.querySelector('[data-action="narrow"]').addEventListener('click', () => {
    beginRefinement(session, ids);
    advance();
  });
}

function rejectResult(candidateId, currentIds=session.visibleShortlistIds) {
  const candidate = findFood(candidateId);
  rejectFood(session, candidateId);
  if (candidate) profile = recordFoodRejection(account.id, profile, candidate.id);
  const nextIds = replaceShortlistItem(session, currentIds, candidateId);
  renderResults(nextIds, false);
}

function chooseFood(candidateId) {
  const candidate = findFood(candidateId);
  if (!candidate) return;
  profile = recordSelection(account.id, profile, candidate, session);
  app.innerHTML = `
    <main class="screen selected-screen">
      <div class="selected-emoji">${candidate.emoji}</div>
      <p class="eyebrow">decision made</p>
      <h1>${escapeHtml(candidate.name)}</h1>
      <p>Saved for ${escapeHtml(account.name)}.</p>
      <button class="primary-action" data-action="again">Choose again</button>
      <button class="text-button centered" data-action="home">Back home</button>
    </main>`;
  app.querySelector('[data-action="again"]').addEventListener('click', () => startSession(false));
  app.querySelector('[data-action="home"]').addEventListener('click', renderStart);
}

renderStart();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
