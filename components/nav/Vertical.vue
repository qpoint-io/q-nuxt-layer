<template>
  <div class="mb-px32">
    <div v-if="title" class="text-12 uppercase tracking-[0.03em] font-semi border-b-1 border-b-stroke-strong text-content-subtle/80 mb-2 pb-1 pr-14">{{ title }}</div>
    <slot />
  </div>
</template>

<style scoped>
.router-link-exact-active {
  color: rgb(var(--qp-primary));
}
</style>

<script setup>
defineProps({
  title : { type:String }
})
</script>
