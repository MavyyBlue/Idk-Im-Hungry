# Idk, I'm Hungry

A mobile-first food decision helper for the moment when you know you need to eat but cannot identify what sounds good.

Instead of presenting a giant menu, the app asks one low-pressure question at a time and treats reactions like **Shrug**, **Ehhh**, and **Nnngh** as real signals rather than collapsing them into “No.”

## V0.1 vertical slice

- Choosing for myself / helping someone choose profiles
- Restaurant-first questioning using a Bartlesville, Oklahoma starter set
- “I’m hungry and nothing sounds good” sensory-first mode
- Broad-to-specific trait questions
- Seven-reaction vocabulary
- Three-candidate shortlist with compatibility indicators
- Hard food rejection and “Absolutely Not” trait elimination
- Lightweight local learning for ambiguous reactions
- Local-only history using `localStorage`
- Installable/offline-friendly PWA shell

## Privacy and architecture

V0.1 has no account system, backend, location permission, restaurant API, or cloud database. Restaurant data is a small editable seed dataset. Preference history stays in the browser on the device that created it.

## Tests

Requires Node.js 20+ only. There are no runtime dependencies.

```bash
npm test
```

## Mobile development handoff

The repository uses `.github/workflows/mobile-import.yml` to support phone-first development. One-time repository setup: **Settings → Pages → Source → GitHub Actions**.

1. Upload `idk-source.zip` to the repository root.
2. The workflow validates the ZIP and its `idk-patch.json` manifest.
3. The ZIP is safely expanded as an overlay over the existing source.
4. Explicit manifest deletions are applied.
5. The uploaded ZIP is removed.
6. Tests run and the expanded source is committed.
7. GitHub Pages is deployed from the verified static source.

The workflow file itself is protected from ZIP overlays so a bad patch cannot silently replace the importer while it is running.
