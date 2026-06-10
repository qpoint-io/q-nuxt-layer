<template>
  <div :class="`group font-semi ${fontSize} whitespace-nowrap select-none flex relative`">
    <!-- If it's a nuxt link -->
    <nuxt-link v-if="to" :to="to"
      class="vertical-link w-full"
      :class="(active)? 'active' : '' "
    >
      <slot/>
    </nuxt-link>
    <!-- else if it's a link -->
    <a :href="href" :target="target" v-else-if="href"
      class="vertical-link"
      :class="(active)? 'active' : '' "
    >
      <slot/>
    </a>

    <!-- else it's a nothing.. -->
    <slot v-else />
  </div>

</template>

<style scoped>
  .vertical-link{
    @apply block py-1 pl-2 -ml-2 -mb-[2px] text-black group-hover:text-grape-700;
  }
  .vertical-link.active{
    @apply text-grape-500 group-hover:text-grape-500
  }

</style>

<script setup>
const props = defineProps({
  size  : { type:String, default: 'medium'},
  to    : { type:String },
  href  : { type:String },
  target: { type:String, default:"_self" },
  active: { type: Boolean, default: false }
})

const fontSize = computed(()=>{
  if(props.size == 'small')
    return 'text-13'

  return 'text-15'
})
</script>
