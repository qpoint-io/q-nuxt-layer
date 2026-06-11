<template>
  <div>
    <label class="text-content-subtle text-13 font-semi select-none">{{ label }}</label>
    <div class="text-18 font-bold">
      <slot/>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: {type:String},
})
</script>