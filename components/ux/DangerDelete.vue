<template>
  <div>
    <!-- verify -->
    <div v-if="verify">
      <!-- Initial Btn -->
      <div v-if="!isOpen" >
        <UxButton class="btn-danger-outline mt-7" @click="isOpen = true">Delete {{target}}</UxButton>
      </div>

      <!-- Sanity check -->
      <div v-if="isOpen" class="flex gap-px16">
        <UxInput class="grow" label='Sanity check, type DELETE to continue'>
          <input class="w-full" type="text" v-model="sanityText" />
        </UxInput>
        <UxButton class="btn-cancel mt-7" @click="isOpen = false">Cancel</UxButton>
        <UxButton
          @click    ="$emit('delete')"
          :disabled ="!sanityTextIsValid"
          :spin     ="deleting"
          class     ="btn-danger mt-7">
            {{ action }} Forever
        </UxButton>
      </div>
    </div>

    <!-- no verify -->
    <div v-if="!verify">
      <UxButton
        class="btn-danger-outline"
        @click="$emit('delete')"
        :spin="deleting">
        {{ action }} {{ target }}
      </UxButton>
    </div>
  </div>
</template>

<script setup>
defineProps({
  action  : { type: String, default: 'Delete' },
  target  : { type: String, default:'' },
  deleting: { type: Boolean },
  verify  : { type: Boolean, default: false },
})

const isOpen     = ref(false)
const sanityText = ref('')

const sanityTextIsValid = computed( () => (
  sanityText.value.toUpperCase() == 'DELETE'
))
</script>
