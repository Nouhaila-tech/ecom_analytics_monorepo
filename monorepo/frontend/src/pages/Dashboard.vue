<template>
    <div class="flex h-screen overflow-hidden">
      <div class="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        <main class="grow">

          <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <h1 class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold mb-5">Outil Simplifié d'Analyse des Paniers d'Achat:</h1>


                <div class="sm:flex sm:justify-between sm:items-center mb-8">

                

                  <div class="grid grid-cols-12 gap-6">
                      <TrendingProducts />

                      <SalesSummary/>
                    

                    <CategorySalesTable/>

                    <DashboardCardCategories/>
                    <ProductTable/>

                    <DashboardCardProducts />

                  </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  
          




</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import TrendingProducts from '../components/TrendingProducts.vue'; 
import SalesSummary from '@/components/SalesSummary.vue';
import CategorySalesTable from '@/components/CategorySalesTable.vue';
import SalesByCategory from '@/components/SalesByCategory.vue';
import DashboardCardCategories from '@/components/DashboardCard.vue';
import ProductTable from '@/components/ProductTable.vue'
import Datepicker from '../charts/Datepicker.vue'; 
import type { ChartData, ChartDataset } from 'chart.js'; 
import { getTotalSalesAndMonthlyData } from '@/services/analyticsService'; 
import DashboardCardProducts from '@/components/DashboardCardProducts.vue';


export default defineComponent({
  name: 'Dashboard',
  components: {
    TrendingProducts,
    SalesSummary,
    CategorySalesTable,
    DashboardCardCategories,
    ProductTable,
    Datepicker,
    DashboardCardProducts
  },
  props: {},

  setup() {
    const totalSales = ref(0);
    
    // Ensure correct typing for the chart data
    const monthlySalesData = ref<ChartData<'line'> | null>(null);  // Make sure it's typed correctly
    
    // Fetch sales data when component is mounted
    onMounted(async () => {
      await fetchSalesData();  // Fetch initial data when component mounts
    });

    // Handle date change
    const handleDateChange = (dates: [Date, Date]) => {
      if (dates[0] && dates[1]) {
        const formattedStartDate = dates[0].toISOString().split('T')[0]; // Convert date to 'YYYY-MM-DD'
        const formattedEndDate = dates[1].toISOString().split('T')[0];
        fetchSalesData(formattedStartDate, formattedEndDate); // Fetch data based on the date range
      }
    };

    // Fetch total sales and monthly sales data based on the selected date range
    const fetchSalesData = async (startDate: string = '', endDate: string = '') => {
      try {
        const data = await getTotalSalesAndMonthlyData(startDate, endDate); // Fetch sales data
        totalSales.value = data.totalSales;

        // Prepare data for the line chart
        monthlySalesData.value = {
          labels: data.monthlySales.map((sale: { month: number }) => `Month ${sale.month}`),
          datasets: [
            {
              label: 'Monthly Sales',
              data: data.monthlySales.map((sale: { totalSales: number }) => sale.totalSales),
              fill: false,  // Don't fill the area under the line
              backgroundColor: 'rgba(66, 153, 225, 0.6)', // Line color
              borderColor: 'rgba(66, 153, 225, 1)', // Line color
              borderWidth: 2,
              pointRadius: 3,  // Optional: show data points
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

