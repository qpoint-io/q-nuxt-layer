<template>
  <div :class="`${temperature} ${viewClass}` ">
    <div v-if="_change.value > 0" class="flex text-13 gap-[2px] items-baseline _text">
      <div>{{ changeIndicator }}{{ _change.value }}{{ _change.unit }}</div>
      <UxIcon id="triangle" class="w-3 triangle" />
    </div>
  </div>
</template>

<style scoped>
._hot{
  @apply text-warn;
}

.--quiet ._text{
  @apply text-12 font-med text-grey-500;
}

.--small ._text{
  @apply text-13 ;
}
.--mini ._text{
  @apply text-12 ;
}
.--micro ._text{
  @apply text-11 ;
}

.--small .triangle{
  @apply w-2 ;
}
.--mini .triangle{
  @apply w-2 ;
}
.--micro .triangle{
  @apply w-2 ;
}

</style>

<script setup>
const props = defineProps({
  change    : {type:Number, default:0},
  healthMode: { type:Function, default:healthModes.NEVER_HOT },
  unit      : { type:String, default: '' },
  viewClass : { type:String, default: '' },
})

const temperature = computed(()=>{
  if( typeof props.healthMode == 'function' ){
    if(props.healthMode( props.change ))
      return '_hot'
  }
  return ''
})

const _change = computed(() => {
  // duration
  if (props.unit === 'duration') {
    let { value, unit } = formatDuration(props.change)

    // ensure the value is rounded to 2 decimal places
    value = Math.round(value)

    return {
      value,
      unit,
    }
  }

  // bytes
  if (props.unit === 'bytes') {
    return formatBytes(props.change)
  }

  // allow 2 decimal places
  const value = Math.round(Math.abs(Number(props.change)) * 100) / 100

  return {
    value: abbreviateNumber(value).join(''),
    unit: props.unit,
  }
})

const changeDirection = computed(()=>{
  if(props.change > 0)
    return 'up'
  if(props.change < 0)
    return 'down'
  return 'static'
})

const changeIndicator = computed(()=>{
  if( changeDirection.value == 'up')
    return '+'
  if( changeDirection.value == 'down')
    return '-'
  return ''
})

const triangleFlip = computed(()=>{
  if(props.change < 0)
    return `scaleY(-1)`
  return `scaleY(1)`

})
</script>


<style>
  .triangle{
    /* transform: v-bind( fillColor ); */
    transform: v-bind( triangleFlip );
  }
  svg{}
</style>
