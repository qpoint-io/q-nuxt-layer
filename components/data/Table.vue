<template>
  <div class="mb-4 overflow-x-auto">
    <h3 v-if="title" class="text-20 font-bold text-content pb-2 mb-1 border-b-2 border-b-content/10">{{ title }}</h3>
    <UxTableList :compact="false">
      <template #header>
        <tr>
          <UxTableListColumnHeader
            v-for="(c, i) in columns" :key="c.key"
            :metric="metrics[i]" :sortBy="sortBy"
            @sortUp="onSort(c.label, 'up')" @sortDown="onSort(c.label, 'down')"
          />
        </tr>
        <tr><th class="h-[5px] p-0 bg-content" colspan="100%"></th></tr>
      </template>

      <!-- expandable rows -->
      <template v-if="expandable">
        <UxTableListExpandRow v-for="(row, i) in visible" :key="rk(row, i)" :bare="bareDetails">
          <td v-for="c in columns" :key="c.key" :class="cellClass(c)">
            <slot :name="c.key" :row="row" :value="row[c.key]">
              <UxPill v-if="c.pill && row[c.key] != null" :tone="toneFor(row[c.key])">{{ row[c.key] }}</UxPill>
              <span v-else>{{ row[c.key] ?? '—' }}</span>
            </slot>
          </td>
          <!-- ExpandRow supplies the card chrome (an ExpandSection with the
               close X) unless bareDetails opts out for sectioned stacks. -->
          <template #details="{ close }">
            <slot name="details" :row="row" :close="close" />
          </template>
        </UxTableListExpandRow>
      </template>

      <!-- plain rows -->
      <template v-else>
        <tr
          v-for="(row, i) in visible" :key="rk(row, i)"
          :class="onRow ? 'cursor-pointer hover:bg-surface-sunken' : ''"
          @click="onRow && onRow(row)"
        >
          <td v-for="c in columns" :key="c.key" :class="cellClass(c)">
            <slot :name="c.key" :row="row" :value="row[c.key]">
              <UxPill v-if="c.pill && row[c.key] != null" :tone="toneFor(row[c.key])">{{ row[c.key] }}</UxPill>
              <span v-else>{{ row[c.key] ?? '—' }}</span>
            </slot>
          </td>
        </tr>
      </template>

      <!-- Empty chrome is the table's; the #empty slot swaps the content
           (e.g. a FilterNoMatches when the rows are filtered away, not absent). -->
      <template #empty>
        <div class="flex items-center h-40 w-full bg-grey-200 justify-center rounded-10">
          <slot name="empty">{{ empty || 'No data yet.' }}</slot>
        </div>
      </template>
    </UxTableList>
    <!-- footer (e.g. a View More link when `limit` hides rows), lower-right -->
    <div v-if="$slots.footer" class="flex justify-end pt-1">
      <slot name="footer" :total="sorted.length" :shown="visible.length" />
    </div>
  </div>
</template>

<script setup lang="ts">
// The DataTable pattern: sortable UxTableListColumnHeader, the signature heavy
// header rule (bg-content, token-themed), uniform `px-3 py-2 text-14` cells
// (mono for numeric/code columns). Cells render via per-column named slots
// (#<key>), with two convenience defaults: plain text, or — when a column sets
// `pill: true` — a tone-mapped UxPill (leaf by default, warn for High/Critical/
// Blocked). Pass a #details slot to make rows expandable (UxTableListExpandRow);
// otherwise rows are plain and `onRow` handles clicks.
// Expanded details render inside ExpandRow's default ExpandSection card
// (close X included); set `bareDetails` when the #details content composes
// its own UxTableListExpandSection stack. The #details slot scope provides
// { row, close }.
// `limit` caps rendered rows AFTER sort+search, so the cap is the top-N of the
// active sort (an outer rows.slice() would cap the pre-sorted set); pair it
// with the #footer slot ({ total, shown }) for a "View more" affordance.
// `#empty` replaces the empty-state text inside the table's own chrome.
// Unifies qdash's DataTable and the design site's PermissionTable (c50/c51).
import { ref, computed, useSlots } from 'vue'

type Col = {
  key: string
  label: string
  width?: string
  num?: boolean
  mono?: boolean
  search?: boolean
  sortable?: boolean
  pill?: boolean
}

const props = defineProps<{
  title?: string
  columns: Col[]
  rows: any[]
  empty?: string
  onRow?: (r: any) => void
  initialSort?: string
  rowKey?: string
  limit?: number
  bareDetails?: boolean
}>()

const slots = useSlots()
const expandable = computed(() => !!slots.details)

const sortBy = ref(props.initialSort || '')
const dir = ref<'up' | 'down'>('down')
const search = ref('')

const metrics = computed(() =>
  props.columns.map((c) => ({
    name: c.label,
    width: c.width,
    search: c.search ? (n: string) => (search.value = n) : undefined,
  })),
)

function onSort(label: string, d: 'up' | 'down') {
  sortBy.value = label
  dir.value = d
}

const sorted = computed(() => {
  let r = [...(props.rows || [])]
  const q = search.value.trim().toLowerCase()
  if (q) r = r.filter((row) => Object.values(row).join(' ').toLowerCase().includes(q))
  const col = props.columns.find((c) => c.label === sortBy.value)
  if (col && col.sortable !== false) {
    const k = col.key,
      s = dir.value === 'up' ? 1 : -1
    r.sort((a, b) => {
      const x = a[k],
        y = b[k]
      return typeof x === 'string' || typeof y === 'string'
        ? s * String(x ?? '').localeCompare(String(y ?? ''))
        : s * ((x || 0) - (y || 0))
    })
  }
  return r
})

const visible = computed(() => (props.limit ? sorted.value.slice(0, props.limit) : sorted.value))

const cellClass = (c: Col) => [
  'px-3 py-2 text-14',
  c.num ? 'font-mono' : c.mono ? 'font-mono' : '',
]

const rk = (row: any, i: number) => (props.rowKey ? row[props.rowKey] : i)

// Tone map for pill rendering: map values to tone names for UxPill.
// Default to 'leaf' (green); flag High/Critical/Blocked states as 'warn' (orange).
const toneMap: Record<string, string> = {
  High: 'warn',
  Critical: 'warn',
  Blocked: 'warn',
}

const toneFor = (val: any) => toneMap[String(val)] || 'leaf'
</script>
