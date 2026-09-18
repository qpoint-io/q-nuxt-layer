<template>
  <div>

    <!-- Optional back link — in normal flow so it clears titles of any size -->
    <div
      v-if="backText"
      @click="$emit('back')"
      class="w-fit mb-1 flex gap-1 items-center cursor-pointer group font-med text-12 text-primary hover:text-content"
    >
      <UxIcon id="arrow-right" class="w-[6px] rotate-180" />
      {{ backText }}
    </div>

    <div class="flex gap-px24 whitespace-nowrap">
      <div class="grow border-b border-stroke-strong pb-3 flex items-end">
        <!-- Main slot -->
        <div class="flex items-baseline gap-2 font-bold text-15 grow">

          <!-- Breadcrumb trail -->
          <div
            v-for="(crumb, index) in parsedBreadcrumb"
            :key="index"
            class="flex items-baseline gap-2"
          >
            <NuxtLink v-if="crumb.to" :to="crumb.to" class="text-content-muted hover:text-content">
              {{ crumb.title }}
            </NuxtLink>
            <span v-else class="text-content-muted">{{ crumb.title }}</span>
            <div class="text-content-subtle">/</div>
          </div>

          <div class="text-content leading-none" :style="{ fontSize: titleSize + 'px' }">
            <slot />
          </div>
        </div>

        <!-- Optional right slot -->
        <div v-if="slots['right']" class="overflow-y-visible flex items-end pb-1 ml-5">
          <slot name="right" />
        </div>
      </div>

      <!-- Optional far-right slot -->
      <slot name="far-right" />
    </div>

    <!-- Optional chin slots (below the content) -->
    <div v-if="slots['chin'] || slots['chin-right']" class="flex items-center mt-3 -mb-5">
      <slot name="chin" />
      <div v-if="slots['chin-right']" class="ml-auto pl-2">
        <slot name="chin-right" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, useSlots } from 'vue'

const slots = useSlots()
const props = defineProps({
  backText   : { type: String },
  // String → plain (unlinked) crumb. Object → { title, to } linked crumb.
  // Pass an array to combine several.
  breadcrumb : { type: [String, Array, Object] },
  titleSize  : { type: Number, default: 28 },   // px — bump for hero detail-page titles

})

defineEmits(['back'])

const parsedBreadcrumb = computed(() => {
  if (props.breadcrumb == null) return []

  const items = Array.isArray(props.breadcrumb) ? props.breadcrumb : [props.breadcrumb]

  return items.map((item) =>
    typeof item === 'string'
      ? { title: item, to: '' }
      : { title: item.title, to: item.to || '' }
  )
})
</script>
