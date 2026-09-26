<template>
  <!-- A NavVertical row that owns child rows (design c98). The parent row is a
       NavVerticalItem (link when `to`/`href`, toggle button otherwise); the
       children are the consumer's NavVerticalItems in the default slot, which
       pick up the sub treatment (italic, med 13, 1px row gap by default) by injection and
       hang off a hairline rail at the parent's left edge.

       Disclosure is route-aware: the list shows whenever the current path
       starts with one of `match` (defaults to `to`), so a section opens itself
       wherever you are inside it. `v-model:open` overrides the route. Row
       highlight stays caller-controlled via `active`, as on NavVerticalItem. -->
  <div>
    <NavVerticalItem v-if="to || href" :to="to" :href="href" :target="target" :active="active" :size="size" :sub="false">
      <slot name="label" />
    </NavVerticalItem>

    <NavVerticalItem v-else :size="size" :sub="false">
      <button
        type="button"
        class="_submenu-toggle"
        :class="{ _active: active }"
        :aria-expanded="isOpen"
        :aria-controls="listId"
        @click="toggle"
      >
        <slot name="label" />
      </button>
    </NavVerticalItem>

    <div v-if="$slots.default" v-show="isOpen" :id="listId" role="group" class="_submenu-rail relative pl-4">
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* The button form mirrors NavVerticalItem's link box (scoped there, so
   restated here via @apply — no arbitrary values in layer templates). */
._submenu-toggle {
  @apply block w-full py-1 pl-2 -ml-2 -mb-[2px] bg-transparent border-0 text-left text-content cursor-pointer group-hover:text-primary;
  font: inherit;
}
._submenu-toggle._active {
  @apply text-primary;
}
/* Hairline rail (the section title rule's stroke-strong) at the parent's left edge, inset from the first and last
   child rows so it reads as a bracket, not a box edge. A pseudo-element so the
   inset doesn't push the children away from the parent row. */
._submenu-rail::before {
  content: "";
  @apply absolute left-0 top-2 bottom-2 border-l border-stroke-strong;
}
</style>

<script setup>
const props = defineProps({
  to    : { type: String },
  href  : { type: String },
  target: { type: String, default: '_self' },
  active: { type: Boolean, default: false },            // parent row highlight (caller-controlled)
  size  : { type: String, default: 'medium' },          // parent row size, as NavVerticalItem
  match : { type: [String, Array], default: undefined }, // path prefix(es) that open the list; defaults to `to`
  open  : { type: Boolean, default: undefined },        // controlled override (v-model:open); wins over `match`
  subWeight: { type: String, default: 'med' },          // children's weight: reg | med | semi | bold | exbold | black
  subSize  : { type: Number, default: 13 },             // children's text size, px on the type scale: 11–16
  // Provisional (design c98): px of space between child rows, while the value is
  // being dialed in — expected to fold back into a fixed style and be removed.
  subGap   : { type: Number, default: 1 },
})

const emit = defineEmits(['update:open'])

provide('navSubmenu', computed(() => ({ weight: props.subWeight, size: props.subSize, gap: props.subGap })))

const route = useRoute()
const listId = `nav-sub-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

const prefixes = computed(() => {
  const m = props.match ?? props.to
  return (Array.isArray(m) ? m : [m]).filter(Boolean)
})

// Segment-aware prefix: '/inventory' matches '/inventory' and '/inventory/models',
// never '/inventory-archive'.
const routeMatches = computed(() =>
  prefixes.value.some((p) => {
    const base = p.replace(/\/+$/, '') || '/'
    return route.path === base || route.path.startsWith(base === '/' ? '/' : `${base}/`)
  })
)

// Uncontrolled toggle state for the button form — only meaningful when nothing
// else decides (no `open` binding, route not matching).
const toggled = ref(false)
const isOpen = computed(() => props.open ?? (routeMatches.value || toggled.value))

function toggle() {
  const next = !isOpen.value
  if (props.open === undefined) toggled.value = next
  emit('update:open', next)
}
</script>
