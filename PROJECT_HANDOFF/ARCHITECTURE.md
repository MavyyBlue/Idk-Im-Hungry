# Architecture

V0.3 remains a dependency-free browser JavaScript PWA. The app is deliberately local-first so the food decision loop can be tested without backend/auth complexity.

- `src/data/` — built-in food and establishment seed data.
- `src/engine/reactions.js` — reaction semantics and personalized ambiguous weighting.
- `src/engine/questions.js` — daypart, establishment, staged trait/detail, custom-keyword, and exact-candidate question generation.
- `src/engine/session.js` — candidate universe, scoring, hard elimination, shortlist novelty, and refinement rounds.
- `src/storage/profile.js` — local account store, V0.1/V0.2 migration, profile learning, and Safe Food CRUD/hide state.
- `src/main.js` — mobile presentation/controller layer including account and Safe Food management surfaces.
- `src/styles.css` — mobile-first visual system.
- `tests/` — Node built-in test runner regression coverage.
- `sw.js` + `public/manifest.webmanifest` — PWA/offline shell.

## Important boundaries

Hard rejection is authoritative. Historical learning may tune ambiguous reactions but must never resurrect a current-session rejection or hidden Safe Food.

Time of day is context only. It can re-rank candidates but must not prohibit breakfast at night or any other off-hours craving.

Safe Foods are first-class candidates, not favorites that bypass the decision engine. User keywords are normalized into tags and participate in the same elimination/scoring system.

Local accounts are intentionally not cloud authentication. Do not introduce backend/auth solely because the UI now says “accounts.” Add sync only after the local model is proven and there is a concrete cross-device need.

Restaurant/store data must remain data, not logic. Bartlesville is the initial useful seed, not an architectural dependency.

The recommendation engine should remain explainable and deterministic enough to test. Avoid introducing an opaque AI call into the core loop.
