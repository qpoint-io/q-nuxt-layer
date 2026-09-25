<template>
  <!-- A small editor window (the VS Code look, no editor inside): a tray on the
       left (#tray — typically a UxFileTree), a tab strip across the top of the
       right pane (tabs prop, or #tabs to draw your own) with an optional
       #toolbar at its right end (e.g. a Preview / Source UxTabGroup), and the
       content below (default slot). Presentational only — what the tabs mean
       and what the content shows are the consumer's. Stacks the tray above
       the pane under `md`. Size it from outside (min-h-*, h-*); the tray and
       the content scroll on their own. -->
  <div class="flex flex-col overflow-hidden rounded-8 border border-stroke bg-surface md:flex-row">
    <aside
      v-if="$slots.tray"
      class="flex max-h-72 min-w-0 flex-col border-b border-stroke bg-surface-sunken md:max-h-none md:w-60 md:shrink-0 md:border-b-0 md:border-r"
    >
      <div v-if="trayLabel" class="truncate px-3 pb-0.5 pt-2 text-11 font-bold uppercase tracking-wide text-content-subtle" :title="trayLabel">{{ trayLabel }}</div>
      <div class="min-h-0 flex-1 overflow-auto">
        <slot name="tray" />
      </div>
    </aside>

    <div class="flex min-w-0 flex-1 flex-col">
      <!-- tab strip: tabs left, toolbar right -->
      <div v-if="normalized.length || $slots.tabs || $slots.toolbar" class="flex items-stretch border-b border-stroke bg-surface-sunken">
        <div role="tablist" class="-mb-px flex min-w-0 overflow-x-auto">
          <slot name="tabs" :tabs="normalized" :active="modelValue">
            <button
              v-for="tab in normalized"
              :key="tab.value"
              type="button"
              role="tab"
              :aria-selected="tab.value === activeValue"
              :title="tab.title || tab.label"
              class="flex min-w-0 max-w-xs shrink-0 items-center gap-1.5 border-r border-t-2 border-r-stroke px-3 py-1.5 font-mono text-12 leading-5"
              :class="tab.value === activeValue
                ? 'border-b border-b-surface border-t-primary bg-surface text-content'
                : 'border-t-transparent text-content-subtle hover:text-content'"
              @click="$emit('update:modelValue', tab.value)"
            >
              <slot name="tab" :tab="tab" :active="tab.value === activeValue">
                <span class="truncate">{{ tab.label }}</span>
              </slot>
            </button>
          </slot>
        </div>
        <div v-if="$slots.toolbar" class="ml-auto flex shrink-0 items-center gap-2 px-2 py-1">
          <slot name="toolbar" />
        </div>
      </div>

      <div class="min-h-0 min-w-0 flex-1 overflow-auto">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  // strings or { value, label, title? } — the open files; title is the tooltip (e.g. the full path)
  tabs: { type: Array, default: () => [] },
  // the active tab's value (v-model); unset → the first tab
  modelValue: { type: [String, Number], default: null },
  // the tray's small uppercase header (the explorer's folder name); omit for none
  trayLabel: { type: String, default: '' },
})

defineEmits(['update:modelValue'])

const normalized = computed(() =>
  props.tabs.map((t) => (typeof t === 'object' ? { ...t, label: t.label ?? String(t.value) } : { value: t, label: String(t) })),
)
const activeValue = computed(() => props.modelValue ?? normalized.value[0]?.value)
</script>
