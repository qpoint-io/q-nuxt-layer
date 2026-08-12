<template>
    <label
      class="inline-flex relative items-center whitespace-nowrap gap-1"
      :class="[(reverse)? 'flex-row-reverse w-full' : '',
              (permaChecked)? '_perma-checked' : '' ,
              (disabled)? 'pointer-events-none' : 'cursor-pointer' ]"
    >
      <div>
        <!-- Slot for the checkbox/radio input -->
        <slot />
        <div
          :class="!disabled && 'peer-checked:bg-primary'"
          class="_toggle translate-x-0
          @apply peer-focus:outline-none rounded-full peer;
          @apply peer-checked:after:translate-x-full peer-checked:after:border-white;"
        />
      </div>
      <!-- render only when a label slot is provided — an empty wrapper still
           costs pl-2 + the root's gap-1 as a flex item (12px phantom on the right) -->
      <div
        v-if="$slots.label"
        class="w-full "
        :class="(size != 'micro')?  'pl-2' : '' "
      >
        <slot name="label" />
      </div>
      <span v-if="label" class="_label ">{{ label }}</span>
    </label>
</template>

<style local>

._toggle{
  width:  v-bind(dimmensions.bgWidth);
  height: v-bind(dimmensions.bgHeight);
  @apply bg-stroke;
}

._toggle:after{
  content:'';
  top: v-bind(dimmensions.padding);
  left: v-bind(dimmensions.padding);
  width: v-bind(dimmensions.circleSize);
  height: v-bind(dimmensions.circleSize);
  @apply absolute bg-surface border-stroke-strong border rounded-full transition-all;
}

._perma-checked{
  @apply pointer-events-none;
  ._toggle:after{
    @apply bg-surface/50 border-none ;
  }
}

._disabled

label ._label{
  font-size: v-bind(fontSize);
}

</style>

<script setup>

const props = defineProps({
  label        : { type:String },
  disabled     : { type: Boolean, default: false },
  permaChecked : {type: Boolean, default: false},
  size         : { type: String, default: 'medium' },
  reverse      : { type: Boolean, default: false },
})

const fontSize = computed(() => {
  if ( props.size == 'micro' ){
    return '12px'
  }else if ( props.size == 'tiny' ){
    return '13px'
  }else if ( props.size == 'small' ){
    return '15px'
  } else if ( props.size == 'medium' ){
    return '16px'
  } else if ( props.size == 'large' ){
    return '18px'
  }
})

const dimmensions = computed(() => {
  let vals = { circleSize: 20, padding: 4 }
  if ( props.size == 'micro' ){
    vals =  { circleSize: 12, padding: 1 }
  }else if ( props.size == 'tiny' ){
    vals =  { circleSize: 14, padding: 4 }
  }else if ( props.size == 'small' ){
    vals =  { circleSize: 18, padding: 4 }
  } else if ( props.size == 'medium' ){
    vals =  { circleSize: 22, padding:8 }
  } else if ( props.size == 'large' ){
    vals =  { circleSize: 26, padding:10 }
  }

  const travel = vals.circleSize + vals.padding

  return {
    bgWidth   : `${vals.circleSize + travel }px`,
    bgHeight  : `${vals.circleSize + (vals.padding) }px`,
    circleSize: `${vals.circleSize}px`,
    padding   : `${vals.padding/2}px`,
  }
})

</script>
