<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="opt in normalized"
      :key="opt.value"
      class="text-12 font-med px-3 py-1.5 rounded-8 border transition-colors cursor-pointer"
      :class="isActive(opt.value) ? activeClass : inactiveClass"
      @click="toggle(opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  // strings or { value, label } objects
  options:    { type: Array, required: true },
  // single mode: value or null; multiple mode: array
  modelValue: { default: null },
  multiple:   { type: Boolean, default: false },
  // single mode: keep one option always selected (clicking the active option does nothing)
  required:   { type: Boolean, default: false },
  tone:       { type: String, default: 'grape' },
})

const emit = defineEmits(['update:modelValue'])

const normalized = computed(() =>
  props.options.map(o =>
    typeof o === 'object' ? o : { value: o, label: o }
  )
)

const activeClass = computed(() => ({
  grape: 'bg-primary text-on-primary border-primary',
  leaf:  'bg-signal-success text-on-primary border-signal-success',
  dark:  'bg-content text-surface border-content',
}[props.tone] || 'bg-primary text-on-primary border-primary'))

const inactiveClass = computed(() => ({
  grape: 'bg-surface text-content-muted border-stroke hover:border-primary/50',
  leaf:  'bg-surface text-content-muted border-stroke hover:border-signal-success/60',
  dark:  'bg-surface text-content-muted border-stroke hover:border-stroke-strong',
}[props.tone] || 'bg-surface text-content-muted border-stroke hover:border-primary/50'))

const isActive = (value) =>
  props.multiple ? (props.modelValue || []).includes(value) : props.modelValue === value

const toggle = (value) => {
  if (props.multiple) {
    const current = props.modelValue || []
    emit('update:modelValue', isActive(value) ? current.filter(v => v !== value) : [...current, value])
  } else {
    if (isActive(value)) {
      // clicking the active option deselects it (unless required)
      if (!props.required) emit('update:modelValue', null)
    } else {
      emit('update:modelValue', value)
    }
  }
}
</script>
