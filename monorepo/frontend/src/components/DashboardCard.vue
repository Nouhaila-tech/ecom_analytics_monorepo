<template>
    <div class="flex flex-col col-span-full sm:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header class="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
        <h2 class="font-semibold text-gray-800 dark:text-gray-100">Category Sales Distribution</h2>
      </header>
      <div class="grow">
        <BarChart03 :data="chartData" :width="595" :height="300" />
      </div>
    </div>
  </template>
  
  <script>
  import {ref, onMounted } from 'vue';
  import BarChart03 from '@/charts/BarChart03.vue';
  import { getCategorySales } from '@/services/analyticsService';
  import { tailwindConfig } from '@/utils/Utils';
  
  export default {
    name:'DashboardCardCategories',
    props: {},
    components: { BarChart03 },
    setup() {
      const chartData = ref({
        labels: ['Categories'],
        datasets: [],
      });
  
      const fetchAndFormatData = async () => {
        try {
          const data =await getCategorySales();
          chartData.value =formatChartData(data);
        } catch (error) {
          console.error('Error fetching category sales:', error);
        }
      };
  
      const formatChartData = (data) => {
        const colors = [
            tailwindConfig().theme.colors.violet[500],
            tailwindConfig().theme.colors.sky[500],
            tailwindConfig().theme.colors.green[500],
            tailwindConfig().theme.colors.red[500],
            tailwindConfig().theme.colors.gray[500],
        ];

        return {
            labels: ['Categories'], 
            datasets: data.map((item, index) => ({
            label: item.category, 
            data: [parseFloat(item.percentage)], 
            backgroundColor: colors[index % colors.length],
            })),
        };
        };

  
      onMounted(fetchAndFormatData);
  
      return {chartData };
    },
  };
  </script>
  