<template>
  <span class="inline-flex items-stretch overflow-hidden rounded-8 border border-grape-300 bg-grape-50">
    <span class="flex shrink-0 items-center border-r border-grape-300 bg-surface" :class="stacked ? 'px-2.5' : 'px-2'">
      <img :src="pawnUrl" alt="" :class="stacked ? 'h-7' : 'h-5'" class="w-auto" />
    </span>
    <span v-if="stacked" class="flex flex-col justify-center px-2.5 py-1 leading-tight">
      <span class="text-13 font-bold text-grape-600">{{ name }}</span>
      <span v-if="user" class="text-12 italic text-grape-600">{{ user }}</span>
    </span>
    <span v-else class="flex items-center gap-1.5 px-2.5 py-1 text-13 font-semi text-grape-600 whitespace-nowrap">
      {{ name }}<template v-if="user"><span class="text-grape-400">/</span>{{ user }}</template>
    </span>
  </span>
</template>

<script setup>
// Agent pill: pixel-pawn face in its own cell + agent name and user in grape.
// The identity chip for table cells and attribution rows where the agent AND
// the person matter ("Claude Code / sofia"). Two layouts:
//   inline (default) — one line: name / user
//   `stacked`        — name bold over the user in italic (taller contexts)
// Art via <img> from the layer's own assets (the AgentPawn pattern — pawn art
// carries its own colors, so never UxIcon). For logo-based attribution
// without the person, see AgentAvatar; for the animated pawn, AgentPawn.
import pawnUrl from '../../assets/svgs/pixel-pawns/agent-defaulta.svg?url'

defineProps({
  name: { type: String, required: true },
  user: { type: String, default: '' },
  stacked: { type: Boolean, default: false },
})
</script>
