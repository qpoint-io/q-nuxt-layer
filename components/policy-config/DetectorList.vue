<template>
  <section>
    <div class="mb-1 flex items-baseline justify-between">
      <h2 class="text-18 font-bold text-content">{{ title }}</h2>
      <p class="text-12 text-content-muted">Detectors toggle individually; hit counts are the last 24h.</p>
    </div>

    <div class="space-y-6">
      <div v-for="(family, fi) in families" :key="family.name">
        <div class="mb-1.5 flex items-baseline justify-between border-b border-stroke pb-1.5">
          <h3 class="text-14 font-bold uppercase tracking-wide text-content-subtle">{{ family.name }}</h3>
          <button
            type="button"
            class="text-12 font-semi text-primary"
            @click="emit('toggle-all', fi, !family.detectors.every((d) => d.on))"
          >{{ family.detectors.every((d) => d.on) ? 'Disable all' : 'Enable all' }}</button>
        </div>

        <div
          v-for="(d, di) in family.detectors" :key="d.label"
          class="flex items-center gap-6 border-b border-stroke/50 py-2"
        >
          <UxToggle size="tiny" style="width: 260px">
            <input
              type="checkbox" class="peer sr-only"
              :checked="d.on"
              @change="emit('toggle', fi, di, !d.on)"
            />
            <template #label>
              <span class="text-14 font-semi" :class="d.on ? 'text-content' : 'text-content-muted'">{{ d.label }}</span>
            </template>
          </UxToggle>
          <SecuritySeverity :severity="d.severity" style="width: 90px" />
          <span class="text-13 tabular-nums" :class="d.hits ? 'font-bold text-content' : 'text-content-muted'">
            {{ d.hits }} {{ d.hits === 1 ? 'hit' : 'hits' }}
          </span>
          <span v-if="d.note" class="text-12 italic text-content-muted">{{ d.note }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Config shape: detector list — detector families toggled individually with
// severity + live hit context (c65 P8/P9/P12/P13). Fully controlled: renders
// `families` as given and emits intents — the parent owns the data.
//   @toggle     → (familyIndex, detectorIndex, on)
//   @toggle-all → (familyIndex, on)

defineProps({
  title: { type: String, default: 'Detectors' },
  families: { type: Array, required: true }, // { name, detectors: [{ label, severity, hits, on, note? }] }
})

const emit = defineEmits(['toggle', 'toggle-all'])
</script>
