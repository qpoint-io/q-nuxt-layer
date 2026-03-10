<template>
  <div class="py-8 lg:py-12">
    <div
      :class="[
        'flex items-center gap-8 lg:gap-12',
        // Layout classes
        layout === '[..][++]' ? 'flex-row' : '',
        layout === '[++][..]' ? 'flex-row-reverse' : '',
        layout === '[.][+++]' ? 'flex-row' : '',
        layout === '[+++][.]' ? 'flex-row-reverse' : '',
        layout === '[++++]'   ? 'flex-row' : '',
        // Mobile responsive - stack on mobile
        'flex-col lg:flex-row'
      ]"
    >
      <!-- Text Content -->
      <div
        v-if="layout !== '[++++]'"
        :class="[
          'flex flex-col',
          // Width classes based on layout
          layout === '[..][++]' || layout === '[++][..]' ? 'flex-1' : '',
          layout === '[.][+++]' || layout === '[+++][.]' ? 'w-full lg:w-1/4 lg:max-w-sm' : ''
        ]"
      >
        <h3 class="text-24 lg:text-28 font-bold text-grey-900 mb-4">
          {{ title }}
        </h3>
        <p class="text-16 lg:text-18 text-grey-600 leading-relaxed mb-6">
          {{ description }}
        </p>
        <a
          v-if="link"
          :href="link"
          class="inline-flex items-center text-grape-500 hover:text-grape-600 font-medium transition-colors"
        >
          {{ linkText || `Learn more about ${title}` }}
          <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </a>
      </div>

      <!-- Image -->
      <div
        v-if="image"
        :class="[
          'flex-shrink-0',
          // Width classes based on layout
          layout === '[..][++]' || layout === '[++][..]' ? 'flex-1' : '',
          layout === '[.][+++]' || layout === '[+++][.]' ? 'flex-1' : '',
          screenshot ? 'screenshot' : ''
        ]"
      >
        <img
          :src="image"
          :alt="title"
          class="w-full h-auto rounded-lg object-cover"
        />
      </div>

      <!-- Multiple Images -->
      <div
        v-if="images"
        :class="[
          'flex-shrink-0',
          layout === '[..][++]' || layout === '[++][..]' ? 'flex-1' : '',
          layout === '[.][+++]' || layout === '[+++][.]' ? 'flex-1' : '',
          layout === '[++++]'                            ? 'flex-1' : '',
          screenshot ? 'screenshot' : ''
        ]"
      >
        <img
          v-for="(imgInstance, index) in images" :key="index"
          :alt="title"
          :src="imgInstance"
          class="w-full h-auto rounded-lg object-cover"
          :class="(visibleImageIndex == index)? 'hidden' : 'visible' "
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: null },
  images: { type: Array },
  link: { type: String, default: null },
  linkText: { type: String, default: null },
  screenshot: { type: Boolean, default: false },
  layout: {
    type: String,
    default: '[..][++]',
    validator: (value) => ['[..][++]', '[++][..]', '[.][+++]', '[+++][.]'].includes(value)
  }
})

const visibleImageIndex = ref(0)
let intervalId = null

// increment visible image index and cycle back to 0 when reaching the end
const nextImage = () => {
  if (props.images && props.images.length > 0) {
    visibleImageIndex.value = (visibleImageIndex.value + 1) % props.images.length
  }
}

// set up interval to cycle through images when component mounts
onMounted(() => {
  if (props.images && props.images.length > 0) {
    intervalId = setInterval(nextImage, 4000)
  }
})

// clear interval when component unmounts
onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>
