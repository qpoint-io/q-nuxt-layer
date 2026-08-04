<template>
  <div class="flex items-center gap-3">
    <EndpointPawn
      :size="size"
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
// EndpointInline — compact endpoint (device) identity for table rows and
// inline contexts: machine pixel pawn beside a bold name and a
// "Vendor / kind / ● status" sub-line. Endpoint in the security sense — a
// laptop, workstation, or VM where agents run. Entity sibling of AgentInline:
// same layout grammar, same status dot language, machine pawn instead of
// agent. The pawn has one body, so status only drives the dot (and stopped
// dims the pawn); no sleeping art.
defineProps({
  // Display name, e.g. "marks-macbook-pro". Overridable via the default slot.
  name:     { type: String, required: true },
  // Sub-line facts, e.g. vendor "Apple", kind "laptop"; either may be
  // omitted (its separator drops with it).
  vendor:   { type: String, default: '' },
  kind:     { type: String, default: '' },
  // One of: active, idle, stopped, errored. stopped dims the pawn and
  // hollows the dot.
  status: {
    type: String,
    default: 'active',
    validator: v => ['active', 'idle', 'stopped', 'errored'].includes(v),
  },
  // Pawn width; number → px. The endpoint art is landscape, so this default
  // differs from AgentInline's 28 (dialed to 29 by eye against the two-line
  // text block).
  size:     { type: [Number, String], default: 29 },
})

const DOTS = {
  active:  'bg-signal-success',
  idle:    'bg-grey-300',
  stopped: 'border border-stroke-strong bg-transparent',
  errored: 'bg-signal-error',
}
</script>
