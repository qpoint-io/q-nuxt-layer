<template>
  <div class="inline-flex flex-col items-center w-[220px] h-[220px] bg-surface border border-stroke rounded-full shadow-lg ml-2">
    <div class="w-[200px] mt-2">
      <HealthDial
        :status="status"
      />
    </div>
    <div class="text-28 font-bold -mt-1">{{ message }}</div>
  </div>
</template>

<script setup>
const statusMessages = { cool: 'Good', warn: 'Warning', warm: 'Concerning', hot: 'Critical' }

const props = defineProps({
  status:        { type: String, required: true },
  statusMessage: { type: String, default: null },
})

const message = computed(() => props.statusMessage || statusMessages[props.status])
</script>
