<template>
  <div class="flex flex-col gap-1">
    <div class="text-12 font-semi leading-3 text-grey-500 -mb-2">
      <div v-html="label" />
    </div>
    <DataMetricValue :val="val" :unit="unit" :size="size" class="-mb-4"/>
  </div>
</template>

<style scoped>

.temp_hot ._val{
    @apply text-warn;
  }

</style>

<script setup>
const props = defineProps({
  label : { type: String },
  val   : { type: String },
  unit  : { type: String },
  size  : { type:Number }
})


</script>
