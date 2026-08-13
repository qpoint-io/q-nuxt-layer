<template>
  <img v-if="src" :src="src" :alt="alt" :title="title" class="object-contain" />
  <span v-else class="inline-flex items-center justify-center text-11 font-bold text-content-muted" :title="title">
    <slot>{{ mark }}</slot>
  </span>
</template>

<script setup>
// Third-party integration/vendor logo (Splunk, Datadog, Slack, …), resolved by
// id against assets/svgs/third-party-logos/<id>.svg and rendered as an <img>.
//
// Deliberately NOT UxIcon: several of these logos carry <linearGradient> defs
// whose ids collide when the SVG is inlined more than once per page, and brand
// fills must never be recolored. An <img> is immune to both. Size via class
// (e.g. class="h-6 w-6"); unknown ids fall back to the `mark` text or slot.
//
// For AI-agent logos, see AgentAvatar / components/agent/registry.js.
const props = defineProps({
  id:    { type: String, required: true },  // filename stem, e.g. 'splunk'
  mark:  { type: String, default: '' },     // fallback initials when id has no asset
  alt:   { type: String, default: '' },
  title: { type: String, default: '' },
})

const logoUrls = import.meta.glob('../../assets/svgs/third-party-logos/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
})

const src = computed(() => logoUrls[`../../assets/svgs/third-party-logos/${props.id}.svg`] || null)
</script>
