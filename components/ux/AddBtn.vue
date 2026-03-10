<template>
  <div
    class="flex items-center text-grape text-16 font-reg cursor-pointer hover:text-black"
    :class="iconType == 'plus' ? 'gap-x-4' : 'gap-x-2'"
    @click="$emit('add')"
  >
    <IconPlusFat v-if="icon && iconType == 'plus'" class="w-[15px]"/>
    <slot/>
    <IconArrowRight v-if="icon && iconType == 'right'" class="w-[8px]"/>
  </div>
</template>

<script setup>
// define props
defineProps({
  icon: {
    type: Boolean,
    default: true,
  },
  iconType: {
    type: String,
    default: 'plus'
  }
})
</script>
