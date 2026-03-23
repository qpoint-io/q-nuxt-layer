<template>
  <div class="inline-block">
    <DataMetricLabel :label="label" />
    <div class="_val flex justify-between items-baseline">
      <DataMetricValue :val="val" :unit="unit" :size="size"  :healthMode="healthMode"/>
      <DataMetricTrend v-if="trend" :change="trend" :unit="unit" :healthMode="healthMode"/>
    </div>
    <DataSparkChart v-if="spark"
      class="h-[30px] "
      :data="spark"
      fillColor="none"
      strokeColor="#BBA5FF"
      strokeWidth="2"
    />
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
  spark : { type: Array  },
  trend : { type: Number },
  healthMode: { type:Function, default:healthModes.NEVER_HOT },
  size  : { type:Number }
})
</script>
