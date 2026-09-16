# Idk, I'm Hungry

A mobile-first food decision helper for the moment when you know you need to eat but cannot identify what sounds good.

Instead of presenting a giant menu, the app asks one low-pressure question at a time and treats reactions like **Shrug**, **Ehhh**, and **Nnngh** as real signals rather than collapsing them into “No.”

## V0.2 — deep narrowing

V0.2 changes the engine from a small flat food list into a deeper Akinator-style narrowing system.

- Choosing for myself / helping someone choose profiles
- Brief restaurant-first probing using a Bartlesville, Oklahoma starter set
- Automatic strategy switch after weak restaurant reactions
- “I’m hungry and nothing sounds good” 7-question sensory-first mode
- 104 specific/actionable food candidates across savory, breakfast, snack, grocery-bakery, and dessert branches
- Family/subfamily metadata plus sensory, ingredient, preparation, format, and effort traits
- Staged broad → family → preparation → nitty-gritty questioning
- Branch-specific detail prompts only when relevant
- Exact candidate questions once the pool is narrow enough
- Seven-reaction vocabulary preserved
- Three-candidate shortlist with compatibility labels
- Hard property and exact-food rejection authority
- Lightweight local learning for ambiguous reactions plus selected family/tag affinity
- Backward-compatible local-only history using the existing `localStorage` profile key
- Installable/offline-friendly PWA shell

A motivating specificity case is represented directly in the seed data: **Walmart Chantilly & Berries cake** is a concrete leaf under the cake/grocery-bakery branch rather than merely returning “cake.” The same depth model applies to savory categories too.

## Privacy and architecture

There is no account system, backend, live location permission, restaurant API, or cloud database. Establishment data is an editable seed dataset. Preference history stays in the browser on the device that created it.

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

Do not use “Re-run jobs” on an old ZIP-import run after its expanded-source commit has advanced `main`; start the workflow from current `main` instead if a clean deployment-only run is needed.
