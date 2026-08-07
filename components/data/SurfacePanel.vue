<template>
  <div :class="compact ? '' : 'rounded-12 border border-stroke bg-surface p-5'">
    <div class="flex items-baseline justify-between gap-2" :class="compact ? 'mb-2' : 'mb-4'">
      <h3 class="font-bold text-content" :class="compact ? 'text-15' : 'text-16'">{{ title }}</h3>
      <span class="flex items-center gap-2 font-mono text-content-subtle" :class="compact ? 'text-11' : 'text-12'">
        <slot name="caption">{{ caption }}</slot>
        <NuxtLink v-if="allTo" :to="allTo" class="ml-1 font-sans text-12 font-med text-primary">all →</NuxtLink>
      </span>
    </div>

    <div
      v-if="shown.length"
      class="grid items-center"
      :class="compact ? 'gap-x-2 text-11 leading-tight' : 'gap-x-3 text-12'"
      :style="{ gridTemplateColumns: headers.length === 3 ? 'auto auto 1fr' : 'auto 1fr' }"
    >
      <span
        v-for="h in headers" :key="h"
        class="border-b border-stroke font-bold text-content-subtle"
        :class="compact ? 'pb-0.5' : 'pb-1 text-11'"
        :style="compact ? { fontSize: '10px', lineHeight: '14px' } : null"
      >{{ h }}</span>
      <component
        :is="rowTo ? NuxtLink : 'div'"
        v-for="(row, i) in shown" :key="rowKey(row)"
        :to="rowTo ? rowTo(row) : undefined"
        class="contents group"
      >
        <slot name="row" :row="row" :border="rowBorder(i)" :clickable="!!rowTo" :compact="compact" />
        <div :class="[compact ? 'py-0.5' : 'py-1', rowBorder(i), rowTo ? 'cursor-pointer' : '']">
          <DataPercentBar :total="Number(row[barKey]) || 0" :percent="pct(Number(row[barKey]) || 0, barDenominator)" :compact="compact" />
        </div>
      </component>
    </div>

    <div v-if="!rows.length" class="text-content-subtle" :class="compact ? 'text-12' : 'text-13'">{{ empty }}</div>

    <UxShowMore
      :total="rows.length" :row-cap="rowCap" :expand-cap="expandCap"
      :expanded="expanded" :to="listingTo"
      @toggle="expanded = !expanded"
    />
  </div>
</template>

<script setup lang="ts">
// The Surface panel (extracted from qdash /inventory, c59/c60): ranked rows
// with a trailing DataPercentBar column — the house shape for "what does this
// thing touch" lists (models, MCP servers, workspaces, tools, sessions). The
// panel owns its overflow behavior (UxShowMore + slicing); consumers render
// only the label/pill cells through #row, closing each cell with the provided
// `border` class so the last-row hairline cut stays aligned with the bar
// column.
//
// Bars fill against the top row (share-of-leader) unless `barMax` pins a real
// denominator — e.g. a fleet Models panel passing the fleet agent count so
// bars read as true share-of-fleet.
//
// Grid template columns are set via inline style, not grid-cols-[…] arbitrary
// classes (layer rule: arbitrary values miss the consumer's Tailwind scan).
import { resolveComponent } from 'vue'

const props = withDefaults(
  defineProps<{
    title: string
    caption?: string
    /** Header labels; 2 = [label, bar], 3 = [label, pill, bar]. */
    headers: string[]
    rows: any[]
    /** Row field the bar plots. */
    barKey: string
    /** Real denominator override; defaults to the leader's value. */
    barMax?: number
    rowKey: (row: any) => string
    /** Row drill-down target; absent = static rows. */
    rowTo?: (row: any) => string
    /** Fleet "all →" header link. */
    allTo?: string
    /** Overflow hand-off target (agent-filtered where applicable). */
    listingTo?: string
    empty: string
    rowCap?: number
    expandCap?: number
    /** Chrome-less dense mode: no border/padding, one-notch-smaller type, tighter leading. Passed through to #row for cell templates. */
    compact?: boolean
  }>(),
  { rowCap: 10, expandCap: 50, compact: false },
)

const NuxtLink = resolveComponent('NuxtLink')
const expanded = ref(false)
const shown = computed(() => props.rows.slice(0, expanded.value ? props.expandCap : props.rowCap))
const barDenominator = computed(
  () => props.barMax ?? Math.max(1, ...props.rows.map((r) => Number(r[props.barKey]) || 0)),
)
const rowBorder = (i: number) => (i === shown.value.length - 1 ? '' : 'border-b border-stroke/60')
const pct = (n: number, d: number) => (d > 0 ? Math.round((n / d) * 100) : 0)
</script>
