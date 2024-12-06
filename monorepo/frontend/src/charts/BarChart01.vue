<template>
  <div class="grow flex flex-col justify-center">
    <canvas ref="canvas" :width="width" :height="height"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import {
  Chart,
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend);

// Define an array of colors
const barColors = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
  '#FF9F40', '#E57373', '#64B5F6', '#81C784', '#FFD54F',
  '#BA68C8', '#7986CB', '#FF8A65', '#D4E157', '#AED581',
];

export default {
  name: 'BarChart01',
  props: {
    data: {
      type: Object,
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
    const canvas = ref(null);
    let chart = null;

    onMounted(() => {
      if (canvas.value) {
        // Dynamically add colors to the dataset
        props.data.datasets.forEach((dataset, index) => {
          dataset.backgroundColor = dataset.data.map((_, i) => barColors[i % barColors.length]);
          dataset.hoverBackgroundColor = dataset.data.map((_, i) => barColors[(i + 1) % barColors.length]);
        });

        chart = new Chart(canvas.value.getContext('2d'), {
          type: 'bar',
          data: props.data,
          options: {
            responsive: true,
            indexAxis: 'y', // Horizontal bars
            scales: {
              y: {
                beginAtZero: true,
                max: 100, // Set the maximum value for percentage
                title: {
                  display: true,
                  text: 'Percentage (%)',
                },
                ticks: {
                  stepSize: 50, // Adjust step size for better readability
                },
              },
              x: {
                title: {
                  display: true,
                  text: 'Products',
                },
                ticks: {
                  font: {
                    size: 12, // Adjust font size for better visibility
                  },
                },
              },
            },
            plugins: {
              legend: {
                display: false, // Hide legend
              },
              tooltip: {
                callbacks: {
                  label: (context) => `${context.raw}%`,
                },
              },
            },
            barThickness: 10, // Adjust bar thickness
            maintainAspectRatio: false,
          },
        });
      } else {
        console.error('Canvas is not available.');
      }
    });

    onUnmounted(() => {
      if (chart) chart.destroy();
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
