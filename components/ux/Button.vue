<template>
  <button :class="['h-12 rounded-lg px-px24 marker:flex items-center gap-px8 group  flex whitespace-nowrap',
                   kind == 'stroke' ? 'bg-surface text-content border-primary border-2 hover:border-content' : 'bg-grape-400 text-white hover:bg-grape-500',
                   disabled? 'opacity-50 pointer-events-none' : '',
                   spin?     'pointer-events-none' : '',
                  ]">

    <!-- This doubles as a slot for icons and the loading spinner. -->
    <div
      v-if="($slots.icon || spin)"
      :class="[ '',
                kind == 'stroke' ? 'text-primary group-hover:text-content' : 'text-white group-hover:text-white' ]">
        <IconSpinner v-if="spin" class="w-[20px] animate-spin -ml-2" style="transform-origin: 45% 50%;"></IconSpinner>
        <slot v-else name="icon" />
    </div>

    <!-- Main Slot -->
    <div class="grow flex items-center">
      <slot />
    </div>

  </button>
</template>

<script setup>
defineProps({
  disabled : { type:Boolean, default:false },
  kind     : { type:String, default:'' },
  spin     : { type:Boolean, default: false},
})
</script>
