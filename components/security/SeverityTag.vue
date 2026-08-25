<template>
  <!-- transition-colors duration-1000: palette swaps (ink on row open, a
       reclassified severity) glide on the same 1s clock as the table-list
       _darken-me open-row treatment -->
  <span
    class="inline-flex items-center whitespace-nowrap rounded-full border transition-colors duration-1000"
    :class="[s.pad, palette.pill]"
  >
    <span class="font-bold capitalize leading-none transition-colors duration-1000" :class="[s.text, palette.label]"><slot>{{ severity }}</slot></span>
  </span>
</template>

<script setup>
// Severity pill — the ComplianceTag chassis with no icon and a severity
// palette. THE canonical severity ladder for tag-scale UI (this component
// deliberately resolves the layer's prior split, where SecuritySeverity put
// `high` on warning while the qdash findings page put it on error):
//   critical — solid error fill: the only filled step, rank encoded by
//              intensity, not a fifth hue
//   high     — error outline
//   medium   — warning outline
//   low      — muted grey (matches ComplianceTag's `gap` register)
// Label defaults to the severity word; override via the default slot
// (e.g. <SecuritySeverityTag severity="critical">crit!</SecuritySeverityTag>).
// `size` follows the UxToggle prop convention ('small' | 'medium').
// `ink` — the open-row register (the table-list `_darken-me` treatment):
// content-ink border/text on a 10% content fill, severity hue dropped while
// the row is expanded. Consumers flip it from UxTableListExpandRow's
// @detailsOpen / @detailsClose.
const props = defineProps({
  severity: {
    type: String,
    required: true,
    validator: (value) => ['critical', 'high', 'medium', 'low'].includes(value),
  },
  size: { type: String, default: 'medium' }, // 'small' | 'medium'
  ink: { type: Boolean, default: false },
})

// literal class strings only — the layer's Tailwind scan must see them
const PALETTES = {
  critical: { pill: 'border-error bg-error', label: 'text-white' },
  high: { pill: 'border-error/60 bg-error/5', label: 'text-error' },
  medium: { pill: 'border-signal-warning/60 bg-signal-warning/10', label: 'text-signal-warning' },
  low: { pill: 'border-stroke-strong bg-surface-sunken', label: 'text-content-subtle' },
}

const SIZES = {
  small: { pad: 'px-2.5 py-1', text: 'text-11' },
  medium: { pad: 'px-3 py-1', text: 'text-13' },
}

const INK = { pill: 'border-content bg-content/10', label: 'text-content' }

const palette = computed(() =>
  props.ink ? INK : PALETTES[props.severity] || PALETTES.low)
const s = computed(() => SIZES[props.size] || SIZES.medium)
</script>
