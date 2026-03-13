<template>
  <div
    class="border-2 rounded-lg bg-white relative"
    :class="active ? 'border-grape-400' : 'border-grape-300 opacity-80'"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-5 py-2 px-4 pt-3 hairline">
      <UxToggle size="small">
        <input type="checkbox" v-model="active" class="sr-only peer" />
        <template #label>
          <span class="text-16 font-semi">{{ active ? 'Active' : 'Inactive' }}</span>
        </template>
      </UxToggle>
      
      <!-- delete button -->
      <button class="text-black hover:text-black cursor-pointer" @click="$emit('delete')">
        <UxIcon id="x" class="w-6" />
      </button>
    </div>

    <!-- Body -->
    <div class="py-2 px-4 hairline">
      <!-- Condition row -->
      <SentenceRow label="Condition :">
        <SentenceSelect v-model="values.conditionType">
          <option value="every">for every violation</option>
          <option value="threshold">If total violations</option>
        </SentenceSelect>
        <template v-if="values.conditionType === 'threshold'">
          <SentenceSelect v-model="values.conditionOperator">
            <option value="exceed">exceed</option>
            <option value="equal">equal</option>
            <option value="below">fall below</option>
          </SentenceSelect>
          <SentenceNumber v-model="values.conditionThreshold" />
          <SentenceSelect v-model="values.conditionTimeScope">
            <option value="within">within the space of</option>
          </SentenceSelect>
          <SentenceNumber v-model="values.conditionTimeValue" />
          <SentenceSelect v-model="values.conditionTimeUnit">
            <option value="minute">minute</option>
            <option value="hour">hour</option>
            <option value="day">day</option>
          </SentenceSelect>
        </template>
      </SentenceRow>

      <!-- Action row -->
      <SentenceRow label="Action :">
        <SentenceSelect v-model="values.actionType">
          <option value="http">Send HTTP Request</option>
          <option value="slack">send a message</option>
        </SentenceSelect>
        <template v-if="values.actionType === 'http'">
          <SentenceSelect v-model="values.httpMethod">
            <option value="POST">POST</option>
            <option value="GET">GET</option>
            <option value="PUT">PUT</option>
          </SentenceSelect>
          <SentenceText v-model="values.httpUrl" placeholder="http://" />
        </template>
        <template v-if="values.actionType === 'slack'">
          <SentenceSelect v-model="values.slackDestination">
            <option value="slack">to Slack ✦</option>
          </SentenceSelect>
        </template>
      </SentenceRow>

      <!-- Throttling row -->
      <SentenceRow label="Throttling :">
        <SentenceSelect v-model="values.throttleType">
          <option value="none">No Throttling</option>
          <option value="rate-limit">collate &amp; summarize messages</option>
        </SentenceSelect>
        <template v-if="values.throttleType === 'rate-limit'">
          <SentenceSelect v-model="values.throttleLimitType">
            <option value="no-more-than">send no more than</option>
          </SentenceSelect>
          <SentenceNumber v-model="values.throttleCount" />
          <SentenceSelect v-model="values.throttlePer">
            <option value="per">per</option>
          </SentenceSelect>
          <SentenceNumber v-model="values.throttleInterval" />
          <SentenceSelect v-model="values.throttleUnit">
            <option value="minutes">minutes</option>
            <option value="hours">hours</option>
          </SentenceSelect>
        </template>
      </SentenceRow>
    </div>

    <!-- Mute button -->
    <div class="flex justify-end py-4 px-4 ">
      <button class="px-4 py-2 text-14 font-med text-grape border-1 border-grape-300 rounded-lg hover:border-grape-500 cursor-pointer bg-transparent">
        Mute for X time
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Object, required: true },
})

const emit = defineEmits(['update:modelValue', 'delete'])

const values = reactive({ ...props.modelValue })

watch(values, (v) => {
  emit('update:modelValue', { ...v })
}, { deep: true })

watch(() => props.modelValue, (v) => {
  Object.assign(values, v)
}, { deep: true })

const active = computed({
  get: () => values.active,
  set: (v) => { values.active = v },
})
</script>
