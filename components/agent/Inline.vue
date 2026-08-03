<template>
  <div class="flex items-center gap-3">
    <AgentPawn
      :state="PAWN_STATE[status] || 'working'"
      :provider="provider"
      :size="size"
      :decorations="status === 'idle'"
      class="shrink-0"
      :class="status === 'stopped' ? 'opacity-40' : ''"
    />

    <div class="min-w-0">
      <div class="text-14 font-bold leading-tight text-content truncate">
        <slot>{{ name }}</slot>
      </div>
      <div class="mt-0.5 flex items-center gap-1.5 text-12 leading-tight text-content-subtle whitespace-nowrap">
        <template v-if="vendor">
          <span class="truncate">{{ vendor }}</span>
          <span class="opacity-50">/</span>
        </template>
        <template v-if="kind">
          <span>{{ kind }}</span>
          <span class="opacity-50">/</span>
        </template>
        <span class="flex items-center gap-1.5">
          <span class="inline-block h-2 w-2 rounded-full" :class="DOTS[status] || DOTS.stopped" />
          {{ status }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
// AgentInline — compact agent identity for table rows and inline contexts:
// pixel pawn beside a bold name and a "Vendor / kind / ● status" sub-line.
// The status drives both the pawn body and the dot. Decorations are
// suppressed except idle's zzz — the sleeping pawn keeps its zzz (small
// enough at inline scale), while working's binary and errored's alert would
// dominate the row (the dot carries those signals). Sibling of AgentMiniCard
// (card contexts) and AgentAvatar (logo + label chip).
defineProps({
  // Display name, e.g. "Claude Code CLI". Overridable via the default slot.
  name:     { type: String, required: true },
  // Sub-line facts; either may be omitted (its separator drops with it).
  vendor:   { type: String, default: '' },
  kind:     { type: String, default: '' },
  // One of: active, idle, stopped, errored. idle renders the sleeping body;
  // stopped dims the pawn and hollows the dot.
  status: {
    type: String,
    default: 'active',
    validator: v => ['active', 'idle', 'stopped', 'errored'].includes(v),
  },
  // Provider logo overlaid on the pawn's face (see AgentPawn), e.g. "anthropic".
  provider: { type: String, default: '' },
  // Pawn width; number → px.
  size:     { type: [Number, String], default: 28 },
})

// Status → AgentPawn body state. active and stopped share the awake body
// (stopped is dimmed via opacity); errored keeps the awake body — its alert
// decor stays suppressed inline, the red dot carries the signal.
const PAWN_STATE = {
  active:  'working',
  idle:    'idle',
  stopped: 'working',
  errored: 'errored',
}

const DOTS = {
  active:  'bg-signal-success',
  idle:    'bg-grey-300',
  stopped: 'border border-stroke-strong bg-transparent',
  errored: 'bg-signal-error',
}
</script>
