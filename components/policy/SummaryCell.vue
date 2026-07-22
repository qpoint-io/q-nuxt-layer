<template>
  <div class="flex justify-between">
    <div class="flex flex-col pr-2 py-2">
      <div class="flex items-center">
        <UxToggle size="tiny">
          <input type="checkbox" class="sr-only peer" v-model="enabled" />
          <template #label>
            <span class="text-18 font-bold text-content">{{ name }}</span>
          </template>
        </UxToggle>
      </div>
      <p class="whitespace-normal text-12 font-med leading-[1.45] text-grey-600">{{ description }}</p>
    </div>

    <!-- beta tag -->
    <div v-if="beta" class="flex items-center gap-4">
      <span class="rounded-32 border border-[#e3a12f] bg-[#ffeadc] px-3 py-0.5 text-11 font-bold leading-[14px] text-[#972a1c]">Beta</span>
    </div>
  </div>
</template>

<script setup>
// Left "Policy Control" cell for policy tables: labeled toggle + description,
// optional right-aligned Beta pill. Row actions (Manage/Details) live in
// their own table column.
import { ref } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  description: { type: String, required: true },
  on: { type: Boolean, default: true },
  beta: { type: Boolean, default: false },
})

const enabled = ref(props.on)
</script>
