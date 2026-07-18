<template>
  <div class=" inline-flex shadow-lg
               rounded-12 border border-stroke bg-surface bg-red"
  >
    <!-- left -->
    <div 
      class="flex flex-col justify-between px-5 py-4 "
      :style="(minWidth != null)?  `min-width:${minWidth}px` : ''"
    >
      <div >
        <!-- Title -->
        <div v-if="title" class="text-18 font-bold text-content">
          {{ title }}
        </div>
        <!-- Main value — default slot overrides the DataMetricValue -->
        <div class="mt-4">
          <slot>
            <DataMetricValue
              :val="data"
              :unit="dataUnit"
              :size="size"
              :weight="weight"
              :showFullNumber="showFullNumber"
            />
          </slot>
        </div>
      </div>

  
      <!-- Description — #description slot overrides the prop -->
      <div v-if="$slots.description || description" class="mt-1 text-14 text-content-muted">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>

    <!-- Optional extra details -->
    <div v-if="$slots.details" class="flex-grow flex items-center self-stretch bg-surface-sunken-subtle border-l-1 border-l-stroke rounded-tr-10 rounded-br-10 px-5 ">
      <slot name="details" />
    </div>

  </div>
</template>

<script setup>
const props = defineProps({
  title          : { type: String },
  data           : { default: null },          // main value → DataMetricValue
  dataUnit       : { type: String },           // unit → DataMetricValue
  description    : { type: String },
  size           : { type: Number, default: 50 },
  weight         : { type: String },
  // cards usually show exact counts, not abbreviations
  showFullNumber : { type: Boolean, default: true },
  minWidth : { type:Number, default:null }
})
</script>
