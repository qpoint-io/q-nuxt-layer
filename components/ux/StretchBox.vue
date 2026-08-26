<template>
  <div
    ref="root"
    class="overflow-hidden"
    :style="`width:100%; min-height: ${ minHeight }; opacity: ${ opacity }` "
  >
    <div ref="stretcher" class="_stretch-box" :style="`min-width: ${ minWidth }px`">
      <div ref="content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
._stretch-box{
  @apply duration-500;

  height:  v-bind(contentHeight);

  transition-property: width, height, opacity;
  transition-duration: v-bind(duration);
  transition-timing-function: cubic-bezier(0.83, 0, 0.17, 1);
}

._height-override{
  height:  initial !important;
}

</style>

<script setup>
const props = defineProps({
  watch              : { },
  transition         : { type: Boolean, default: true },
  stretchToContainer : { type: Boolean, default: false},
  stretchWidth       : { type:Boolean, default: true},
  stretchHeight      : { type:Boolean, default: true},
  minWidth           : { type:Number, default: 0},
  minHeight          : { type:Number, default: 0},
})

const content       = ref(null)
const root          = ref(null)
const stretcher     = ref(null)

const contentWidth  = ref(0)
const contentHeight = ref(0)

const duration = ref('0ms, 0ms, 0ms')
const opacity  = ref('0')
const onWatchPropChange = ()=>{
  // return if the dom ref is null
  if(content.value == null)
    return 0

  // Remove height override so transition can animate from current value
  stretcher.value?.classList.remove('_height-override')

  // Let the dom update, then find the width of the content
  setTimeout(( ()=>{
    // component may have unmounted while the timer was pending
    if(content.value == null)
      return

    let parentHeight   = 0;
    let parentWidth    = 0;
    opacity.value        = 1;
    let widthDuration  = '300ms';
    let heightDuration = '300ms';

    let $content = content.value.cloneNode(true)

    // append copy of content element off screen
    Object.assign($content.style, {top: '-2000px', position : 'absolute', opacity  : '0'})

    // When width is externally determined (stretchWidth: false — e.g. an
    // ExpandRow well), pin the clone to the live width: an absolutely
    // positioned clone on <body> otherwise lays out at shrink-to-fit/body
    // width, where text wraps differently and the measured height comes up
    // short — the row then sits clipped until the height override snaps it
    // open.
    if( !props.stretchWidth )
      $content.style.width = `${ content.value.offsetWidth }px`

    document.body.appendChild( $content )

    // if stretch-to-parent-container is true, measure parent height/width
    if(props.stretchToContainer){
      let $parent  = root.value.parentElement
      parentWidth  = $parent.offsetWidth
      parentHeight = $parent.offsetHeight
    }

    if( !props.stretchWidth )
      widthDuration = '0ms'

    if( !props.stretchHeight )
      heightDuration = '0ms'

    // Set the values
    contentWidth.value  = `${ Math.max(parentWidth,  $content.offsetWidth )}px` // <-- set the width
    contentHeight.value = `${ Math.max(parentHeight, $content.offsetHeight)}px` // <-- set the height
    duration.value      = `${widthDuration}, ${heightDuration}, 1300ms`

    // remove copied el
    document.body.removeChild($content)
    setTimeout( ()=>{
      stretcher.value?.classList.add('_height-override')
    }, 1000 )
  }), 200 )
}

watch( () => props.watch, onWatchPropChange, { immediate: true })
onMounted(()=>{
  onWatchPropChange()
})
</script>
