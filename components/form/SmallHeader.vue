<template>
  <div class="mt-8 pb-2 font-semi text-20 border-b-3 border-b-content flex items-end">
    <div>
      <slot />
    </div>
    <div class="overflow-y-visible flex items-end ml-auto">
      <slot name="right" />
    </div>
  </div>
</template>

<style>
._danger{
  @apply  border-b-signal-error;
}
</style>
