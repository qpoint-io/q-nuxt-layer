<template>
  <label class="flex items-center gap-2 text-14 text-content-muted font-med" :for="checkboxId" v-if="label">
    <slot />
    {{ label }}
  </label>
</template>

<script setup>
import { useSlots } from 'vue'

const slots = useSlots()

const checkboxId = computed(()=>{
  return slots.default()[0].props.id
})

const props = defineProps({
  label: { type:String, default:null },
})

</script>
