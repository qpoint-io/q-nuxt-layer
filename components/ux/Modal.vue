<template>

  <TransitionRoot appear :show="open" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-[20]">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full justify-center p-4 text-center"
          :class="getAlign()"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              tabindex="0"
              class="w-full transform rounded-lg p-6 text-left shadow-xl transition-all relative outline-none focus:outline-none"
              :class="[
                fullScreen || 'max-w-[740px]',
                bg
              ]"
            >
              <UxClose v-if="closeBtn" class="absolute right-px8 top-px8" @click="closeModal"/>
              <slot />
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
  import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
  } from '@headlessui/vue'

  const props = defineProps({
    open       : { type:Boolean, default:false },
    fullScreen : { type:Boolean, default: false },
    atTop      : { type: Boolean, default: false },
    atBottom   : { type: Boolean, default: false },
    closeBtn   : { type:Boolean, default: true },
    bg         : { type:String, default: 'bg-white'},
  })

  const emit = defineEmits(['update:open'])
  const closeModal = () => emit('update:open', false)

  const getAlign = ()=> {
    if(props.atTop)
      return 'items-start'

      if(props.atBottom)
      return 'items-end'

    if(!props.fullScreen)
      return 'items-center'

    return ''
  }

</script>
