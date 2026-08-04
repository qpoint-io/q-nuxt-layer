<template>
  <div class="inline-block" @click="onClick" :class="(to !== '_none_')? 'cursor-pointer hover:text-primary' : ''">
    <DataMetricLabel :label="label" v-if="label"/>
    <div class="_val flex justify-between items-baseline gap-2" :style="`margin-top: ${spaceAfterLabel}px`">
      <DataMetricValue :val="val" :unit="unit" :size="size" class="" :weight="weight" :healthMode="healthMode" :showFullNumber="showFullNumber" />
      <DataMetricTrend v-if="trend" :change="trend" :unit="unit" :healthMode="healthMode"/>
    </div>
    <DataSparkChart v-if="spark"
      class="h-[30px]"
      :style="sparkMaxWidth ? `max-width: ${sparkMaxWidth}px` : ''"
      :data="spark"
      fillColor="none"
      :strokeColor="sparkInk"
      strokeWidth="2"
    />
    <!-- Additional content (e.g. a segment bar + legend). Rendering inside
         the inline-block root means the label hairline spans the slot's
         width, not just the label text. -->
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  label     : { type: String },
  val       : { type: Number },
  unit      : { type: String },
  spark     : { type: Array  },
  trend     : { type: Number },
  healthMode: { type:Function, default:healthModes.NEVER_HOT },

  // display levers
  size            : { type:Number },
  weight          : { type:String },
  showFullNumber  : { type:Boolean },
  spaceAfterLabel : { type:String },
  sparkMaxWidth   : { type:Number },

  // optional link
  to              : { type:String, default:'_none_'},
})

// theme-reactive sparkline ink (canvas chart — needs a resolved color)
const sparkInk = useTokenColor('primary')

// use the router
const router = useRouter()

const onClick = ()=>{
  if(props.to !== '_none_'){
    router.push(props.to)
  }
}

</script>
