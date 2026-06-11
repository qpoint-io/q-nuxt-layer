<template>
  <div class="rounded-12 border border-stroke bg-surface px-4 py-3">
    <DataMetricLabel v-if="label" :label="label" />
    <DataMetricValue
      :val="val"
      :unit="unit"
      :size="size"
      :weight="weight"
      :showFullNumber="showFullNumber"
      :healthMode="healthMode"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  label          : { type: String },
  val            : { required: true },
  unit           : { type: String },
  size           : { type: Number, default: 20 },
  weight         : { type: String },
  // cards usually show exact counts, not abbreviations
  showFullNumber : { type: Boolean, default: true },
  healthMode     : { type: Function, default: healthModes.NEVER_HOT },
})
</script>
