<template>
  <span
    class="inline-flex items-center whitespace-nowrap rounded-full border"
    :class="[s.pad, s.gap, palette.pill]"
  >
    <img :src="shieldSrc" alt="" class="w-auto shrink-0" :class="s.shield" />
    <span class="font-bold leading-none" :class="[s.text, palette.label]"><slot /></span>
    <button
      v-if="removable"
      type="button"
      class="flex shrink-0 items-center"
      :class="palette.x"
      aria-label="Remove"
      @click="emit('remove')"
    >
      <UxIcon id="x" :class="s.x" />
    </button>
  </span>
</template>

<script setup>
// Small compliance-framework tag: shield mark + framework name in a grape
// pill, optional remove ✕ (`removable` + @remove). Two non-default states:
//   `gap`   — muted grey tag (grey shield): required by an active framework,
//             but the policy is off. Pair the tag CLUSTER with one exclaim
//             circle after it (page-side) rather than marking every tag.
//   `error` — the whole tag red (red two-tone shield, error border/text).
// `gap` wins when both are set. `size` follows the UxToggle prop convention
// ('small' | 'medium', default medium). Label via default slot:
//   <ComplianceTag>EU AI Act</ComplianceTag>
//   <ComplianceTag removable @remove="...">EU AI Act</ComplianceTag>
//   <ComplianceTag gap size="small">SOC 2</ComplianceTag>
// Shield art resolved at build time from the layer's own assets (the
// AgentPawn pattern) — carries its own colors, so <img>, not UxIcon. Light
// variant (grape-300/400 halves): the full-weight shield reads heavy at tag
// scale.
import shieldUrl from '../../assets/svgs/compliance-frameworks/compliance-shield-light.svg?url'
import shieldGreyUrl from '../../assets/svgs/compliance-frameworks/compliance-shield-grey.svg?url'
import shieldErrorUrl from '../../assets/svgs/compliance-frameworks/compliance-shield-error.svg?url'

const props = defineProps({
  removable: { type: Boolean, default: false },
  error: { type: Boolean, default: false },
  gap: { type: Boolean, default: false },
  size: { type: String, default: 'medium' }, // 'small' | 'medium'
})

const emit = defineEmits(['remove'])

const shieldSrc = computed(() =>
  props.gap ? shieldGreyUrl : props.error ? shieldErrorUrl : shieldUrl
)

const palette = computed(() => {
  if (props.gap) {
    return {
      pill: 'border-stroke-strong bg-surface-sunken',
      label: 'text-content-subtle',
      x: 'text-content-subtle hover:text-content',
    }
  }
  if (props.error) {
    return {
      pill: 'border-error/60 bg-error/5',
      label: 'text-error',
      x: 'text-error hover:text-error/70',
    }
  }
  return {
    pill: 'border-grape-400 bg-grape-50',
    label: 'text-grape-600',
    x: 'text-grape-600 hover:text-grape-800',
  }
})

// literal class strings only — the layer's Tailwind scan must see them
const SIZES = {
  small: { pad: 'px-2.5 py-1', gap: 'gap-1.5', shield: 'h-3', text: 'text-11', x: 'h-3 w-3' },
  medium: { pad: 'px-3 py-1', gap: 'gap-2', shield: 'h-4', text: 'text-13', x: 'h-4 w-4' },
}

const s = computed(() => SIZES[props.size] || SIZES.medium)
</script>
