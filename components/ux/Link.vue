<template>
  <div class=" text-15 flex items-center group
              text-grape-500 font-med  cursor-pointer duration-300
              hover:text-black h hover:duration-0">
    <slot />
    <IconArrowRight v-if="arrow" class="h-[10px] ml-0 duration-100 opacity-0
                           group-hover:ml-4 group-hover:opacity-100"/>
  </div>
</template>

<script setup>
defineProps({
  arrow: { type: Boolean, default: false }
})
</script>
