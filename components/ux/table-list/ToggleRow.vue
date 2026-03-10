<!--
This component is a wrapper for expanding entire rows to show details
-->

<template>
  <tr
    class   = "hover:duration-0 duration-300"
    :class  = "(isOpen)? 'hover:bg-none' : 'hover:bg-grape-300/10 cursor-pointer'"
    v-on    = "(!isOpen)? { click: open } : {}"
  >

    <slot v-if="!isOpen"/>

    <td :colspan="totalColumns" v-if="isOpen" class="p-0">
      <UxStretchBox :stretchWidth="false" :watch="watchVar">

        <!-- Fade in / out -->
        <div ref="$fader" class="duration-[1000ms] delay-300 opacity-0">
          <slot name="expanded" :close="close" />
        </div>
      </UxStretchBox>
    </td>

  </tr>
</template>

<style scoped>

._visible{
  @apply opacity-100;
}

._small{
  @apply h-[35px];
}


</style>

<script setup>

// initialize props / emits
const props = defineProps({
  totalColumns:{type:Number, required:true}
})
const emit = defineEmits(['open'])

// component is open
const isOpen = ref(false)
// ref to dom element
const $fader = ref(null)
const watchVar = ref(1)

const open = ()=> {
  isOpen.value = true
  //fade in
  let interval = setTimeout( ()=>{
    $fader.value.classList.add("_visible");
    emit('open')
  }, 200 );
}

const close = ()=> {
  //fade out
  $fader.value.classList.remove("_visible");

  setTimeout( ()=>{
    // shrink
    $fader.value.classList.add("_small");
    // trigger the stretch box to readjust
    watchVar.value += 1

    setTimeout( ()=>{
      isOpen.value = false
      emit('close')
    }, 700 );

  }, 300 );
}

// Click handler
const onClick = ()=>{
  if(isOpen.value){
    close();
    emit('close');
  }
  else{
    open()
    emit('open');
  }
}

</script>
