<template>
  <div class="_health-dial max-w-[200px]">
    <svg data-name="HealthDial" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 257.35 210.34" >

      <defs>
        <linearGradient id='health-dial-hot'>
          <stop stop-color='#FE0800'/>
          <stop offset='100%' stop-color='#930000'/>
        </linearGradient>

        <linearGradient id='health-dial-warm'>
          <stop stop-color='#ffc368'/>
          <stop offset='100%' stop-color='#ff8c00'/>
        </linearGradient>

        <linearGradient id='health-dial-warn'>
          <stop stop-color='#f9db68'/>
          <stop offset='100%' stop-color='#d6de70'/>
        </linearGradient>

        <linearGradient id='health-dial-cool'>
          <stop stop-color='#8adf73'/>
          <stop offset='60%' stop-color='#06b83b'/>
          <stop offset='100%' stop-color='#004f14'/>
        </linearGradient>
      </defs>

      <g data-name="Layer_1" :class="status">
        <g>
          <!-- Pointer needle -->
          <g id="pointer" :style="`transform: rotate(${ dialedPercent }deg); transform-origin:129px 128px`" class="duration-500 ease-in-out-quint">
            <line class="cls-needle" x1="128.65" y1="127.97" x2="69.75" y2="167.01"/>
            <circle cx="128.65" cy="127.97" r="13.58"/>
          </g>

          <!-- Background arc -->
          <path class="arc-bg"
            :d="pathD"
            fill="none" stroke-linecap="round" stroke-linejoin="round"
          />

          <!-- Health gradient stops -->
          <path v-for="(stop, index) in stops" :key="index"
            :style="`transform-origin:129.6px 131px; transform:rotate(${stop.rotation}deg);`"
            :class="stop.class"
            :d="pathD"
            :stroke-dasharray="lineLength"
            :stroke-dashoffset="lineLength - (pathLength*2.2 * stop.size/100)"
            fill="none" stroke-linecap="round" stroke-linejoin="round"
          />

          <!-- Track -->
          <path class="arc-track opacity-0"
            :d="pathD"
            :stroke-dasharray="lineLength"
            :stroke-dashoffset="lineLength - (pathLength*2.2 * (100 - percent)/100)"
            fill="none" stroke-linecap="round" stroke-linejoin="round"
          />

          <!-- Main display -->
          <path class="arc-main opacity-0"
            :d="pathD"
            :stroke-dasharray="lineLength"
            :stroke-dashoffset="lineLength - (pathLength*2.2 * (100 - percent)/100)"
            fill="none" stroke-linecap="round" stroke-linejoin="round"
          />
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
  .cls-needle {
    fill: none;
    stroke: #000;
    stroke-linecap: round;
    stroke-miterlimit: 10;
    stroke-width: 9px;
  }
  svg path {
    @apply duration-500 ease-in-out-quint;
  }

  ._health-dial .arc-main {
    stroke-width: 13px;
  }
  ._health-dial .arc-track {
    stroke-width: 24px;
  }
  ._health-dial .arc-bg {
    stroke-width: 24px;
    @apply stroke-grey-200;
  }

  /* Hot */
  ._health-dial .hot .arc-main {
    stroke: url(#health-dial-hot);
  }
  ._health-dial .hot .arc-track {
    @apply stroke-[#ff0000];
  }
  ._health-dial .hot .arc-bg {
    @apply stroke-[#ffc2c2];
  }

  /* Cool */
  ._health-dial .cool .arc-main {
    stroke: url(#health-dial-cool);
  }
  ._health-dial .cool .arc-track {
    @apply stroke-[#5bd15e];
  }

  /* Gradient fill for background stops */
  ._health-dial path.hot,
  ._health-dial path.warm,
  ._health-dial path.warn,
  ._health-dial path.cool {
    stroke-width: 24px;
  }
  ._health-dial path.hot {
    stroke: url(#health-dial-hot);
  }
  ._health-dial path.warm {
    stroke: url(#health-dial-warm);
  }
  ._health-dial path.warn {
    stroke: url(#health-dial-warn);
  }
  ._health-dial path.cool {
    stroke: url(#health-dial-cool);
  }

  /* Warm */
  ._health-dial .warm .arc-main {
    stroke: url(#health-dial-warm);
  }
  ._health-dial .warm .arc-track {
    @apply stroke-[#ffc368];
  }
</style>

<script setup>
const pathLength = 200

const props = defineProps({
  status:        { type: String, required: true },
  lineLength:    { type: Number, default: 600 },
})

// Status → fixed needle position (internal detail)
const statusPositions = { cool: 95, warn: 60, warm: 35, hot: 10 }
const percent = computed(() => statusPositions[props.status] ?? 95)

const stops = [
  { size: 10, rotation: 0,   class: 'cool' },
  { size: 20, rotation: 25,  class: 'warn' },
  { size: 30, rotation: 71,  class: 'warm' },
  { size: 40, rotation: 145, class: 'hot' },
]

// Arc path parameters
const startX = 41, startY = 183, radiX = 103, radiY = 103
const xAxisRot = 43, largeArcFlag = 1, sweepFlag = 1
const endX = 175, endY = 4

const dialedPercent = computed(() => {
  const ceiling = 245
  return Math.floor(ceiling - (ceiling * (percent.value / 100)))
})

const pathD = computed(() => {
  return `M${startX},${startY} a${radiX},${radiY} ${xAxisRot} ${largeArcFlag} ${sweepFlag} ${endX},${endY}`
})
</script>
