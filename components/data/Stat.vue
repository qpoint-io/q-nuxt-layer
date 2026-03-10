<template>
  <div class="flex flex-col pt-[2px]">
    <!-- Label -->
    <div
      :class="[
        'border-b-4 pb-1 whitespace-nowrap',
        size == StatSizes.SMALL ? 'text-13 font-med text-grey-400' : '',
        size == StatSizes.MED ?   'text-13 font-med text-grey-400' : '',
      ]">
      <div class="-mb-1">
        {{ label }}
      </div>
    </div>

    <!-- Val -->
    <div
      v-if="!isLoading"
      :class="[
        'font-black',
        size == StatSizes.SMALL ? 'text-25 pt-1' : '',
        size == StatSizes.MED ?   'text-30' : '',
        textColor,
      ]">
      {{ pre }}{{ formattedVal }}{{ post }}
    </div>

    <!-- Loading animation -->
    <div v-else-if="isLoading"  class="flex flex-col items-center justify-center p-3 relative">
      <IconSpinner class="w-[20px] animate-spin ml-1 text-gray-300" style="transform-origin: 45% 50%; transition-duration: 5s;"></IconSpinner>
    </div>

  </div>
</template>

<script setup>
const props = defineProps({
  label      : { type:String,  required:true },
  val        : { required:true },
  size       : { type:String,  default:StatSizes.SMALL},
  kind       : { type:String,  default:StatTypes.PERCENTAGE },
  showHealth : { type:Boolean, default:false},
  isHealthy  : { type:Boolean, default:true }
})

const pre = computed(function(){
  return ''
})

const post = computed(function(){
  if(props.kind == StatTypes.PERCENTAGE)
    return '%'

  return ''
})

const formattedVal = computed(function(){
  if(props.kind == StatTypes.NUM_SHORT){
    let formatter = Intl.NumberFormat('en', { notation: 'compact' })
    return formatter.format( props.val )
  }
  return props.val
})


const textColor = computed(function(){
  if( props.showHealth ){
    if(props.isHealthy)
      return 'text-blue'
    else
      return 'text-[#F87F7D]'
  }


  return 'text-black'
})

const isLoading = computed(function(){
  return props.val == null
})

</script>
