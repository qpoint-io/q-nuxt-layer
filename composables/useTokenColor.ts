import { computed, type ComputedRef } from 'vue'
import { useColorScheme } from './useThemeMode'
// Requires tokens/ in package.json "files" — provides role names + SSR/no-css fallbacks
import { semantic } from '../tokens/semantic.mjs'

/* ── Semantic token colors for script-side use ───────────────────────────────
   Templates should use the Tailwind classes (bg-surface, text-content, …).
   These helpers exist for colors that live in JS: inline styles, SVG
   attributes, and canvas (Chart.js).

   Which one to use:
   - qp(role)            → DOM-resolved CSS string. For inline styles and SVG
                           rendered in the DOM — CSS resolves the var live, so
                           it flips with the theme for free.
                           NEVER pass to Chart.js/canvas: a canvas 2D context
                           cannot resolve var() and silently paints black.
   - useTokenColor(role) → reactive, fully-resolved color. For canvas/Chart.js
                           — reference .value inside a computed config so the
                           chart recolors when the theme toggles.
   - resolveTokenColor() → one-shot resolved color (rarely needed directly).

   Note: roles are the CSS-var names from tokens/semantic.mjs — signal roles
   are plain 'error'/'success'/'warning'/'info' here, NOT the Tailwind-facing
   'signal-*' keys. */

export type TokenRole = keyof typeof semantic

// '#RGB' | '#RRGGBB' → 'R G B' (same channel form tokens.css uses)
function hexToChannels(hex: string): string {
  let h = hex.replace('#', '')
  if (h.length === 3) h = h.split('').map(c => c + c).join('')
  const n = parseInt(h, 16)
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`
}

function warnUnknownRole(role: string) {
  if (import.meta.dev) console.warn(
    `[useTokenColor] unknown token role '${role}' — valid roles: ${Object.keys(semantic).join(', ')}`
  )
}

/** Static CSS color string backed by the theme var — for DOM/SVG/inline styles only. */
export function qp(role: TokenRole, alpha?: number): string {
  if (!(role in semantic)) warnUnknownRole(role)
  return alpha != null
    ? `rgb(var(--qp-${role}) / ${alpha})`
    : `rgb(var(--qp-${role}))`
}

/** Resolve a token role to a concrete color string — canvas-safe.
    SSR → light value (the server always renders light, see useThemeMode.ts).
    Client → live --qp-* var (honors runtime overrides like the theme editor),
    falling back to semantic.mjs when tokens.css isn't loaded. */
export function resolveTokenColor(role: TokenRole, alpha?: number): string {
  if (!(role in semantic)) warnUnknownRole(role)

  let channels = ''
  if (typeof document !== 'undefined') {
    channels = getComputedStyle(document.documentElement)
      .getPropertyValue(`--qp-${role}`).trim()
  }
  if (!channels) {
    const { colorScheme } = useColorScheme()
    const mode = typeof document === 'undefined' ? 'light' : colorScheme.value
    channels = hexToChannels(semantic[role]?.[mode] ?? '#000000')
  }
  return alpha != null ? `rgb(${channels} / ${alpha})` : `rgb(${channels})`
}

/** Reactive resolved color — re-evaluates on theme toggle. For canvas/Chart.js. */
export function useTokenColor(role: TokenRole, alpha?: number): ComputedRef<string> {
  const { colorScheme } = useColorScheme()
  return computed(() => {
    // touch the ref so the computed tracks theme flips; the .dark class is
    // already applied by the time this re-runs (applyColorScheme is sync)
    void colorScheme.value
    return resolveTokenColor(role, alpha)
  })
}
