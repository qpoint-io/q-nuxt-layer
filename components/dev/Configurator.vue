<template>
  <DevControls :initial-visible="initialVisible">
    <DevControlSection
      v-for="(category, catKey) in config"
      :key="catKey"
      :title="catKey"
    >
      <div class="configurator-props">
        <template v-for="(val, propKey) in category" :key="propKey">
          <template v-if="isVisible(category, val)">

            <!-- Boolean → Toggle -->
            <DevControlToggle
              v-if="typeof val === 'boolean'"
              :label="propKey"
              :modelValue="val"
              @update:modelValue="config[catKey][propKey] = $event"
            />

            <!-- Number → Slider (default range 0–100) -->
            <DevControlSlider
              v-else-if="typeof val === 'number'"
              :label="propKey"
              :modelValue="val"
              :min="0"
              :max="Math.max(100, val * 3)"
              :step="val < 1 ? 0.01 : 1"
              @update:modelValue="config[catKey][propKey] = Number($event)"
            />

            <!-- String → Text input -->
            <DevControlText
              v-else-if="typeof val === 'string'"
              :label="propKey"
              :modelValue="val"
              @update:modelValue="config[catKey][propKey] = $event"
            />

            <!-- Object with kind -->
            <template v-else-if="typeof val === 'object' && val !== null && val.kind">

              <!-- Range → Slider -->
              <DevControlSlider
                v-if="val.kind === 'range'"
                :label="propKey"
                :modelValue="Number(val.val)"
                :min="val.props?.min ?? 0"
                :max="val.props?.max ?? 100"
                :step="val.props?.step ?? 1"
                :suffix="val.props?.suffix"
                @update:modelValue="config[catKey][propKey].val = Number($event)"
              />

              <!-- Options → Select -->
              <DevControlSelect
                v-else-if="val.kind === 'options'"
                :label="propKey"
                :modelValue="val.val"
                :options="val.props?.options ?? []"
                @update:modelValue="config[catKey][propKey].val = $event"
              />

              <!-- Color → Color picker -->
              <DevControlColor
                v-else-if="val.kind === 'color'"
                :label="propKey"
                :modelValue="val.val"
                @update:modelValue="config[catKey][propKey].val = $event"
              />

            </template>

            <!-- Object with visibleWhen + boolean val (no kind) -->
            <DevControlToggle
              v-else-if="typeof val === 'object' && val !== null && typeof val.val === 'boolean'"
              :label="propKey"
              :modelValue="val.val"
              @update:modelValue="config[catKey][propKey].val = $event"
            />

          </template>
        </template>
      </div>
    </DevControlSection>
    <DevControlExport v-if="exportFn" :config="config" :exportFn="exportFn" />
  </DevControls>
</template>

<script setup>
import DevControls from './Controls.vue'
import DevControlSection from './ControlSection.vue'
import DevControlExport from './ControlExport.vue'
import DevControlToggle from './ControlToggle.vue'
import DevControlSlider from './ControlSlider.vue'
import DevControlText from './ControlText.vue'
import DevControlSelect from './ControlSelect.vue'
import DevControlColor from './ControlColor.vue'

defineProps({
  config: { type: Object, required: true },
  exportFn: { type: Function, default: null },
  initialVisible: { type: Boolean, default: true },
})

/**
 * Check if a property should be visible based on its visibleWhen field.
 * visibleWhen references another property key in the same category.
 */
function isVisible(category, val) {
  if (typeof val !== 'object' || val === null || !val.visibleWhen) return true
  const dep = category[val.visibleWhen]
  // dep can be a plain boolean or an object with .val
  if (typeof dep === 'boolean') return dep
  if (typeof dep === 'object' && dep !== null && 'val' in dep) return !!dep.val
  return !!dep
}
</script>

<style scoped>
.configurator-props {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
