<template>
  <div class="bg-grey-100 rounded-[250px] p-3 pl-0 flex items-center gap-14">
    <slot />

    <div class="w-[76px] rounded-[250px] bg-white p-1 shadow-lg">
      <slot name="icon">
        <div class="w-full aspect-square rounded-full bg-grey-200" />
      </slot>
    </div>

    <div class="flex-1 flex justify-end pr-8">
      <UxButton
        kind="stroke"
        class="!h-7 !px-3 !text-14 text-grape-500 !bg-transparent opacity-75"
        @click="$emit('manage')"
      >
        {{ manageTxt }}
      </UxButton>
    </div>
  </div>
</template>

<script setup>
defineProps({
  manageTxt: { type: String, default: 'Manage' }
})

defineEmits(['manage'])
</script>
