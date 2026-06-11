<template>
  <div class=" bg-primary/25 px-4 rounded-full inline-flex gap-2 max-h-[24px] items-center max-w-[300px]" :class="{'bg-signal-error': warn}">
    <div class="overflow-hidden overflow-ellipsis whitespace-nowrap ">
      <slot />
    </div>
    <div v-if="!noX" class="group p-1 rounded-4 -mr-1  cursor-pointer">
      <UxIcon id="x" class="w-[10px] text-content group-hover:text-primary" :class="{'group-hover:text-signal-error': warn}" @click="$emit('remove')"/>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  // set to true to hide the x
  noX:  {type:Boolean, default:false},
  id:   {type:String},
  warn: {type:Boolean, default:false}
})
</script>
