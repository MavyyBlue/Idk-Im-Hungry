# Idk, I'm Hungry — Current State

## Read this first in a new development chat

Current product line: **V0.3 — local accounts, Safe Foods, time context, and real refinement rounds**.

The repository is the source of truth. Preserve working behavior before adding scope.

### Current loop

Choose local account → start session → time-of-day context → brief restaurant probe or sensory questions → broad-to-niche elimination → three-result shortlist → pick / Nope / Keep Drilling → save result locally.

### Implemented through V0.3

- Seven reaction states remain first-class: Definitely, Sure, Shrug, Ehhh, Nnngh, No, Absolutely Not.
- Ambiguous reactions remain distinct and learn per local account.
- Hard rejections remain authoritative and cannot be overridden by history.
- Over 100 built-in specific food candidates plus user-created Safe Foods.
- Normal mode supports up to 28 questions before refinement extensions; fast mode stays bounded at 8.
- The first question is derived from local device time: breakfast-ish, lunch-ish, dinner-ish, or late-night. It is contextual ranking only, never a hard meal-time ban.
- Two weak restaurant reactions switch away from establishment interrogation.
- Stage-based questions now include broad sensory traits, families, preparations, ingredients, branch-specific details, and nitty-gritty discriminators.
- Exact candidate questions appear when the pool becomes narrow.
- Keep Drilling begins a real refinement round, adds question capacity, and penalizes already-shown finalists so alternatives can surface.
- Nope hard-rejects the exact candidate for the current session; it cannot return later in that session.
- Keep Drilling can continue even after a shortlist has reached three or fewer candidates.
- Local accounts keep separate histories, affinities, ambiguous-reaction learning, and Safe Foods.
- Existing V0.1/V0.2 `self` history migrates into the default local `Me` account.
- Safe Foods can be added with a name, optional source/place, category, emoji, and comma-separated keywords.
- Safe Foods can be edited, deleted, hidden, or unhidden. Hidden means fully excluded from recommendation sessions until restored.
- Safe Foods are not guaranteed recommendations: current-session answers can eliminate them like any other food.
- User keywords can become late-stage personalized questions when useful.
- Still local-first: no email/password auth, cloud sync, backend, restaurant API, or location permission.

### Next priorities after V0.3 playtesting

1. Test whether refinement rounds actually feel different rather than merely mathematically different.
2. Observe how users describe Safe Foods and which keyword prompts need friendlier aliases.
3. Expand exact-item coverage where built-in branches still terminate too generically.
4. Decide whether account sync/auth is justified only after local account behavior proves useful.
5. Add account export/import before cloud sync if users need backup portability.
6. Keep profiling and settings surfaces focused; do not turn the app into a dashboard.
