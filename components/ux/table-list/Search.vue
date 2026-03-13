<template>
  <th class="text-13 px-2 select-none  border-l-1 border-r-1 first-of-type:border-l-0" :style="(!width) ? '' : `width:${width}`">
    <div>
      <div class="_search flex justify-between capitalize" :class="(isSorting)?'text-grape':''">
        <slot />
        <UxIcon id="search" class="w-4 text-grey-400" />
      </div>
    </div>
  </th>
</template>

<style>
._search{
  @apply w-full;
  input{
    @apply p-0 text-13 w-full border-none focus:outline-none bg-grey-100;
  }
  input:focus{
    box-shadow: none;
  }
}
</style>

<script setup>
// props
const props = defineProps({
  width: { type: String }, // optional
  name: { type: String },
  isSorting: { type: Boolean, default: false },
})

const search = ref('')
</script>
