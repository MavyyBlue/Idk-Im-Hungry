# Architecture

V0.1 intentionally uses dependency-free browser JavaScript.

- `src/data/` — editable food and restaurant seed data.
- `src/engine/reactions.js` — reaction semantics and personalized ambiguous weighting.
- `src/engine/questions.js` — restaurant ordering and information-value trait selection.
- `src/engine/session.js` — session state, scoring, elimination, shortlist generation.
- `src/storage/profile.js` — local profile persistence and post-selection learning.
- `src/main.js` — presentation/controller layer only.
- `src/styles.css` — mobile-first visual system.
- `tests/` — Node built-in test runner regression coverage.
- `sw.js` + `public/manifest.webmanifest` — PWA/offline shell.

## Important boundaries

Hard rejection is authoritative. Historical learning may tune ambiguous reactions but must never turn a direct No into a positive signal.

Restaurant data must remain data, not logic. Bartlesville is the initial useful seed, not an architectural dependency.

The recommendation engine should remain explainable and deterministic enough to test. Avoid introducing an opaque AI call into the core loop.
