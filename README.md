# Idk, I'm Hungry

A mobile-first food decision helper for the moment when you know you need to eat but cannot identify what sounds good.

Instead of presenting a giant menu, the app asks one low-pressure question at a time and treats reactions like **Shrug**, **Ehhh**, and **Nnngh** as real signals rather than collapsing them into “No.”

## V0.3

- Local named accounts for choosing for yourself or helping someone else
- Separate learning/history/Safe Foods per account
- Existing V0.1/V0.2 self history migrates into the default `Me` account
- Safe Food catalog with add, edit, hide/unhide, and delete
- User-added Safe Foods accept optional source/place plus keyword tags
- Hidden Safe Foods are removed from recommendation sessions without deleting them
- First question is time-aware using the device clock, but meal timing remains a preference rather than a restriction
- Over 100 built-in specific candidates plus user-created exact foods
- Broad-to-niche staged questioning with branch-specific detail prompts
- Exact-candidate questions when the pool becomes narrow
- Keep Drilling starts a real refinement round and pushes previously shown finalists downward so alternatives can surface
- Nope is a hard session rejection and rejected foods cannot return
- “Nothing sounds good” mode remains intentionally short
- Seven-reaction vocabulary preserved
- Installable/offline-friendly PWA shell

## Privacy and architecture

V0.3 still has no backend, cloud database, email/password authentication, location permission, payments, or restaurant API. “Accounts” are named local profiles stored in the browser on this device. Safe Foods and preference history stay local.

## Tests

Requires Node.js 20+ only. There are no runtime dependencies.

```bash
npm test
```

## Mobile development handoff

The repository uses `.github/workflows/mobile-import.yml` to support phone-first development. Repository Pages source should remain **GitHub Actions**.

1. Upload `idk-source.zip` to the repository root.
2. The workflow validates the ZIP and its `idk-patch.json` manifest.
3. The ZIP is safely expanded as an overlay over the existing source.
4. Explicit manifest deletions are applied.
5. The uploaded ZIP is removed.
6. Tests run and the expanded source is committed.
7. GitHub Pages is deployed from the verified static source.

The workflow file itself is protected from ZIP overlays so a bad patch cannot silently replace the importer while it is running.
