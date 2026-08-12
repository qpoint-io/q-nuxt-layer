<template>
  <section>
    <div class="mb-1 flex items-baseline justify-between">
      <h2 class="text-18 font-bold text-content">Exceptions</h2>
      <p class="text-12 text-content-muted">Scoped carve-outs with a reason and an expiry — accepted risk, on the record.</p>
    </div>

    <UxTableList>
      <template #header>
        <tr>
          <th class="text-left">Scope</th>
          <th class="text-left">Value</th>
          <th class="text-left">Reason</th>
          <th class="text-left">Expires</th>
          <th style="width: 1px"></th>
        </tr>
      </template>

      <tr v-for="(ex, i) in items" :key="i">
        <td class="py-2.5 text-13 font-semi capitalize text-content">{{ ex.scope }}</td>
        <td class="py-2.5 font-mono text-13 text-content">{{ ex.value }}</td>
        <td class="py-2.5 text-13 text-content-subtle" style="max-width: 320px">{{ ex.reason }}</td>
        <td class="py-2.5 text-13 text-content-subtle">{{ ex.expires }}</td>
        <td class="py-2.5">
          <button class="text-content-muted" title="Remove exception" @click="emit('remove', i)">
            <UxIcon id="x" class="h-3 w-3" />
          </button>
        </td>
      </tr>
      <tr v-if="!items.length">
        <td colspan="5" class="py-4 text-13 italic text-content-muted">No exceptions — the policy applies everywhere.</td>
      </tr>

      <!-- add row -->
      <tr class="bg-surface-sunken">
        <td class="py-2.5">
          <select v-model="draft.scope" class="rounded-4 border border-stroke bg-surface px-2 py-1 text-13 text-content">
            <option v-for="s in scopes" :key="s" :value="s">{{ s }}</option>
          </select>
        </td>
        <td class="py-2.5">
          <input v-model="draft.value" placeholder="value or pattern" class="w-full rounded-4 border border-stroke bg-surface px-2 py-1 font-mono text-13 text-content" />
        </td>
        <td class="py-2.5">
          <input v-model="draft.reason" placeholder="why this carve-out exists" class="w-full rounded-4 border border-stroke bg-surface px-2 py-1 text-13 text-content" />
        </td>
        <td class="py-2.5">
          <input v-model="draft.expires" placeholder="2026-12-31" class="rounded-4 border border-stroke bg-surface px-2 py-1 text-13 text-content" style="width: 110px" />
        </td>
        <td class="py-2.5">
          <button
            class="whitespace-nowrap rounded-4 bg-primary px-3 py-1 text-13 font-semi text-white disabled:opacity-40"
            :disabled="!draft.value || !draft.reason"
            @click="add"
          >Add</button>
        </td>
      </tr>
    </UxTableList>
  </section>
</template>

<script setup>
// Config shape: the shared Exceptions section — c65's replacement for
// enforcement-mode cascades: a policy is on everywhere minus explicit,
// expiring, reasoned carve-outs. Fully controlled: renders `items` as given,
// emits intents; the parent owns the array.
//   @add    → { scope, value, reason, expires }
//   @remove → index

const props = defineProps({
  items: { type: Array, default: () => [] }, // { scope, value, reason, expires }
  scopes: { type: Array, default: () => ['agent', 'host', 'user', 'destination', 'adapter'] },
})

const emit = defineEmits(['add', 'remove'])

const draft = reactive({ scope: props.scopes[0], value: '', reason: '', expires: '' })

const add = () => {
  emit('add', { ...draft, expires: draft.expires || 'never' })
  draft.value = ''
  draft.reason = ''
  draft.expires = ''
}
</script>
