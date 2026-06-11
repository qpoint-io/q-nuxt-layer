<template>
  <div class="text-14 text-content-muted leading-6">
    <!-- summary -->
    <div v-if="summary != '' && !isOpen">
      {{ summary }} <span class="_help-text-link" @click="isOpen = true"> More..</span>
    </div>

    <!-- full text -->
    <div v-if="isOpen">
      <slot/>
      <span v-if="summary != ''" class="_help-text-link" @click="isOpen = false">Less</span>
    </div>
  </div>
</template>

<style scoped>
._help-text-link{
  @apply ml-2 text-primary font-med cursor-pointer;
}
</style>

<script setup>
const props = defineProps({
  summary:{type:String, default:""}
})

const isOpen = ref(false)
</script>
