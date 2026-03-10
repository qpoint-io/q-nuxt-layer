<template>
  <th
    class="text-13 font-bold px-2 select-none border-l-1 border-r-1"
    :class="(!disabled)? 'cursor-pointer' : ''"
    :style="styles"
    @click="onClick"
  >
    <div>
      <div class="flex justify-between  gap-1" :class="(isSorting)?'text-grape':''">
        {{ sortMetric }}
        <IconArrowUp
          v-if="!disabled"
          class="w-3 duration-300"
          :class="[
            (isSorting)?  '': 'opacity-10',
            (sortLowToHigh)?  'rotate-0 duration-600' : 'rotate-180',
          ]"
        />
      </div>
    </div>
  </th>
</template>

<script setup>
// props
const props = defineProps({
  total     : {type:String},
  sortMetric: {type:String},
  isHot     : {type:Boolean, default:false},
  isSorting : {type:Boolean},
  disabled  : {type:Boolean},
  width     : {type:String}, // optional
  align     : {type:String}, // optional
})

// emits
const emit = defineEmits([
  'sortUp',
  'sortDown'
])

// store the up/down sorting toggle
const sortLowToHigh = ref(false)

// emit the correct sorting event when clicked
const onClick = ()=>{
  if( props.isSorting ){          // if sorting..
    if(sortLowToHigh.value)       // ..and currently sorting low to high
      emit( 'sortDown', props.sortMetric )
    else                          // else sort high to low
      emit( 'sortUp', props.sortMetric )
    sortLowToHigh.value = !sortLowToHigh.value
  }else{                          // else, not sorting, let's sort:
    sortLowToHigh.value = false
    emit( 'sortDown', props.sortMetric )
  }
}

// get the computed styles
const styles = computed(()=> {
  let str = ""
  str += (props.width)? `width:${props.width}` : ''
  str += (props.align)? `; align:${props.align}` : ''
  return str
})

</script>
