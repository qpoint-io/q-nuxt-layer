<template>
  <div class="overflow-hidden" :class="theme == 'light' ? 'rounded-8' : 'rounded-12'">
    <!-- Collapsible header: whole bar toggles, copy stays independent -->
    <button
      v-if="collapsible"
      class="flex items-center justify-between w-full px-4 py-2 bg-grey-800 cursor-pointer hover:bg-grey-700 transition-colors"
      @click="open = !open"
    >
      <span class="text-12 font-med text-grey-400 uppercase tracking-wide">{{ label }}</span>
      <div class="flex items-center gap-2">
        <span @click.stop><UxCopyBtn :text-to-copy="code" no-text /></span>
        <span class="text-12 text-grey-500">{{ open ? 'Hide' : 'Show' }}</span>
      </div>
    </button>

    <!-- Static header -->
    <div
      v-else-if="label"
      class="flex items-center justify-between px-4 py-2 bg-grey-800"
    >
      <span class="text-12 font-med text-grey-400 uppercase tracking-wide">{{ label }}</span>
      <UxCopyBtn :text-to-copy="code" no-text />
    </div>

    <!-- theme=dark chrome stays raw grey-800/900 by design: a code panel is
         deliberately dark on both page themes (like an editor). Only the
         light variant follows the page theme. -->
    <!-- lineNumbers: a gutter column (not selectable, not copied) that stays
         put while a long line scrolls sideways -->
    <pre
      v-show="open"
      class="m-0 p-4 overflow-x-auto"
      :class="[theme == 'light' ? 'bg-surface-sunken' : 'bg-grey-900', lineNumbers ? 'flex pl-0' : '']"
    ><span
      v-if="lineNumbers"
      aria-hidden="true"
      class="sticky left-0 shrink-0 select-none pl-4 pr-4 text-right font-mono leading-relaxed"
      :class="theme == 'light' ? 'bg-surface-sunken text-14 text-content-subtler' : 'bg-grey-900 text-13 text-grey-600'"
    >{{ gutter }}</span><code
      v-if="highlighted !== null"
      class="ux-codeblock-hl font-mono leading-relaxed"
      :class="theme == 'light' ? 'ux-codeblock-hl--light text-14 text-content' : 'ux-codeblock-hl--dark text-13 text-grey-300'"
      v-html="highlighted"
    /><code
      v-else
      class="font-mono leading-relaxed"
      :class="theme == 'light' ? 'text-14 text-content' : 'text-13 text-grey-300'"
    >{{ code }}</code></pre>
  </div>
</template>

<script>
// Syntax highlighting: highlight.js core on a private instance (so a consumer's
// own hljs registrations never leak in or out), four grammars only.
import hljsCore from 'highlight.js/lib/core'
import hljsMarkdown from 'highlight.js/lib/languages/markdown'
import hljsYaml from 'highlight.js/lib/languages/yaml'
import hljsBash from 'highlight.js/lib/languages/bash'
import hljsJson from 'highlight.js/lib/languages/json'

const hljs = hljsCore.newInstance()
hljs.registerLanguage('markdown', hljsMarkdown) // + md
hljs.registerLanguage('yaml', hljsYaml)         // + yml
hljs.registerLanguage('bash', hljsBash)         // + sh, zsh
hljs.registerLanguage('json', hljsJson)
hljs.registerAliases(['sh', 'shell'], { languageName: 'bash' })

const escapeHtml = (s) => s
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#x27;')

const known = (lang) => !!lang && !!hljs.getLanguage(lang)

// A fence opener: up to 3 spaces, ``` or ~~~ (3+), then the info string's first word
const FENCE_OPEN = /^ {0,3}(`{3,}|~{3,})[ \t]*([^\s`]*)/

// Markdown needs two things hljs's grammar doesn't do: a leading `---`
// frontmatter block (hljs would read its last line as a setext heading) is
// YAML, and fenced blocks take their info-string language. Split on those,
// highlight each piece on its own, and rejoin on the same newlines.
function highlightMarkdown(code) {
  const lines = code.split('\n')
  const out = []
  let i = 0

  if (/^---[ \t]*$/.test(lines[0])) {
    let j = 1
    while (j < lines.length && !/^(---|\.\.\.)[ \t]*$/.test(lines[j])) j++
    if (j < lines.length) {
      out.push(`<span class="hljs-meta">${escapeHtml(lines[0])}</span>`)
      if (j > 1) out.push(highlight('yaml', lines.slice(1, j).join('\n')))
      out.push(`<span class="hljs-meta">${escapeHtml(lines[j])}</span>`)
      i = j + 1
    }
  }

  let prose = []
  const flush = () => {
    if (!prose.length) return
    out.push(`<span class="ux-hl-md">${hljs.highlight(prose.join('\n'), { language: 'markdown', ignoreIllegals: true }).value}</span>`)
    prose = []
  }

  while (i < lines.length) {
    const m = FENCE_OPEN.exec(lines[i])
    if (!m) { prose.push(lines[i]); i++; continue }
    flush()
    const [, fence, info] = m
    const close = new RegExp(`^ {0,3}${fence[0] === '`' ? '`' : '~'}{${fence.length},}[ \\t]*$`)
    let j = i + 1
    while (j < lines.length && !close.test(lines[j])) j++ // unclosed → runs to the end
    out.push(`<span class="hljs-code">${escapeHtml(lines[i])}</span>`)
    if (j > i + 1) out.push(highlight(info.toLowerCase(), lines.slice(i + 1, j).join('\n')))
    if (j < lines.length) out.push(`<span class="hljs-code">${escapeHtml(lines[j])}</span>`)
    i = j + 1
  }
  flush()
  return out.join('\n')
}

