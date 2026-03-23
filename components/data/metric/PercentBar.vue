<template>
  <div class="w-full h-full">
    <div class="_bar h-full bg-grape-200" ></div>
  </div>
</template>

<style scoped>
  ._bar{
    width: v-bind('percent + "%"');
  }
</style>

<script setup>
const props = defineProps({
  percent:{ type: Number }
})
</script>
