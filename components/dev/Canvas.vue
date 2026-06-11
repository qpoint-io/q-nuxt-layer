<template>
  <div :id="idHash" class="flex" :class="adminAtTop ? 'flex-col-reverse' : 'flex-col'">

    <div class="">
      <!-- WORK IN PROGRESS - Render the raw html found in the dev canvas -->
      <div v-if="true == false">
        <button @click="showCode = !showCode">show code</button>
        <div id="raw-code" v-if="showCode" class="whitespace-pre">
          {{ rawCode }}
        </div>
      </div>


      <!-- Title -->
      <!-- <DevH class="flex justify-between items-baseline" v-if="title">
        <div>
          {{ title }}
        </div>
        <div class="not-italic text-12" v-if="route">
          <span class="text-content-subtle">App route:</span> {{ route }}
        </div>
      </DevH> -->

      <!-- Backdrop -->
      <div class="backdrop w-full p-10" :class="(bg)?  bg : 'bg-surface-sunken'">
        <slot />
      </div>

      <!-- Location of file -->
      <div class="flex justify-end">
        <div v-if="loc"
          @click="gotoSourceFile"
          class="font-dev text-13 opacity-30 cursor-pointer duration-300 inline-block
                hover:opacity-100 hover:duration-0">
            {{ loc }}
        </div>
      </div>
    </div>


    <!-- When an object is provided, show a quick UI for editing the props -->
    <DevMetaPropsMachine
      class="mt-10"
      v-model:properties="localAdminProps"
      v-if="localAdminProps"
    />

  </div>
</template>

<script setup>
  const slots = useSlots()
  const showCode = ref(false)

  const props = defineProps({
    title     : {type:String},                 // title
    loc       : {type:String},                 // location of the file
    route     : {type:String},                 // where to view this in the app
    adminProps: {type:Object},                 // admin props
    adminAtTop: {type:Boolean, default:false}, // position the props at the top
    bg        : {type:String, }
  })

  const emit = defineEmits(['update:adminProps']);
  const localAdminProps = computed({
    get: () => props.adminProps,
    set: (val) => emit('update:adminProps', val)
  });


  const idHash = computed(()=>{
    if( props.title == null)
      return ""
    let str = props.title.replace(/ /g,"_")
    return str.toUpperCase()
  })

  useHead({
    link: [
      { rel:"stylesheet", href:"https://use.typekit.net/vzp0gfh.css" },
    ]
  })

  const gotoSourceFile = ()=>{
    navigator.clipboard.writeText(props.loc)
    // console.log( props.loc )
  }

  // grab the raw code
  const rawCode = computed(()=>{
    if(slots.length < 1)
      return ''

    // Another useful bit of data
    // slots.default()[0].ctx.type.__file
    return slots.default()[0].ctx.vnode.el.innerHTML
  })

</script>

<style>
  .backdrop{
    @apply border-1 border-stroke;
    box-shadow: 0 4px 12px 2px rgba(0, 0, 0, 0.02);
    border-radius: 6px;
  }
</style>
