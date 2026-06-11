<template>
  <div
    class = " duration-[180ms] cursor-pointer ease-[cubic-bezier(0.22, 1, 0.36, 1)] group"
    :class     = "(isHovered)? '_chosen' : '_overlooked' "
    @mouseover = "isHovered = true"
    @mouseout  = "isHovered = false"
    @click     = "onClick"
  >
    <slot />
    <div v-if="callToAction || (isHovered && hoverText != null)"
      class      = "flex gap-2 items-center text-14 font-med text-primary mt-6 duration-[180ms]
                  group-hover:text-content group-hover:text-15"
    >
      {{ actionText }}
      <IconTriangle class="rotate-90 w-3 h-3 text-content-subtle duration-[180ms]
                         group-hover:text-primary group-hover:ml-3"  />
    </div>
  </div>
</template>

<style>
._overlooked{
  @apply m-0 rounded-1;
  box-shadow: 0px 0px 1px 5000px rgba(0,0,0,0);
}

._chosen{
  z-index: 100000;
  /* dark-only border: the lift shadows don't read on a dark page */
  @apply -m-6 p-6 rounded-12 dark:border-1 dark:border-stroke;
  box-shadow:  0px 0px 1px 5000px rgba(0,0,0,0.02), 0px 4px 6px rgba(0,0,0,0.12);
}
</style>

<script setup>
const props = defineProps({
  callToAction: { type: String, default: null },
  hoverText: {type:String},
})

const emit = defineEmits(['clicked'])

// is hovered state
const isHovered = ref(false)

const actionText = computed(() => props.callToAction || props.hoverText)

const onClick = (e) => {
  emit('clicked', e)
}

</script>
