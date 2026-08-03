<template>
  <div class="inline-flex flex-col align-top" style="width: 210px">
    <!-- ── Header: pawn + workspace/provider identity ────────────────── -->
    <div class="flex items-end gap-4">
      <AgentPawn :state="state" :size="48" class="shrink-0">
        <AgentInputBubble v-if="state === 'needs-input'" @action="emit('go-to-agent')" />
      </AgentPawn>
      <div class="flex flex-col gap-1 pb-0.5 min-w-0">
        <!-- h-6 pins the row to the text-13 line box (24px): an empty folder
             span otherwise collapses this row, shrinking the header below the
             48px pawn on some cards and breaking pawn top alignment across a
             card row (items-end bottom-aligns whichever child is tallest). -->
        <button
          class="group flex h-6 min-w-0 items-center gap-2"
          title="Reveal in Finder"
          @click="emit('reveal-folder')"
        >
          <UxPixelArt v-if="icon('folder')" name="pixel-icons/folder" class="shrink-0" size="16px" />
          <span class="font-mono text-13 text-content truncate group-hover:underline">{{ folder }}</span>
          <UxIcon id="arrow-head" class="text-content-subtle shrink-0" style="height: 10px" />
        </button>
        <div class="flex items-center gap-2">
          <component :is="agentInfo.logo" class="shrink-0 text-content-subtle" style="width: 15px; height: 15px" />
          <span class="font-mono text-13 text-content-subtle truncate">{{ agentInfo.label }}</span>
        </div>
      </div>
    </div>

    <!-- ── Stats: requests + files ───────────────────────────────────── -->
    <div class="grid mt-5" style="grid-template-columns: 45% 55%">
      <div>
        <div class="text-13 text-content-subtle border-b border-stroke-strong pb-1 mb-2">Requests</div>
        <div class="relative" style="width: 52px">
          <UxPixelArt v-if="icon('browser-frame')" name="pixel-icons/browser-frame" class="block" size="52px" />
          <span class="absolute inset-x-0 bottom-0 flex items-center justify-center font-mono font-bold text-16 text-content leading-none" style="top: 22%">
            {{ requests }}
          </span>
        </div>
      </div>
      <div>
        <div class="text-13 text-content-subtle border-b border-stroke-strong pb-1 mb-2">Files</div>
        <div class="flex gap-3">
          <!-- 32.5px width renders the 40×48 page.svg at 39px tall — the same
               height as the 64×48 browser-frame at its 52px width. -->
          <div class="relative shrink-0" style="width: 32.5px">
            <UxPixelArt v-if="icon('page')" name="pixel-icons/page" class="block" size="32.5px" />
            <span class="absolute inset-0 flex items-center justify-center font-mono font-bold text-14 text-content leading-none">
              {{ files.total }}
            </span>
          </div>
          <div class="flex flex-col justify-center font-mono text-12 leading-tight">
            <div v-for="row in fileRows" :key="row.label" class="flex gap-2">
              <span class="w-3 text-right font-bold text-content">{{ row.count }}</span>
              <span class="text-content-subtle">{{ row.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Tools & Skills ────────────────────────────────────────────── -->
    <div v-if="tools.count > 0" class="mt-5">
      <div class="flex items-baseline justify-between border-b border-stroke-strong pb-1 mb-2">
        <span class="text-13 text-content-subtle">Tools &amp; Skills</span>
        <span class="text-13 font-bold text-content">{{ tools.count }}</span>
      </div>
      <div class="flex flex-col gap-1">
        <div v-for="item in visibleTools" :key="item.label" class="flex items-center gap-3">
          <UxPixelArt v-if="icon(item.icon)" :name="`pixel-icons/${item.icon}`" class="shrink-0" size="16px" />
          <span class="font-mono text-13 text-content">{{ item.label }}</span>
        </div>
        <!-- The card truncates the list itself; "+N more" expands in place.
             A consumer that passes an abbreviated `items` list with a larger
             `count` still gets the row, just not clickable (nothing to show). -->
        <button
          v-if="hiddenTools > 0 && expandable"
          class="font-mono text-13 text-content-subtle text-left hover:text-content"
          @click="toolsExpanded = true"
        >+{{ hiddenTools }} more</button>
        <span v-else-if="hiddenTools > 0" class="font-mono text-13 text-content-subtle">
          +{{ hiddenTools }} more
        </span>
        <button
          v-else-if="toolsExpanded"
          class="font-mono text-13 text-content-subtle text-left hover:text-content"
          @click="toolsExpanded = false"
        >show less</button>
      </div>
    </div>

    <!-- ── Links ─────────────────────────────────────────────────────── -->
    <div class="flex gap-8 mt-3">
      <button class="mini-link" @click="emit('view-details')">View Details</button>
      <button class="mini-link" @click="emit('go-to-agent')">Go to Agent</button>
    </div>
  </div>
</template>

<script setup>
// AgentMiniCard — compact agent summary card: AgentPawn state at a glance,
// workspace + provider identity, request/file stats rendered inside
// pixel-frame icons, tools & skills, and navigation links. In needs-input
// state the AgentInputBubble hangs above the pawn and its button re-emits as
// go-to-agent. Pixel icons render via UxPixelArt (themed --px-* fills)
// (multicolor art — not UxIcon). Provider row is rendered inline (mono,
// subtle) rather than via AgentAvatar, whose bold chip styling is for table
// cells.
import { resolveAgent } from './registry'

const props = defineProps({
  // Passed through to AgentPawn: working, idle, errored, needs-input, angel.
  state:    { type: String, default: 'working' },
  // Resolved against the agent registry for the provider row (logo + label).
  agent:    { type: String, default: 'claude-code' },
  folder:   { type: String, default: '' },
  requests: { type: Number, default: 0 },
  // { total, read, write, edit }
  files:    { type: Object, default: () => ({ total: 0, read: 0, write: 0, edit: 0 }) },
  // { count, items: [{ icon: 'briefcase' | 'calculator' | …, label }] }
  tools:    { type: Object, default: () => ({ count: 0, items: [] }) },
})

const emit = defineEmits(['view-details', 'go-to-agent', 'reveal-folder'])

const agentInfo = computed(() => resolveAgent(props.agent))

// Collapsed cards list this many tools before truncating to "+N more".
const COLLAPSED_TOOLS = 3

const toolsExpanded = ref(false)
const visibleTools = computed(() =>
  toolsExpanded.value ? props.tools.items : props.tools.items.slice(0, COLLAPSED_TOOLS),
)
const hiddenTools = computed(() => Math.max(0, props.tools.count - visibleTools.value.length))
const expandable = computed(() => props.tools.items.length > visibleTools.value.length)

const iconUrls = import.meta.glob('../../assets/svgs/pixel-icons/*.svg', {
  query: '?url',
  import: 'default',
  eager: true,
})

const icon = name => iconUrls[`../../assets/svgs/pixel-icons/${name}.svg`] || null

const fileRows = computed(() => [
  { count: props.files.read,  label: 'Read' },
  { count: props.files.write, label: 'Write' },
  { count: props.files.edit,  label: 'Edit' },
])

if (import.meta.dev) {
  watchEffect(() => {
    const missing = ['folder', 'browser-frame', 'page', ...props.tools.items.map(i => i.icon)]
      .filter(name => !icon(name))
    if (missing.length) {
      console.warn(`[AgentMiniCard] missing pixel icon(s): ${missing.join(', ')} (expected assets/svgs/pixel-icons/<name>.svg)`)
    }
  })
}
</script>

<style scoped>
.mini-link {
  @apply font-mono text-13 text-content underline decoration-violet-500 decoration-2 underline-offset-4 hover:decoration-violet-300;
}
</style>
