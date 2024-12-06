<template>
    <div class="flex flex-col col-span-full sm:col-span-12 xl:col-span-12 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header class="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
        <h2 class="font-semibold text-gray-800 dark:text-gray-100">Product Sales Distribution</h2>
      </header>
      <div class="grow">
        <!-- Bar chart for product sales percentage -->
        <BarChart01 :data="chartData" :width="595" :height="260" />
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import BarChart01 from '@/charts/BarChart01.vue'; // Import the BarChart component
  import { getProductSales } from '@/services/analyticsService'; // Fetch product sales data
  
  // Import utilities for colors
  import { tailwindConfig } from '@/utils/Utils';
  
  export default {
    name: 'DashboardCardProducts',
    components: { BarChart01 },
    setup() {
      const chartData = ref({
        labels: [],
        datasets: [],
      });
  
      onMounted(async () => {
        try {
          const productSales = await getProductSales(); // Fetch data from the backend
          chartData.value = formatChartData(productSales);
        } catch (error) {
          console.error('Error fetching product sales data:', error);
        }
      });
  
      const formatChartData = (data) => {
        const colors = [
          tailwindConfig().theme.colors.violet[500],
          tailwindConfig().theme.colors.sky[500],
          tailwindConfig().theme.colors.green[500],
          tailwindConfig().theme.colors.red[500],
          tailwindConfig().theme.colors.gray[500],
        ];
  
        const totalSales = data.reduce((sum, item) => sum + item.totalSales, 0);
  
        return {
          labels: data.map((item) => item.productName),
          datasets: [
            {
              label: 'Percentage of Sales',
              data: data.map((item) => ((item.totalSales / totalSales) * 100).toFixed(2)), // Calculate percentage
              backgroundColor: colors,
              hoverBackgroundColor: colors.map((color) => `${color}cc`), // Slightly lighter on hover
              barPercentage: 0.8,
              categoryPercentage: 0.8,
            },
          ],
        };
      };
  
      return {
        chartData,
      };
    },
  };
  </script>
  