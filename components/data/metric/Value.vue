<template>
  <div>
    <div v-if="!isLoading && val != '_blank'" class="flex gap-[0.06em] items-baseline" :class="temperature">

      <!-- Prefix unit ('$') — same dimmed treatment as a suffix unit -->
      <div v-if="_prefix" class="_unit opacity-50">
        {{ _prefix }}
      </div>

      <!-- Value -->
      <div class="_value">
        {{ _val }}
      </div>

      <!-- Unit -->
      <div class="_unit opacity-50" v-if="!showFullNumber && _unit">
        {{ _unit }}
      </div>
    </div>

    <!-- Loading animation -->
    <div v-else-if="isLoading && val != '_blank'"  class="flex flex-col items-center justify-center p-3 relative">
      <IconSpinner class="w-[20px] animate-spin ml-1 text-content-subtle" style="transform-origin: 45% 50%; transition-duration: 5s;"></IconSpinner>
    </div>
  </div>
</template>

<style scoped>
  ._hot ._value{
    @apply text-signal-error;
  }
  ._value{ /* Dynamic val for 'value' size/weight */
    font-size: v-bind(fontSize);
    font-weight: v-bind(fontWeight);
    /* display numerals: tight leading — inherited 1.5 reserves ~half the
       font size as empty space below large values */
    line-height: 1.05;
  }

  ._unit{ /* Dynamic val for unit size/weight */
    font-size: v-bind(unitFontSize);
    font-weight: v-bind(fontWeight);
    line-height: 1.05; /* match ._value — a taller unit line box would inflate the baseline row */
  }
</style>


<script setup>
const props = defineProps({
  val            : { required:true },             // Value
  size           : { type:Number, default:40 },   // Font size
  weight         : { type:String },               // Font weight
  unit           : { type:String },               // unit — 'bytes' | 'duration' | '$' (prefix) | any suffix string
  unitSize       : { type:String },               // unit size
  showFullNumber : { type:Boolean },              // Don't abbreviate. when true, 10k becomes 10000
  healthMode     : { type:Function, default: healthModes.NEVER_HOT },
})

const temperature = computed(()=>{
  if( typeof props.healthMode == 'function' ){
    if(props.healthMode( props.val ))
      return '_hot'
  }
  return ''
})

const isLoading = computed(function(){
  return props.val == null
})

// get the font size
const fontSize = computed(function(){
  return `${props.size}px`
})

// derive the unit size
const unitFontSize = computed(function(){
  if(props.unitSize)
    return `${props.unitSize}px`

  return `${ Math.round(props.size * 0.9) }px`
})

// derive the font weight from the font size
const fontWeight = computed(function(){
  if(props.weight)
    return props.weight
  if(props.size > 30)
    return '800'
  if(props.size > 20)
    return '700'

  return '600'
})

const _val = computed(() => {
  if (props.unit === 'bytes') {
    return formatBytes(Number(props.val)).value;
  }
  if (props.unit === 'duration') {
    return formatDuration(Number(props.val)).value;
  }
  if (props.showFullNumber)
    return Number(props.val);
  if (props.unit)
    return abbreviateNumber(Number(props.val)).join('');

  return abbreviateNumber(Number(props.val))[0];
})

// units that read before the number
const PREFIX_UNITS = ['$']
const _prefix = computed(() => PREFIX_UNITS.includes(props.unit) ? props.unit : '')

const _unit = computed(() => {
  if (_prefix.value)
    return '';
  if (props.unit === 'bytes') {
    return formatBytes(Number(props.val)).unit;
  }
  if (props.unit === 'duration') {
    return formatDuration(Number(props.val)).unit;
  }
  if (props.unit)
    return props.unit;
  return abbreviateNumber(props.val)[1];
})

</script>
