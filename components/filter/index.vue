<template>
  <!-- Embed mode: not redesigned yet — delegates to the Phase-1 embed variant -->
  <FilterOldEmbed
    v-if="embed"
    ref="embedRef"
    :filters="filters.filter(f => f.key).map(f => ({ key: f.key, operator: f.operator, val: f.val ?? '' }))"
    :availableKeyDefs="availableKeyDefs"
    :valSuggestions="valSuggestions"
    :filterKeyDefs="filterKeyDefs"
    @update:filters="onEmbedFiltersUpdate"
    @requestKeySuggestions="onRequestKeySuggestions"
    @requestValSuggestions="onRequestValSuggestions"
  />

  <!-- Filter -->
  <template v-else>
    <!-- Stuck sentinel: CSS has no cross-browser "is stuck" state, so a 1px marker
         is left at the bar's rest position and watched by an IntersectionObserver.
         Absolute with no offsets = static position (where the bar sits at rest),
         out of flow so it adds no width or flex gap, and — unlike anything inside
         the sticky box — it stays put when the bar pins. -->
    <div ref="stuckSentinel" class="absolute h-px w-px pointer-events-none" aria-hidden="true" />
    <!-- The component owns pinning: it is sticky itself, so every consumer
         gets the pinned bar for free. It needs a tall ancestor to detach
         within (a layout band, the page root) — a title-row slot is not
         tall enough. h-0 keeps it out of flow vertically so the bar can sit
         on a title row without pushing content. At rest the backing is
         transparent; once pinned it takes the page canvas tone so it reads
         opaque over scrolled content, and `_stuck` is exposed as a class
         hook (plus `stuck` emit) for consumers that want their own chrome. -->
    <div
      ref="barRef"
      class="inline-block sticky z-40 h-0 rounded-8 px-3 py-3 transition-colors"
      :class="filterStuck ? '_stuck bg-surface-sunken' : ''"
      :style="{ top: `${stickyTop}px` }"
    >
      <!-- Disabled -->
      <div v-if="disabled" class="flex items-center gap-3 text-grey-400/80 text-16 font-semi text-nowrap">
        <div>Not Applicable</div>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="filters.length === 0"
        role="button" tabindex="0"
        class="inline-flex items-center gap-3 rounded-[8px] rounded-bl-full rounded-tl-full border-2 border-blue bg-blue/10 cursor-pointer hover:bg-surface transition-colors"
        @click="startAdd" @keydown.enter.prevent="startAdd" @keydown.space.prevent="startAdd"
      >
        <div class="bg-surface w-8 h-8 -ml-[2px] -mt-[2px] -mb-[2px] rounded-full border-2 border-blue flex items-center justify-center text-blue shrink-0">
          <UxIcon id="plus" class="w-3.5" />
        </div>
        <div class="text-14 font-bold">Add Filter</div>
        <FilterEndcapPlaceholder />
      </div>

      <!-- Populated bar: a table — ADD sits outside it; inside, each column's label
           row is transparent and its value row carries the fill (white for a
           filter, light blue for Config). Dividers use a darker tone than the
           rest of the palette for table-line contrast. No overflow-hidden (it
           would clip FilterItem's dropdown) — the first/last column instead
           round their own value fill to match the table's outer corners. -->
      <div v-else class="inline-flex items-end gap-3">
        <div
          role="button" tabindex="0"
          class="flex flex-col gap-1 cursor-pointer shrink-0"
          @click="startAdd" @keydown.enter.prevent="startAdd" @keydown.space.prevent="startAdd"
        >
          <div class="text-11 font-med text-blue">ADD</div>
          <div class="w-7 h-7 rounded-full bg-surface border-2 border-blue flex items-center justify-center text-blue hover:bg-blue/5">
            <UxIcon id="plus" class="w-2.5" />
          </div>
        </div>

        <!-- Each boundary is owned by one side only (the left border of the cell
             after it) so there's a single line per divider, not two stacked. -->
        <div class="inline-flex items-stretch rounded-b-6 border-x-1 border-b-1 border-blue/40">
          <FilterItem
            v-for="(filter, i) in filters" :key="filter.key"
            :class="i > 0 ? 'border-l-2 border-blue/40' : ''"
            :roundLeft="i === 0"
            :_key="filter.key"
            :operator="filter.operator"
            :val="filter.val ?? ''"
            :isTagFilter="isTagFilter(filter.key)"
            :formatVal="formatValFor(filter.key)"
            :valSuggestions="valSuggestions?.[filter.key] ?? []"
            @update:val="updateFilterVal(filter.key, $event)"
            @delete="removeFilter(filter.key)"
          />

          <div class="flex flex-col border-l-1 border-blue/40">
            <div class="flex items-end pb-1 text-12 font-bold tracking-[0.07em] text-content-subtle uppercase px-3 border-b-2 border-blue/40 min-h-[32px]">Filter</div>
            <div class="flex items-stretch bg-blue/10 rounded-br-8">
              <button type="button" class="flex items-center gap-1 text-14 font-bold text-blue hover:text-grape px-3 " @click="openFilterManager">
                <UxIcon id="gear" class="w-3.5" />
                Config
              </button>
              <!-- <FilterEndcapPlaceholder class="" /> -->
            </div>
          </div>
        </div>
      </div>

      <!-- Modal — reuses the Phase-1 manage modal (FilterOldManage) until a v2 design lands.
           Both the ADD trigger and Config open it; ADD also kicks off its add-row flow. -->
      <UxModal v-model:open="isManaging" :close-btn="false" :at-top="true">
        <FilterOldManage
          ref="manageRef"
          :filters="filters"
          :availableKeyDefs="availableKeyDefs"
          :filterKeyDefs="filterKeyDefs"
          :valSuggestions="valSuggestions"
          :timeframe="timeframe"
          :timeframeValue="timeframeValue"
          :timeframeOptions="timeframeOptions"
          @update:timeframeValue="$emit('update:timeframeValue', $event)"
          @close="onManageClose"
          @requestKeySuggestions="onRequestKeySuggestions"
          @requestValSuggestions="onRequestValSuggestions"
        />
      </UxModal>
    </div>
  </template>
</template>

<!-- Presentational — the timeframe value itself (route query, store, whatever
     the consumer uses) is threaded through as timeframeValue/timeframeOptions
     rather than read from a store here. v2 drops the always-visible timeframe
     pill and onlyTime mode; timeframe selection now lives inside the Config
     modal (FilterOldManage), which still renders it.

     The bar itself is display-only: key and operator are fixed per pill: only
     the value is editable in place (FilterItem's own dropdown). Adding a new
     filter, or changing its key/operator, happens in the Config modal — the
     ADD trigger opens it and starts that flow immediately. -->
<script setup>
const props = defineProps({
  keySuggestions: { type: Array },
  filterKeyDefs : { type: Array, default: () => [] },
  valSuggestions: { type: Object },
  keyValFilters : { type: Array },
  timeframe     : { type: Boolean, default: true },
  timeframeValue  : { default: null },
  timeframeOptions: { type: Array, default: () => [] },
  disabled      : { type: Boolean, default: false },
  embed         : { type: Boolean, default: false },
  // Pin offset in px from the top of the scroll container — a consumer with
  // its own fixed header sets this to that header's height.
  stickyTop     : { type: Number, default: 0 },
})

const emit = defineEmits([
  'update:keyValFilters',
  'update:timeframeValue',
  'requestKeySuggestions',
  'requestValSuggestions',
  // true once the bar has pinned, false when it returns to rest
  'stuck',
])

// Stuck state for the sticky bar — see the sentinel comment in the template.
// The observer's root is inset by the bar's pin offset plus the sentinel's own
// 1px, so the sentinel stops intersecting at exactly the pixel the bar pins.
// Re-armed when stickyTop changes (the observer's rootMargin is fixed at
// construction).
const barRef = ref(null)
const stuckSentinel = ref(null)
const filterStuck = ref(false)
let stuckObserver = null
const armStuckObserver = () => {
  stuckObserver?.disconnect()
  if (!stuckSentinel.value || typeof IntersectionObserver === 'undefined') return
  const line = props.stickyTop + 1
  stuckObserver = new IntersectionObserver(
    ([entry]) => { filterStuck.value = !entry.isIntersecting && entry.boundingClientRect.top < line },
    { rootMargin: `-${line}px 0px 0px 0px`, threshold: 0 },
  )
  stuckObserver.observe(stuckSentinel.value)
}
onMounted(armStuckObserver)
watch(() => props.stickyTop, armStuckObserver)
watch(filterStuck, (v) => emit('stuck', v))
onBeforeUnmount(() => stuckObserver?.disconnect())

// Modal state
const isManaging = ref(false)
const manageRef = ref(null)

// Embed mode ref
const embedRef = ref(null)

// keyValFilters: array of { key, val, operator? }. Internal format uses operator from utils/filter (eq, neq, ...).
const filters = computed({
  get: () => {
    return (props.keyValFilters || [])
      .filter(f => f.key)
      .map(f => ({
        key: f.key,
        operator: f.operator || FILTER_DEFAULT_OP,
        val: f.val
      }))
  },
  set: (newFilters) => {
    const keyValFilters = newFilters.map(f => ({
      key: f.key,
      operator: f.operator || FILTER_DEFAULT_OP,
      val: f.val
    }))
    emit('update:keyValFilters', keyValFilters)
  }
})

// Normalize to FilterKeyDefinition[]: from filterKeyDefs or keySuggestions (legacy)
const allKeyDefs = computed(() => {
  if (props.filterKeyDefs?.length > 0) {
    return props.filterKeyDefs
  }
  if (props.keySuggestions?.length > 0) {
    return props.keySuggestions.map((s) =>
      typeof s === 'string' ? { key: s, label: s, type: FilterType.ATTRIBUTE } : s,
    )
  }
  return []
})

// Available key defs for the modal's add row (exclude used keys)
const availableKeyDefs = computed(() => {
  const usedKeys = filters.value.map((f) => f.key)
  return allKeyDefs.value.filter((d) => !usedKeys.includes(d.key))
})

const formatValFor = (key) => allKeyDefs.value.find((d) => d.key === key)?.formatVal ?? null

const isTagFilter = (key) => {
  const def = props.filterKeyDefs?.find((d) => d.key === key)
  return !def || def.type === FilterType.TAG
}

const onRequestKeySuggestions = ({ applyExistingFilter } = {}) => {
  emit('requestKeySuggestions', { applyExistingFilter })
}

const onRequestValSuggestions = ({ key, applyExistingFilter } = {}) => {
  emit('requestValSuggestions', { key, applyExistingFilter })
}

// Opens the Config modal and immediately starts its add-row flow (embed mode
// delegates to FilterOldEmbed's own startAdd instead).
const startAdd = () => {
  if (props.embed && embedRef.value) {
    embedRef.value.startAdd()
    return
  }
  isManaging.value = true
  nextTick(() => {
    manageRef.value?.startAdd()
  })
}

const openFilterManager = () => {
  isManaging.value = true
}

const onManageClose = (updatedFilters) => {
  isManaging.value = false
  if (updatedFilters) {
    filters.value = updatedFilters
  }
}

const removeFilter = (keyToDelete) => {
  const newFilters = props.keyValFilters.filter(f => f.key !== keyToDelete)
  emit('update:keyValFilters', newFilters)
}

const updateFilterVal = (key, val) => {
  const newFilters = (props.keyValFilters || []).map(f => f.key === key ? { ...f, val } : f)
  emit('update:keyValFilters', newFilters)
}

const onEmbedFiltersUpdate = (updatedFilters) => {
  const withOperator = (updatedFilters || []).map(f => ({
    key: f.key,
    val: f.val,
    operator: f.operator || FILTER_DEFAULT_OP
  }))
  emit('update:keyValFilters', withOperator)
}

const createFilter = () => {
  startAdd()
}

defineExpose({ createFilter })
</script>
