# tokens/ — design token bridge

The token half of the Figma ↔ code sync (cycle c1). `tailwind.config.js` is the
single source of truth; this directory exposes those tokens in a portable format
for Figma and other consumers.

## Files

- **`build.mjs`** — generator. Reads `tailwind.config.js` and writes `tokens.json`.
- **`tokens.json`** — generated [DTCG](https://tr.designtokens.org/format/) token set. **Do not edit by hand** — re-run the generator.

## Regenerate

```bash
npm run tokens        # or: node tokens/build.mjs
```

Emits `color` (grape/leaf/grey/semantic/accent), `fontFamily`, `fontSize`
(with line-height in `$extensions`), `fontWeight`, `spacing`, `radius`, `borderWidth`.

## Figma side (the other half of bidirectional sync)

The Figma MCP can **read** variables (`get_variable_defs`) for drift detection but
**cannot write** them. To push/pull tokens on the Figma side, use the **Tokens
Studio** plugin (free) in the canonical file (`wzzmExswgFGXNKQyDSqGMF`):

1. Install Tokens Studio in Figma.
2. Point its Git sync at this repo, `tokens/tokens.json` (DTCG provider).
3. **Code → Figma:** after `npm run tokens`, pull in Tokens Studio and apply to
   Figma Variables.
4. **Figma → code:** when a designer changes a variable, push from Tokens Studio;
   reconcile the JSON diff back into `tailwind.config.js` by hand (the config stays
   the source of truth, so this is a deliberate, reviewed step — drift is expected
   and acceptable per the cycle's bidirectional policy).

## Drift check

Spot-check generated values against live Figma variables:

```bash
node -e 'const t=require("./tokens/tokens.json");
console.log(t.color.grape["500"].$value, t.color.grey["900"].$value)'
# → #895AE8 #111111   (compare to get_variable_defs on a token-bound node)
```

Confirmed in sync at cycle start (2026-06-04): `grape-500`, `grape-100`,
`grey-600`, `grey-900` match between `tokens.json` and Figma. A full-collection
comparison needs a live Figma desktop selection (or a REST pull) — see
`cycles/c1.figma-library-integration/research/01-library-audit.md`.
