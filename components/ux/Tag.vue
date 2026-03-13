<template>
  <div class=" bg-grape-200 px-4 rounded-full inline-flex gap-2 max-h-[24px] items-center max-w-[300px]" :class="{'bg-warn': warn}">
    <div class="overflow-hidden overflow-ellipsis whitespace-nowrap ">
      <slot />
    </div>
    <div v-if="!noX" class="group p-1 rounded-4 -mr-1  cursor-pointer">
      <UxIcon id="x" class="w-[10px] text-white group-hover:text-grape-600" :class="{'group-hover:text-warn': warn}" @click="$emit('remove')"/>
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
