<template>
  <div>
    <DevLabel v-if="label"class="hairline mb-4 pb-1">{{ label }}</DevLabel>
    <slot/>
  </div>
</template>

<script setup>
const props = defineProps({
  label:{type:String}
})
</script>