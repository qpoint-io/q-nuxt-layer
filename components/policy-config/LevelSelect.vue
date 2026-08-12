<template>
  <section>
    <div class="mb-1 flex items-baseline justify-between">
      <h2 class="text-18 font-bold text-content">{{ title }}</h2>
      <p class="text-12 text-content-muted">Ordered weakest → strongest; click a level to set the floor.</p>
    </div>

    <div class="grid gap-3" :style="{ gridTemplateColumns: `repeat(${levels.length}, minmax(0, 1fr))` }">
      <button
        v-for="(level, i) in levels" :key="level.id"
        type="button"
        class="rounded-6 border p-4 text-left transition-colors"
        :class="i < floorIndex
          ? 'border-error/40 bg-error/5'
          : i === floorIndex
            ? 'border-primary bg-primary/5'
            : 'border-stroke bg-surface'"
        @click="setFloor(i)"
      >
        <p class="flex items-center justify-between gap-2">
          <span class="font-mono text-13 font-bold text-content">{{ level.label }}</span>
          <span
            v-if="i === floorIndex"
            class="whitespace-nowrap rounded-32 bg-primary px-2.5 py-0.5 text-11 font-bold text-white"
          >floor</span>
        </p>
        <p class="mt-1.5 whitespace-normal text-12 text-content-subtle" style="line-height: 1.4">{{ level.desc }}</p>
        <p class="mt-2 text-12 font-bold" :class="i < floorIndex ? 'text-error' : 'text-content-muted'">
          <template v-if="i < floorIndex">
            {{ level.count }} {{ countNoun }} would violate
          </template>
          <template v-else>{{ level.count }} {{ countNoun }} today</template>
        </p>
      </button>
    </div>

    <p class="mt-3 text-13 text-content-subtle">
      Everything below <span class="font-mono font-bold text-content">{{ levels[floorIndex].label }}</span>
      raises a finding —
      <span class="font-bold" :class="violating ? 'text-error' : 'text-content'">{{ violating }} current {{ countNoun }}</span>
      below the floor.
    </p>
  </section>
</template>

<script setup>
// Config shape: level select — an ordered floor over an enum (c65 P7 sandbox
// level, P11 TLS floor). Below-floor cards preview the blast radius live.
// Seeds the selection from `floor` and emits @floor(levelId) on change —
// the parent persists (e.g. rewrite the backing control's clause value).

const props = defineProps({
  title: { type: String, required: true },
  levels: { type: Array, required: true }, // ordered weakest → strongest: { id, label, desc, count }
  floor: { type: String, required: true }, // level id
  countNoun: { type: String, default: 'runs' },
})

const emit = defineEmits(['floor'])

const floorIndex = ref(Math.max(0, props.levels.findIndex((l) => l.id === props.floor)))

const setFloor = (i) => {
  floorIndex.value = i
  emit('floor', props.levels[i].id)
}

const violating = computed(() =>
  props.levels.slice(0, floorIndex.value).reduce((sum, l) => sum + (l.count || 0), 0)
)
</script>
