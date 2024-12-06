<template>
  <div>
    <canvas ref="canvas" :width="width" :height="height"></canvas>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useDark } from '@vueuse/core';
import { Chart, LineController, LinearScale, PointElement, LineElement, Tooltip, TimeScale } from 'chart.js';
import 'chartjs-adapter-moment';
import { ChartData } from 'chart.js';

Chart.register(LineController, LinearScale, PointElement, LineElement, Tooltip, TimeScale);

export default {
  name: 'LineChart',
  props: {
    data: {
      type: Object as () => ChartData<'line'>, // Typed as Chart.js 'line' data
      required: true,
    },
    width: {
      type: Number,
      default: 600,
    },
    height: {
      type: Number,
      default: 400,
    },
  },
  setup(props) {
    const canvas = ref<HTMLCanvasElement | null>(null);
    let chart: Chart | null = null;
    const darkMode = useDark(); // Detect dark mode

    const initializeChart = () => {
      if (!canvas.value || !props.data) {
        console.error('Canvas or data is missing.');
        return;
      }

      // Destroy the chart if it already exists
      if (chart) {
        chart.destroy();
      }

      chart = new Chart(canvas.value, {
        type: 'line',
        data: props.data,
        options: {
          responsive: true,
          layout: {
            padding: 20,
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value: number | string) => {
                  if (typeof value === 'number') {
                    return `$${(value / 1_000_000).toFixed(1)}M`; // Format values as millions
                  }
                  return value;
                },
                color: darkMode.value ? '#fff' : '#000', // Change tick color based on dark mode
              },
              title: {
                display: true,
                text: 'Total Sales (Millions)',
              },
            },
            x: {
              type: 'time',
              time: {
                unit: 'month',
                displayFormats: {
                  month: 'MMM YY', // Display month as 'Jan 21'
                },
              },
              ticks: {
                color: darkMode.value ? '#fff' : '#000', // Change tick color based on dark mode
              },
              title: {
                display: true,
                text: 'Month',
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => `$${context.raw}`, // Show raw values in tooltips
              },
              backgroundColor: darkMode.value ? '#333' : '#fff', // Tooltip background color
              bodyColor: darkMode.value ? '#fff' : '#000', // Tooltip text color
              borderColor: darkMode.value ? '#444' : '#ddd', // Tooltip border color
            },
            legend: {
              display: false, // Hide legend
            },
          },
          maintainAspectRatio: false,
          resizeDelay: 200,
        },
      });
    };

    onMounted(() => {
      initializeChart(); // Initialize the chart on mount
    });

    watch(
      () => props.data,
      (newData) => {
        if (newData) {
          initializeChart(); // Reinitialize chart on data change
        }
      },
      { deep: true } // Watch deeply for changes in nested objects
    );

    watch(darkMode, () => {
      if (chart?.options?.plugins?.tooltip) {
        chart.options.plugins.tooltip.backgroundColor = darkMode.value ? '#333' : '#fff';
        chart.options.plugins.tooltip.bodyColor = darkMode.value ? '#fff' : '#000';
        chart.options.plugins.tooltip.borderColor = darkMode.value ? '#444' : '#ddd';
        chart.update();
      }
    });

    onUnmounted(() => {
      if (chart) {
        chart.destroy();
      }
    });

    return {
      canvas,
    };
  },
};
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>
