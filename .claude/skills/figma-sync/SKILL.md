---
name: figma-sync
description: Reconcile the Qpoint Figma design system with the q-nuxt-layer code library — tokens and components, in either direction. Use when asked to sync Figma, push components/tokens to Figma, pull design changes into code, or check for design/code drift.
---

# figma-sync

Keeps the canonical Figma file (**Qpoint Design System**, `wzzmExswgFGXNKQyDSqGMF`)
and the code library in step. Bidirectional and **drift-tolerant** — the goal is
"both sides well-served," not byte-identical. Background and decisions:
`cycles/c1.figma-library-integration/`.

## Two tracks

### 1. Tokens
Source of truth: `tailwind.config.js`. Interchange: `tokens/tokens.json` (DTCG).
- **Regenerate:** `npm run tokens`.
- **Code → Figma:** after regenerating, apply via the **Tokens Studio** plugin
  (the MCP cannot write Figma variables).
- **Figma → code:** pull the Tokens Studio diff and reconcile into
  `tailwind.config.js` by hand (reviewed, deliberate).
- **Drift check:** `get_variable_defs` on a token-bound node vs `tokens.json`.
- Details: `tokens/README.md`.

### 2. Components
Bridge: `figma/component-map.json`. Source of truth depends on the change type
(props/structure → code-first; visual styling → Figma-first).

**Code → Figma (for each manifest entry):**
1. Read the component's `defineProps`; diff against the manifest `props`.
2. If `figmaNodeId` is null → build a new variant set; else update in place.
3. Build/update via Figma MCP — **load the `/figma-use` skill first**, then
   `use_figma` / `generate_figma_design`. Bind colors/spacing/type to token
   variables (never hard-coded hex).
4. Write the resulting `figmaNodeId` back into the manifest; set `status: synced`.

**Figma → code:**
1. `get_metadata` (full page list: probe an invalid node id if needed) →
   `get_context_for_code_connect` on the component set.
2. Diff its variant properties against the manifest; surface a spec/diff.
3. Apply changes to the Vue component manually; update the manifest.

## Operational notes
- `use_figma`, `get_design_context`, unscoped `get_variable_defs` need a **live
  desktop selection** — ask the user to select the target node. Node-scoped
  `get_metadata` / `get_variable_defs` work headless.
- `get_metadata` with no nodeId only lists the page open in the desktop app;
  probe an invalid node id (e.g. `99:1`) to dump the full page list.
- Mature variant sets to port live in the legacy file `8pllCWHTjstwHaj5ZAZUOo`
  (node `388:774`); `legacyNodeId` in the manifest points at them.

## Structure invariants (don't regress)
- Canonical file pages: `Cover`, `Foundations`, then category pages `UX`, `Data`,
  `Health`, `Security`, `Icons`.
- One **component set per component**; variant props mirror `defineProps` enums.
- Every component carries a `meta` doc note (ported from legacy).
