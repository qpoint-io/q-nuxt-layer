<!-- The listing strip: c92's FilterTriggerBar with c93's UxColumnPicker seated
     as its last segment — one row over a listing table that answers "which
     rows" (the quick filter) and "which columns" (the picker) without every
     page composing it by hand. Pass `columns` + v-model:visibleColumns and the
     picker appears; leave `columns` out, or set :columnPicker="false", and this
     is the bar alone. Anything else that belongs on the bar's end goes in
     #end, after the picker. Canonical seat: DataTable's #toolbar slot.

     The key dropdown is restricted to the table (Mark, c95: "global keys only,
     restricted to columns"): of the filterKeyDefs passed, only those the
     catalog has a column for are offered — a column matches by its `key`, or
     by naming the key(s) it answers to in `filterKey` (a `providers` column ↔
     the `provider` key). One offered key renders as a fixed label, no caret
     (the bar's rule). If the current filterKey isn't offered, the first offered
     key is emitted so the segment never shows a key the table can't answer.
     `restrictKeys=false` turns this off.

     Presentational, like both parts: the bar's filter props and events pass
     through untouched; the visible column set is a plain v-model (no memory —
     persistence is the consumer's, per c93). The picker's trigger is drawn
     here, from the bar's TONE roles, so it reads as part of the bar rather than
     a button beside it; the popover opens above by default so the columns being
     toggled stay in view (c93 side finding). (design c95) -->
<template>
  <FilterTriggerBar
    :label="label" :filterKeyDefs="offeredKeyDefs" :filterKey="filterKey"
    :options="options" :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    @update:filterKey="$emit('update:filterKey', $event)"
  >
    <template v-if="showPicker || $slots.end" #end="{ tone }">
      <UxColumnPicker
        v-if="showPicker"
        :columns="columns" :modelValue="visibleColumns" :label="columnsLabel"
        :side="side" :minVisible="minVisible" align="right"
        @update:modelValue="$emit('update:visibleColumns', $event)"
      >
        <template #trigger="{ open, visibleCount, hiddenCount, total }">
          <!-- Same metrics as the value segments (text-14, py-1, px-5); rounded-r-6
               so the fill follows the bar's inner corner (see TriggerBar's #end note).
               Reads "Columns" until something is hidden, then the count. -->
          <span
            class="flex h-full items-center gap-2 px-5 py-1 text-14 whitespace-nowrap rounded-r-6 transition-colors"
            :class="open || hiddenCount ? ['font-bold', tone.selected] : ['font-med', tone.text, tone.hover]"
            :title="hiddenCount ? `${visibleCount} of ${total} columns shown` : columnsLabel"
          >
            <UxIcon id="view" class="w-4" />
            <span v-if="hiddenCount">{{ visibleCount }} of {{ total }}</span>
            <span v-else>{{ columnsLabel }}</span>
            <UxIcon id="triangle" class="w-3" :class="[tone.accent, open ? '' : 'rotate-180']" />
          </span>
        </template>
      </UxColumnPicker>
      <slot name="end" :tone="tone" />
    </template>
  </FilterTriggerBar>
</template>

<script setup>
const props = defineProps({
  // ── FilterTriggerBar, passed through ──
  label: { type: String, default: '' },
  filterKeyDefs: { type: Array, default: () => [] },
  filterKey: { type: String, default: '' },
  options: { type: Array, default: () => [] },
  modelValue: { default: null },

  // ── UxColumnPicker ──
  // Full column catalog ({ key, label, locked? }). Omit it and there is no picker.
  columns: { type: Array, default: null },
  // Visible column keys (v-model:visibleColumns), emitted in catalog order.
  visibleColumns: { type: Array, default: () => [] },
  // The opt-out when a catalog is passed but this listing shouldn't offer the picker.
  columnPicker: { type: Boolean, default: true },
  columnsLabel: { type: String, default: 'Columns' },
  // 'above' keeps the table under the bar uncovered while toggling.
  side: { type: String, default: 'above' },
  minVisible: { type: Number, default: 1 },

  // Offer only the filter keys the catalog has a column for (see header).
  restrictKeys: { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue', 'update:filterKey', 'update:visibleColumns'])

const showPicker = computed(() => props.columnPicker && !!props.columns?.length)

const columnAnswers = (col, key) => col.key === key || (Array.isArray(col.filterKey) ? col.filterKey.includes(key) : col.filterKey === key)
const offeredKeyDefs = computed(() =>
  props.restrictKeys && props.columns?.length
    ? props.filterKeyDefs.filter((d) => props.columns.some((c) => columnAnswers(c, d.key)))
    : props.filterKeyDefs,
)

// Keep the segment on a key the table can answer.
watch(
  () => [offeredKeyDefs.value, props.filterKey],
  ([defs, key]) => {
    if (defs.length && !defs.some((d) => d.key === key)) emit('update:filterKey', defs[0].key)
  },
  { immediate: true },
)
</script>
