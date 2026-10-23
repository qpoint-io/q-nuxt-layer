<template>
  <img :src="faded ? fadedUrl : fullUrl" alt="" class="h-7 w-auto shrink-0" />
</template>

<script setup>
// The policy ribbon as a mark: grape medallion + hanging tail, for policy pills
// and rows. `faded` is the light version that sits inside a tinted pill (design
// c121 change-impact card).
//   <PolicyRibbonMark faded />
// Own colors, so <img>, not UxIcon. For the state-colored corner badge
// (cool / warm / hot …) use SecurityPolicyRibbon. Source: assets/svgs/policies/
// (Mark, 2026-10-23).
import fullUrl from '../../assets/svgs/policies/policy.svg?url'
import fadedUrl from '../../assets/svgs/policies/faded-policy.svg?url'

defineProps({
  faded: { type: Boolean, default: false },
})
</script>
