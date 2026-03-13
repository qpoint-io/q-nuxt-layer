<template>
  <div
    class="relative py-4 px-6 bg-white border flex flex-col gap-[7px] rounded-12 shadow-lg shrink-0"
    :style="{ borderColor, maxWidth }"
  >
    <slot />
    <SecurityPolicyRibbon
      v-if="ribbon"
      :state="state"
      class="absolute -bottom-4 -right-4"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  state:    { type: String,  default: 'cool' },    // 'cool' | 'hot' | 'warm' | 'default' | 'white-list'
  maxWidth: { type: String,  default: '350px' },
  ribbon:   { type: Boolean, default: true },
})

const palette = {
  hot:            '#ff0200',
  warm:           '#FFB020',
  cool:           '#49cf81',
  default:        '#BBA5FF',
  'white-list':   '#84CAFF',
}

const borderColor = computed(() => palette[props.state] || palette.cool)
</script>
