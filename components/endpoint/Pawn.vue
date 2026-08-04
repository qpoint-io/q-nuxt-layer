<template>
  <!-- line-height 0 kills the baseline strut under the inline-block art span,
       which otherwise pads the wrapper's bottom and floats the art high of
       true center in flex/table contexts. -->
  <div class="relative inline-block align-middle" :style="{ width: px, lineHeight: 0 }">
    <!-- Consumer content anchored above the machine — mirrors AgentPawn's slot. -->
    <div v-if="$slots.default" class="absolute" style="bottom: 104%; left: 50%">
      <slot />
    </div>

    <UxPixelArt
      name="pixel-icons/machine"
      alt="endpoint pawn — machine"
      class="block"
      size="100%"
    />
  </div>
</template>

<script setup>
// EndpointPawn — the "Endpoint" pixel pawn: a machine (laptop/workstation —
// endpoint in the security sense, where agents actually run). Entity sibling
// of AgentPawn (c47 pawn family). One body for now; when per-state art lands,
// mirror AgentPawn's BODIES/DECORATIONS maps here. Art is the machine pixel
// icon, rendered through UxPixelArt (inlined, palette rewritten to themed
// --px-* variables).
//
// The art is landscape (~1.7:1), unlike the square agent pawn — size sets
// width and height follows, so match agent pawns by visual area, not width
// (a 36px endpoint reads level with a 28px agent).
const props = defineProps({
  // Pawn width; number → px. Height scales automatically.
  size: { type: [Number, String], default: 96 },
})

const px = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))
</script>
