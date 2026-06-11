<template>
  <label class="relative group"
    :class="disabled? 'pointer-events-none' : 'cursor-pointer' ">

      <!-- A input radio or checkbox must be place in the slot -->
      <slot />

      <!-- Main content area -->
      <div class="duration-200 p-6 rounded-12  border-3 border-stroke flex flex-col gap-3 min-w-[360px]
                peer-checked:border-primary peer-checked:border-3
                group-hover:border-primary/50"
      >
        <span v-if="label" class="text-20 font-bold">{{ label }}</span>
        <slot v-if="$slots?.content || description" name="content">{{ description }}</slot>
      </div>

      <!-- Logo bug - Optional place for logos-->
      <div class="absolute top-[50%] right-6" style="transform: translateY(-50%)">
        <slot name="logobug" />
      </div>
  </label>
</template>

<script setup>
  defineProps({
    label       : { type:String },
    description : { type:String },
    disabled    : { type: Boolean, default: false },
  })
</script>
