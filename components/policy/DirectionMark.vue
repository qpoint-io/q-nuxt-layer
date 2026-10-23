<template>
  <img :src="direction === 'looser' ? looserUrl : tighterUrl" :alt="direction === 'looser' ? 'Looser' : 'Tighter'" class="h-7 w-7 shrink-0" />
</template>

<script setup>
// Which way a policy change moves restrictions: a sky clockwise ring (tighter)
// or a red counter-clockwise ring (looser). Used beside "Mode : Observe → Enforce"
// in design's c121 change-impact card.
//   <PolicyDirectionMark direction="tighter" />
//   <PolicyDirectionMark direction="looser" class="!h-5 !w-5" />
// The art carries its own colors, so <img>, not UxIcon (the ComplianceTag /
// AgentPawn pattern). Source: the @4x PNGs in assets/svgs/tighter-looser/ (Mark,
// 2026-10-23: PNG over the SVGs), drawn at 28px.
import tighterUrl from '../../assets/svgs/tighter-looser/tighter@4x.png?url'
import looserUrl from '../../assets/svgs/tighter-looser/looser@4x.png?url'

defineProps({
  direction: { type: String, default: 'tighter' }, // 'tighter' | 'looser'
})
</script>
