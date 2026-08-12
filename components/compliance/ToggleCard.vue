<template>
  <div
    class="rounded-6 border p-4 transition-colors"
    :class="active
      ? 'border-grape-400 bg-surface'
      : 'border-dashed border-stroke-strong bg-surface-sunken-subtle'"
  >
    <div class="flex items-start justify-between gap-2">
      <button type="button" class="flex min-w-0 items-center gap-2.5 text-left" @click="emit('toggle')">
        <img :src="active ? shieldUrl : shieldGreyUrl" alt="" class="h-5 w-auto shrink-0" />
        <span
          class="min-w-0 truncate text-15 font-bold leading-tight"
          :class="active ? 'text-content' : 'text-content-subtle'"
        >{{ name }}</span>
      </button>
      <UxToggle size="tiny">
        <input type="checkbox" class="peer sr-only" :checked="active" @change="emit('toggle')" />
      </UxToggle>
    </div>

    <!-- active: completeness toward the framework; inactive: what activating would demand -->
    <div v-if="active" class="mt-3">
      <!-- no semantic coloring — grey while in progress, grape only at 100% -->
      <div class="relative h-1.5 w-full rounded-full bg-surface-sunken-deeper">
        <div
          class="absolute inset-y-0 left-0 rounded-full"
          :class="percent === 100 && 'bg-grape-500'"
          :style="{
            width: percent + '%',
            backgroundColor: percent === 100 ? null : '#949494',
          }"
        ></div>
      </div>
      <div class="mt-1.5 flex items-center justify-between">
        <span class="text-13 font-bold text-content">
          {{ percent }}%
          <span class="font-med text-content-subtle">· {{ satisfied }} / {{ required }} policies</span>
        </span>
        <button
          v-if="gaps > 0"
          type="button"
          class="whitespace-nowrap rounded-4 border border-primary/60 bg-surface px-2.5 py-0.5 text-11 font-semi text-primary hover:bg-primary/5"
          :title="gapTitle"
          @click="emit('enable-gaps')"
        >
          Enable Required Policies
        </button>
      </div>
    </div>
    <p v-else class="mt-3 text-12 font-med text-content-muted">
      {{ required }} policies mapped · {{ gaps }} would need enabling
    </p>
  </div>
</template>

<script setup>
// Compliance framework toggle card (c65 "surface semantics"): shield mark +
// name + activation toggle over a completeness bar. Active = raised white
// card with grape border; inactive = sunken, dashed, grey shield. The bar
// stays neutral grey until 100%, then goes grape. The Enable Required
// Policies button appears while gaps remain; the parent owns all state:
//   <ComplianceToggleCard
//     name="SOC 2" :active="on" :percent="67" :satisfied="4" :required="6"
//     :gaps="2" gap-title="Enable: Tool Allow-List, Data Redaction"
//     @toggle="..." @enable-gaps="..." />
// Shield art from the layer's own assets (?url imports, AgentPawn pattern) —
// the art carries its own colors, so <img>, not UxIcon. Grey fill on the
// bar is an inline style: no grey-400 class dependency on consumer scans.
import shieldUrl from '../../assets/svgs/compliance-frameworks/compliance-shield.svg?url'
import shieldGreyUrl from '../../assets/svgs/compliance-frameworks/compliance-shield-grey.svg?url'

defineProps({
  name: { type: String, required: true },
  active: { type: Boolean, default: false },
  /** completeness 0–100 (shown when active) */
  percent: { type: Number, default: 0 },
  /** policies satisfied / required by this framework */
  satisfied: { type: Number, default: 0 },
  required: { type: Number, default: 0 },
  /** required-but-off policy count — > 0 shows the enable button */
  gaps: { type: Number, default: 0 },
  /** optional tooltip for the enable button (e.g. the gap policy names) */
  gapTitle: { type: String, default: '' },
})

const emit = defineEmits(['toggle', 'enable-gaps'])
</script>
