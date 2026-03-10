<template>
  <div class="pb-20 lg:pb-24 pt-8 lg:pt-14">
    <div class="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
      <!-- Content -->
      <div class="hero-content">
        <h1 class="text-56 font-bold md:mb-6" v-html="title"></h1>
        <h2 class="text-18 leading-5 sm:text-20 md:text-26" v-if="subTitle" v-html="subTitle"></h2>
        <p class="text-14 sm:text-18 md:text-20   text-grey-600 font-med leading-5 mb-4 sm:mb-8" v-html="description"></p>
        <div class="flex gap-2">
          <slot mdc-unwrap="p" />
        </div>

      </div>

      <!-- Hero Image -->
      <div v-if="image" class="order-first lg:order-last" :class="screenshot ? 'screenshot' : ''">
        <img
          :src="image"
          :alt="imageAlt || 'Hero image'"
          :style="{ maxWidth: maxImgWidth ? `${maxImgWidth}px` : undefined }"
          class="w-full h-auto rounded-lg mx-auto max-w-lg lg:max-w-none"
        />
      </div>
      <!-- optional slot for additional content -->
       <div v-if="$slots.right" class="self-end ">
        <slot name="right" mdc-unwrap="p" />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title:      { type: String, required: true },
  subTitle:   { type: String },
  description: { type: String, required: true },
  image:      { type: String, default: null },
  imageAlt:   { type: String, default: '' },
  maxImgWidth:   { type: [String, Number], default: null },
  screenshot:   { type: Boolean, default: false },
})
</script>
