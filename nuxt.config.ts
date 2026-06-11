import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// Resolved paths are the documented approach for Nuxt Layers.
// https://nuxt.com/docs/guide/going-further/layers
const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  css: [
    join(currentDir, 'assets/css/shared.css'),
  ],

  tailwindcss: {
    cssPath: false,  // We provide @tailwind directives in shared.css
    exposeConfig: true,
  },

  modules: [
    '@nuxtjs/tailwindcss',
  ],

  components: {
    dirs: [
      join(currentDir, 'components'),
    ]
  },

  imports: {
    dirs: [
      join(currentDir, 'composables'),
      join(currentDir, 'composables/slot'),
    ]
  },

  // Explicit registration so the plugin fires for both NUXT_LOCAL_LAYER and
  // published-package consumers (don't rely on implicit layer plugin scan).
  plugins: [
    join(currentDir, 'plugins/theme.client.ts'),
  ],

  alias: {
    '$layer': currentDir,
  },

  compatibilityDate: '2025-07-15',
})
