<template>
  <div class="flex flex-col gap-1">
    <div class="text-12 font-semi leading-3 text-content-subtle -mb-2">
      <div v-html="label" />
    </div>
    <DataMetricValue :val="val" :unit="unit" :size="size" class="-mb-4"/>
  </div>
</template>

<style scoped>

.temp_hot ._val{
    @apply text-signal-error;
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
