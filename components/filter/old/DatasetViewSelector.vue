<template>
  <div>
    <Listbox as="div" v-model="selected" v-if="selected">
      <ListboxLabel class="sr-only">Change View</ListboxLabel>

      <div class="relative text-15 font-semi text-nowrap">

        <!-- Trigger -->
        <div class=" text-11 border-b-1 font-semi mb-2 ">Dataset View:</div>

        <!-- if is disabled -->
        <div v-if="disabled" class=" flex items-center gap-2">
          <slot name="icon" />
          <div class="text-grey-400/80 text-16 font-semi text-nowrap">Not Applicable</div>
        </div>
        <!-- not disabled -->
        <ListboxButton class="flex items-center" v-if="!disabled">
          <div class="flex items-center gap-2 pr-[18px]">
            <slot name="icon" />
            <div>{{ selected.name }}</div>
            <span class="sr-only">Change View</span>
          </div>
          <UxIcon id="down-arrow" class="w-3 text-grape"/>
        </ListboxButton>

        <!-- Content -->
        <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100"
          leave-to-class="opacity-0">
          <ListboxOptions class="absolute left-0 z-10 mt-2 min-w-[200px] origin-top-right divide-y
                  divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1
                  ring-black ring-opacity-5 focus:outline-none">
            <ListboxOption as="template" v-for="option in options" :key="option.id ?? 'none'" :value="option"
              v-slot="{ active, selected }">
              <li
                :class="[active ? 'text-white bg-grape' : 'text-gray-900', 'select-none py-3 px-4 text-sm cursor-pointer']">
                <div class="flex justify-between items-center group grow">
                  <div class="flex flex-col whitespace-nowrap">
                    <div>{{ option.name }}</div>
                  </div>
                  <span v-if="selected" :class="active ? 'text-white' : 'text-grape'">
                    <UxIcon id="check" class="w-[15px] mt-2 ml-4" aria-hidden="true" />
                  </span>
                </div>
              </li>
            </ListboxOption>

            <div v-if="canManage"
              class="w-full cursor-pointer hover:text-grape inline-flex p-4 font-reg" @click="$emit('manage')">
              <UxIcon id="arrow-right" class="w-[8px] text-grape mr-px8" aria-hidden="true" />
              Manage
            </div>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>

<!-- Presentational listbox only — fetching the dataset-view options, the
     org-permissions check behind canManage, and the "Manage" navigation are
     all business logic that stays local to the consumer. -->
<script setup>
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'

const props = defineProps({
  modelValue: { type: String, default: undefined },
  // { id, name }[] — id undefined represents "All"/no-context
  options: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: true },
  canManage: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'manage'])

// listbox state for selected option
const selected = ref(undefined)

// sync selected from modelValue/options
watch([() => props.options, () => props.modelValue], () => {
  if (props.options.length === 0) return
  selected.value =
    props.options.find(o => o.id === props.modelValue) ??
    props.options.find(o => o.id === undefined) ??
    props.options[0]
}, { immediate: true })

// when user picks an option, emit its id
watch(selected, (updated) => {
  if (!updated) return
  if (updated.id !== props.modelValue) emit('update:modelValue', updated.id)
})
</script>
