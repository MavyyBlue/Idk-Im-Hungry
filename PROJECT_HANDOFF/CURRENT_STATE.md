# Idk, I'm Hungry — Current State

## Read this first in a new development chat

Current product line: **V0.1 — first playable vertical slice**.

The repository is the source of truth. Preserve working behavior before adding scope.

### Current loop

Start → choose profile mode → restaurant-first or sensory-first questions → react → narrow → three-result shortlist → select or reject → save result locally.

### Implemented in V0.1

- Seven reaction states: Definitely, Sure, Shrug, Ehhh, Nnngh, No, Absolutely Not.
- Ambiguous reactions remain separate numeric signals.
- Per-profile lightweight learning adjusts only ambiguous reaction weighting.
- Explicit No/Absolutely Not behavior is never overridden by learned history.
- Normal mode begins with establishment questions and then changes strategy.
- “Nothing sounds good” mode skips establishment questions and asks six broad trait questions.
- Question selection prefers traits that split the remaining food candidates.
- Results show at most three candidates with compatibility labels.
- User can reject a result and force recalculation.
- Local-only persistence; no account or backend.
- Bartlesville, Oklahoma starter restaurant data is isolated in `src/data/restaurants.js`.

### Next priorities after player testing

1. Tune reaction weights from real sessions rather than adding more features.
2. Observe whether the first four establishment questions feel useful or repetitive.
3. Improve candidate/tag coverage where the engine repeatedly reaches weak shortlists.
4. Add a tiny editable “restaurants I actually use” setup only if the static starter list becomes a constraint.
5. Do not add authentication, cloud sync, restaurant APIs, maps, or location permission until the decision loop is proven.
