<template>
  <div class="dark bg-black bg-opacity-30 px-6 py-6 rounded-[10px] border-dashed border-1 border-grape border-opacity-25 mb-6">
    <!-- <div class="text-grape-100 text-14 font-bold opacity-40 border-b-1 border-b-white/30 w-full mb-7">META:</div> -->
    <div class="flex gap-6 items-end _props-machine flex-wrap font-mono font-bold text-grape dark:text-grape-200 gap-y-10 pt-4">
      <div v-for="(val, key) of localProps" :key="key" >
        
        <!-- Boolean -->
        <div v-if="typeof val == 'boolean'" class="flex items-center justify-center h-full">
          <UxToggle :label="key" size="small">
            <input type="checkbox" value="toggle" v-model="localProps[key]" class="sr-only peer">
          </UxToggle>
        </div>

        <!-- String -->
        <div v-else-if="typeof val == 'string'" class="_input-holder">
          <UxInput :label  = "key" >
            <input v-model="localProps[key]" type="text" />
          </UxInput>
        </div>


        <!-- Function -->
        <div v-else-if="typeof val == 'function'" class="_input-holder">
          <UxInput :label  = "key"  >
            <input v-model="localProps[key]" type="text" disabled="true" />
          </UxInput>
        </div>

        <!-- Array -->
        <div v-else-if="typeof val == 'array'" disabled="true" class="_input-holder">
          <UxInput :label  = "key" >
            <input v-model="localProps[key]" type="text" disabled="true" />
          </UxInput>
        </div>

        <!-- Object -->
        <div v-else-if="typeof val == 'object' " class="overflow-hidden overflow-ellipsis whitespace-nowrap max-w-[200px] _input-holder">

          <!-- Number : Range -->
          <div v-if="val.kind == 'range'" >
            <UxLabelText :label="key" size="small" class="opacity-70" />
            <div class="flex gap-2 items-center mt-2">
              <input type="range" :min="val.props.min" :max="val.props.max" v-model="localProps[key].val" />
              <!-- <div class="min-w-10">{{ localProps[key].val }}</div> -->
              <input type="text" v-model="localProps[key].val" class="bg-white" />
            </div>
          </div>

          <!-- Options -->
          <div v-else-if="val.kind == 'options'" >
            <UxLabelText :label="key" size="small" class="opacity-70" />

            <UxSimpleSelect v-model="localProps[key].val" class="px-2">
              <option v-for="(option, index) in val.props.options" :key="index" :value="option">{{ option }}</option>
            </UxSimpleSelect>
          </div>

          <!-- Default - Non editable -->
          <div v-else>
            <UxInput :label  = "key" >
              <input v-model="localProps[key]" type="text" disabled="true" />
            </UxInput>
          </div>
        </div>

        <!-- Number -->
        <div v-if="typeof val == 'number'" class="flex gap-1 items-end _input-holder">
          <UxInput :label= "key" >
            <input v-model="localProps[key]" type="text"   />
          </UxInput>
          <div class="flex flex-col -mb-1">
            <div
              @click="amount = (isShiftDown)? 10 : 1; localProps[key]+= amount"
              class="p-1 opacity-25 cursor-pointer hover:opacity-100"
            >
              <IconTriangle class="w-2 text-white" />
            </div>
            <div
              @click="amount = (isShiftDown)? 10 : 1; localProps[key] -= amount"
              class="p-1 opacity-25 scale-y-[-1] cursor-pointer hover:opacity-100"
            >
              <IconTriangle class="w-2 text-white" />
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<style>
.dark ._props-machine input, 
.dark ._props-machine input:disabled{
  @apply text-12 h-6 border-none outline-none bg-black text-grape-200;
  @apply focus:ring-0 focus:bg-opacity-60
}

.dark ._props-machine label{
  @apply text-11 text-grey-400;
}

.dark ._props-machine select{
  @apply bg-black text-grape-200 border-none;
}

.dark ._props-machine input[type="range"]{
  @apply appearance-none bg-grape-200/20 h-1 rounded-full;
}

.dark ._props-machine input[type="range"]::-webkit-slider-thumb{
  @apply appearance-none w-3 h-3 rounded-full bg-grape-200 cursor-pointer;
}

.dark ._props-machine input[type="range"]::-moz-range-thumb{
  @apply appearance-none w-3 h-3 rounded-full bg-grape-200 cursor-pointer border-none;
} 

._props-machine input:disabled{
  @apply opacity-40 pointer-events-none;
}

._input-holder{
  @apply -mt-7;
}
</style>



<script setup>
const props = defineProps({
  properties: {type:Object, required:true}
})


const emit = defineEmits(['update:properties']);
const localProps = computed({
  get: () => props.properties,
  set: (val) => {emit('update:properties', val); console.log('update')}
});


const isShiftDown = ref(false)

// on mount, watch shift key–when pressed, we want to increment by greater amounts
onMounted(()=>{
  window.addEventListener('keydown', (e)=>{
    if(e.key == 'Shift'){
      isShiftDown.value = true
    }
  })

  window.addEventListener('keyup', (e)=>{
    if(e.key == 'Shift'){
      isShiftDown.value = false
    }
  })
})

// increment the value
const incrament = (val, incramentBy)=>{
  if(isShiftDown.value)
    incramentBy *= 10
  val += incramentBy
}

</script>
