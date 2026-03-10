<template>
  <div>
    <div class="flex justify-between items-baseline gap-4">
      <DataMachineValue :val="val" :unit="unit" :size="25" :healthMode="healthMode"/>
      <DataMachineTrend v-if="trend" :change="trend" :unit="unit" :healthMode="healthMode"/>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  val       : { type: Number },
  unit      : { type: String },
  trend     : { type: Number },
  healthMode: { type:Function, default:healthModes.NEVER_HOT },
})
</script>
