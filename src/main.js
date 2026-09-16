import { foodById } from './data/foods.js';
import { restaurantById } from './data/restaurants.js';
import { reactions } from './engine/reactions.js';
import { applyReaction, beginRefinement, createSession, getNextQuestion, getShortlist, noteShortlistShown, rejectFood, remainingCount } from './engine/session.js';
import {
  createAccount, deleteAccount, deleteSafeFood, getActiveAccount, listAccounts, loadProfile,
  parseKeywords, recordFoodRejection, recordSelection, renameAccount, setActiveAccount,
  toggleSafeFoodHidden, upsertSafeFood
} from './storage/profile.js';

const app = document.querySelector('#app');
let account = getActiveAccount();
let profile = loadProfile(account.id);
let session = null;
let currentQuestion = null;

const escapeHtml = (value='') => String(value).replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const titleCase = (value='') => String(value).split('-').map((part) => part ? part[0].toUpperCase() + part.slice(1) : '').join(' ');

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
        <p class="lede">You don’t have to know what you want. Just react. I’ll keep drilling until the options are actually specific.</p>
      </section>

      <button class="account-pill" data-action="accounts">
        <span>${escapeHtml(accountContextLabel())}</span>
        <small>Switch or manage local accounts</small>
      </button>

      <section class="start-actions">
        <button class="primary-action" data-start="normal">Help me choose</button>
        <button class="panic-action" data-start="fast">
          <span>I’m hungry and nothing sounds good</span>
          <small>Time context + broad sensory questions, then a shortlist.</small>
        </button>
      </section>

      <button class="safe-food-entry" data-action="safe-foods">
        <span>🛟 Safe Foods</span>
        <small>${profile.safeFoods?.filter((food) => !food.hidden).length || 0} active · add, edit, hide, or delete</small>
      </button>

      ${recent ? `<p class="recent-win">Last win: <strong>${escapeHtml(recent.name)}</strong></p>` : ''}
      <p class="privacy-note">Accounts are local to this device for now. No sign-in, cloud database, or location permission.</p>
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
        <p class="eyebrow">local accounts</p>
        <h1>Who are we feeding?</h1>
        <p>Each account keeps its own Safe Foods, reactions, history, and learning.</p>
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
    if (window.confirm(`Delete ${target?.name || 'this account'} and its local food history?`)) {
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
        <p>Safe Foods are candidates, not guarantees. Session answers can still eliminate them. Hide means “not safe right now.”</p>
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
  const keywords = food?.customTags?.join(', ') || '';
  app.innerHTML = `
    <main class="screen manage-screen editor-screen">
      <header class="page-header">
        <button class="text-button" data-action="back">← Safe Foods</button>
        <p class="eyebrow">${food ? 'edit safe food' : 'new safe food'}</p>
        <h1>${food ? escapeHtml(food.name) : 'Add the exact thing'}</h1>
        <p>Keywords plug this food directly into the same elimination engine as built-in foods.</p>
      </header>
      <form class="editor-card" data-safe-form>
        <label>Food name<input name="name" required maxlength="80" value="${escapeHtml(food?.name || '')}" placeholder="Walmart Chantilly & Berries cake"></label>
        <div class="two-field">
          <label>Emoji<input name="emoji" maxlength="4" value="${escapeHtml(food?.emoji || '🍴')}" placeholder="🍴"></label>
          <label>Category<input name="family" maxlength="32" value="${escapeHtml(food?.family === 'safe-food' ? '' : food?.family || '')}" placeholder="cake, burger, chicken…"></label>
        </div>
        <label>Where from? <span>(optional)</span><input name="sourceLabel" maxlength="64" value="${escapeHtml(food?.sourceLabel || '')}" placeholder="Walmart, home, Sonic…"></label>
        <label>Keywords <span>(comma separated)</span><textarea name="keywords" rows="5" placeholder="sweet, berries, cream, cold, soft, dessert, grocery-bakery">${escapeHtml(keywords)}</textarea></label>
        <p class="form-help">Useful keywords include salty, savory, handheld, dinner, breakfast-food, crunchy, soft, spicy, cheesy, quick, filling, dessert, chicken, burger, pizza, cake, and anything personal that helps describe it.</p>
        <button class="primary-action compact" type="submit">Save Safe Food</button>
      </form>
    </main>`;

  app.querySelector('[data-action="back"]').addEventListener('click', renderSafeFoods);
  app.querySelector('[data-safe-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    upsertSafeFood(account.id, {
      id:food?.id,
      name:data.get('name'),
      emoji:data.get('emoji'),
      family:data.get('family'),
      sourceLabel:data.get('sourceLabel'),
      keywords:parseKeywords(data.get('keywords')),
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
  const phase = currentQuestion.type === 'time-context' ? 'Starting with right now.'
    : currentQuestion.type === 'candidate' ? 'Getting very specific.'
    : currentQuestion.type === 'restaurant' ? 'Checking the obvious places.'
    : session.questionCount >= 12 ? 'Nitty-gritty now.'
    : session.questionCount >= 7 ? 'Narrowing the details.'
    : 'Gut reaction. Don’t overthink it.';
  app.innerHTML = `
    <main class="screen question-screen">
      <header class="session-header">
        <button class="text-button" data-action="restart">Start over</button>
        <span>${escapeHtml(accountContextLabel())}</span>
      </header>
      <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
      <p class="possibility-count"><span>${remainingCount(session)}</span> specific possibilities still alive</p>

      <section class="question-card" aria-live="polite">
        <div class="question-icon">${currentQuestion.icon || '🍴'}</div>
        <p class="question-kicker">${escapeHtml(phase)}</p>
        <h2>${escapeHtml(currentQuestion.prompt)}</h2>
      </section>

      <section class="reaction-dock" aria-label="Reaction choices">
        ${reactions.map((reaction) => `<button class="reaction-button ${reaction.tone}" data-reaction="${reaction.id}">${escapeHtml(reaction.label)}</button>`).join('')}
      </section>
    </main>`;

  app.querySelector('[data-action="restart"]').addEventListener('click', renderStart);
  app.querySelectorAll('[data-reaction]').forEach((button) => {
    button.addEventListener('click', () => {
      button.classList.add('pressed');
      const reactionId = button.dataset.reaction;
      applyReaction(session, currentQuestion, reactionId);
      if (currentQuestion.type === 'candidate' && ['no','absolutely-not'].includes(reactionId)) {
        profile = recordFoodRejection(account.id, profile, currentQuestion.candidateId);
      }
      setTimeout(advance, 90);
    });
  });
}

function renderResults() {
  const shortlist = getShortlist(session, 3);
  if (!shortlist.length) {
    app.innerHTML = `
      <main class="screen results-screen empty-results">
        <div class="logo-bubble small">hmm.</div>
        <h1>You rejected the whole room.</h1>
        <p>Fair. We can reset and ask from a different angle.</p>
        <button class="primary-action" data-action="again">Try again</button>
      </main>`;
    app.querySelector('[data-action="again"]').addEventListener('click', () => startSession(true));
    return;
  }

  noteShortlistShown(session, shortlist.map((item) => item.id));
  app.innerHTML = `
    <main class="screen results-screen">
      <header class="results-header">
        <p class="eyebrow">strongest survivors · round ${session.refinementRound + 1}</p>
        <h1>Which sounds least bad?</h1>
        <p>Nope permanently removes an item for this session. Keep Drilling deliberately pushes past this shortlist and asks questions that can separate it from alternatives.</p>
      </header>
      <section class="shortlist">
        ${shortlist.map((item) => {
          const places = item.sourceLabel || item.viableRestaurants.slice(0, 2).map((id) => restaurantById[id]?.name).filter(Boolean).join(' · ');
          return `<article class="result-card ${item.userAdded ? 'safe-result' : ''}">
            <div class="food-emoji">${item.emoji}</div>
            <div class="result-main">
              <div class="result-title-row"><h2>${escapeHtml(item.name)}</h2><span>${item.compatibility}%</span></div>
              <p class="match-label">${item.label}${item.userAdded ? ' · Safe Food' : ''}</p>
              <p class="food-path">${escapeHtml(titleCase(item.family))} · ${escapeHtml(titleCase(item.subfamily))}</p>
              <div class="match-track"><div class="match-fill" style="width:${item.compatibility}%"></div></div>
              ${places ? `<p class="places">Try: ${escapeHtml(places)}</p>` : ''}
              <div class="result-actions">
                <button class="pick-button" data-pick="${item.id}">That’s the one</button>
                <button class="nope-button" data-nope="${item.id}">Nope</button>
              </div>
            </div>
          </article>`;
        }).join('')}
      </section>
      <button class="text-button centered drill-button" data-action="narrow">Keep drilling → new angle</button>
    </main>`;

  app.querySelectorAll('[data-pick]').forEach((button) => button.addEventListener('click', () => chooseFood(button.dataset.pick)));
  app.querySelectorAll('[data-nope]').forEach((button) => button.addEventListener('click', () => rejectResult(button.dataset.nope)));
  app.querySelector('[data-action="narrow"]').addEventListener('click', () => {
    beginRefinement(session, shortlist.map((item) => item.id));
    advance();
  });
}

function rejectResult(candidateId) {
  const candidate = findFood(candidateId);
  rejectFood(session, candidateId);
  if (candidate) profile = recordFoodRejection(account.id, profile, candidate.id);
  renderResults();
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
      <p>I’ll remember the family, details, and ambiguous reactions that led here for ${escapeHtml(account.name)}.</p>
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
