<template>
  <div>

    <span
      class="nuxt-icon"
      :class="[filled ? 'nuxt-icon--fill' : '' , (hasStroke && !filled)? 'nuxt-icon--stroke' : '']"
      v-html="processedIcon"
    />
  </div>
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
    const iconsImport = import.meta.glob('~/assets/svg-icons/**/*.svg', {
      eager: false,
      query: '?raw',
      import: 'default'
    })

    const rawIcon = await iconsImport[`/assets/svg-icons/${props.id}.svg`]()
    if (rawIcon.includes('stroke')) { hasStroke = true }
    icon.value = rawIcon
    processedIcon.value = processSvgStyles(rawIcon)
  } catch (error) {
    console.error(
      `[nuxt-icons] Icon '${props.id}' doesn't exist in 'assets/svg-icons'`,
      error
    )
  }
}

await getIcon()

watchEffect(getIcon)
</script>

<style>
.nuxt-icon svg {
  vertical-align: middle;
  width: 100%;
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
