<template>
  <!-- titlePosition 'left' | 'right': the title sits in its own column beside
       the bar, right-aligned either way — at 'right' the column is the far end
       of the row, so stacked rows' numbers align on their last digit -->
  <div v-if="titlePosition !== 'inside'" class="w-full flex items-stretch gap-1.5 font-semi" :class="compact ? 'text-12' : 'text-16'">
    <div
      v-if="title"
      class="shrink-0 self-center text-right tabular-nums whitespace-nowrap"
      :class="[compact ? '' : 'text-13', titlePosition === 'right' ? 'order-last' : '']"
      :style="titleStyle"
    >{{ title }}</div>
    <div class="relative min-w-0 flex-1" :class="thin ? 'h-1.5 self-center' : ''">
      <div class="absolute top-0 left-0 h-full" :class="fillClass" :style="`width: ${percent}%`"></div>
    </div>
    <slot></slot>
  </div>

  <div v-else class="w-full relative flex items-center font-semi" :class="compact ? 'pl-1.5 text-12' : 'pl-2 text-16'">
    <div class="text-ellipsis overflow-hidden">
      <div class="absolute top-0 left-0 h-full" :class="fillClass" :style="`width: ${percent}%`"></div>
    </div>
    <div
      v-if="title"
      class="relative text-ellipsis overflow-hidden whitespace-nowrap"
      :class="compact ? '' : 'text-13'"
      :style="titleStyle"
    >{{ title }}</div>
    <!-- solid: a second copy of the title in the surface color, clipped to the
         fill's width — the label reads inverse over the bar and normal past its
         end, so a short bar never swallows its own number -->
    <div
      v-if="solid && title"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 flex items-center text-surface"
      :class="compact ? 'pl-1.5' : 'pl-2'"
      :style="{ clipPath: `inset(0 ${100 - percent}% 0 0)` }"
    >
      <div class="text-ellipsis overflow-hidden whitespace-nowrap" :class="compact ? '' : 'text-13'" :style="titleStyle">{{ title }}</div>
    </div>
    <div class="relative overflow-hidden">
      <slot></slot>
    </div>
  </div>
</template>
<script setup>

const props = defineProps({
  title   : {type:String },
  percent : {type:Number, required:true},
  // Dense contexts (e.g. SurfacePanel compact): smaller label with tight
  // leading, so the h-full fill band shrinks with it.
  compact : {type:Boolean, default:false},
  // High-contrast fill: content-colored bar (black in light, white in dark)
  // with the title inverted where the bar covers it.
  solid   : {type:Boolean, default:false},
  // 'inside' (default): title overlays the start of the bar. 'left' / 'right':
  // title in its own column before / after the bar.
  titlePosition : {type:String, default:'inside'},
  // Half-height bar (6 px, centered on the title) — side titles only; an
  // inside title needs the full bar behind it.
  thin    : {type:Boolean, default:false},
  // Title font-size override in px (compact default 9)
  titleSize : {type:Number},
})

const fillClass = computed(() => props.solid ? 'bg-content' : 'bg-primary/15')

const titleStyle = computed(() => props.compact
  ? { minWidth: '36px', fontSize: `${props.titleSize ?? 9}px`, lineHeight: `${(props.titleSize ?? 9) + 2}px` }
  : { minWidth: '60px', ...(props.titleSize ? { fontSize: `${props.titleSize}px` } : {}) })
</script>
