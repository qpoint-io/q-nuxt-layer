<template>
  <div class="inline-flex flex-col items-start">
    <div class="flex flex-col items-start gap-2 bg-grey-800 px-4 py-3">
      <span class="font-mono text-13 text-white whitespace-nowrap">{{ text }}</span>
      <button
        class="self-end font-mono text-13 text-white bg-violet-500 hover:bg-violet-400 rounded-4 px-3 py-1 leading-tight"
        @click="emit('action')"
      >{{ buttonText }}</button>
    </div>
    <!-- Stepped pixel tail, pointing down toward the pawn's head. -->
    <div class="bg-grey-800" style="margin-left: 16px; width: 16px; height: 6px" />
    <div class="bg-grey-800" style="margin-left: 20px; width: 8px; height: 6px" />
  </div>
</template>

<script setup>
// AgentInputBubble — the "waiting for your input" callout that hangs above an
// AgentPawn in the needs-input state (drops into the pawn's above-head slot).
// Fixed dark styling to match the pixel-pawn art, which is dark-first.
defineProps({
  text:       { type: String, default: 'Waiting for your input' },
  buttonText: { type: String, default: 'Go to Agent' },
})

const emit = defineEmits(['action'])
</script>
