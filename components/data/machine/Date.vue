<template>
  <div>
    {{ date }}
  </div>
</template>

<script setup>
const props = defineProps({date:{type:String, required:true}})
</script>
