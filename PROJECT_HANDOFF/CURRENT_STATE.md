# Idk, I'm Hungry — Current State

## Read this first in a new development chat

Current product line: **V0.4 — continuous reactions, harsher rejection, stable shortlist replacement, and tap-first Safe Foods**.

The repository is the source of truth. Preserve working behavior before adding scope.

### Current loop

Choose account → start session → time-of-day context → one question at a time → slide gut reaction → broad-to-niche narrowing → three-result shortlist → pick / Nope / Keep Drilling → save result locally.

### Implemented through V0.4

- Question reactions now use one thumb-friendly 0–100 slider instead of seven buttons.
- The slider starts at 50 / Ehhh on every question.
- Mood zones preserve the product vocabulary and add an endpoint Absolutely Yes state.
- Releasing the slider commits the answer and advances immediately.
- The floating mood emoji/label follows the thumb and pops when semantic zones change.
- Negative evidence is intentionally harsher than symmetric positive evidence.
- Below-middle responses lower matching-food scores; unrelated foods do not receive a free boost.
- The far-left Absolutely Not zone hard-eliminates matching traits or exact candidates for the current session.
- Previously answered exact questions cannot reappear, and adverse dimensions are de-prioritized for later question selection.
- Compatibility indicators no longer have an artificial 38% floor; weak survivors may display honestly low matches.
- Nope hard-rejects one result, preserves the other two cards in place, and replaces only the rejected slot.
- Keep Drilling begins a genuine refinement round and penalizes already-shown finalists.
- Over 100 built-in specific food candidates plus user-created Safe Foods.
- Local accounts keep separate history, affinities, ambiguity learning, and Safe Foods.
- The first question uses device-local time as context only; it never forbids off-hours cravings.
- Safe Foods can be added with name, category, source, emoji, and tappable keyword chips.
- Existing custom Safe Food categories/tags are preserved when editing older V0.3 entries.
- Safe Foods can be edited, deleted, hidden, or unhidden. Hidden foods are excluded completely.
- Player-facing developer explanation notes were removed for a cleaner mobile surface.
- Still local-first: no cloud auth/sync, backend, restaurant API, or location permission.

### Next priorities after V0.4 playtesting

1. Tune slider zone boundaries and negative-weight curve from real thumb behavior.
2. Watch for slider-release UX issues on Android and keyboard/accessibility behavior on desktop.
3. Check whether stable one-slot Nope replacement feels calmer than full-list reshuffling.
4. Expand the Safe Food chip vocabulary only when repeated real entries expose gaps.
5. Continue deepening niche food branches where the engine still terminates too generically.
6. Revisit real account authentication only when cross-device sync is a proven user need.
