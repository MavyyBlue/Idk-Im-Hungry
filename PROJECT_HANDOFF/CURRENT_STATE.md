# Idk, I'm Hungry — Current State

## Read this first in a new development chat

Current product line: **V0.2 — deep narrowing / specific-food slice**.

The repository is the source of truth. Preserve working behavior before adding scope.

### Current loop

Start → choose profile mode → brief restaurant probe or sensory-first questions → broad sensory narrowing → family/format narrowing → preparation/ingredient/detail questions → exact candidate questions when useful → three-result shortlist → select/reject → save locally.

### Implemented through V0.2

- Seven reactions preserved exactly: Definitely, Sure, Shrug, Ehhh, Nnngh, No, Absolutely Not.
- Ambiguous reactions remain distinct learned signals.
- Explicit `No` on an explicit trait/property eliminates that property for the current session; uncertain reactions never do.
- Direct candidate `No`/`Absolutely Not` eliminates that exact item. `Absolutely Not` also penalizes close family/subfamily similarity.
- Normal sessions can ask up to 24 questions instead of V0.1's 9.
- “Nothing sounds good” stays intentionally fast at 7 broad questions before a shortlist.
- Restaurant interrogation stops after two weak reactions and changes strategy.
- Question depth is staged: broad sensory → family/format → preparation/ingredient → branch-specific detail.
- Branch-specific prompts are gated. Cake questions such as berries/cream/frosting only appear when cake is a meaningful portion of the remaining pool.
- Once the pool is small enough, the app asks about exact candidates instead of stopping at a generic family.
- Food seed expanded from 30 flat candidates to 104 specific/actionable candidates across chicken, burgers, Mexican, pizza, breakfast, pasta/comfort, sandwiches/fresh, Asian-style dishes, seafood, savory sides/snacks, frozen desserts, cake, cheesecake, cookies, brownies, and donuts.
- Walmart Chantilly & Berries cake exists as a specific candidate leaf to prove grocery-bakery specificity.
- Candidate metadata now includes `family` and `subfamily` in addition to tags and establishments.
- Selection learning now records family/tag affinity as a light prior while preserving hard-rejection authority.
- Existing V0.1 local profiles are extended in place; the localStorage key is unchanged.
- Results remain approximately three specific survivors and retain “Which sounds least bad?” / continued narrowing.
- Local-only; no auth, backend, restaurant API, location permission, or cloud database.

### Regression state

V0.2 overlay currently passes 13/13 Node regression tests, including dataset uniqueness, specific Chantilly leaf, ambiguous reaction ordering/learning, trait and exact-item hard rejection, deeper normal questioning, fast-mode cap, restaurant strategy switching, and branch-specific cake-question eligibility.

### Next player-testing priorities

1. Run real sessions and note whether 24 questions feels useful or tiring; do not shorten only because the number looks large.
2. Identify branches that still land on a generic result and deepen only those branches.
3. Expand establishment-specific leaves based on foods Mavyy and partner actually encounter.
4. Tune branch-specific wording so questions sound like Mavyy helping someone choose, not a taxonomy quiz.
5. Add result diversity rules only if three near-duplicates become frustrating; specificity is currently more important than artificial variety.
