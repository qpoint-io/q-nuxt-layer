<template>
  <div class="inline-block" :class="to !== '_none_' ? 'cursor-pointer hover:text-primary' : ''" @click="onClick">

    <!-- Title -->
    <div class="font-bold text-content text-20" :style="titleSize ? `font-size:${titleSize}px` : ''">
      {{ title }}
    </div>

    <!-- Hairline — spans the full width of the card, independent of DataMetricLabel's
         own label-tied hairline (that one only ever matches its label's text width). -->
    <div class="hairline mt-1 mb-2" />

    <!-- Description -->
    <div v-if="description" class="text-content-subtle text-14 mb-3" :style="descriptionSize ? `font-size:${descriptionSize}px` : ''">
      {{ description }}
    </div>

    <!-- Main row -->
    <div class="flex items-center gap-3">
      <div v-if="$slots.left" :style="slotGap ? `margin-right:${slotGap}px` : ''">
        <slot name="left" />
      </div>

      <div class="flex items-baseline gap-2">
        <DataMetricValue :val="val" :unit="unit" :size="valueSize" :healthMode="healthMode" />
        <DataMetricTrend v-if="delta != null" :change="delta" :unit="deltaUnit" :healthMode="healthMode" />
      </div>

      <div class="flex-grow" />

      <div v-if="$slots.right" :style="slotGap ? `margin-left:${slotGap}px` : ''">
        <slot name="right" />
      </div>
    </div>

    <!-- Provenance / context row -->
    <div v-if="provenance" class="text-13 text-content-subtle mt-2">
      {{ provenance }}
    </div>

    <!-- Sparkline -->
    <DataMetricSpark
      v-if="spark"
      class="h-[30px] mt-2"
      :data="spark"
      fillColor="none"
      :strokeColor="sparkInk"
      strokeWidth="2"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  title           : { type: String, required: true },
  titleSize       : { type: Number },              // font-size override
  description     : { type: String },
  descriptionSize : { type: Number },              // font-size override

  val             : { required: true },            // passed straight to DataMetricValue; null shows loading
  valueSize       : { type: Number, default: 40 }, // matches DataMetricValue's own default
  unit            : { type: String },              // 'bytes' | 'duration' | 'ms' | '%' | any custom string

  delta           : { type: Number },              // passed to DataMetricTrend as `change`
  deltaUnit       : { type: String },              // passed to DataMetricTrend as `unit`

  healthMode      : { type: Function, default: healthModes.NEVER_HOT }, // shared across value + delta

  provenance      : { type: String },
  spark           : { type: Array },

  slotGap         : { type: Number }, // extra px gap between #left/#right slot content and the main value/delta group

  to              : { type: String, default: '_none_' }, // click-to-navigate, mirrors DataMetric_Base's `to` prop
})

// theme-reactive sparkline ink (SVG chart — needs a resolved color)
const sparkInk = useTokenColor('primary')

const router = useRouter()

const onClick = () => {
  if (props.to !== '_none_') {
    router.push(props.to)
  }
}
</script>
