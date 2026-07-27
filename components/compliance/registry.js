// Icon resolution for compliance-framework kinds. Deliberately NOT 1:1 —
// the icons are a small shared vocabulary (warn / scale / ribbon) reused
// across kinds, so several kinds map to the same icon. First match wins.
//
// Matching mirrors agent/registry.js: the incoming kind is flattened to
// lowercase alphanumerics ("Regulation/Standard" → "regulationstandard") and
// checked for alias containment; aliases shorter than 4 chars require a
// whole-token match instead.
//
// To add a kind: add an alias to the icon it should reuse (or drop a new icon
// SFC in ./icon/, import it here, add an entry).
import Ribbon from './icon/Ribbon.vue'
import Scale from './icon/Scale.vue'
import Warn from './icon/Warn.vue'

export const FRAMEWORK_KINDS = [
  { slug: 'risk-taxonomy', icon: Warn, aliases: ['risk', 'taxonomy', 'threat'] },
  { slug: 'regulation', icon: Scale, aliases: ['regulation', 'standard', 'law', 'act'] },
  { slug: 'attestation', icon: Ribbon, aliases: ['attestation', 'certification', 'audit'] },
  { slug: 'governance', icon: Ribbon, aliases: ['governance'] },
]

const flatten = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

// Resolve a framework kind to { slug, icon, known }. Unknown kinds fall back
// to the scale (the most framework-neutral mark).
export function resolveFrameworkKind(kind) {
  const flat = flatten(kind || '')
  const tokens = (kind || '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
  for (const entry of FRAMEWORK_KINDS) {
    for (const alias of entry.aliases) {
      const hit = alias.length >= 4 ? flat.includes(alias) : tokens.includes(alias)
      if (hit) return { ...entry, known: true }
    }
  }
  return { slug: 'generic', icon: Scale, known: false }
}
