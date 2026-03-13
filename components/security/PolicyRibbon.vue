<template>
  <svg width="29" height="48" viewBox="0 0 29 48" fill="none" xmlns="http://www.w3.org/2000/svg"
    class="pointer-events-none" aria-hidden="true"
  >
    <!-- Ribbon tail -->
    <path d="M4.15997 22.3896V47.4396L14.2 37.3896L23.55 46.7397V21.6396" :fill="tailColor" :stroke="badgeStroke" :stroke-width="badgeStroke ? 1.5 : 0" />
    <!-- Circle badge -->
    <path d="M14.2 28.4C22.0424 28.4 28.4 22.0424 28.4 14.2C28.4 6.35756 22.0424 0 14.2 0C6.35756 0 0 6.35756 0 14.2C0 22.0424 6.35756 28.4 14.2 28.4Z" :fill="badgeColor" :stroke="badgeStroke" :stroke-width="badgeStroke ? 1.5 : 0" />
    <!-- Checkmark icon -->
    <path d="M11.7675 19.3825L8.4875 16.0825C7.8375 15.4125 7.8375 14.3325 8.4875 13.7025C9.1675 13.0225 10.2375 13.0225 10.8875 13.7025L12.9775 15.7925L18.2575 10.5025C18.9075 9.8325 20.0075 9.8325 20.6575 10.5025C21.3075 11.1525 21.3075 12.2525 20.6575 12.9025L14.1775 19.3825C13.8675 19.6925 13.4475 19.8925 12.9875 19.8925C12.5275 19.8925 12.1175 19.6925 11.7775 19.3825H11.7675Z" :fill="checkColor" />
  </svg>
</template>

<script setup>
const props = defineProps({
  state: { type: String, default: 'cool' }, // 'hot' | 'warm' | 'cool' | 'white-list'
})

const palette = {
  hot:            { badge: '#FF4D4D', tail: '#CC0000', check: '#ffffff', stroke: null },
  warm:           { badge: '#FFB020', tail: '#CC8800', check: '#ffffff', stroke: null },
  cool:           { badge: '#49CF81', tail: '#1C974F', check: '#ffffff', stroke: null },
  'white-list':   { badge: '#ffffff', tail: '#FFFFFF', check: '#84CAFF', stroke: '#DFDFDF' },
}

const colors      = computed(() => palette[props.state] || palette.cool)
const badgeColor  = computed(() => colors.value.badge)
const tailColor   = computed(() => colors.value.tail)
const checkColor  = computed(() => colors.value.check)
const badgeStroke = computed(() => colors.value.stroke)
</script>
