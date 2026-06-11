<template>
  <div class="flex items-center gap-2 text-primary text-16 cursor-pointer hover:text-content" >
    <slot name="left" />
    <slot />
    <slot name="right" />
  </div>
</template>
