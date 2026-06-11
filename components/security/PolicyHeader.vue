<template>
  <div class="flex gap-8">
    <!-- Card -->
    <SecurityPolicySkin :state="state" maxWidth="none" class="flex-1">
      <!-- Header: name + version -->
      <div class="flex items-start justify-between leading-normal shrink-0">
        <p class="text-20 font-bold text-content whitespace-nowrap">{{ name }}</p>
        <div class="flex gap-[2px] items-center shrink-0">
          <span class="text-[14px] font-bold text-content-muted leading-none">v</span>
          <span class="text-[16px] font-black text-content leading-none">{{ version }}</span>
        </div>
      </div>

      <!-- Divider -->
      <div class="w-full border-t border-stroke shrink-0" />

      <!-- Description -->
      <p
        v-if="description"
        class="text-14 text-content leading-normal shrink-0 w-full border-b border-stroke-strong py-3"
      >{{ description }}</p>

      <!-- Metadata row -->
      <div v-if="lastUpdated || regulations"
        class="flex gap-[7px] "
      >
        <div v-if="lastUpdated" class="flex flex-col pb-[6px] shrink-0">
          <span class="font-normal">Last Updated</span>
          <span class="font-semibold">{{ lastUpdated }}</span>
        </div>
        <div v-if="regulations" class="flex flex-col pb-[6px] shrink-0">
          <span class="font-normal">Regulations</span>
          <span class="font-semibold whitespace-nowrap">{{ regulations }}</span>
        </div>
      </div>
    </SecurityPolicySkin>

    <!-- Stats row -->
    <div class="inline-flex gap-[12px] bg-surface shadow-md border border-stroke pt-[18px] rounded-12 px-4 self-start pb-8">
      <DataMetric_Base label="Flows Governed" :val="flowsGoverned" :spark="flowsData" :size="26" weight="800" :healthMode="() => false" :sparkMaxWidth="80" />
      <DataMetric_Base label="Compliance" :val="compliance" unit="%" :spark="complianceData" :size="26" weight="800" :healthMode="complianceHealth" :sparkMaxWidth="80" />
      <DataMetric_Base label="Violations" :val="violations" :spark="violationsData" :size="26" weight="800" :healthMode="healthModes.ZERO_TOLERANCE" :sparkMaxWidth="80" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  name:             { type: String,           required: true },
  version:          { type: [String, Number], default: '1' },
  state:            { type: String,           default: 'cool' },  // 'cool' | 'hot'
  description:      { type: String,           default: '' },
  lastUpdated:      { type: String,           default: '' },
  regulations:      { type: String,           default: '' },
  flowsGoverned:    { type: Number,           required: true },
  flowsData:        { type: Array,            default: () => [] },
  compliance:       { type: Number,           required: true },
  complianceData:   { type: Array,            default: () => [] },
  violations:       { type: Number,           required: true },
  violationsData:   { type: Array,            default: () => [] },
})

const complianceHealth = (v) => v < 100
</script>
