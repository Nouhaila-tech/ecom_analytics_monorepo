<template>
    <div class="grow flex flex-col justify-center">
      <canvas ref="canvas" :width="width" :height="height"></canvas>
    </div>
  </template>
  
  <script lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue';
  import { Chart, BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend, ChartData } from 'chart.js';
  
  Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend);
  
  export default {
    name: 'BarChart03',
    props: {
      data: {
        type: Object as () => ChartData<'bar'>, // Ensure data is typed as 'bar' chart data
        required: true,
      },
      width: {
        type: Number,
        required: true,
      },
      height: {
        type: Number,
        required: true,
      },
    },
    setup(props) {
      const canvas = ref<HTMLCanvasElement | null>(null); // Ref for canvas element
      let chart: Chart | null = null;
  
      const initializeChart = () => {
        if (!canvas.value) {
          console.error("Canvas is not available!");
          return;
        }
        if (chart) {
          chart.destroy();
        }
  
        const ctx = canvas.value.getContext('2d');
        if (ctx) {
          chart = new Chart(ctx, {
            type: 'bar',
            data: props.data, 
            options: {
              indexAxis: 'y', 
              responsive: true,
              scales: {
                x: {
                  stacked: true, 
                  max: 100, 
                  ticks: {
                    stepSize: 20,
                  },
                },
                y: {
                  stacked: true, 
                  ticks: {
                    font: {
                      size: 12, 
                    },
                  },
                },
              },
              plugins: {
                legend: {
                  display: true,
                  position: 'bottom', 
                },
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.raw}%`, 
                  },
                },
              },
              maintainAspectRatio: false, 
            },
          });
        } else {
          console.error("Failed to get canvas context!");
        }
      };
  
      watch(
        () => props.data,
        (newData) => {
          if (newData) {
            initializeChart();
          }
        },
        { deep: true } 
      );
  
      onMounted(() => {
        if (props.data) {
          initializeChart();
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
  