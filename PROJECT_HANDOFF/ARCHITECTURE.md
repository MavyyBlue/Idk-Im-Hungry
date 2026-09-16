# Architecture

V0.2 remains intentionally dependency-free browser JavaScript. The deeper engine is structured data + deterministic scoring, not an opaque AI call.

- `src/data/foods.js` — specific food leaves with `family`, `subfamily`, establishments, and trait tags.
- `src/data/restaurants.js` — editable Bartlesville-oriented establishment seed; may include non-restaurant food sources such as grocery bakery.
- `src/engine/reactions.js` — seven-reaction semantics and personalized ambiguous weighting.
- `src/engine/questions.js` — staged question library, branch eligibility, information-value selection, restaurant ordering, and exact-candidate question construction.
- `src/engine/session.js` — session state, scoring, eliminations, strategy switching, direct-candidate handling, and shortlist generation.
- `src/storage/profile.js` — backward-compatible local profile persistence plus selected family/tag affinity.
- `src/main.js` — presentation/controller layer only.
- `src/styles.css` — mobile-first visual system.
- `tests/` — Node built-in regression coverage.
- `sw.js` + `public/manifest.webmanifest` — PWA/offline shell.

## Food model

Every result candidate is a leaf that should be concrete enough to act on. Hierarchy is represented by metadata rather than a rigid tree:

`family → subfamily → traits/preparation/ingredients → establishment → specific candidate`

A leaf can participate in several cross-cutting traits (for example bacon cheeseburger is burger + cheeseburger + beef + bacon + cheese + bread + handheld). This lets the question engine narrow across sensory dimensions without duplicating a tree for every possible path.

## Question-depth contract

Question stages are UX guidance, not a fixed script:

- Stage 0: broad sensory / effort.
- Stage 1: family, meal type, format.
- Stage 2: preparation, protein, core ingredient, sauce.
- Stage 3: branch-specific detail such as bacon, berries, frosting, gravy, or cheesecake.

Stage-3 questions must be branch-gated. Do not ask niche questions simply because they exist in the data.

When the pool becomes small, direct candidate questions are valid and desirable. Akinator-like specificity is part of the product, not an edge case.

## Rejection authority

- Uncertain reactions change scores only.
- `No` on an explicit property can eliminate that property for the current session.
- `No` on a direct candidate eliminates that candidate.
- `Absolutely Not` may additionally penalize close similarity.
- Historical affinity may only affect starting priors. It must never resurrect a current-session hard rejection.

## Persistence

Keep the V0.1 localStorage key unless an explicit migration is built. New profile fields must normalize safely when older saved profiles do not contain them.

## Locality

Bartlesville is useful seed context, not an architectural dependency. Establishments stay data-driven. Do not add live location, restaurant APIs, accounts, or cloud storage until the local decision loop proves it needs them.
