<template>
<div v-if="dirty"
  class="-bottom-12 bg-opacity-[95%] z-[9] pt-4"
  :class="{ 'sticky border-grape-100 border-2 rounded-12 p-4 bg-grey-150/90': floating}"
>
  <div  class="flex justify-between gap-px16">
      <!-- Cancel -->
      <UxButton
        v-if      = "hasCancelListener && cancel"
        kind      = "cancel"
        @click    = "$emit('cancel')"
        :disabled = "cancelDisabled"
        class     = "btn-cancel" >
          {{ cancelText }}
      </UxButton>

      <!-- Save -->
      <UxButton
        v-if      = "attrs.onSave != null"
        @click    = "$emit('save')"
        :disabled = "disabled"
        :spin     = "saving"
        class     = "" >
          {{ (saving && savingText) ? savingText : saveText }}
      </UxButton>
    </div>
  </div>

</template>

<script setup>

import { useAttrs } from 'vue'

defineProps({
  saveText  : { type: String,   default: 'Save' },
  savingText: { type: String },
  saving    : { type: Boolean,  default: false },

  disabled  : { type: Boolean, default: false },
  dirty     : { type: Boolean, default: true },

  cancel        : { type: Boolean, default: true},
  cancelText    : { type:String,   default: 'Cancel' },
  cancelDisabled: { type: Boolean, default: false },

  floating: { type: Boolean, default: true },
})

const attrs = useAttrs()

const hasCancelListener = computed(()=>{
  return attrs.onCancel != null
})
</script>
