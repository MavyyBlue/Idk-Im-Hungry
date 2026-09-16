# Idk, I'm Hungry — Current State

## Read this first in a new development chat

Current product line: **V0.5 — 500+ catalog, Literal Unsafe Foods, focused deep narrowing, and user-provided PNG app icon**.

The repository is the source of truth. Preserve working behavior before adding scope.

### Current loop

Choose account → optional Safe/Unsafe food setup → start session → time-of-day context → one question at a time → slide gut reaction → broad-to-niche narrowing → three-result shortlist → pick / Nope / Keep Drilling → save result locally.

### Implemented through V0.5

- 539 unique built-in food candidates, plus visible user Safe Foods.
- Catalog expansion covers chicken, burgers, Mexican/Tex-Mex, pizza, breakfast, pasta, sandwiches/wraps, Asian-style dishes, seafood, soups, BBQ, Mediterranean, Indian-style, fresh bowls/salads, snacks, convenience foods, desserts, bakery items, and drinks.
- Question selection progressively focuses on top-ranked candidate slices as sessions deepen, preventing the 500+ pool from trapping the engine in generic questions.
- Walmart Chantilly & Berries cake remains a test-protected niche leaf reachable by focused questioning.
- Literal Unsafe Foods are account-specific normalized keywords. Matching built-ins and matching Safe Foods are excluded before session scoring begins.
- Common unsafe chips cover shellfish, fish, peanuts/peanut butter, tree nuts, dairy, eggs, gluten/wheat, proteins, and common ingredient dealbreakers.
- Custom unsafe keywords are supported.
- Alias matching lets a shellfish exclusion catch shrimp/crab/lobster/scallop branches.
- Unsafe Foods are deterministic filters, not an allergy/cross-contact guarantee.
- Safe Foods remain editable, hideable, deletable, and tap-tagged.
- Question reactions use a continuous 0–100 slider with preserved reaction vocabulary.
- Negative evidence is intentionally harsher than symmetric positive evidence.
- Far-left Absolutely Not and shortlist Nope remain authoritative session exclusions.
- Nope replaces only the rejected shortlist slot.
- Keep Drilling starts a genuine refinement round.
- The user-provided `Idk? / I'm Hungry` pink/beige PNG is now the PWA icon source; 192px and 512px install derivatives are produced from it.
- Still local-first: no cloud auth/sync, backend, restaurant API, or location permission.

### Next priorities after V0.5 playtesting

1. Watch whether 539 candidates improves specificity without making sessions feel too long.
2. Audit missing unsafe/allergen tags when real foods expose gaps.
3. Tune family-focus timing if the engine dives into a cuisine too early or too late.
4. Continue expanding exact/local leaves only where playtesting shows generic gaps.
5. Keep the unsafe system explicit about its limits; never market it as certified allergy safety.
6. Revisit real account authentication only when cross-device sync becomes a proven need.
