// Resolve the color scheme (stored choice > OS preference > light) as soon as
// the client boots. `.client` suffix — never runs during SSR, so the server
// always renders the light (`:root`) defaults.
//
// Two-step on purpose: the `.dark` class is painted immediately (html isn't
// Vue-managed, so this can't cause a hydration mismatch and minimizes the
// light flash for dark users), but the reactive ref is only synced after
// app:mounted — components that render from `colorScheme` must hydrate
// against the server's light markup first.
import { defineNuxtPlugin } from '#app'
import { initColorScheme, resolveColorScheme } from '../composables/useThemeMode'

export default defineNuxtPlugin((nuxtApp) => {
  document.documentElement.classList.toggle('dark', resolveColorScheme() === 'dark')
  nuxtApp.hook('app:mounted', () => initColorScheme())
})
