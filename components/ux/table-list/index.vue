<template>
  <div>
    <table class="relative whitespace-nowrap w-full overflow-x-scroll">
      <!-- headers -->
      <UxTableListHeader :compact="compact">
        <slot name="header" />
      </UxTableListHeader>

      <!-- content -->
      <!-- <UxTableListLoader :isLoading="isLoadingTop" /> -->
      <slot/>
      <!-- <UxTableListLoader :isLoading="isLoadingBottom" /> -->
    </table>

    <div class="pt-4 pb-8 text-15 text-grey-500 flex items-center justify-center h-full w-full delay-100" v-if="slotIsEmpty">
      <slot name="empty">No Records</slot>
    </div>
  </div>
</template>

<style >
tr{
  @apply border-b-1 border-b-tableBorder
}
thead tr{
  @apply bg-grey-100 border-b-0;
}
td{
  @apply border-tableBorder border-l-1 border-r-1 p-1
  /* first-of-type:border-l-0 first-of-type:pl-0 align-middle; */
}
th{
  @apply p-0 border-0 ;
}
</style>

<script setup>
import { useSlots } from 'vue'

// check if the table is empty, if so, show an empty state
const slots = useSlots()
const { slotIsEmpty } = useSlotsChecker({ slot: slots.default })

const props = defineProps({
  // this is determine if event listeners are used with this component.
  // see : https://github.com/vuejs/core/issues/5319
  onScrollAtTop    : Function,
  onScrollingDown  : Function,
  onScrollAtBottom : Function,

  // used to show loading
  isLoadingTop    : Boolean,
  isLoadingBottom : Boolean,

  // when in the compact mode
  compact : Boolean,
})

// emits
const emit = defineEmits('scroll-at-top', 'scrolling-down', 'scroll-at-bottom')

onMounted(async () => {
  // on mount, determine if there are any scroll event listeners–if so, listen to scrolling
  if( props.onScrollAtTop != null || props.onScrollingDown != null || props.onScrollAtBottom != null ) {
    // need to wait for the window to be ready if after a page transition
    await sleep(200)
    initializeScrolling()
  }

  // on mount, also watch the slot so that we can determine if the slot is empty

})

const scrollWindow = () => {
  return document.getElementById('page-scroll-window')
}

const isAtTop = ref(true)

const handleScroll = () => {
  let $scrollWindow = scrollWindow()
  let wasAtTop      = isAtTop.value
  isAtTop.value     = $scrollWindow.scrollTop === 0

  // Emit when scroll reaches top
  if (isAtTop.value && !wasAtTop) {
    emit( 'scroll-at-top')
  }

  // Emit when scroll leaves top
  if (!isAtTop.value && wasAtTop) {
    emit('scrolling-down')
  }

  // Emit when scroll reaches bottom
  if ($scrollWindow.scrollHeight - $scrollWindow.scrollTop === $scrollWindow.clientHeight) {
    emit('scroll-at-bottom')
  }
}

const waitTimeout = ref(null)

// initialize the scrolling
const initializeScrolling = () => {
  // If the scroll window is not ready, time-out and try again
  if( scrollWindow() == null ){
    waitTimeout.value = setTimeout(initializeScrolling, 1000)
  }else{
    scrollWindow().addEventListener('scroll', handleScroll);
  }
}

// un-initialize the scrolling
onUnmounted(() => {
  scrollWindow()?.removeEventListener('scroll', handleScroll);
})
</script>
