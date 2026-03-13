<template>
  <div
    class="flex items-start"
  >
    <!-- Card -->
    <SecurityPolicySkin :state="state">
      <!-- Header: name + version -->
      <div class="flex items-start justify-between leading-normal shrink-0">
        <p class="text-[15px] font-bold text-black whitespace-nowrap">{{ name }}</p>
        <div class="flex gap-[2px] items-center shrink-0">
          <span class="text-[14px] font-bold text-grey-400 leading-none">v</span>
          <span class="text-[16px] font-black text-black leading-none">{{ version }}</span>
        </div>
      </div>

      <!-- Divider -->
      <div class="w-full border-t border-grey-200 shrink-0" />

      <!-- Description + metadata (big + med) -->
      <template v-if="size === 'big' || size === 'med'">
        <p
          v-if="description"
          class="text-[11px] text-black leading-normal shrink-0 w-full"
          :class="size === 'big' ? 'border-b border-grey-300 pb-[7px]' : ''"
        >{{ description }}</p>

        <!-- Metadata row: big only -->
        <div
          v-if="size === 'big' && (lastUpdated || regulations)"
          class="flex gap-[7px] items-start text-[11px] text-black leading-normal shrink-0"
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
      </template>

      <!-- Stats row -->
      <div
        class="flex gap-[12px] items-start shrink-0"
        :class="(size === 'big' || size === 'med') ? 'border-t border-grey-300 pt-[18px]' : ''"
      >

        <!-- Flows Governed -->
        <div
          class="flex flex-col items-start justify-center border-r border-grey-200 pr-[16px] shrink-0"
          :class="statColGap"
        >
          <p class="font-bold text-black whitespace-nowrap" :class="labelSize">Flows Governed</p>
          <DataMachineValue :val="flowsGoverned" :size="valueSize" weight="800" :healthMode="() => false" />
          <div class="h-[14px] w-full shrink-0">
            <DataMachineSpark
              :data="flowsData"
              fillColor="none"
              strokeColor="#BBA5FF"
              strokeWidth="2"
            />
          </div>
        </div>

        <!-- Compliance -->
        <div
          class="flex flex-col items-start justify-center border-r border-grey-200 pr-[16px] shrink-0"
          :class="statColGap"
        >
          <p class="font-bold text-black whitespace-nowrap" :class="labelSize">Compliance</p>
          <DataMachineValue :val="compliance" unit="%" :size="valueSize" weight="800" :healthMode="complianceHealth" />
          <div class="h-[14px] w-full shrink-0">
            <DataMachineSpark :data="complianceData" fillColor="none" strokeColor="rgba(0,0,0,0.4)" :strokeWidth="1.5" />
          </div>
        </div>

        <!-- Violations -->
        <div
          class="flex flex-col items-start justify-center pr-[16px] shrink-0"
          :class="statColGap"
        >
          <p class="font-bold text-black whitespace-nowrap" :class="labelSize">Violations</p>
          <DataMachineValue :val="violations" :size="valueSize" weight="800" :healthMode="healthModes.ZERO_TOLERANCE" />
          <div class="h-[14px] w-full shrink-0">
            <DataMachineSpark :data="violationsData" fillColor="none" strokeColor="rgba(0,0,0,0.4)" :strokeWidth="1.5" />
          </div>
        </div>

      </div>

    </SecurityPolicySkin>

    <!-- Violations panel (adjacent to card) -->
    <div v-if="violationSamples.length" class="flex-1 min-w-0 mt-4 ">
      <div class="overflow-x-auto bg-grey-50 rounded-tr-12 rounded-br-12 py-4 pr-4 shadow-lg border-1 border-grey-300">
        <SecurityViolationsTable :violations="violationSamples" class=""/>
      </div>
        <!-- TODO uncomment to add remediation CTA -->
        <!-- <div class="flex items-center justify-end gap-4">
          <span class="text-13 text-grey-500">
            Violation Samples <span class="font-bold text-black">{{ violationSamples.length }}</span> of <span class="font-bold text-black">{{ violations.toLocaleString() }}</span>
          </span>
          <UxButton label="Remediate" />
        </div> -->
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  name:           { type: String,           required: true },
  version:        { type: [String, Number], default: '1' },
  state:          { type: String,           default: 'cool' },    // 'cool' | 'hot'
  size:           { type: String,           default: 'big' },     // 'big' | 'med' | 'small' | 'micro'
  description:    { type: String,           default: '' },
  lastUpdated:    { type: String,           default: '' },
  regulations:    { type: String,           default: '' },
  flowsGoverned:  { type: Number,           required: true },
  flowsData:      { type: Array,            default: () => [] },
  compliance:     { type: Number,           required: true },
  complianceData: { type: Array,            default: () => [] },
  violations:     { type: Number,           required: true },
  violationsData:   { type: Array,            default: () => [] },
  violationSamples: { type: Array,            default: () => [] },
})

const valueSize   = computed(() => props.size === 'micro' ? 22 : 26)
const labelSize   = computed(() => props.size === 'micro' ? 'text-[9px]' : 'text-[10px]')
const statColGap  = computed(() => props.size === 'micro' ? 'gap-px' : 'gap-[6px]')

const complianceHealth = (v) => v < 100
</script>
