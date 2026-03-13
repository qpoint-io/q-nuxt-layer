import { inject, provide, computed, type Ref } from 'vue'

const THEME_KEY = Symbol('theme-mode')

type ThemeMode = 'light' | 'dark'

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
