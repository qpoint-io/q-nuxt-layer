<template>
  <span
    class="nuxt-icon"
    :class="[filled ? 'nuxt-icon--fill' : '' , (hasStroke && !filled)? 'nuxt-icon--stroke' : '']"
    v-html="processedIcon"
  />
</template>

<script setup>
const props = defineProps({
  id:     {type: String, required: true},
  filled: {type: Boolean, default: false},
})

const icon = ref('')
const processedIcon = ref('')
let hasStroke = false

function processSvgStyles(svgContent) {
  // add unique id to svg to prevent collisions
  const uniqueId = `icon-${props.id}-${Math.random().toString(36).substr(2, 9)}`
  const svgWithClass = svgContent.replace('<svg', `<svg class="${uniqueId}"`)

  // Extract and modify internal styles
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/g
  let modifiedSvg = svgWithClass

  modifiedSvg = modifiedSvg.replace(styleRegex, (match, styleContent) => {
    // Scope all CSS rules to the unique class
    const scopedStyles = styleContent
      .split('}')
      .filter(rule => rule.trim())
      .map(rule => {
        const [selector, ...declarations] = rule.split('{')
        return `.${uniqueId} ${selector.trim()} {${declarations.join('{')}`
      })
      .join('}')

    return `<style>${scopedStyles}</style>`
  })

  return modifiedSvg
}

async function getIcon () {
  try {
    // Layer icons (shared/common)
    const layerIcons = import.meta.glob('../../assets/icons/**/*.svg', {
      eager: false,
      query: '?raw',
      import: 'default'
    })

    // App icons (app-specific, e.g. nav icons)
    const appIcons = import.meta.glob('~/assets/svg-icons/**/*.svg', {
      eager: false,
      query: '?raw',
      import: 'default'
    })

    // Try layer first, then fall back to app icons
    const layerPath = `../../assets/icons/${props.id}.svg`

    let loader = layerIcons[layerPath]
    if (!loader) {
      // Find matching app icon by suffix
      const appKey = Object.keys(appIcons).find(k => k.endsWith(`/${props.id}.svg`))
      if (appKey) loader = appIcons[appKey]
    }

    if (!loader) {
      console.error(`[nuxt-icons] Icon '${props.id}' not found in layer or app assets`)
      return
    }

    const rawIcon = await loader()
    if (rawIcon.includes('stroke')) { hasStroke = true }
    icon.value = rawIcon
    processedIcon.value = processSvgStyles(rawIcon)
  } catch (error) {
    console.error(
      `[nuxt-icons] Icon '${props.id}' doesn't exist in 'assets/icons'`,
      error
    )
  }
}

await getIcon()

watchEffect(getIcon)
</script>

<style>
.nuxt-icon {
  display: inline-flex;
}
.nuxt-icon svg {
  width: 100%;
  height: 100%;
}
.nuxt-icon.nuxt-icon--fill,
.nuxt-icon.nuxt-icon--fill * {
  fill: currentColor !important;
}

.nuxt-icon.nuxt-icon--stroke,
.nuxt-icon.nuxt-icon--stroke *{
  stroke: currentColor !important;
}
</style>
