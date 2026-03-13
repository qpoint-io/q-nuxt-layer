<template>
  <select
    :value="props.modelValue"
    v-on:input="updateValue($event.target.value)"
    @change="$emit('change')"
    class="text-14 font-semi border-0 bg-transparent p-0 pr-7 bg-no-repeat cursor-pointer rounded-none
           focus:ring-0 focus:border-0 "
    style="background-position: right 0.4rem center; background-size:10px; background-image: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5l5 5 5-5' stroke='%23666' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E&quot;);"
  >
    <slot />
  </select>
</template>

<script setup>
const props = defineProps( ['modelValue'] )
const emit = defineEmits(['update:modelValue', 'change'])

function updateValue(value){
  emit('update:modelValue', value)
}
</script>
