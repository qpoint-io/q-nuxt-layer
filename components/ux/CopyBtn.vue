<template>
  <div
    class="relative text-11 cursor-pointer inline-flex"
    :class="(copied)? 'copied' : ''"
    v-if="copy"
    @click="handleCopy"
  >
    <IconCheck class="_check absolute w-4 opacity-0 text-black top-2 left-1 duration-200" />

    <!-- Icon-only mode -->
    <IconCopy
      v-if="noText"
      class="text-grape max-w-[20px] w-8 _copy"
    />

    <!-- Icon + text mode -->
    <button v-if="!noText" :class="['inline-flex items-center gap-1 text-11', inline ? '' : 'px-2 py-1']">
      <IconCopy class="text-grape max-w-[20px] _copy" />
      <span>{{ copied ? copiedText : copyText }}</span>
    </button>
  </div>
</template>

<style scoped>
.copied ._copy {
  @apply text-grape-400 opacity-20;
}
.copied ._check {
  @apply text-grape-400 opacity-100;
}
</style>

<script setup>
const props = defineProps({
  textToCopy: { type: String, default: '' },
  copy:       { type: Boolean, default: true },
  copiedText: { type: String, default: 'copied!' },
  copyText:   { type: String, default: 'copy' },
  noText:     { type: Boolean, default: false },
  inline:     { type: Boolean, default: false },
})

const { copied, copy: clipboardCopy } = useClipboard()

const handleCopy = () => {
  clipboardCopy(props.textToCopy)
}
</script>
