
<template>
  <div class="col-span-full xl:col-span-8 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
    <header class="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
      <h2 class="font-semibold text-gray-800 dark:text-gray-100">Trending Products</h2>
    </header>
    <div class="p-3">
      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="table-auto w-full dark:text-gray-300">
          <!-- Table header -->
          <thead class="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50">
            <tr>
              <th class="p-2">
                <div class="font-semibold text-left">Product Name</div>
              </th>
              <th class="p-2">
                <div class="font-semibold text-center">Quantity Sold</div>
              </th>
              <th class="p-2">
                <div class="font-semibold text-center">Total Sales</div>
              </th>
            </tr>
          </thead>
          <!-- Table body -->
          <tbody class="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700/60">
            <tr v-for="(product, index) in trendingProducts" :key="index">
              <td class="p-2">
                <div class="flex items-center text-gray-800 dark:text-gray-100">
                  {{ product.productName }}
                </div>
              </td>
              <td class="p-2">
                <div class="text-center">{{ product.totalQuantity }}</div>
              </td>
              <td class="p-2">
                <div class="text-center text-green-500">${{ product.totalSales.toFixed(2) }}</div>
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
import { getTrendingProducts } from '@/services/analyticsService';

export interface Product {
  productName: string;
  totalQuantity: number;
  totalSales: number;
}

export default defineComponent({
  name: 'TrendingProducts',
  setup() {
    const trendingProducts = ref<Product[]>([]);

    onMounted(async () => {
      try {
        trendingProducts.value = await getTrendingProducts();
        console.log('Fetched Trending Products:', trendingProducts.value);
      } catch (error) {
        console.error('Error fetching trending products:', error);
      }
    });

    return {
      trendingProducts,
    };
  },
});
</script>
