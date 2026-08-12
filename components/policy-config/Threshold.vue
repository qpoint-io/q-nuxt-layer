<template>
  <section>
    <div class="mb-1 flex items-baseline justify-between">
      <h2 class="text-18 font-bold text-content">{{ title }}</h2>
      <p class="text-12 text-content-muted">Violations flag when the observed value crosses a ceiling{{ hasFloor ? ' / falls below a floor' : '' }}.</p>
    </div>

    <div class="space-y-3">
      <div
        v-for="(m, i) in metrics" :key="m.label"
        class="flex flex-wrap items-center gap-x-8 gap-y-2 rounded-6 border border-stroke bg-surface px-5 py-4"
        :class="breached(m) && 'border-error/50 bg-error/5'"
      >
        <div style="min-width: 220px">
          <p class="text-15 font-bold text-content">{{ m.label }}</p>
          <p class="text-12 text-content-muted">{{ m.scope }}</p>
        </div>

        <label class="flex items-center gap-2">
          <span class="text-13 font-med text-content-subtle">{{ dirOf(m) === 'min' ? 'floor' : 'ceiling' }}</span>
          <span v-if="m.unit === '$'" class="text-15 font-bold text-content">$</span>
          <input
            :value="m.value" type="number"
            class="rounded-4 border border-stroke bg-surface px-2 py-1.5 text-right text-16 font-bold text-content"
            style="width: 90px"
            @input="emit('change', i, Number($event.target.value))"
          />
          <span v-if="m.unit !== '$'" class="text-13 font-med text-content-subtle">{{ m.unit }}</span>
        </label>

        <div class="flex items-center gap-2">
          <span class="text-13 text-content-muted">observed:</span>
          <span class="text-15 font-bold" :class="breached(m) ? 'text-error' : 'text-content'">
            {{ m.unit === '$' ? '$' + m.observed : m.observed + (m.unit !== '$' ? ' ' + m.unit : '') }}
          </span>
          <span
            v-if="breached(m)"
            class="rounded-32 bg-error/10 px-2.5 py-0.5 text-11 font-bold text-error"
          >{{ dirOf(m) === 'min' ? 'below floor' : 'over ceiling' }}</span>
        </div>

        <p v-if="m.note" class="w-full text-12 italic text-content-muted">{{ m.note }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
// Config shape: threshold — numeric ceilings/floors with observed context
// (c65 P15/P16/P17). Fully controlled: renders `metrics` as given and emits
// @change(index, value) on input — the parent owns the values (mutate its
// reactive metric, debounce a control save, etc.). `dir: 'max'` (default)
// breaches when observed > value; `dir: 'min'` when observed < value.

const props = defineProps({
  title: { type: String, default: 'Thresholds' },
  metrics: { type: Array, required: true }, // { label, scope, unit, value, observed, dir?, note? }
})

const emit = defineEmits(['change'])

const dirOf = (m) => m.dir || 'max'
const breached = (m) => (dirOf(m) === 'min' ? m.observed < m.value : m.observed > m.value)
const hasFloor = computed(() => props.metrics.some((m) => dirOf(m) === 'min'))
</script>
