<template>
  <div>
    <div class="font-med text-13 text-content-muted">{{ label }} :</div>
    <div class="font-semi text-15 -mt-1">
      <slot>
        {{ val }}
      </slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label:{type:String, required:true},
  val:{type:String}
})
</script>
