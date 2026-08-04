// Canonical identities for known coding agents. AgentAvatar resolves the name
// it's given against this list — first match wins, so more specific entries
// (Claude Desktop) sit above their general sibling (Claude Code).
//
// Matching: the incoming name is flattened to lowercase alphanumerics
// ("Claude Code CLI" → "claudecodecli") and checked for alias containment.
// Aliases shorter than 4 chars ("pi", "zed") instead require a whole-token
// match, so "pi" can't fire inside "copilot".
//
// Logos live in ./logo/ — one SFC per agent, generic-mark placeholders until
// the official SVG is pasted in. To add an agent: drop a logo SFC in ./logo/,
// import it here, add an entry.
import Aider from './logo/Aider.vue'
import Claude from './logo/Claude.vue'
import Codex from './logo/Codex.vue'
import Copilot from './logo/Copilot.vue'
import Cursor from './logo/Cursor.vue'
import Devin from './logo/Devin.vue'
import Gemini from './logo/Gemini.vue'
import Generic from './logo/Generic.vue'
import Goose from './logo/Goose.vue'
import Grok from './logo/Grok.vue'
import Ollama from './logo/Ollama.vue'
import Openclaw from './logo/Openclaw.vue'
import Opencode from './logo/Opencode.vue'
import Openhands from './logo/Openhands.vue'
import Pi from './logo/Pi.vue'
import Windsurf from './logo/Windsurf.vue'
import Zed from './logo/Zed.vue'

export const AGENTS = [
  { slug: 'claude-desktop', label: 'Claude Desktop', logo: Claude, aliases: ['claudedesktop'] },
  { slug: 'claude-code', label: 'Claude Code', logo: Claude, aliases: ['claude'] },
  { slug: 'codex', label: 'Codex', logo: Codex, aliases: ['codex', 'chatgpt', 'openai'] },
  { slug: 'copilot', label: 'GitHub Copilot', logo: Copilot, aliases: ['copilot'] },
  { slug: 'cursor', label: 'Cursor', logo: Cursor, aliases: ['cursor'] },
  { slug: 'gemini', label: 'Gemini', logo: Gemini, aliases: ['gemini'] },
  { slug: 'goose', label: 'Goose', logo: Goose, aliases: ['goose'] },
  { slug: 'grok', label: 'Grok', logo: Grok, aliases: ['grok', 'xai'] },
  { slug: 'ollama', label: 'Ollama', logo: Ollama, aliases: ['ollama'] },
  { slug: 'opencode', label: 'opencode', logo: Opencode, aliases: ['opencode'] },
  { slug: 'openclaw', label: 'OpenClaw', logo: Openclaw, aliases: ['openclaw'] },
  { slug: 'openhands', label: 'OpenHands', logo: Openhands, aliases: ['openhands', 'allhands'] },
  { slug: 'windsurf', label: 'Windsurf', logo: Windsurf, aliases: ['windsurf', 'codeium'] },
  { slug: 'zed', label: 'Zed', logo: Zed, aliases: ['zed'] },
  { slug: 'aider', label: 'Aider', logo: Aider, aliases: ['aider'] },
  { slug: 'devin', label: 'Devin', logo: Devin, aliases: ['devin'] },
  { slug: 'pi', label: 'Pi', logo: Pi, aliases: ['pi'] },
]

const flatten = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

// Resolve an agent name to { slug, label, logo, known }. Unknown names keep
// their raw name as the label and get the generic mark.
export function resolveAgent(name) {
  const flat = flatten(name || '')
  const tokens = (name || '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
  for (const agent of AGENTS) {
    for (const alias of agent.aliases) {
      const hit = alias.length >= 4 ? flat.includes(alias) : tokens.includes(alias)
      if (hit) return { ...agent, known: true }
    }
  }
  return { slug: 'generic', label: name, logo: Generic, known: false }
}
