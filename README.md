# Idk, I'm Hungry

A mobile-first food decision helper for the moment when you know you need to eat but cannot identify what sounds good.

The app asks one question at a time, learns from lightweight local history, and narrows toward specific foods without forcing the user through a giant menu.

## V0.5 playable slice

- 539 unique built-in food candidates before user-created Safe Foods
- Broader cuisine and format coverage across meals, snacks, desserts, grocery/convenience foods, and drinks
- Focused late-stage question pools so the larger catalog can still reach niche leaves
- Local per-person accounts/profiles
- User-created Safe Foods with edit, hide/unhide, delete, and tap-first keyword chips
- Literal Unsafe Foods: account-specific hard-exclusion keywords that filter candidates before a session starts
- Common unsafe chips plus optional custom keywords
- Unsafe Foods override matching Safe Foods
- Time-of-day opening context that influences but never forbids off-hours cravings
- Continuous 0–100 reaction slider with animated mood feedback
- Harsher negative weighting than symmetric positive weighting
- Stable one-slot replacement when a shortlist result is Noped
- Keep Drilling refinement rounds
- User-provided pink/beige `Idk? / I'm Hungry` PNG as the PWA icon
- Offline-friendly PWA shell with local persistence

## Literal Unsafe Foods boundary

Unsafe keywords are deterministic local filters over the catalog tags and names. They are useful for strong dislikes and personal restrictions, but the app is not an ingredient-certification or cross-contact system. For allergies or medical restrictions, users still need to verify labels and restaurant handling.

## Privacy and architecture

V0.5 remains local-first. There is no email/password authentication, cloud sync, backend, restaurant API, payment system, or location permission. Each device stores its own accounts, Safe Foods, Unsafe Foods, history, and preference learning.

## Tests

Requires Node.js 20+ only. There are no runtime dependencies.

```bash
npm test
```

## Mobile development handoff

The repository uses `.github/workflows/mobile-import.yml` to support phone-first development.

1. Upload `idk-source.zip` to the repository root.
2. The workflow validates the ZIP and its `idk-patch.json` manifest.
3. The ZIP is safely expanded as an overlay over the existing source.
4. Explicit manifest deletions are applied.
5. The uploaded ZIP is removed.
6. Tests run and the expanded source is committed.
7. GitHub Pages is deployed from the verified static source.
