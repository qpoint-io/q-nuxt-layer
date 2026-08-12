<template>
  <div>
    <NuxtLink
      v-if="backTo"
      :to="backTo"
      class="inline-flex items-center gap-2 text-13 font-semi text-content-subtle"
    >
      ‹ {{ backLabel }}
    </NuxtLink>

    <!-- content box: white card (bg-surface) on the sunken page ground -->
    <div class="mt-3 rounded-6 border border-stroke bg-surface p-6">
      <!-- identity row: name + maturity + the activation toggle -->
      <div class="flex items-start justify-between gap-6">
        <div class="min-w-0">
          <div class="flex items-center gap-3">
            <h1 class="text-32 font-bold leading-tight text-content">{{ policy.name }}</h1>
            <span
              v-if="policy.maturity && policy.maturity !== 'live'"
              class="rounded-32 border bg-surface-sunken px-2.5 py-0.5 text-11 font-bold text-content-muted"
              style="line-height: 14px"
              :class="policy.maturity !== 'beta' && 'border-stroke'"
              :style="policy.maturity === 'beta' ? { borderColor: '#318bc499' } : null"
            >{{ policy.maturity === 'beta' ? 'Beta' : 'Roadmap' }}</span>
          </div>
          <p class="mt-2 whitespace-normal text-15 font-med text-content-subtle" style="max-width: 640px; line-height: 1.5">
            {{ policy.purpose }}
          </p>
        </div>
        <UxToggle size="small" class="mt-2 shrink-0">
          <input type="checkbox" class="peer sr-only" v-model="active" />
          <template #label>
            <span class="text-14 font-bold" :class="active ? 'text-content' : 'text-content-muted'">
              {{ active ? 'Active' : 'Inactive' }}
            </span>
          </template>
        </UxToggle>
      </div>

      <!-- meta strip -->
      <div class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-stroke py-2.5">
        <span class="text-13 font-semi text-content">{{ policy.category }}</span>
        <SecuritySeverity :severity="policy.severity" />
        <span class="font-mono text-12 text-content-muted">{{ policy.id }}</span>
        <div class="flex flex-wrap items-center gap-1.5">
          <span class="text-12 font-med text-content-muted">Satisfies</span>
          <ComplianceTag v-for="fw in policy.satisfies" :key="fw" size="small">{{ fw }}</ComplianceTag>
        </div>
      </div>

      <!-- underlying control — the quiet escape hatch to full flexibility -->
      <details class="group mt-3">
        <summary class="cursor-pointer list-none text-12 font-med text-content-muted">
          <span class="underline decoration-dotted">Underlying control</span>
          <span class="ml-1 text-content-muted/70 group-open:hidden">— show</span>
        </summary>
        <div class="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-6 bg-surface-sunken px-4 py-3">
          <code class="font-mono text-12 text-content">{{ policy.rule }}</code>
          <a
            href="#" class="whitespace-nowrap text-12 font-semi text-content-subtle underline"
            title="Opens this rule in the custom-control editor" @click.prevent="emit('edit-control')"
          >edit as custom control →</a>
        </div>
      </details>

      <!-- shape body -->
      <div class="mt-8 space-y-10" :class="!active && 'pointer-events-none opacity-50'">
        <slot />

        <!-- shared across every policy: scoped carve-outs instead of enforcement modes -->
        <PolicyConfigExceptions
          :items="exceptionRows"
          @add="onExceptionAdd"
          @remove="onExceptionRemove"
        />
      </div>

      <p v-if="policy.remediation" class="mt-10 border-t border-stroke pt-4 text-12 text-content-muted">
        <span class="font-bold">Remediation shown on findings:</span> {{ policy.remediation }}
      </p>
    </div>
  </div>
</template>

<script setup>
// Shared shell for a policy's full-detail page (c65): identity + activation,
// meta strip with ComplianceTag satisfies chips, underlying-control
// disclosure (the escape hatch), the shape body via slot, then the shared
// Exceptions section — all inside a white bg-surface card. Pages stay thin:
// data object + one shape component.
// Exceptions: the shell keeps a working copy seeded from `exceptions` so
// standalone/mock pages work with zero wiring, and re-emits every change
// (@exception-add / @exception-remove) for consumers that persist.
// @toggle fires with the new active state; @edit-control is the escape hatch.

const props = defineProps({
  policy: { type: Object, required: true }, // { id, name, purpose, category, severity, maturity, rule, satisfies: [], remediation, on }
  exceptions: { type: Array, default: () => [] },
  backTo: { type: String, default: '' },
  backLabel: { type: String, default: 'Policy Catalog' },
})

const emit = defineEmits(['toggle', 'exception-add', 'exception-remove', 'edit-control'])

const active = ref(props.policy.on !== false)
watch(active, (v) => emit('toggle', v))

const exceptionRows = reactive(props.exceptions.map((x) => ({ ...x })))
const onExceptionAdd = (ex) => {
  exceptionRows.push(ex)
  emit('exception-add', ex)
}
const onExceptionRemove = (i) => {
  const [removed] = exceptionRows.splice(i, 1)
  emit('exception-remove', removed, i)
}
</script>
