<template>
  <div class="mt-px16 flex relative max-w-[300px] drop-shadow-lg bg-surface px-px24 py-px16 pr-px40 rounded-md border-stroke border-1 ">
    <slot />
    <UxClose class="absolute  right-px8 top-px8" @click="$emit('close')"/>
  </div>
</template>
