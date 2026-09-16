# Architecture

V0.4 remains a dependency-free browser JavaScript PWA and keeps the recommendation engine deterministic and testable.

- `src/data/` — built-in food and establishment seed data.
- `src/engine/reactions.js` — slider semantic zones, continuous asymmetric weighting, and ambiguity learning compatibility.
- `src/engine/questions.js` — time context, establishment, staged trait/detail, custom-keyword, and exact-candidate question generation.
- `src/engine/session.js` — candidate universe, scoring, elimination, adverse-dimension memory, shortlist stability, and refinement rounds.
- `src/storage/profile.js` — local account store, legacy migration, profile learning, and Safe Food CRUD/hide state.
- `src/main.js` — mobile controller/presentation including the reaction slider and chip-based Safe Food editor.
- `src/styles.css` — mobile-first visual system and slider/mood animation.
- `tests/` — Node built-in regression coverage, including static player-UI assertions.
- `sw.js` + `public/manifest.webmanifest` — PWA/offline shell.

## Scoring boundary

The live slider value is stronger evidence than historical preference. Negative evidence is deliberately asymmetric: moving left from the midpoint hurts matching foods faster than moving the same distance right helps them.

A value below 50 is adverse evidence, but it is not automatically a hard ban. Only the far-left semantic zone (0–8 / Absolutely Not) hard-eliminates a trait, establishment, or exact candidate. Shortlist `Nope` is always a hard exact-item rejection and is represented internally as zero session viability.

## Important boundaries

Historical learning must never resurrect a hard-rejected item or hidden Safe Food.

Time of day is context only. It can re-rank candidates but must not prohibit breakfast at night or any other off-hours craving.

Safe Foods are first-class candidates, not guaranteed favorites. Their selected chips become normalized tags and participate in the same scoring/elimination engine.

Local accounts are not cloud authentication. Do not introduce backend/auth solely because the UI says accounts. Add sync only after a concrete cross-device need is validated.

Restaurant/store data must remain data, not logic. Bartlesville is the initial useful seed, not an architectural dependency.
