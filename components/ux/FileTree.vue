<template>
  <!-- An explorer-style file tree (the VS Code explorer look): folders built
       from the paths themselves, collapse chevrons, small file-type glyphs,
       compact rows, the selected row highlighted. Presentational only — the
       consumer owns the file list and the selection (v-model = a path).
       Keyboard (roving focus): ↑/↓ move, Home/End jump, → expands a folder
       (or steps into it), ← collapses it (or steps out to the parent),
       Enter/Space selects a file or toggles a folder. -->
  <div
    role="tree"
    :aria-label="label"
    class="py-1 font-mono text-12"
    @keydown="onKeydown"
  >
    <template v-if="rows.length">
      <div
        v-for="(row, i) in rows"
        :key="row.key"
        :ref="(el) => setRowRef(row.key, el)"
        role="treeitem"
        :aria-level="row.depth + 1"
        :aria-expanded="row.dir ? !collapsed.has(row.path) : undefined"
        :aria-selected="row.dir ? undefined : row.path === modelValue"
        :tabindex="row.key === tabStop ? 0 : -1"
        :title="row.path"
        class="group flex cursor-pointer select-none items-center gap-1.5 pr-2 leading-5 focus:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary"
        :class="!row.dir && row.path === modelValue
          ? 'bg-primary/15 text-content'
          : 'text-content-muted hover:bg-surface hover:text-content'"
        :style="{ paddingLeft: `${8 + row.depth * 12}px` }"
        @click="activate(row, i)"
      >
        <!-- chevron column: folders only, files keep the space so names align -->
        <span class="flex w-3 shrink-0 justify-center text-content-subtle" aria-hidden="true">
          <svg
            v-if="row.dir" viewBox="0 0 16 16" class="h-3 w-3 transition-transform"
            :class="collapsed.has(row.path) ? '' : 'rotate-90'"
          ><path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </span>
        <!-- type glyph -->
        <span class="flex w-3.5 shrink-0 justify-center text-content-subtle" aria-hidden="true">
          <svg v-if="row.dir" viewBox="0 0 16 16" class="h-3.5 w-3.5">
            <path d="M1.5 4.5a1 1 0 0 1 1-1h3.6l1.4 1.5h6a1 1 0 0 1 1 1v6.5a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1z" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" />
          </svg>
          <svg v-else viewBox="0 0 16 16" class="h-3.5 w-3.5">
            <path d="M3.5 1.5h6l3 3v10h-9z" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" />
            <path d="M9.5 1.5v3h3" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" />
            <path v-if="kindOf(row.name) === 'text'" d="M5.5 8h5M5.5 10h5M5.5 12h3" stroke="currentColor" stroke-width="1" />
            <path v-else-if="kindOf(row.name) === 'script'" d="M5.2 8.2l1.8 1.6-1.8 1.6M8 12h2.6" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" />
            <path v-else-if="kindOf(row.name) === 'code'" d="M6.6 8l-1.6 2 1.6 2M9.4 8l1.6 2-1.6 2" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" />
            <path v-else-if="kindOf(row.name) === 'data'" d="M7 7.8c-1 0-1 .6-1 1.1s-.4 1.1-.9 1.1c.5 0 .9.6.9 1.1s0 1.1 1 1.1M9 7.8c1 0 1 .6 1 1.1s.4 1.1.9 1.1c-.5 0-.9.6-.9 1.1s0 1.1-1 1.1" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" />
            <path v-else-if="kindOf(row.name) === 'image'" d="M5 12.5l2.2-2.6 1.5 1.6 1-1.1 1.3 2.1zM9.8 8.2a.6.6 0 1 0 0-.1" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round" />
          </svg>
        </span>
        <span class="min-w-0 flex-1 truncate">{{ row.name }}</span>
        <span v-if="!row.dir && $slots.adornment" class="flex shrink-0 items-center gap-1 text-11 text-content-subtle">
          <slot name="adornment" :file="row.file" />
        </span>
      </div>
    </template>
    <div v-else class="px-3 py-2 font-sans text-12 text-content-subtle">
      <slot name="empty">{{ empty }}</slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  // { path, ...meta }[] — folders come from the '/'-separated paths; meta rides
  // along untouched to the adornment slot and the select event
  files: { type: Array, default: () => [] },
  // the selected file's path (v-model)
  modelValue: { type: String, default: null },
  // folders before files in each directory (the explorer default); false puts
  // files first — e.g. a skill's SKILL.md above its scripts/ folder
  foldersFirst: { type: Boolean, default: true },
  // accessible name of the tree
  label: { type: String, default: 'Files' },
  // text when there are no files (the #empty slot replaces it)
  empty: { type: String, default: 'No files.' },
})

const emit = defineEmits(['update:modelValue', 'select'])

