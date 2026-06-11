<template>
  <div
    class="box-tag font-med text-14 px-2 rounded-4 inline-block"
    :class="(mode == 'border')? 'border-2 border-content' : 'bg-content text-surface'"
  >
    <slot/>
  </div>
</template>

<script setup>
const props = defineProps({
  mode: {type: String, default: ""}
})
</script>
