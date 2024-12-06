<template>
  <div class="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
    <!-- Datepicker -->
    <div class="px-5 pt-5 mb-4">
      <p class="text-sm dark:text-gray-100">Séléctionner une période</p>
      <Datepicker @dateChange="handleDateChange" style="align-items: right;"/>
    </div>

    <!-- Total Sales -->
    <div class="px-5 pt-5">
      <header class="flex justify-between items-start mb-2">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Ventes Totales</h2>
      </header>

      <div class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">Ventes</div>
      <div class="flex items-start">
        <div class="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">
          ${{ totalSales.toFixed(2) }}
        </div>
      </div>
    </div>

    <div class="grow max-sm:max-h-[128px] xl:max-h-[128px]">
      <!-- Check if monthlySalesData is loaded before passing it to the chart -->
      <LineChart v-if="monthlySalesData" :data="monthlySalesData" style="width: 398px; height: 128px;" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { getTotalSalesAndMonthlyData } from '@/services/analyticsService'; 
import LineChart from '../charts/LineChart.vue'; 
import Datepicker from '../charts/Datepicker.vue'; 
import type { ChartData } from 'chart.js'; 

export default defineComponent({
  name: 'SalesSummary',
  components: {
    LineChart,  
    Datepicker,
  },
  setup() {
    const totalSales = ref(0);
    const monthlySalesData = ref<ChartData<'line'> | null>(null); // Default value as null initially

    const defaultStartDate = '2024-01-01';
    const defaultEndDate = '2024-07-30';

    onMounted(async () => {
      await fetchSalesData(defaultStartDate, defaultEndDate); // Fetch sales data on mounted
    });

    const handleDateChange = (dates: [Date, Date]) => {
      if (dates[0] && dates[1]) {
        const formattedStartDate = dates[0].toISOString().split('T')[0];
        const formattedEndDate = dates[1].toISOString().split('T')[0];
        fetchSalesData(formattedStartDate, formattedEndDate);
      }
    };

    const fetchSalesData = async (startDate: string, endDate: string) => {
      try {
        const data = await getTotalSalesAndMonthlyData(startDate, endDate);
        totalSales.value = data.totalSales;

        // Construct the monthly sales data
        monthlySalesData.value = {
          labels: data.monthlySales.map((sale: { month: number }) => `Month ${sale.month}`),
          datasets: [
            {
              label: 'Monthly Sales',
              data: data.monthlySales.map((sale: { totalSales: number }) => sale.totalSales),
              fill: false,
              backgroundColor: 'rgba(66, 153, 225, 0.6)',
              borderColor: 'rgba(66, 153, 225, 1)',
              borderWidth: 2,
              pointRadius: 3,
            },
          ],
        };
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    return {
      totalSales,
      monthlySalesData,
      fetchSalesData,
      handleDateChange,
    };
  },
});
</script>

