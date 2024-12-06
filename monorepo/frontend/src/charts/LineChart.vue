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
  name:'LineChart',
  props: {
    data: {
      type: Object as () => ChartData<'line'>,  
      required: true,
    },
    width: {
      type:Number,
      required:true,
    },
    height: {
      type: Number,
      required:true,
    },
  },
  setup(props) {
    const canvas = ref<HTMLCanvasElement | null>(null);
    let chart: Chart | null = null;
    const darkMode =useDark(); 

    onMounted(() => {
      if (canvas.value && props.data) {
        chart = new Chart(canvas.value, {
          type:'line',
          data: props.data,
          options: {
            responsive: true,
            layout: {
              padding: 20,
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks:{
                  callback: (value: number | string) => {
                    if (typeof value === 'number') {
                      return `$${(value / 1_000_000).toFixed(1)}M`; 
                    }
                    return value; 
                  },
                  color: darkMode.value ? '#fff' : '#000',
                },
                title:{
                  display: true,
                  text: 'Total Sales (Millions)',
                },
              },
              x: {
                type: 'time',
                time:{
                  unit: 'month',
                  displayFormats: {
                    month: 'MMM YY',
                  },
                },
                ticks: {
                  color: darkMode.value ? '#fff' : '#000',
                },
                title:{
                  display: true,
                  text: 'Month',
                },
              },
            },
            plugins: {
              tooltip:{
                callbacks:{
                  label: (context) => `$${context.raw}`, // Tooltip shows raw value
                },
                backgroundColor: darkMode.value ? '#333' : '#fff',
                bodyColor: darkMode.value ? '#fff' : '#000',
                borderColor: darkMode.value ? '#444' : '#ddd',
              },
              legend: {
                display: false, 
              },
            },
            maintainAspectRatio: false,
            resizeDelay: 200,
          },
        });
      }
    });

    onUnmounted(() => {
      if (chart) {
        chart.destroy();
      }
    });

    watch(darkMode, () => {
      if (chart?.options?.plugins?.tooltip) {
        chart.options.plugins.tooltip.backgroundColor = darkMode.value ? '#333' : '#fff';
        chart.options.plugins.tooltip.bodyColor = darkMode.value ? '#fff' : '#000';
        chart.options.plugins.tooltip.borderColor = darkMode.value ? '#444' : '#ddd';
        chart.update();
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
