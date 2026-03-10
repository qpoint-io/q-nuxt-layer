<template>
  <!-- Label -->
  <div
    :class="[
      'pb-1 whitespace-nowrap',
      size == StatSizes.SMALL ? 'text-13 font-med' : '',
      size == StatSizes.MED ?   'text-13 font-med' : '',
    ]">
    <div class="-mb-1 hairline">
      {{ label }}
    </div>
  </div>
</template>
<script setup>

const props = defineProps({
  label      : { type:String,  required:true },
  size       : { type:String,  default:StatSizes.SMALL},
})

</script>
