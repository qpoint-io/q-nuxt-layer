<template>
  <div>
    <div class="flex flex-wrap gap-2 border-1 border-stroke-strong px-2 pt-2 pr-0 pb-2 bg-surface">
      <UxTag
        v-for="(tag, index) in tags" :key="index"
        @remove  = "removeTag(index)">
      {{tag}}
     </UxTag>
     <input
        @focus   = "onFocus"
        @blur    = "onBlur"
        @keydown = "onKeyPress"
        v-model  = "inputTxt"
        class="-mt-1 py-0 max-h-9 grow border-none focus:ring-0 focus:border-0 pl-0" type="text" name="tag input" >
    </div>

  </div>
</template>

<script setup>

  // define props
  const props = defineProps({
    modelValue: {
      type    : Array,
      default : [],
      required: true
    }
  })

  // define emits
  const emit = defineEmits(['update:modelValue'])

  // the tags
  const tags = ref(props.modelValue)

  // input text
  const inputTxt  = ref('')

  // are we listening?
  const listening = ref(false)

  // watch modelValue and update tags
  watch(() => props.modelValue, (val) => {
    tags.value = val
  })

  // textfield gain focus
  const onFocus = () => {
    listening.value = true
  }

  // textfield gain focus
  const onBlur = () => {
    listening.value = false
    addTextToArray()
  }

  // listen for commas, tabs, and backspaces
  const onKeyPress = (e) => {
    if(!listening.value)
      return

    if(e.key == ',' || e.key == 'Tab' || e.key == 'Enter'){
      addTextToArray()
      e.preventDefault()
    }

    if (e.key == 'Backspace' && inputTxt.value == '' && tags.value.length > 0) {
      removeTag(tags.value.length - 1)
      e.preventDefault()
    }
  }

  // add the text to the array
  const addTextToArray = () => {
    if(inputTxt.value.length < 1)
      return

    // add to tags
    tags.value.push(inputTxt.value)

    // emit change
    emit('update:modelValue', tags.value)

    // reset input textr
    inputTxt.value = ''
  }

  // remove tag
  const removeTag = (index) => {
    // remove the element at the index
    tags.value.splice(index, 1)

    // emit change
    emit('update:modelValue', tags.value)
  }
</script>
