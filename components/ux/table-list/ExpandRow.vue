<template>
  <!-- purple Line above -->
  <tr v-if="isOpen" >
    <td colspan="100%" class="h-1 p-0 bg-primary" />
  </tr>

  <!-- Table Row View -->
  <tr
    class  = "font-bold text-13 cursor-pointer _stretchy z-10"
    :class = "(isOpen)? '_open-row duration-1000 bg-primary/10 hover:bg-primary/10' : 'hover:border-y-primary hover:bg-surface bg-surface/50'"
    @click = "onClick"
    ref    = "mainRow"
  >
    <slot />
  </tr>

  <!-- Expanded view -->
  <tr v-if="isOpen" class="bg-[#f2f3d5] dark:bg-primary/15" :class="isOpen ? 'bg-primary/10' : 'bg-surface'">
    <td colspan="100%" v-if="isOpen" class="p-0 pb-6 border-1 border-primary/40">
      <UxStretchBox
        :stretchWidth="false"
        :watch="contentChanged"
        :stretchToContainer="true"
        class="relative"
      >
        <!-- Fade in / out -->
        <div ref="$fader" class="duration-[1000ms] delay-300 pb-4">
          <div ref="el" class="px-8 py-4 duration-300 pb-0 ">
            <!-- Default chrome: one ExpandSection card with the close X wired.
                 `bare` opts out for consumers composing their own section
                 stack (or bringing their own chrome) — they receive `close`
                 through the slot scope instead. -->
            <UxTableListExpandSection v-if="!bare" @close="close">
              <slot name="details" :close="close" />
            </UxTableListExpandSection>
            <slot v-else name="details" :close="close" />
          </div>
        </div>
      </UxStretchBox>
    </td>
  </tr>

  <!-- purple Line below -->
  <tr v-if="isOpen" >
    <td colspan="100%" class="h-1 p-0 bg-primary" />
  </tr>
</template>
<style>
/* nicely animate row details */
._open-row{
  @apply text-13 py-3 ;
  /* background: #f0f0f0 !important; */
}
._stretchy{
  @apply duration-0 hover:border-y-1
}

._stretchy td{
  @apply ease-in-out-quint;
  transition-duration: 100ms;
  line-height: normal;
}

._open-row td{
 @apply pl-[10px] pt-3 pb-2 border-1 border-primary/40;
 transition-duration: 1000ms ;
}
._open-row td:first-of-type{
 @apply pl-8;
}
._open-row td:last-of-type{
 @apply pr-8;
}

._just-born{
  /* dark: tint exception — light keeps the cream flash byte-identical */
  @apply bg-[#fffef1] dark:bg-primary/5 delay-300;
}

</style>

<script setup>
// define props
const props = defineProps({
  isOpen:  { type: Boolean, default: false },
  to:      { type: Object, default: null },
  // Render the details slot bare (no default ExpandSection card).
  bare:    { type: Boolean, default: false },
})

// emits
const emit = defineEmits(['detailsOpen', 'detailsClose'])

// state
const el = ref(null)
const isOpen = ref(false)
const contentChanged = ref(0)

// Handle Click
const onClick = () => {
  // If this is a url, then don't toggle, just goto the page
  if (props.to !== null) {
    const nuxtRouter = useRouter()
    nuxtRouter.push(props.to)

    return
  }

  if(isOpen.value)
    close()
  else
    open()
}

// open details
const open = () => {
  emit('detailsOpen')
  contentChanged.value++
  isOpen.value = true
}

// close details
const close = () => {
  emit('detailsClose')
  contentChanged.value++
  isOpen.value = false
}

// Programmatic control for consumers (template refs) — e.g. default-open a
// featured row or close from custom chrome. Declarative `isOpen` prop
// support is still a known gap (the local ref shadows it).
defineExpose({ open, close })

// row state
const mainRow  = ref(null)
const justBorn = ref(true)
const timeOut  = ref(null)

const initMainRow = async () => {
  if( !justBorn.value )
    return

  // add the class
  mainRow.value?.classList?.add('_just-born')

  // wait for 1 second
  await sleep(1000)

  // remove the class
  justBorn.value = false
  mainRow.value?.classList?.remove('_just-born') // remove the class
}

onMounted(() => initMainRow())
onUnmounted(()=> clearTimeout( timeOut.value ))
</script>
