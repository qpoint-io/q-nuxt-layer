<template>
  <div class="flex gap-2 items-center text-14">
    <img
      v-if="authorImage"
      class="rounded-full object-cover"
      :class="imageSize == 'tiny' ? 'w-5 h-5' : 'w-9 h-9'"
      :src="authorImage"
      :alt="authorName"
    />
    <div class="font-semi text-15">{{ authorName }}</div>
    <div class="italic ml-2 text-content-subtle">{{ publishDate }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  // Person object (new way)
  person: { type: Object, default: null },
  // Individual props (backward compatibility)
  name: { type: String, default: null },
  publishDate: { type: String, required: true },
  img: { type: String, default: null },
  // Control whether to show the author image
  showImage: { type: Boolean, default: true },
  // Image size
  imageSize: { type: String, default: 'reg'}

})

// Computed properties to handle both person object and individual props
const authorName = computed(() => {
  if (props.person?.name) {
    return props.person.name
  }
  return props.name || 'QPoint Team'
})

const authorImage = computed(() => {
  if (!props.showImage) {
    return null
  }
  if (props.person?.photo) {
    return props.person.photo
  }
  return props.img || null
})
</script>
