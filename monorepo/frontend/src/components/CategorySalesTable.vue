<template>
    <div class="col-span-full xl:col-span-8 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header class="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 class="font-semibold text-gray-800 dark:text-gray-100">Répartition des ventes par catégorie</h2>
      </header>
      <div class="p-3">
        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="table-auto w-full dark:text-gray-300">
            <!-- Table header -->
            <thead class="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50">
              <tr>
                <th class="p-2">
                  <div class="font-semibold text-left">Catégorie</div>
                </th>
                <th class="p-2">
                  <div class="font-semibold text-center">Ventes Totales</div>
                </th>
                <th class="p-2">
                  <div class="font-semibold text-center">Quantité Totale</div>
                </th>
                <th class="p-2">
                  <div class="font-semibold text-center">Pourcentage des Ventes</div>
                </th>
              </tr>
            </thead>
            <!-- Table body -->
            <tbody class="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700/60">
              <tr v-for="(category, index) in categorySales" :key="index">
                <td class="p-2">
                  <div class="flex items-center text-gray-800 dark:text-gray-100">
                    {{ category.category }}
                  </div>
                </td>
                <td class="p-2">
                  <div class="text-center text-green-500">{{ formatCurrency(category.totalSales) }}</div>
                </td>
                <td class="p-2">
                  <div class="text-center">{{ category.totalQuantity }}</div>
                </td>
                <td class="p-2">
                  <div class="text-center  text-sky-500">{{ category.percentage }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import axios from 'axios';
  
  interface CategorySales {
    category:string;
    totalSales:number;
    totalQuantity: number;
    percentage:string;
  }
  
  export default defineComponent({
    name:'CategorySalesTable',
    setup() {
      const categorySales = ref<CategorySales[]>([]);
  
      const getCategorySales = async () => {
        try {
          const response =await axios.get('/api/analytics/category_sales');
          console.log('Fetched Category Sales:',response.data);
          categorySales.value =response.data;
        } catch (error) {
          console.error('Error fetching category sales:', error);
        }
      };
  
      const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 2
        }).format(value);
      };
  
      onMounted(async () => {
        await getCategorySales();
      });
  
      return {
        categorySales,
        formatCurrency,
      };
    },
  });
  </script>
  
  <style scoped>
  table {
    border-collapse: collapse;
  }
  
  th, td {
    text-align: left;
  }
  
  th {
    padding: 12px;
  }
  
  td {
    padding: 8px;
  }
  </style>
  