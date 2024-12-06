<template>
    <div class="grow flex flex-col justify-center">
      <canvas ref="canvas" :width="width" :height="height"></canvas>
    </div>
  </template>
  
  <script lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import { Chart, BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend, ChartData } from 'chart.js';
  
  // Register necessary chart components
  Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend);
  
  export default {
    name: 'BarChart03',
    props: {
      data: {
        type: Object as () => ChartData<'bar'>,  // Ensure data is typed as 'bar' chart data
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
      const canvas = ref<HTMLCanvasElement | null>(null);  // Ref for canvas element
      let chart: Chart | null = null;
  
      onMounted(() => {
        if (canvas.value) {
          const ctx = canvas.value.getContext('2d');
          if (ctx) {
            chart = new Chart(ctx, {
              type: 'bar',
              data: props.data,  // Use the data passed as a prop
              options: {
                indexAxis: 'y',  // Make the chart horizontal
                responsive: true,
                scales: {
                  x: {
                    stacked: true,  // Stack bars on the x-axis
                    max: 100,  // You can adjust this value as needed
                  },
                  y: {
                    stacked: true,  // Stack bars on the y-axis
                  },
                },
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom',  // Position of the legend
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.raw}%`,  // Display percentage in tooltips
                    },
                  },
                },
                maintainAspectRatio: false,  // Allow the chart to resize responsively
                resizeDelay: 200,  // Delay for resizing the chart when window changes
              },
            });
          } else {
            console.error("Failed to get canvas context!");
          }
        }
      });
  
      onUnmounted(() => {
        if (chart) {
          chart.destroy();
        }
      });
  
      return {
        canvas,  // Expose canvas ref
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
  
  