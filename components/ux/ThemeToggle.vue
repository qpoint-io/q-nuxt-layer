<template>
  <button
    type="button"
    class="flex items-center justify-center w-8 h-8 rounded-6 cursor-pointer text-content-muted hover:text-content hover:bg-surface-sunken"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggleColorScheme()"
  >
    <IconMoon v-if="isDark" class="w-[18px]" />
    <IconSun v-else class="w-[18px]" />
  </button>
</template>

<script setup>
const { colorScheme, toggleColorScheme } = useColorScheme()

// Gated on mounted so SSR and hydration always render the same branch (the
// server doesn't know the client's scheme) — the real icon swaps in right
// after mount. Without this, a dark-preferring client mangles the SVG during
// hydration.
const mounted = ref(false)
onMounted(() => { mounted.value = true })
const isDark = computed(() => mounted.value && colorScheme.value === 'dark')
</script>
