<template>
<div>
  <div class="flex place-content-between mb-1 text-14 text-grey-400 font-med content-center">
    <label class="label" >{{ label }}</label>
    <!-- Hint / Help launcher -->
    <div class="flex place-content-between gap-2 items-center">
      <div class="font-med text-14 italic" v-if="hint">{{ hint }}</div>
      <div class="rounded-full border-1 w-[23px] h-[23px] grid justify-center content-center text-grape-500
                cursor-pointer hover:border-grape-500" style="" v-if="$slots.help" @click="viewingHelp = true">?</div>
    </div>

  </div>

  <div
    @focus.capture = "isFocused = true"
    @blur.capture  = "isFocused = false"
    :class="[error && !isFocused ? 'border-b-1 border-b-red' : 'border-b-1 border-transparent', ]" >
    <slot />
  </div>
  <div
    :class="[
      'font-med text-14',
      error && !isFocused ? ' text-red' : 'text-grey-400']" v-if="error">* {{ error }}</div>

  <!-- Help Section -->
  <UxModal v-if="$slots.help" v-model:open="viewingHelp">
    <slot name="help" />
  </UxModal>
</div>
</template>

<script setup>
defineProps({
  label : {type:String, default:""},
  hint  : {type:String, default:null},
  error : {type:String, default:null}
})

const isFocused = ref(false)

const viewingHelp = ref(false);
</script>
