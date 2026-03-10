<template>
  <div
    class="flex flex-col gap-1 key-val cursor-pointer"
    @click="$emit( 'check' )"
    :class="{isChecked, fitHeight, fitWidth}"
  >

    <!---------------- Label -->
    <TypographyLabel v-if="label" :label="label">{{ label }}</TypographyLabel>

    <!---------------- Val / Metric -->

    <div v-if="!isLoading">
      <div class="_value-line flex leading-none items-baseline duration-300 relative ">
        <!-- Val -->
        <div
          class="_value font-black leading-none temperature"
          :class="[ valStyles, textColor ]">
          {{ formattedVal }}
        </div>

        <!-- Metric -->
        <div
          class="_metric font-black leading-none temperature-metric self-start metric"
          :class="[metricStyles, metricColor ]" v-if="!isLoading">
            {{ metric }}
        </div>

        <!-- Optional - Inline slot -->
        <div class="grow flex justify-end"></div>
        <div class="grow flex justify-end align-baseline">
          <slot name="inline" />
        </div>
      </div>
      <div>
        <slot class="mt-2" />
      </div>

    </div>

      <!-------------- Loading animation -->
      <div v-else-if="isLoading"  class="flex flex-col items-center justify-center  relative">
        <IconSpinner class="w-[20px] animate-spin ml-1 text-gray-300" style="transform-origin: 45% 50%; transition-duration: 5s;"></IconSpinner>
      </div>


  </div>
</template>


<style scoped>

/* Styles for using as a radio button */
.isChecked ._value-line{
  @apply bg-grape-500  text-white rounded-6 px-2 duration-0;
}

.isChecked ._value-line::before,
.isChecked ._value-line::after{
  @apply absolute;
  content: '';
}

.isChecked ._value-line::before{
  @apply rounded-full bg-grape-500 right-[10px];
  top: calc(100% + 20px);
  width: 11px;
  height: 11px;
}
.isChecked ._value-line::after{
  @apply border-r-3 border-r-grape-500 top-full right-[14px];
  height: 20px;
}

.isChecked ._value{
  @apply  text-white duration-0;
}

.isChecked ._metric{
  @apply  text-white duration-0;
}

.isChecked ._label{
  @apply  text-grape duration-0;
}

.fitHeight{
  @apply h-0 min-h-full;
}

.fitWidth{
  @apply w-0 min-w-full;
}

</style>

<script setup>

/*

Important:
This will continue to grow robust and configurable over time.
Consider it partially implmented, and we may need to update
instantiations to match future specifications.

*/

const props = defineProps({
  label      : { type:String },  //optional
  val        : { required:true },
  metric     : { type:String },  //optional
  size       : { type:String,  default:StatSizes.SMALL},
  kind       : { type:String,  default:StatTypes.PERCENTAGE },
  showHealth : { type:Boolean, default:false},
  isHealthy  : { type:Boolean, default:true },
  // When using as a radio button
  isChecked  : { type:Boolean, default: false},

  // To force height to fit provided space
  fitHeight  : {type:Boolean, default: false},
  // To force width to fit provided space
  fitWidth   : {type:Boolean, default: false},

})



const formattedVal = computed(function(){
  if(props.kind == StatTypes.NUM_SHORT){
    let formatter = Intl.NumberFormat('en', { notation: 'compact' })
    return formatter.format( props.val )
  }
  return props.val
})

// Dynamic text color - used to denote health
const textColor = computed(function(){
  if( props.showHealth ){
    if(props.isHealthy)
      return 'text-black'
    else
      return 'text-[#F87F7D]'
  }
  return 'text-black'
})

// Dynamic text color - used to denote health
const metricColor = computed(function(){
  if( props.showHealth ){
    if(props.isHealthy)
      return 'text-grey-400'
    else
      return 'text-[#F87F7D]'
  }
  return 'text-grey-400'
})

// Is loading..
const isLoading = computed(function(){
  return props.val == null
})



// Stat styles – per size
const valStyles = computed( ()=> {
  if(props.size == "68")
    return "text-68"
  if(props.size == "58")
    return "text-58"
  if(props.size == "48")
    return "text-48"
  if(props.size == "38")
    return "text-38"
  if(props.size == "28")
    return "text-28"
  if(props.size == "23")
    return "text-23"
  if(props.size == "18")
    return "text-18"
  if(props.size == "15")
    return "text-15"
  if(props.size == "13")
    return "text-13"

  return "text-18"
})

// Metric styles – per size
const metricStyles = computed( ()=> {
  if(props.size == "68")
    return "text-35 mt-1"
  if(props.size == "58")
    return "text-35 mt-1"
  if(props.size == "48")
    return "text-30 mt-[2px]"
  if(props.size == "38")
    return "text-22 mt-[2px]"
  if(props.size == "28")
    return "text-16 font-exbold mt-[2px]"
  if(props.size == "23")
    return "text-23"
  if(props.size == "18")
    return "text-15"
  if(props.size == "15")
    return "text-11"
  if(props.size == "13")
    return "text-11"

  return "text-15"
})

// Metric styles – per size
const headerStyles = computed( ()=> {
  if(props.size == "38")
    return "text-11 font-semi font-black"
  if(props.size == "28")
    return "text-11 font-semi font-black"
  if(props.size == "23")
    return "text-11 font-semi font-black"
  if(props.size == "18")
    return "text-11 font-semi font-black"
  if(props.size == "15")
    return "text-11 font-semi font-black"
  if(props.size == "13")
    return "text-10"

  return "text-15"
})


</script>


