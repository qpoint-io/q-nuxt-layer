<template>
  <div class="relative mt-14">
    <component :is="chartType" v-bind="{ data, options }" />
  </div>
</template>

<script setup>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Filler,
} from 'chart.js'
import { Line, Bar } from 'vue-chartjs'

// chartjs is modular, capabilities need to be registered
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Filler,
);

// define props
const props = defineProps({
  data: { type: Array, default: [] },
  type: { type: String, default: 'line' },
  compact: { type: Boolean, default: false },
  unit: { type: String, default: '' },
  showYAxis: { type: Boolean, default: true },
  showXAxis: { type: Boolean, default: true },
});

// Determine which chart component to use
const chartType = computed(() => props.type === 'bar' ? Bar : Line);

// Theme-reactive chart ink — canvas can't resolve CSS var() strings, so
// these resolve to concrete colors and re-evaluate on theme toggle,
// which changes the options/data identity and triggers a chart update.
const tickColor   = useTokenColor('content-muted');
const lineColor   = useTokenColor('primary');
const fillColor   = useTokenColor('primary', 0.2);
const pointAccent = useTokenColor('surface');

// customize the chart
const options = computed(() => ({
  animation: {
    duration: 600,
    easing: 'easeInOutQuint',
  },
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false // This will hide the legend
    },
    tooltip: {
      enabled: false // This will hide the tooltip
    }
  },
  scales: {
    x: {
      display: props.showXAxis,
      grid: {
        display: false,
        drawBorder: false
      },
      border: {
        display: false
      },
      ticks: {
        font: {
          size: props.compact ? 8 : 12
        },
        color: tickColor.value,
        callback: function (value, index, values) {
          // is this compact mode?
          if (props.compact) {
            return index % 3 === 0 ? labels.value[index] : '';
          }

          return index % 2 === 0 ? labels.value[index] : '';
        }
      },
    },
    y: {
      display: props.compact ? false : props.showYAxis,
      beginAtZero: true,
      suggestedMin: 0,
      grid: {
        display: props.compact ? false : true,
        drawBorder: false
      },
      border: {
        display: false
      },
      ticks: {
        font: {
          size: props.compact ? 8 : 12
        },
        color: tickColor.value,
        callback: function (value) {
          if (props.unit === 'bytes') {
            const { value: val, unit } = formatBytes(Number(value));
            return `${val} ${unit}`;
          }

          if (props.unit === 'duration') {
            const { value: val, unit } = formatDuration(Number(value));
            return `${val} ${unit}`;
          }

          const abbreviated = abbreviateNumber(value).join('');
          return `${abbreviated}${props.unit}`;
        }
      }
    }
  },
  elements: {
    line: {
      borderWidth: 3,
      fill: true,
      backgroundColor: fillColor.value, // primary area under line
      borderColor: lineColor.value,
      tension: 0.1,
      pointRadius: 0,
      pointBackgroundColor: lineColor.value,
      pointBorderColor: pointAccent.value,
      pointHoverRadius: 8,
      pointHoverBackgroundColor: pointAccent.value,
      pointHoverBorderColor: lineColor.value,
      pointStyle: 'circle',
    },
    point: {
      borderWidth: 2,
      radius: 6,
      hoverRadius: 8
    },
    bar: {
      borderWidth: props.compact ? 0 : 2,
      backgroundColor: fillColor.value,
      borderColor: lineColor.value,
    }
  }
}));

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

// compute the point label
const label = computed(() => {
  return key.value.charAt(0).toUpperCase() + key.value.slice(1);
});

// compute the line
const line = computed(() => {
  return props.data.map(item => {
    return item[key.value];
  });
});

// determine the duration
const duration = computed(() => {
  // ensure we have at least 2 entries
  if (props.data.length < 2) return '';

  // grab the first
  const first = new Date(props.data[0].timestamp);

  // grab the second
  const second = new Date(props.data[1].timestamp);

  // return the duration
  return timestampsDuration(second.getTime(), first.getTime());
})

// compute the date format
const dateFormatter = computed(() => {
  // minutes
  if (['minute', '5minute', '15minute'].includes(duration.value)) {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  // hours
  if (duration.value == 'hour') {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  // days, when less than 10
  if (duration.value == 'day' && props.data.length < 10) {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short'
    });
  }

  // days, when more than 10
  if (duration.value == 'day') {
    return new Intl.DateTimeFormat('en-US', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    });
  }

  // default
  return new Intl.DateTimeFormat('en-US', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
});

// compute the labels
const labels = computed(() => {
  return props.data.map(({ timestamp }, i, list) => {
    return dateFormatter.value.format(new Date(timestamp));
  });
});

// compute the chart data
const data = computed(() => ({
  labels: labels.value,
  datasets: [{
    label: label.value,
    data: line.value,
    ...(props.type == 'bar' && options.value.elements.bar),
    ...(props.type == 'line' && options.value.elements.line),
  }]
}));
</script>
