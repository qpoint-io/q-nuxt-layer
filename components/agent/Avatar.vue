<template>
  <div class="flex items-center gap-2.5">
    <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-content text-11 font-bold text-surface">{{ initial }}</span>
    <span class="text-13 font-bold text-content">{{ name }}</span>
  </div>
</template>

<script setup>
// Inline identity chip: small filled initial circle + name label.
// For attributing a row or item to an agent/user inside dense layouts
// like table cells. For the larger interactive avatar, see UxAvatar.
const props = defineProps({
  name: { type: String, required: true },
})

const initial = computed(() => props.name.charAt(0))
</script>
