import { inject, provide, computed, ref, type Ref } from 'vue'

const THEME_KEY = Symbol('theme-mode')

type ThemeMode = 'light' | 'dark'

/* ── Global color scheme (document-level dark mode) ─────────────────────────
   Singleton state backing the `.dark` class on <html>. All DOM/storage access
   is guarded so this is safe to import (not call) during SSR; the actual
   resolution happens in plugins/theme.client.ts after hydration. */

const STORAGE_KEY = 'qp-theme'

const colorScheme = ref<ThemeMode>('light')

function applyColorScheme(mode: ThemeMode) {
  colorScheme.value = mode
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', mode === 'dark')
  }
}

/** Set the scheme explicitly and persist the choice. */
export function setColorScheme(mode: ThemeMode) {
  applyColorScheme(mode)
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, mode)
  } catch { /* storage unavailable (private mode, etc.) — non-fatal */ }
}

export function toggleColorScheme() {
  setColorScheme(colorScheme.value === 'dark' ? 'light' : 'dark')
}

/** Resolve the preferred scheme without applying it:
    stored choice > OS preference > light. */
export function resolveColorScheme(): ThemeMode {
  let stored: string | null = null
  try {
    if (typeof localStorage !== 'undefined') stored = localStorage.getItem(STORAGE_KEY)
  } catch { /* ignore */ }

  if (stored === 'light' || stored === 'dark') return stored
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

/** Resolve and apply the initial scheme, without persisting — OS-preference
    users keep following the OS until they explicitly toggle.
    Client-only (called from theme.client.ts).

    SSR note: the server always renders light, so any component that renders
    from `colorScheme` must gate on a mounted flag (see UxThemeToggle) —
    otherwise a dark-preferring client hydrates against mismatched markup.
    Nuxt's root Suspense means no plugin hook runs late enough to avoid this
    for async layouts/pages. */
export function initColorScheme() {
  applyColorScheme(resolveColorScheme())
}

export function useColorScheme() {
  return { colorScheme, setColorScheme, toggleColorScheme, initColorScheme }
}

/**
 * Provide dark mode context to descendants.
 * Call from a parent/wrapper component.
 */
export function provideThemeMode(mode: Ref<ThemeMode> | ThemeMode) {
  provide(THEME_KEY, mode)
}

/**
 * Resolve the active theme mode.
 * Priority: explicit prop > injected context > 'light' default.
 */
export function useThemeMode(propMode?: ThemeMode | null) {
  const injected = inject<Ref<ThemeMode> | ThemeMode | undefined>(THEME_KEY, undefined)

  const resolved = computed<ThemeMode>(() => {
    if (propMode && propMode !== 'light') return propMode
    if (injected) return typeof injected === 'string' ? injected : injected.value
    return 'light'
  })

  const isDark = computed(() => resolved.value === 'dark')

  return { mode: resolved, isDark }
}
