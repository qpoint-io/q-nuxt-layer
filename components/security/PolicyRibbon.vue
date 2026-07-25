<template>
  <svg width="29" height="48" viewBox="0 0 29 48" fill="none" xmlns="http://www.w3.org/2000/svg"
    class="pointer-events-none" aria-hidden="true"
  >
    <!-- Style (not attribute) bindings: var()-backed token colors only
         resolve in CSS properties, not SVG presentation attributes. -->
    <!-- Ribbon tail -->
    <path d="M4.15997 22.3896V47.4396L14.2 37.3896L23.55 46.7397V21.6396" :style="{ fill: tailColor, stroke: badgeStroke || 'none', strokeWidth: badgeStroke ? 1.5 : 0 }" />
    <!-- Circle badge -->
    <path d="M14.2 28.4C22.0424 28.4 28.4 22.0424 28.4 14.2C28.4 6.35756 22.0424 0 14.2 0C6.35756 0 0 6.35756 0 14.2C0 22.0424 6.35756 28.4 14.2 28.4Z" :style="{ fill: badgeColor, stroke: badgeStroke || 'none', strokeWidth: badgeStroke ? 1.5 : 0 }" />
    <!-- Checkmark icon -->
    <path d="M11.7675 19.3825L8.4875 16.0825C7.8375 15.4125 7.8375 14.3325 8.4875 13.7025C9.1675 13.0225 10.2375 13.0225 10.8875 13.7025L12.9775 15.7925L18.2575 10.5025C18.9075 9.8325 20.0075 9.8325 20.6575 10.5025C21.3075 11.1525 21.3075 12.2525 20.6575 12.9025L14.1775 19.3825C13.8675 19.6925 13.4475 19.8925 12.9875 19.8925C12.5275 19.8925 12.1175 19.6925 11.7775 19.3825H11.7675Z" :style="{ fill: checkColor }" />
  </svg>
</template>

<script setup>
const props = defineProps({
  state: { type: String, default: 'cool' }, // 'hot' | 'warm' | 'tepid' | 'cool' | 'white-list'
})

// hot/warm/cool badge+tail are two-tone shade pairs beyond the token
// vocabulary — kept raw (same rationale as the Dial gauge gradients).
// Whites ride tokens so the ribbon doesn't glow on a dark page.
const palette = {
  hot:            { badge: '#FF4D4D', tail: '#CC0000', check: qp('on-primary'), stroke: null },
  warm:           { badge: '#FFB020', tail: '#CC8800', check: qp('on-primary'), stroke: null },
  tepid:          { badge: '#949494', tail: '#565454', check: qp('on-primary'), stroke: null },
  cool:           { badge: '#49CF81', tail: '#1C974F', check: qp('on-primary'), stroke: null },
  'white-list':   { badge: qp('surface'), tail: qp('surface'), check: '#84CAFF', stroke: qp('stroke') },
}

const colors      = computed(() => palette[props.state] || palette.cool)
const badgeColor  = computed(() => colors.value.badge)
const tailColor   = computed(() => colors.value.tail)
const checkColor  = computed(() => colors.value.check)
const badgeStroke = computed(() => colors.value.stroke)
</script>
