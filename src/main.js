import { foodById } from './data/foods.js';
import { restaurantById } from './data/restaurants.js';
import { reactions } from './engine/reactions.js';
import { applyReaction, createSession, getNextQuestion, getShortlist, rejectFood, remainingCount } from './engine/session.js';
import { loadProfile, recordFoodRejection, recordSelection } from './storage/profile.js';

const app = document.querySelector('#app');
let mode = 'self';
let profile = loadProfile(mode);
let session = null;
let currentQuestion = null;

const escapeHtml = (value='') => String(value).replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

function setMode(nextMode) {
  mode = nextMode;
  profile = loadProfile(mode);
  renderStart();
}

function renderStart() {
  session = null;
  currentQuestion = null;
  const recent = (profile.recentSelections || []).map((id) => foodById[id]).filter(Boolean)[0];
  app.innerHTML = `
    <main class="screen start-screen">
      <section class="brand-block">
        <div class="logo-bubble">idk?</div>
        <p class="eyebrow">food, without the interrogation</p>
        <h1>Idk, I’m Hungry</h1>
        <p class="lede">You don’t have to know what you want. Just react.</p>
      </section>

      <section class="mode-switch" aria-label="Who are we choosing for?">
        <button class="mode-button ${mode === 'self' ? 'active' : ''}" data-mode="self">Choosing for myself</button>
        <button class="mode-button ${mode === 'partner' ? 'active' : ''}" data-mode="partner">Helping someone choose</button>
      </section>

      <section class="start-actions">
        <button class="primary-action" data-start="normal">Help me choose</button>
        <button class="panic-action" data-start="fast">
          <span>I’m hungry and nothing sounds good</span>
          <small>Skip restaurants. Ask me the broad stuff.</small>
        </button>
      </section>

      ${recent ? `<p class="recent-win">Last win: <strong>${escapeHtml(recent.name)}</strong></p>` : ''}
      <p class="privacy-note">No account. No location tracking. Your reactions stay on this device.</p>
    </main>`;

  app.querySelectorAll('[data-mode]').forEach((button) => button.addEventListener('click', () => setMode(button.dataset.mode)));
  app.querySelector('[data-start="normal"]').addEventListener('click', () => startSession(false));
  app.querySelector('[data-start="fast"]').addEventListener('click', () => startSession(true));
}

function startSession(fastMode) {
  profile = loadProfile(mode);
  session = createSession({ mode, fastMode, profile });
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
  const progress = Math.round((session.questionCount / session.maxQuestions) * 100);
  app.innerHTML = `
    <main class="screen question-screen">
      <header class="session-header">
        <button class="text-button" data-action="restart">Start over</button>
        <span>${mode === 'self' ? 'For me' : 'Helping someone'}</span>
      </header>
      <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
      <p class="possibility-count"><span>${remainingCount(session)}</span> possibilities still alive</p>

      <section class="question-card" aria-live="polite">
        <div class="question-icon">${currentQuestion.icon || '🍴'}</div>
        <p class="question-kicker">Gut reaction. Don’t overthink it.</p>
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
      applyReaction(session, currentQuestion, button.dataset.reaction);
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

  app.innerHTML = `
    <main class="screen results-screen">
      <header class="results-header">
        <p class="eyebrow">I’m not pretending I can read minds.</p>
        <h1>Which sounds least bad?</h1>
        <p>These are the strongest survivors.</p>
      </header>
      <section class="shortlist">
        ${shortlist.map((item) => {
          const places = item.viableRestaurants.slice(0, 2).map((id) => restaurantById[id]?.name).filter(Boolean).join(' · ');
          return `<article class="result-card">
            <div class="food-emoji">${item.emoji}</div>
            <div class="result-main">
              <div class="result-title-row"><h2>${escapeHtml(item.name)}</h2><span>${item.compatibility}%</span></div>
              <p class="match-label">${item.label}</p>
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
      <button class="text-button centered" data-action="narrow">Keep narrowing</button>
    </main>`;

  app.querySelectorAll('[data-pick]').forEach((button) => button.addEventListener('click', () => chooseFood(button.dataset.pick)));
  app.querySelectorAll('[data-nope]').forEach((button) => button.addEventListener('click', () => rejectResult(button.dataset.nope)));
  app.querySelector('[data-action="narrow"]').addEventListener('click', () => {
    session.maxQuestions += 3;
    advance();
  });
}

function rejectResult(candidateId) {
  const candidate = foodById[candidateId];
  rejectFood(session, candidateId);
  if (candidate) profile = recordFoodRejection(mode, profile, candidate.id);
  renderResults();
}

function chooseFood(candidateId) {
  const candidate = foodById[candidateId];
  if (!candidate) return;
  profile = recordSelection(mode, profile, candidate, session);
  app.innerHTML = `
    <main class="screen selected-screen">
      <div class="selected-emoji">${candidate.emoji}</div>
      <p class="eyebrow">decision made</p>
      <h1>${escapeHtml(candidate.name)}</h1>
      <p>I’ll remember that this one survived your reactions.</p>
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
