# Architecture

V0.5 remains a dependency-free browser JavaScript PWA and keeps the recommendation engine deterministic and testable.

- `src/data/foods.js` — hand-curated core leaves plus deterministic local catalog expansion; currently 539 unique built-in candidates.
- `src/data/restaurants.js` — establishment/store seed data.
- `src/data/unsafe.js` — unsafe keyword groups, aliases, normalization, and candidate matching.
- `src/engine/reactions.js` — slider semantic zones, continuous asymmetric weighting, and ambiguity-learning compatibility.
- `src/engine/questions.js` — time context, establishment, staged trait/detail, family questions, custom-keyword, and exact-candidate question generation.
- `src/engine/session.js` — candidate universe, unsafe pre-filtering, scoring, progressive question focus, elimination, shortlist stability, and refinement rounds.
- `src/storage/profile.js` — local account store, legacy migration, learning, Safe Food CRUD/hide state, and Unsafe Food keywords.
- `src/main.js` — mobile controller/presentation including slider, Safe Food chips, and Literal Unsafe Food controls.
- `src/styles.css` — mobile-first visual system.
- `tests/` — Node built-in regression coverage, including catalog size, unsafe filtering, niche reachability, icon integrity, and player UI assertions.
- `sw.js` + `public/manifest.webmanifest` — PWA/offline shell.

## Scoring boundary

The live slider value is stronger evidence than historical preference. Negative evidence is deliberately asymmetric: moving left from the midpoint hurts matching foods faster than moving the same distance right helps them. Only the far-left semantic zone hard-eliminates a trait, establishment, or exact candidate. Shortlist `Nope` is always a hard exact-item rejection.

## 500+ catalog boundary

The built-in candidate catalog is local data, not live menu availability. Generated expansions are realistic food archetypes and must not make claims that a named establishment currently sells them. As the candidate universe grows, question selection progressively focuses on high-ranked slices rather than considering all 539 candidates equally at every late-stage question.

## Unsafe Foods boundary

Unsafe keywords filter the candidate universe before scoring. Unsafe exclusions override Safe Foods and historical affinity. Alias groups may conservatively match related tags such as shellfish → shrimp/crab/lobster/scallop. This is not an ingredient-certification or cross-contact system; do not represent it as medical/allergy safety.

## Important boundaries

Historical learning must never resurrect a hard-rejected item, hidden Safe Food, or Unsafe Food match.

Time of day is context only. It can re-rank candidates but must not prohibit off-hours cravings.

Local accounts are not cloud authentication. Do not introduce backend/auth solely because the UI says accounts.

Restaurant/store data must remain data, not logic. Bartlesville is the initial useful seed, not an architectural dependency.