// ── tree from paths ──
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
const root = computed(() => {
  const top = { dirs: new Map(), files: [] }
  for (const file of props.files) {
    const parts = String(file?.path || '').split('/').filter(Boolean)
    if (!parts.length) continue
    let node = top
    let prefix = ''
    for (const part of parts.slice(0, -1)) {
      prefix = prefix ? `${prefix}/${part}` : part
      if (!node.dirs.has(part)) node.dirs.set(part, { name: part, path: prefix, dirs: new Map(), files: [] })
      node = node.dirs.get(part)
    }
    node.files.push({ name: parts[parts.length - 1], path: parts.join('/'), file })
  }
  return top
})

// folders the reader has closed (open by default, so a first look shows everything)
const collapsed = ref(new Set())
const toggle = (path) => {
  const next = new Set(collapsed.value)
  next.has(path) ? next.delete(path) : next.add(path)
  collapsed.value = next
}

// the visible rows, depth-first
const rows = computed(() => {
  const out = []
  const walk = (node, depth, parent) => {
    const dirs = [...node.dirs.values()].sort((a, b) => collator.compare(a.name, b.name))
    const files = [...node.files].sort((a, b) => collator.compare(a.name, b.name))
    const emitDirs = () => {
      for (const d of dirs) {
        out.push({ key: `d:${d.path}`, dir: true, name: d.name, path: d.path, depth, parent })
        if (!collapsed.value.has(d.path)) walk(d, depth + 1, `d:${d.path}`)
      }
    }
    const emitFiles = () => {
      for (const f of files) out.push({ key: `f:${f.path}`, dir: false, name: f.name, path: f.path, file: f.file, depth, parent })
    }
    if (props.foldersFirst) { emitDirs(); emitFiles() } else { emitFiles(); emitDirs() }
  }
  walk(root.value, 0, null)
  return out
})

// a selection inside a closed folder opens its ancestors
watch(() => props.modelValue, (path) => {
  if (!path || !path.includes('/')) return
  const parts = path.split('/').slice(0, -1)
  const next = new Set(collapsed.value)
  let changed = false
  parts.reduce((prefix, part) => {
    const p = prefix ? `${prefix}/${part}` : part
    if (next.delete(p)) changed = true
    return p
  }, '')
  if (changed) collapsed.value = next
}, { immediate: true })

// the type glyph, by extension — a hint, not a claim about the contents
const KINDS = {
  text: ['md', 'mdx', 'markdown', 'txt', 'rst', 'adoc'],
  script: ['sh', 'bash', 'zsh', 'fish', 'ps1', 'bat', 'cmd'],
  code: ['js', 'mjs', 'cjs', 'ts', 'tsx', 'jsx', 'vue', 'py', 'rb', 'go', 'rs', 'java', 'kt', 'swift', 'c', 'h', 'cpp', 'cs', 'php', 'lua', 'sql', 'html', 'css'],
  data: ['json', 'jsonl', 'yaml', 'yml', 'toml', 'ini', 'csv', 'xml', 'env', 'lock'],
  image: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico'],
}
const kindOf = (name) => {
  const ext = name.includes('.') ? name.split('.').pop().toLowerCase() : ''
  return Object.keys(KINDS).find((k) => KINDS[k].includes(ext)) || 'file'
}

// ── roving focus ──
const focusKey = ref(null)
const rowEls = new Map()
const setRowRef = (key, el) => { el ? rowEls.set(key, el) : rowEls.delete(key) }
const tabStop = computed(() => {
  const keys = rows.value.map((r) => r.key)
  if (focusKey.value && keys.includes(focusKey.value)) return focusKey.value
  const sel = props.modelValue ? `f:${props.modelValue}` : null
  return sel && keys.includes(sel) ? sel : keys[0]
})
const focusRow = (key) => {
  focusKey.value = key
  nextTick(() => rowEls.get(key)?.focus())
}

const select = (row) => {
  emit('update:modelValue', row.path)
  emit('select', row.file)
}
const activate = (row) => {
  focusKey.value = row.key
  row.dir ? toggle(row.path) : select(row)
}

const onKeydown = (e) => {
  const list = rows.value
  if (!list.length) return
  const i = Math.max(0, list.findIndex((r) => r.key === tabStop.value))
  const row = list[i]
  const expanded = row.dir && !collapsed.value.has(row.path)
  switch (e.key) {
    case 'ArrowDown': if (i < list.length - 1) focusRow(list[i + 1].key); break
    case 'ArrowUp': if (i > 0) focusRow(list[i - 1].key); break
    case 'Home': focusRow(list[0].key); break
    case 'End': focusRow(list[list.length - 1].key); break
    case 'ArrowRight':
      if (row.dir && !expanded) toggle(row.path)
      else if (row.dir && list[i + 1]?.parent === row.key) focusRow(list[i + 1].key)
      break
    case 'ArrowLeft':
      if (expanded) toggle(row.path)
      else if (row.parent) focusRow(row.parent)
      break
    case 'Enter':
    case ' ':
      activate(row)
      break
    default: return
  }
  e.preventDefault()
}
</script>
