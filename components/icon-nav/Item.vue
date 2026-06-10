<template>
  <nuxt-link
    :to="to"
    class="_left-nav-link flex items-center gap-4 px-2 min-h-8 group cursor-pointer hover:text-grape-700 text-black"
    :class="urlMatches([basePath]) ? 'link-active' : ''"
  >
    <div class="w-10 flex items-center justify-center">
      <slot />
    </div>

    <!-- Title -->
    <div
      v-if="isExpanded"
      class="_text text-15 font-bold  duration-200 group-hover:duration-0 -mb-[2px]"
      :class="(isExpanded)? 'opacity-100  mr-4 duration-300 ease-in-out-quint' : 'invisible -ml-4 w-0 p-0 opacity-0 pointer-events-none' "
    >
      {{ title }}
    </div>
  </nuxt-link>
</template>

<style>
._left-nav-link.link-active{
  @apply text-grape-500 relative;
}
._left-nav-link.link-active ._text{
  @apply relative;
}

._text:after{
  content: "";
  @apply border-b-transparent border-b-3 absolute block bottom-0 w-full;
}

._left-nav-link.link-active ._text:after{
  content: "";
  @apply border-b-grape-200 border-b-2 absolute block bottom-0 w-full duration-700;
}
</style>

<script setup>
const props = defineProps({
  title      : { type: String },
  isExpanded : { type: Boolean, default: true },
  to         : { type: String },
  basePath   : { type: String }
})

// compute the path as it changes
const path = computed(() => useRoute()?.path)

// helper to determine if the url is found in the path
const urlMatches = (matches) => {
  return path.value?.startsWith(matches)
}

</script>
