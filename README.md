# Idk, I'm Hungry

A mobile-first food decision helper for the moment when you know you need to eat but cannot identify what sounds good.

The app asks one question at a time, learns from lightweight local history, and narrows toward specific foods without forcing the user through a giant menu.

## V0.4 playable slice

- Local per-person accounts/profiles
- User-created Safe Foods with edit, hide/unhide, and delete
- Tap-first Safe Food keyword chips instead of manual keyword typing
- Time-of-day opening context that influences but never forbids off-hours cravings
- Continuous 0–100 reaction slider with animated mood feedback
- Semantic slider zones including Absolutely Not, Nnngh, Ehhh, Shrug, Sure, Definitely, and Absolutely Yes
- Harsher negative weighting than symmetric positive weighting
- Far-left slider reactions are authoritative hard eliminations
- Below-middle reactions suppress matching candidates without automatically deleting the entire branch
- Three-result shortlist with compatibility indicators that can now fall genuinely low
- Nope hard-rejects exactly one result and replaces only that slot
- Keep Drilling starts a genuine refinement round instead of replaying the same shortlist
- Over 100 built-in specific food candidates plus visible Safe Foods
- Offline-friendly PWA shell with local persistence

## Privacy and architecture

V0.4 is still local-first. There is no email/password authentication, cloud sync, backend, restaurant API, payment system, or location permission. Each device stores its own accounts, Safe Foods, history, and preference learning.

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
