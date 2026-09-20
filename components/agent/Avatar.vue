<template>
  <div class="flex items-center gap-2.5">
    <component :is="agent.logo" class="shrink-0 text-content" :style="{ width: `${size}px`, height: `${size}px` }" />
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
  // Logo edge in px — 20 for rows and chips; larger as a page's identity mark (ActorHeader #mark).
  size: { type: Number, default: 20 },
})

const agent = computed(() => resolveAgent(props.name))
</script>
