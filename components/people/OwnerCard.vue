<template>
  <!-- One frame; the user and the endpoint are two columns inside it, split by a hairline. -->
  <div class="grid grid-cols-1 overflow-hidden rounded-12 border border-stroke bg-surface" :class="both ? 'md:grid-cols-2' : ''">
    <!-- ── User: the person this install / endpoint belongs to ── -->
    <component
      :is="userTo ? NuxtLink : 'div'" v-if="only !== 'host'" :to="userTo || undefined"
      class="block min-w-0 px-5 py-4 no-underline" :class="userTo ? 'group hover:bg-surface-sunken' : ''"
    >
      <div class="mb-3 text-11 uppercase tracking-wide text-content-subtle">{{ userLabel }}</div>
      <div v-if="displayName" class="flex items-center gap-3">
        <img v-if="avatar" :src="avatar" alt="" class="h-11 w-11 shrink-0 rounded-full border-2 border-content object-cover" />
        <UxAvatar v-else :name="displayName" />
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <span class="truncate text-16 font-bold text-content group-hover:text-primary">{{ displayName }}</span>
            <UxPill v-if="team" tone="grey">{{ team }}</UxPill>
          </div>
          <div v-if="email" class="truncate text-12 text-content-subtle" :title="email">{{ email }}</div>
        </div>
      </div>
      <div v-else class="text-16 font-bold text-content-subtle">{{ emptyUser }}</div>
    </component>

    <!-- ── Endpoint: the machine it runs on ── -->
    <component
      :is="hostTo ? NuxtLink : 'div'" v-if="only !== 'user'" :to="hostTo || undefined"
      class="block min-w-0 px-5 py-4 no-underline"
      :class="[hostTo ? 'group hover:bg-surface-sunken' : '', both ? 'border-t border-stroke md:border-l md:border-t-0' : '']"
    >
      <div class="mb-3 text-11 uppercase tracking-wide text-content-subtle">{{ hostLabel }}</div>
      <div class="flex items-center gap-3">
        <UxIcon id="laptop" class="shrink-0 text-content-subtle" :style="{ width: '28px', height: '16px' }" />
        <div class="min-w-0">
          <div class="truncate font-mono text-16 font-bold" :class="host ? 'text-content group-hover:text-primary' : 'text-content-subtle'" :title="host || undefined">{{ host || '—' }}</div>
          <div class="text-12 text-content-subtle">OS {{ os || '—' }}</div>
        </div>
      </div>
    </component>
  </div>
</template>

<script setup lang="ts">
// PeopleOwnerCard (design c92 todos-2026-09-24 plan 02): who and what an
// instance belongs to — the person and the endpoint — in one card. Built for
// qdash's Harness install page (user + endpoint) and the Endpoint page (user
// only, `only="user"`). Identity only, no numbers: it is not a band.
// Presentational — the consumer resolves team / links; nothing is fetched.
// Pixel sizes ride inline styles (layer rule: no arbitrary-value classes).
import { computed, resolveComponent } from 'vue'

const props = withDefaults(defineProps<{
  /** Display name; defaults to the email's local part. */
  name?: string | null
  email?: string | null
  /** Image URL; initials (UxAvatar) when absent. */
  avatar?: string | null
  /** Team pill beside the name, when known. */
  team?: string | null
  /** Endpoint hostname; `—` when absent. */
  host?: string | null
  /** Endpoint OS; `OS —` until a source exists. */
  os?: string | null
  /** Drill-down targets; absent = static part. */
  userTo?: string
  hostTo?: string
  /** Render one part alone in the same frame. */
  only?: 'user' | 'host'
  userLabel?: string
  hostLabel?: string
  /** Shown in the user part when there is no name or email. */
  emptyUser?: string
}>(), {
  userLabel: 'User',
  hostLabel: 'Endpoint',
  emptyUser: 'unattributed',
})

const NuxtLink = resolveComponent('NuxtLink')
const both = computed(() => !props.only)
const displayName = computed(() => props.name || (props.email ? props.email.split('@')[0] : ''))
</script>
