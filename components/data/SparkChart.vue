<template>
  <div>
    <Line v-bind="{ data, options }" />
  </div>
</template>

<script setup>
import {
  Chart as ChartJS,
  Filler,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js'
import { Line } from 'vue-chartjs'

// chartjs is modular, capabilities need to be registered
ChartJS.register(
  CategoryScale,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
);

const props = defineProps({
  data        : { type: Array, default: [] },
  ceiling     : { type: Number },
  fillColor   : { default: undefined },
  strokeColor : { default: undefined },
  strokeWidth : { default: 1 },
  padding     : { default: 0 },
});

// Theme-reactive default ink — canvas can't resolve var() or currentColor,
// so unset color props fall back to the resolved content token.
const defaultInk = useTokenColor('content');

// compute the point key
const key = computed(() => {
  // if the list is empty, return an empty string
  if (props.data.length == 0) {
    return '';
  }

  // look for the first key that isn't a timestamp
  for (const key of Object.keys(props.data[0])) {
    if (key != 'timestamp') {
      return key;
    }
  }

  // return an empty string
  return '';
});

// compute the line
const line = computed(() => {
  return props.data.map(item => {
    return item[key.value];
  });
});

// compute the labels
const labels = computed(() => {
  return props.data.map(() => '');
});

// compute the chart data
const data = computed(() => ({
  labels: labels.value,
  datasets: [{
    label: '',
    data: line.value,
    ...options.value.elements.line,
  }]
}));

// customize the chart
const options = computed(() => ({
  responsive: true,
  animation: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false, // This will hide the legend
    },
    tooltip: {
      enabled: false, // Disable the tooltip
    }
  },
  scales: {
    x: { display: false },
    y: {
      display: false,
      suggestedMax: Math.max(...line.value) + 1,
    },
  },
  elements: {
    line: {
      borderWidth: props.strokeWidth,
      borderColor: props.strokeColor ?? defaultInk.value, // Line color
      backgroundColor: (props.fillColor ?? defaultInk.value), // Fill color
      fill: (props.fillColor == 'none') ? false : true,
      tension: 0.1, // Smoothness of the line
      pointRadius: 0 // Hide the points
    },
  }
}));
</script>
