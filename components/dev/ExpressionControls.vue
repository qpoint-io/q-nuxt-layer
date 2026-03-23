<template>
  <div class="expression-controls">
    <!-- Preset selector + JSON buttons -->
    <div class="expression-toolbar">
      <select
        v-if="presetNames.length"
        class="preset-select"
        :value="activePreset"
        @change="onPresetChange($event.target.value)"
      >
        <option value="">Custom</option>
        <option v-for="name in presetNames" :key="name" :value="name">{{ name }}</option>
      </select>
      <button class="toolbar-btn" title="Copy JSON" @click="copyJson">Copy</button>
      <button class="toolbar-btn" title="Paste JSON" @click="pasteJson">Paste</button>
    </div>

    <!-- Sections -->
    <DevControlSection
      v-for="(section, sectionKey) in expression"
      :key="sectionKey"
      :title="sectionKey"
      :collapsed="collapsedSections.has(sectionKey)"
    >
      <template v-for="(prop, propKey) in section" :key="propKey">
        <DevControlSlider
          v-if="prop.kind === 'range'"
          :label="propKey"
          :modelValue="prop.val"
          :min="prop.props.min"
          :max="prop.props.max"
          :step="prop.props.step"
          :suffix="prop.props.suffix"
          @update:modelValue="onPropUpdate(sectionKey, propKey, $event)"
        />
        <DevControlColor
          v-else-if="prop.kind === 'color'"
          :label="propKey"
          :modelValue="prop.val"
          @update:modelValue="onPropUpdate(sectionKey, propKey, $event)"
        />
        <DevControlSelect
          v-else-if="prop.kind === 'options'"
          :label="propKey"
          :modelValue="prop.val"
          :options="prop.props.options"
          @update:modelValue="onPropUpdate(sectionKey, propKey, $event)"
        />
        <label
          v-else-if="prop.kind === 'boolean'"
          class="expression-toggle"
        >
          <span class="expression-toggle-label">{{ propKey }}</span>
          <input
            type="checkbox"
            :checked="prop.val"
            @change="onPropUpdate(sectionKey, propKey, $event.target.checked)"
          />
        </label>
      </template>
    </DevControlSection>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import DevControlSection from './ControlSection.vue'
import DevControlSlider from './ControlSlider.vue'
import DevControlColor from './ControlColor.vue'
import DevControlSelect from './ControlSelect.vue'

const props = defineProps({
  expression: { type: Object, required: true },
  presets: { type: Object, default: () => ({}) },
  collapsedSections: { type: Set, default: () => new Set() },
})

const emit = defineEmits(['update:expression'])

const activePreset = ref('')

const presetNames = computed(() => Object.keys(props.presets))

function onPropUpdate(sectionKey, propKey, value) {
  activePreset.value = ''
  props.expression[sectionKey][propKey].val = value
}

function onPresetChange(presetName) {
  if (!presetName) return
  activePreset.value = presetName
  const preset = props.presets[presetName]
  if (!preset) return

  for (const [sectionKey, section] of Object.entries(preset)) {
    if (!props.expression[sectionKey]) continue
    for (const [propKey, val] of Object.entries(section)) {
      if (props.expression[sectionKey][propKey]) {
        props.expression[sectionKey][propKey].val = val
      }
    }
  }
}

function copyJson() {
  const values = {}
  for (const [sectionKey, section] of Object.entries(props.expression)) {
    values[sectionKey] = {}
    for (const [propKey, prop] of Object.entries(section)) {
      values[sectionKey][propKey] = prop.val
    }
  }
  navigator.clipboard.writeText(JSON.stringify(values, null, 2))
}

async function pasteJson() {
  try {
    const text = await navigator.clipboard.readText()
    const values = JSON.parse(text)
    for (const [sectionKey, section] of Object.entries(values)) {
      if (!props.expression[sectionKey]) continue
      for (const [propKey, val] of Object.entries(section)) {
        if (props.expression[sectionKey][propKey]) {
          props.expression[sectionKey][propKey].val = val
        }
      }
    }
    activePreset.value = ''
  } catch (e) {
    console.warn('Failed to paste expression JSON:', e)
  }
}
</script>

<style scoped>
.expression-controls {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.expression-toolbar {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.preset-select {
  flex: 1;
  padding: 0.35rem 0.5rem;
  border: 1px solid #2a2a4e;
  border-radius: 4px;
  background: #1a1a2e;
  color: #ccc;
  font-size: 0.8rem;
}

.toolbar-btn {
  padding: 0.35rem 0.75rem;
  border: 1px solid #2a2a4e;
  border-radius: 4px;
  background: #1a1a2e;
  color: #888;
  font-size: 0.7rem;
  cursor: pointer;
  white-space: nowrap;
}

.toolbar-btn:hover {
  color: #ccc;
  border-color: #3a3a5e;
}

.expression-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.expression-toggle-label {
  font-size: 0.75rem;
  color: #aaa;
  white-space: nowrap;
  min-width: 7rem;
  text-align: right;
}
</style>
