<template>
  <div class="flex flex-col gap-3">
    <TranscriptMessage
      v-for="(message, i) in turn.messages"
      :key="i"
      :message="message"
      :userName="userName"
    />
  </div>
</template>

<script setup>
// One turn's message stack — a turn is a titled/summarized unit the
// TranscriptNavigator points at, but the title/summary themselves only
// surface in the navigator's hover card, not inline in the turn body.
defineProps({
  turn:     { type: Object, required: true }, // TranscriptTurn
  userName: { type: String, required: true },
})
</script>
