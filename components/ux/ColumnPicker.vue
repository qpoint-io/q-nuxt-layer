<!-- Show / hide columns of a table. `columns` is the full catalog
     ({ key, label, locked? }); the v-model is the list of visible keys, kept
     in catalog order so the consumer can filter its column config with it:
       :columns="cols.filter(c => visible.includes(c.key))"
     Locked columns render checked and disabled (the identity column). The
     last visible unlocked column can't be unchecked, so a table never renders
     with nothing in it. Show/hide only — ordering is the consumer's.
     The trigger is the bordered button below by default; a host that seats the
     picker in its own chrome (DataListingBar puts it in FilterTriggerBar's last
     segment) overrides it through the #trigger slot, which exposes the counts.
     Prototyped on the design site (c93), extracted here in c95. -->
<template>
  <UxPopover :align="align" :side="side">
    <template #trigger="{ open }">
      <slot name="trigger" :open="open" :label="label" :visibleCount="visibleCount" :hiddenCount="hiddenCount" :total="columns.length">
        <span
          class="flex items-center gap-2 rounded-8 border border-stroke bg-surface px-3 py-1.5 text-13 font-semi text-content hover:border-primary/50 transition-colors"
        >
          <UxIcon id="view" class="w-4 text-content-muted" />
          {{ label }}
          <span v-if="hiddenCount" class="rounded-4 bg-primary/10 px-1.5 text-11 font-bold text-primary">
            {{ visibleCount }} of {{ columns.length }}
          </span>
          <UxIcon id="down-arrow" class="w-3 opacity-50" />
        </span>
      </slot>
    </template>

    <template #default="{ close }">
      <div class="p-3">
        <div class="flex items-center justify-between pb-2 border-b border-stroke">
          <span class="text-12 font-bold uppercase tracking-wider text-content-subtle">{{ label }}</span>
          <button
            type="button"
            class="text-12 text-primary hover:text-content disabled:opacity-40 disabled:pointer-events-none"
            :disabled="!hiddenCount"
            @click="showAll"
          >Show all</button>
        </div>

        <ul class="py-2 max-h-96 overflow-y-auto">
          <!-- a locked or last-standing row dims so "can't uncheck" is visible before the click -->
          <li v-for="c in columns" :key="c.key" class="py-1" :class="c.locked || isLastVisible(c.key) ? 'opacity-50' : ''">
            <UxCheckbox :label="c.label">
              <input
                type="checkbox"
                :id="`${uid}-${c.key}`"
                :checked="isVisible(c.key)"
                :disabled="c.locked || isLastVisible(c.key)"
                @change="toggle(c.key)"
              />
            </UxCheckbox>
          </li>
        </ul>

        <div class="flex items-center justify-between pt-2 border-t border-stroke text-12">
          <span class="text-content-subtle">{{ visibleCount }} of {{ columns.length }} shown</span>
          <button type="button" class="text-content-subtle hover:text-content" @click="close">Done</button>
        </div>
      </div>
    </template>
  </UxPopover>
</template>

<script setup>
const props = defineProps({
  // full catalog: { key, label, locked? }
  columns:    { type: Array, required: true },
  // visible keys (v-model)
  modelValue: { type: Array, default: () => [] },
  label:      { type: String, default: 'Columns' },
  align:      { type: String, default: 'right' },
  // 'above' opens the list over the title area so the columns being toggled stay in view
  side:       { type: String, default: 'below' },
  // never let the visible set drop below this many
  minVisible: { type: Number, default: 1 },
})

const emit = defineEmits(['update:modelValue'])

// stable per-instance id so several pickers on one page don't share input ids
const uid = `colpick-${Math.random().toString(36).slice(2, 8)}`

const visibleSet = computed(() => new Set(props.modelValue))
const isVisible = (key) => visibleSet.value.has(key)

const visibleCount = computed(() => props.columns.filter((c) => isVisible(c.key)).length)
const hiddenCount  = computed(() => props.columns.length - visibleCount.value)

// the guard: unchecking this one would leave fewer than minVisible
const isLastVisible = (key) => isVisible(key) && visibleCount.value <= props.minVisible

// emit in catalog order — the consumer's column config is ordered, and so is this
const emitFrom = (set) =>
  emit('update:modelValue', props.columns.filter((c) => set.has(c.key)).map((c) => c.key))

const toggle = (key) => {
  const next = new Set(visibleSet.value)
  if (next.has(key)) {
    if (visibleCount.value <= props.minVisible) return
    next.delete(key)
  } else {
    next.add(key)
  }
  emitFrom(next)
}

const showAll = () => emitFrom(new Set(props.columns.map((c) => c.key)))
</script>
