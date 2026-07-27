<template>
  <component :is="entry.icon" />
</template>

<script setup>
// Compliance-framework kind icon. `kind` is the framework's type label
// ("Risk Taxonomy", "Regulation", "Attestation", "Governance", …), resolved
// against ./registry.js — several kinds share one icon (the set is a small
// visual vocabulary, not 1:1). Unknown kinds fall back to the scale. Size and
// tone come from the caller (class="h-5 w-5 text-content"); attrs fall
// through to the icon's root <svg>.
import { resolveFrameworkKind } from './registry'

const props = defineProps({
  kind: { type: String, required: true },
})

const entry = computed(() => resolveFrameworkKind(props.kind))
</script>
