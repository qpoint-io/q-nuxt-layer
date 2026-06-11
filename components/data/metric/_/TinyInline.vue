<template>
  <div class="flex max-h-4 gap-4 b ">
    <div class="flex justify-between items-baseline relative max-h-4 flex-1 gap-3">
      <DataMetricPercentBar v-if="percent" :percent="percent" class="absolute z-0 max-h-4 " :healthMode="healthMode"/>
      <div class="flex gap-2">
        <DataMetricValue :val="val" :unit="unit" :size="14" class="z-1 relative" :healthMode="healthMode"/>
        <div class="text-13 text-content-subtle z-1 relative">{{ label }}</div>
      </div>
      <DataMetricTrend v-if="trend" :change="trend" :unit="unit" class="z-1 relative" :healthMode="healthMode" />
    </div>
    <div class="w-[20%]" v-if="spark">
      <DataSparkChart
        class="max-h-4"
        :data="spark"
        fillColor="none"
        :strokeColor="sparkInk"
        strokeWidth="2"
      />
    </div>
  </div>
</template>

<style scoped lang="css">
._grid{
  display: grid;
  grid-template-columns: 1fr minmax(50px, auto);
  grid-gap: 5px;
}
</style>

<script setup>
// theme-reactive sparkline ink (canvas chart — needs a resolved color)
const sparkInk = useTokenColor('primary')

const props = defineProps({
  percent : { type: Number },
  val     : { type: Number },
  unit    : { type: String },
  spark   : { type: Array },
  trend   : { type: Number },
  healthMode: { type:Function, default:healthModes.NEVER_HOT },
  label   : { type: String, default:'' },
})
</script>
