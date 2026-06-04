# figma/ — design ↔ code bridge

The component half of the Figma ↔ code sync (cycle c1). Since **Code Connect is
unavailable on the pro plan**, this repo-owned manifest is the bridge: it records
which Figma component set corresponds to which Vue component, and how each `prop`
maps to a Figma **variant** or **text** property. The agent reads it to drive sync
in either direction.

## Files

- **`component-map.json`** — the manifest (see schema below).
- **`README.md`** — this file: schema + sync workflow.

## Manifest schema

```jsonc
{
  "canonicalFile": { "name", "fileKey" },   // the Qpoint Design System file
  "legacySource":  { "name", "fileKey", "libraryNode" },  // app.qpoint.io - 3.0
  "components": [
    {
      "code":        "components/ux/Button.vue", // repo-relative source path
      "name":        "UxButton",                 // Nuxt auto-import name
      "figmaName":   "ux/button",                // component-set name in Figma
      "figmaNodeId": null,                        // set during Phase-3 migration
      "legacyNodeId":"5:3467",                    // node to port from, if any
      "status":      "pending-build | synced | drift",
      "props": {
        "<vueProp>": {
          "figmaProp": "Flavor",                  // Figma variant/property name
          "type":      "variant | text | boolean",
          "map":       { "<vueValue>": "<figmaValue>" },
          "required":  true,
          "note":      "freeform"
        }
      }
    }
  ]
}
```

`figmaNodeId` is `null` until a component is built in Figma; the migration step
fills it so future runs update in place rather than duplicating.

## Sync workflow

Driven by the `figma-sync` skill (`.claude/skills/figma-sync/`). Summary:

- **Code → Figma:** for each component, read `defineProps`, diff against the
  manifest's `props`, and (re)build the Figma variant set via the Figma MCP
  (`use_figma` / `generate_figma_design`). Bind styles to token variables.
- **Figma → code:** read the Figma component set (`get_metadata` /
  `get_context_for_code_connect`), diff variant props against the manifest, and
  surface a spec/diff for manual application to the Vue component.
- **Drift is acceptable** (bidirectional policy). The manifest's `status` field
  flags components that have diverged so they can be reconciled deliberately.

## Constraints

- `use_figma`, `get_design_context`, and unscoped `get_variable_defs` need a
  **live selection** in the Figma desktop app. Node-scoped `get_metadata` /
  `get_variable_defs` work headless.
- Tokens are bridged separately — see `tokens/README.md`.
- Full background: `cycles/c1.figma-library-integration/`.
