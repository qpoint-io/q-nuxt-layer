<template>
  <div class="flex items-center gap-2.5">
    <component :is="agent.logo" class="h-5 w-5 shrink-0 text-content" />
    <span class="text-13 font-bold text-content">{{ label || agent.label }}</span>
  </div>
</template>

<script setup>
// Inline identity chip: agent logo + name label, for attributing a row or
// item to an agent inside dense layouts like table cells. `name` is resolved
// against the known-agent registry (./registry.js) to pick the logo and a
// canonical label ("cursor-agent" → Cursor logo + "Cursor"); unknown agents
// get the generic mark and their raw name. `label` overrides the shown text
// without affecting logo resolution. For the larger interactive people
// avatar, see UxAvatar.
import { resolveAgent } from './registry'

const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, default: '' },
})

const agent = computed(() => resolveAgent(props.name))
</script>
