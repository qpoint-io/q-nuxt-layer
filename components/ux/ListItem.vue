<template>
  <div style="&:after" :class="$slots.left ? 'gap-6' : ''"
    class='text-content pb-2 mb-2 flex items-center bordered relative after-border last:no-after-border'>

    <div class="flex items-center gap-4">
      <slot name="left" />
    </div>

    <div
      class="flex items-center group grow"
      :class="manage && clickable && 'cursor-pointer'"
      @click="manage && clickable && $emit('manage')"
    >
      <div
        class="font-med grow overflow-hidden"
        :class="[manage && clickable && 'group-hover:text-primary', size == 'short' ? 'text-16 gap-2' : 'text-18 gap-4']"
      >
        <slot />
        <div
          class="font-reg text-12 text-nowrap truncate"
          :class="size == 'short' ? 'text-content-subtle -mt-1' : ''"
        >{{ description }}</div>
      </div>
      <slot name="right" />
      <div v-if="manage" class="text-12 flex items-center group-hover:text-primary cursor-pointer" @click="manage && $emit('manage')">
        {{ manageTxt }}
        <IconArrowRight v-if="showArrow" class="text-primary w-2 ml-2" />
      </div>
    </div>
  </div>
</template>

<script setup>
  defineProps({
    description : { type: String },
    manage: { type: Boolean, default: true },
    manageTxt : { type: String, default: 'Manage' },
    showArrow: { type: Boolean, default: true },
    clickable: { type: Boolean, default: true },
    size: { type: String, default: 'reg' },
  })
</script>
