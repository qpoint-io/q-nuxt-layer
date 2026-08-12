<template>
  <section>
    <div class="mb-1 flex items-baseline justify-between">
      <h2 class="text-18 font-bold text-content">{{ title }}</h2>
      <p class="text-12 text-content-muted">{{ entries.length }} {{ entries.length === 1 ? 'entry' : 'entries' }} · patterns supported (<code class="font-mono">*</code> and <code class="font-mono">?</code>)</p>
    </div>

    <UxTableList>
      <template #header>
        <tr>
          <th class="text-left">{{ valueLabel }}</th>
          <th v-if="scopes.length" class="text-left">Scope</th>
          <th class="text-left">Added by</th>
          <th class="text-left">Last matched</th>
          <th style="width: 1px"></th>
        </tr>
      </template>

      <tr v-for="(entry, i) in entries" :key="entry.value + i">
        <td class="py-2.5">
          <span class="font-mono text-13 text-content">{{ entry.value }}</span>
          <span v-if="entry.note" class="ml-2 text-12 italic text-content-muted">{{ entry.note }}</span>
        </td>
        <td v-if="scopes.length" class="py-2.5 text-13 capitalize text-content-subtle">{{ entry.scope }}</td>
        <td class="py-2.5 text-13 text-content-subtle">{{ entry.addedBy }}</td>
        <td class="py-2.5 text-13 text-content-subtle">{{ entry.lastMatched || '—' }}</td>
        <td class="py-2.5">
          <button class="text-content-muted" title="Remove entry" @click="emit('remove', i)">
            <UxIcon id="x" class="h-3 w-3" />
          </button>
        </td>
      </tr>
      <tr v-if="!entries.length">
        <td :colspan="scopes.length ? 5 : 4" class="py-4 text-13 italic text-content-muted">
          Empty list — everything violates until entries are approved.
        </td>
      </tr>

      <!-- add row -->
      <tr class="bg-surface-sunken">
        <td class="py-2.5">
          <input
            v-model="draft.value" :placeholder="placeholder"
            class="w-full rounded-4 border border-stroke bg-surface px-2 py-1 font-mono text-13 text-content"
            style="max-width: 340px"
            @keyup.enter="add"
          />
        </td>
        <td v-if="scopes.length" class="py-2.5">
          <select v-model="draft.scope" class="rounded-4 border border-stroke bg-surface px-2 py-1 text-13 capitalize text-content">
            <option v-for="s in scopes" :key="s" :value="s">{{ s }}</option>
          </select>
        </td>
        <td class="py-2.5 text-13 italic text-content-muted">you</td>
        <td class="py-2.5"></td>
        <td class="py-2.5">
          <button
            class="whitespace-nowrap rounded-4 bg-primary px-3 py-1 text-13 font-semi text-white disabled:opacity-40"
            :disabled="!draft.value" @click="add"
          >Add</button>
        </td>
      </tr>
    </UxTableList>
  </section>
</template>

<script setup>
// Config shape: list editor — allow/deny-list management (c65 P5/P6/P10/P14).
// Fully controlled: renders `entries` as given and emits intents — the parent
// owns the array (mutate it on @add/@remove, or persist via API first). The
// list is the policy's config data; the signal exposes the verdict (the
// egress `allowlisted` precedent).
//   @add    → { value, scope, addedBy: 'you', lastMatched: '' }
//   @remove → index

const props = defineProps({
  title: { type: String, required: true },
  valueLabel: { type: String, default: 'Entry' },
  placeholder: { type: String, default: 'value or pattern' },
  scopes: { type: Array, default: () => [] }, // e.g. ['global', 'host', 'agent']
  entries: { type: Array, default: () => [] }, // { value, scope, addedBy, lastMatched, note }
})

const emit = defineEmits(['add', 'remove'])

const draft = reactive({ value: '', scope: props.scopes[0] || '' })

const add = () => {
  if (!draft.value) return
  emit('add', { value: draft.value, scope: draft.scope, addedBy: 'you', lastMatched: '' })
  draft.value = ''
}
</script>
