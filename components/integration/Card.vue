<template>
  <!-- Integration connector card with two states sharing one grid, so names and
       body text align when active and available cards stack in a list.

       active:    primary border on surface; logo cell + name/"active" row over a
                  stat row (value/label pairs) + a config rail on the right.
       available: recessed row (surface-sunken-deeper) with logo chip, name +
                  description, and a dashed add button.

       Logos resolve by id via IntegrationLogo (assets/svgs/third-party-logos);
       pass `mark` initials as the fallback for ids without an asset. -->
  <article
    class="integration-card grid w-full overflow-hidden rounded-8"
    :class="active ? 'border border-primary bg-surface' : 'bg-surface-sunken-deeper'"
  >
    <span class="flex items-center justify-center" :class="active ? 'border-r border-stroke bg-surface-logo' : ''">
      <span class="inline-flex items-center justify-center" :class="active ? '' : 'rounded-6 bg-surface-logo p-1'">
        <IntegrationLogo :id="logoId" :mark="mark" :alt="name" class="h-6 w-6" />
      </span>
    </span>

    <div v-if="active" class="min-w-0">
      <div class="integration-card-row flex items-center justify-between gap-2 border-b border-stroke px-3">
        <span class="truncate text-15 font-bold leading-none text-content">{{ name }}</span>
        <span class="inline-flex shrink-0 items-center gap-1 text-11 font-semi text-primary/70">
          <UxIcon id="check-fat" class="h-2.5 w-2.5" />
          active
        </span>
      </div>
      <div class="integration-card-row flex flex-wrap items-center gap-x-3.5 px-3 py-0.5">
        <span v-for="stat in stats" :key="stat.label" class="flex items-baseline gap-1">
          <span class="text-16 font-bold leading-none text-primary">{{ stat.value }}</span>
          <span class="text-11 text-content-subtle">{{ stat.label }}</span>
        </span>
      </div>
    </div>
    <div v-else class="integration-card-center flex min-w-0 flex-col justify-center px-3">
      <span class="truncate text-15 font-bold leading-none text-content">{{ name }}</span>
      <span class="mt-1 truncate text-11 text-content-subtle">{{ description }}</span>
    </div>

    <button
      v-if="active"
      class="flex flex-col items-center justify-center gap-1 border-l border-stroke text-primary"
      :title="`Configure ${name}`"
      @click="emit('config')"
    >
      <UxIcon id="gear" class="h-3.5 w-3.5" />
      <span class="text-11 font-semi leading-none">config</span>
    </button>
    <span v-else class="flex items-center justify-center">
      <button
        class="inline-flex h-10 w-10 items-center justify-center rounded-6 border-1 border-dashed border-current bg-surface-sunken text-primary hover:bg-surface"
        :title="`Add ${name}`"
        :aria-label="`Add ${name}`"
        @click="emit('add')"
      >
        <UxIcon id="plus-fat" class="h-3 w-3" />
      </button>
    </span>
  </article>
</template>

<script setup>
const props = defineProps({
  name:        { type: String, required: true },
  logoId:      { type: String, default: '' },          // third-party-logos asset stem, e.g. 'splunk'
  mark:        { type: String, default: '' },          // fallback initials when logoId has no asset
  state:       { type: String, default: 'available' }, // 'active' | 'available'
  stats:       { type: Array, default: () => [] },     // active only: [{ value, label }]
  description: { type: String, default: '' },          // available only: one-line purpose
})

const emit = defineEmits(['config', 'add'])
const active = computed(() => props.state === 'active')
</script>

<style scoped>
/* Fixed side rails + shared row heights keep text aligned across states;
   values have no Tailwind tokens (layer forbids arbitrary-value classes). */
.integration-card {
  grid-template-columns: 54px minmax(0, 1fr) 60px;
}

.integration-card-row {
  min-height: 30px;
}

.integration-card-center {
  min-height: 60px;
}
</style>
