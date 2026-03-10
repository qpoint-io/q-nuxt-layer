<template>
    <div class=" bg-grape-50 bg-opacity-70 px-6 py-6 rounded-[10px] border-dashed border-1 border-grape border-opacity-25">
    <div class="text-grape text-14 font-bold opacity-40 border-b-1 border-b-grape w-full mb-7">META:</div>
    <div class="flex gap-6 items-centerd _props-machine flex-wrap font-mono font-bold text-grape gap-y-10">
      <div v-for="(val, key) of localProps" :key="key" class="">
        <!-- Boolean -->
        <div v-if="typeof val == 'boolean'" class="flex items-center justify-center h-full">
          <UxToggle :label="key" size="small">
            <input type="checkbox" value="toggle" v-model="localProps[key]" class="sr-only peer">
          </UxToggle>
        </div>

        <!-- String -->
        <div v-else-if="typeof val == 'string'" class="_input-holder">
          <UxInput :label  = "key" >
            <input v-model="localProps[key]" type="text"  />
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
            <UxLabelText :label="key" size="small" class="opacity-70 mb-2" />

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
        <div v-if="typeof val == 'number'" class="flex gap-2 items-center _input-holder">
          <UxInput :label= "key" >
            <input v-model="localProps[key]" type="text"   />
          </UxInput>
          <div class="flex flex-col -mb-8 -ml-10">
            <div
              @click="amount = (isShiftDown)? 10 : 1; localProps[key]+= amount"
              class="p-1 opacity-25 cursor-pointer hover:opacity-100"
            >
              <IconTriangle class="w-4 text-white" />
            </div>
            <div
              @click="amount = (isShiftDown)? 10 : 1; localProps[key] -= amount"
              class="p-1 opacity-25 scale-y-[-1] cursor-pointer hover:opacity-100"
            >
              <IconTriangle class="w-4 text-white" />
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<style>
._props-machine input, ._props-machine input:disabled{
  @apply h-6 border-none outline-none bg-opacity-0 focus:ring-0 focus:bg-opacity-60;
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
