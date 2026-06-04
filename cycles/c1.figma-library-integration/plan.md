# c1 — Figma ↔ q-nuxt-layer Library Integration · Plan

## Context

`q-nuxt-layer` ships ~103 Vue components and a rich token set (`tailwind.config.js`). Two Figma files exist in parallel:

- **New** — *"Qpoint Design System"* (`wzzmExswgFGXNKQyDSqGMF`): token-wired (real `grape`/`grey` variables), self-described as "mirrored from q-nuxt-layer", but shallow — one page per component, ~15 components, no variant properties. Not yet published as a library.
- **Legacy** — *"app.qpoint.io - 3.0"* (`8pllCWHTjstwHaj5ZAZUOo`): a **published team library**, mature — a single "🌟 - Library" page with frames-per-component and real **variant sets** (Button `Flavor×State×Icon`, Toggle `On×Size`, Tag `size×outline×close×key/val`, `data/sparkline`, `data/percent-bar`, `data/rect-box`, nav, list-item, super-table, cloud/favicon icons) plus a `meta` documentation component. Reflects the *old* app and is not aligned to the current layer's tokens.

The goal: integrate these into one coherent, bidirectionally-synced design system bridged to the code library.

**Hard constraint:** Figma **Code Connect requires Org/Enterprise**; this account is **pro** ([docs](https://help.figma.com/hc/en-us/articles/23920389749655-Code-Connect)). So the bridge must be agent/MCP + token-JSON based, not Code Connect.

### Decisions (confirmed with user)

| Question | Decision |
|---|---|
| Source of truth | **Bidirectional** — tokens & components can lead from either side; drift tolerated |
| Bridge | **Agent + token JSON** — Figma MCP + this agent as sync engine; tokens via DTCG JSON. Stay on pro |
| Canonical file | **New file canonical**, port legacy's variant sets into it |
| Structure | **Foundations + category pages** (UX, Data, Health, Security, Icons), variant **component sets** |

## Recommended Architecture (answers the prompt's 3 asks)

**1. How to structure Figma** — In the canonical *Qpoint Design System* file:
- `Cover` (exists) → `Foundations` (color/type/spacing/radius variables + swatches) → category pages: `UX`, `Data`, `Health`, `Security`, `Icons`.
- One **component set per component**, with Figma **variant properties** that mirror the Vue `defineProps` enums (e.g. Button `kind`, Toggle `size`/`disabled`, Severity `severity`). This replaces page-per-component and matches the legacy file's proven, scalable pattern.
- Keep a `meta`/doc component (port from legacy) on each component for inline documentation.

**2. How to structure the bridge** — A repo-owned manifest, `figma/component-map.json`, is the spine:
```jsonc
{ "fileKey": "wzzmExswgFGXNKQyDSqGMF",
  "components": [
    { "code": "components/ux/Button.vue", "name": "UxButton",
      "figmaNodeId": "<set>", "figmaName": "ux/button",
      "props": { "kind": { "figmaProp": "Flavor", "map": {"":"Primary","stroke":"Secondary"} },
                 "disabled": { "figmaProp": "State", "map": {"true":"Disabled"} } } }
  ] }
```
The agent reads this to drive sync in either direction. No Figma plan upgrade required.

**3. How syncing happens** — two independent tracks, both drift-tolerant and manually triggered (a cycle ritual / `.claude` skill):
- **Tokens:** `tailwind.config.js` → generator → `tokens/tokens.json` (DTCG). Figma side uses **Tokens Studio** (free plugin) pointed at the same Git JSON, so Variables ↔ Tailwind round-trip. MCP can *read* Figma variables (`get_variable_defs`) for drift detection but cannot *write* them — Tokens Studio handles the Figma-write half.
- **Components:** agent-mediated via MCP. Code→Figma uses `use_figma`/`generate_figma_design` (needs `/figma-use` skill; some ops need a live desktop selection). Figma→code surfaces specs/diffs for manual application. The manifest records node IDs so re-runs update in place.

## Execution Phases

**Phase 0 — Kickoff & research artifact**
- Write `CYCLE.md` (Why/Objective/Scope) and promote the `cycles/CYCLES.md` entry from draft → active.
- Write `research/01-library-audit.md` capturing the two-file analysis, token map, and this architecture (so multiple agent runs share findings, per the prompt).

**Phase 1 — Reconciliation matrix**
- Produce `research/02-reconciliation.md`: a table of `code component ↔ new-file node ↔ legacy variant set`, flagging (a) legacy components worth porting, (b) code components missing from Figma, (c) token drift between `tailwind.config.js` and Figma variables. Read-only (MCP + repo).

**Phase 2 — Token bridge**
- Add `tokens/` to the repo: a small generator (`tokens/build.mjs`, Style Dictionary or hand-rolled) that emits `tokens/tokens.json` (DTCG) from `tailwind.config.js` token groups (grape 12-step, leaf 4-step, grey 13-step, semantic, fontSize, spacing `px8–64`, radius `1–32`, fontFamily/Weight).
- Document the Tokens Studio Figma-side setup pointing at this JSON. Verify against current Figma variables via `get_variable_defs`.

**Phase 3 — Figma structure migration**
- In the canonical file: create `Foundations` + category pages; rebuild components as variant **component sets** bound to the token variables; port legacy variant sets and the `meta` doc component. Agent-driven via Figma MCP (`/figma-use`).
- Start with a vertical slice: **Button, Toggle, Tag, SecuritySeverity, DataStat, DataSparkChart, HealthDial** — prove the pattern end-to-end before bulk migration.

**Phase 4 — Component bridge manifest**
- Author `figma/component-map.json` for the Phase-3 slice (node IDs captured during migration), with prop↔variant maps drawn from each component's `defineProps`.
- Add `figma/README.md` documenting the manifest schema and sync workflow.

**Phase 5 — Sync ritual & tooling**
- Add a `.claude/skills/figma-sync/` (or agent) describing the drift-detect → reconcile loop for both tracks, plus cadence guidance. Optionally extend `vue/` exports if any newly-needed components must be importable.
- Update root `CLAUDE.md` with a "Figma Integration" section pointing at `figma/` and `tokens/`.

## Critical Files

- `cycles/c1.figma-library-integration/{CYCLE.md, research/*.md}` — cycle artifacts
- `tokens/tokens.json`, `tokens/build.mjs` — token interchange (new)
- `figma/component-map.json`, `figma/README.md` — component bridge manifest (new)
- `.claude/skills/figma-sync/SKILL.md` — sync ritual (new)
- `tailwind.config.js` — token source (read; unchanged unless drift reconciliation requires)
- `CLAUDE.md` — add Figma Integration section

## Constraints & Risks

- **No Code Connect** on pro — bridge is convention + agent, not Figma-native binding. (Revisit if upgraded to Org.)
- **MCP cannot write Figma variables** — token writes to Figma go through Tokens Studio, not the agent.
- **Some MCP write/read ops need a live desktop selection** (`use_figma`, `get_design_context`, unscoped `get_variable_defs`). Migration steps that need this will prompt you to select a node; node-scoped reads work headless.
- **Bidirectional drift** needs a tie-break rule per change type — captured in the sync skill.

## Verification

- **Tokens:** `node tokens/build.mjs` emits `tokens.json`; spot-check `grape-500 #895AE8`, `grey-900 #111111`, `leaf-300 #58E392` match both `tailwind.config.js` and Figma `get_variable_defs`.
- **Structure:** `get_metadata` on the canonical file shows `Foundations` + category pages; Button is a component set with `Flavor`/`State` variant props.
- **Bridge round-trip (the real test):** take **UxButton** — change a prop default in code, run the sync ritual, confirm the Figma component set updates; then rename a Figma variant, run the reverse, confirm the manifest/spec flags the diff.
- **Slice acceptance:** all 7 Phase-3 components render in Figma with token-bound styles and variant props matching their `defineProps`.

## First Concrete Steps (on approval)

1. Kick off the cycle (CYCLE.md + promote CYCLES.md).
2. Write the Phase-1 reconciliation matrix (read-only analysis).
3. Stand up `tokens/build.mjs` → `tokens/tokens.json` and diff against live Figma variables.
4. Migrate the Button vertical slice in Figma to validate the structure + manifest pattern before scaling out.

---

## Source Material (for future agent runs)

- **Canonical Figma file:** `wzzmExswgFGXNKQyDSqGMF` — "Qpoint Design System" (19 pages today: Cover, Foundations, Button, Tag, BoxTag, Avatar, Severity, Link, Input, Toggle, DataStat, TrendDirection, KeyVal, PercentBar, HealthDial, SparkChart, Table, Overview). Page-per-component; tokens already wired (`grape-500 #895ae8`, `grape-100 #efebfc`, `grey-600 #565454`, `grey-900 #111111`).
- **Legacy Figma file:** `8pllCWHTjstwHaj5ZAZUOo` — "app.qpoint.io - 3.0", published **team** library. Node `388:774` = "🌟 - Library" single-page-with-frames. Mature variant sets: `ux/button` (Flavor=Primary/Secondary/Danger × state=Default/Hover/Pressed/Disabled × With Icon), `toggle` (On × Size 42/30/24), `text-field`/`input`/`helpers`/`select`/`radio`/`checkbox`, `tag` (size×outline, close×key/val×size), `tag-add`, `data` (line×type×delta), `data/sparkline` (a–d), `data/percent-bar`, `data/rect-box` (width full/75/50/25/5/0), `triangle` (flip), `nav`/`list-item`/`super-table`, cloud icons (aws/gcp/azure/k8s/docker/linux), brand favicons, `meta` doc component.
- **MCP gotchas:** `get_metadata` with no nodeId only lists the desktop-open page; probe an invalid node id to dump the full page list. `get_variable_defs`/`get_design_context`/`use_figma` need a live desktop selection (node-scoped reads work headless).
- **Code inventory:** `components/ux` (33), `components/icon` (26), `components/health` (4), `components/security` (7), `components/dev` (16), `components/data` (21, incl. `Stat`, `SparkChart`, `PercentBar`, `KeyVal`, `TrendDirection`, `metric/*`). `vue/` barrel currently exports only dev-controls. No existing Code Connect / figma config.