// Registered lang → escaped hljs markup; anything else → escaped plain text
function highlight(lang, code) {
  if (!known(lang)) return escapeHtml(code)
  if (hljs.getLanguage(lang) === hljs.getLanguage('markdown')) return highlightMarkdown(code)
  return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
}
</script>

<script setup>
const props = defineProps({
  code:        { type: String, required: true },
  label:       { type: String, default: '' },
  collapsible: { type: Boolean, default: false },
  defaultOpen: { type: Boolean, default: false },
  // dark = doc/pattern code, light = inline page snippets
  theme:       { type: String, default: 'dark' },
  // a line-number gutter (editor source views)
  lineNumbers: { type: Boolean, default: false },
  // syntax highlighting: markdown/md (frontmatter as YAML, fenced blocks in
  // their info-string language), yaml/yml, bash/sh/shell/zsh, json. Unset →
  // the plain render; unknown → escaped plain text.
  lang:        { type: String, default: '' },
})

// one number per line; a single trailing newline doesn't render a line, so it gets no number
const gutter = computed(() => {
  const n = props.code.replace(/\n$/, '').split('\n').length
  return Array.from({ length: n }, (_, i) => i + 1).join('\n')
})

// lang → highlighted markup for v-html: every text run is escaped (hljs output,
// or escapeHtml for the plain fallback). No lang → null → the plain <code>,
// which renders exactly as before. Token spans only colour/weight text, never
// size it, so lines stay aligned with the gutter.
const highlighted = computed(() => (props.lang ? highlight(props.lang.toLowerCase(), props.code) : null))

const open = ref(props.collapsible ? props.defaultOpen : true)
</script>

<style>
/* hljs class → brand token. Unscoped so the no-lang render carries no scope
   attribute; every selector is anchored under .ux-codeblock-hl, which only the
   highlighted <code> carries. Roles, not decoration:
     heading   section                        brightest text + bold
     structure attr · bullet · keyword · name  primary (grape)
     literal   string · code (inline + fences) success green
     scalar    number · literal · built_in ·   info
               variable · type · symbol · title
     link      link (URL, underlined) · md link text  info
     aside     comment · meta (---, #!)        subtle text
     quote     quote                          muted text, italic
   theme=light follows the page theme (semantic tokens; green is leaf-600 —
   the palette's "dark success text" — because leaf-500 is too faint on a
   sunken surface); theme=dark is fixed dark chrome, so raw palette steps. */
.ux-codeblock-hl .hljs-strong   { @apply font-bold; }
.ux-codeblock-hl .hljs-emphasis { @apply italic; }
.ux-codeblock-hl .hljs-link     { @apply underline; }
.ux-codeblock-hl .hljs-comment,
.ux-codeblock-hl .hljs-quote    { @apply italic; }
/* json true/null nest a keyword span inside the literal — keep the literal's colour */
.ux-codeblock-hl .hljs-literal .hljs-keyword { color: inherit; }

.ux-codeblock-hl--light .hljs-section { @apply text-content font-bold; }
.ux-codeblock-hl--light .hljs-attr,
.ux-codeblock-hl--light .hljs-bullet,
.ux-codeblock-hl--light .hljs-keyword,
.ux-codeblock-hl--light .hljs-selector-tag,
.ux-codeblock-hl--light .hljs-name { @apply text-primary; }
.ux-codeblock-hl--light .hljs-string,
.ux-codeblock-hl--light .hljs-code,
.ux-codeblock-hl--light .hljs-regexp { @apply text-leaf-600 dark:text-leaf-300; }
.ux-codeblock-hl--light .hljs-number,
.ux-codeblock-hl--light .hljs-literal,
.ux-codeblock-hl--light .hljs-built_in,
.ux-codeblock-hl--light .hljs-variable,
.ux-codeblock-hl--light .hljs-template-variable,
.ux-codeblock-hl--light .hljs-type,
.ux-codeblock-hl--light .hljs-symbol,
.ux-codeblock-hl--light .hljs-title,
.ux-codeblock-hl--light .hljs-link,
.ux-codeblock-hl--light .ux-hl-md .hljs-string { @apply text-signal-info; }
.ux-codeblock-hl--light .hljs-comment,
.ux-codeblock-hl--light .hljs-meta { @apply text-content-subtle; }
.ux-codeblock-hl--light .hljs-quote { @apply text-content-muted; }

.ux-codeblock-hl--dark .hljs-section { @apply text-grey-100 font-bold; }
.ux-codeblock-hl--dark .hljs-attr,
.ux-codeblock-hl--dark .hljs-bullet,
.ux-codeblock-hl--dark .hljs-keyword,
.ux-codeblock-hl--dark .hljs-selector-tag,
.ux-codeblock-hl--dark .hljs-name { @apply text-grape-400; }
.ux-codeblock-hl--dark .hljs-string,
.ux-codeblock-hl--dark .hljs-code,
.ux-codeblock-hl--dark .hljs-regexp { @apply text-leaf-300; }
.ux-codeblock-hl--dark .hljs-number,
.ux-codeblock-hl--dark .hljs-literal,
.ux-codeblock-hl--dark .hljs-built_in,
.ux-codeblock-hl--dark .hljs-variable,
.ux-codeblock-hl--dark .hljs-template-variable,
.ux-codeblock-hl--dark .hljs-type,
.ux-codeblock-hl--dark .hljs-symbol,
.ux-codeblock-hl--dark .hljs-title,
.ux-codeblock-hl--dark .hljs-link,
.ux-codeblock-hl--dark .ux-hl-md .hljs-string { @apply text-grape-200; }
.ux-codeblock-hl--dark .hljs-comment,
.ux-codeblock-hl--dark .hljs-meta { @apply text-grey-500; }
.ux-codeblock-hl--dark .hljs-quote { @apply text-grey-400; }
</style>
