<template>
  <form @submit.prevent="">
    <div :class="`${position == 'center' && 'mx-auto'} max-w-[640px] flex flex-col gap-y-px24`">
      <slot />
    </div>
  </form>
</template>

<script setup>
defineProps({
  position: { type: String, default: 'center' }
})
</script>
