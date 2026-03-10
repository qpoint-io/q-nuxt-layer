<template>
  <!-- TODO, merge w/ Ux/PercentBar ? -->
  <UxPercentBar
    :title   = "formattedTotal"
    :percent = "percent"
  />
</template>
<script setup>

const props = defineProps({
  total   : {type:Number, required:true},
  percent : {type:Number, required:true},
})

const formattedTotal = computed(()=>{
  let formatter = Intl.NumberFormat('en', { notation: 'compact' })
  return formatter.format( props.total )
})
</script>
