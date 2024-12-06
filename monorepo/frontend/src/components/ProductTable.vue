<template>
    <div class="col-span-full xl:col-span-12 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header class="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 class="font-semibold text-gray-800 dark:text-gray-100">Liste des Produits</h2>
      </header>
      <div class="p-3">
        <div class="overflow-x-auto">
          <table class="table-auto w-full dark:text-gray-300">
            <thead class="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50">
              <tr>
                <th class="p-2">
                  <div class="font-semibold text-left">Nom du Produit</div>
                </th>
                <th class="p-2">
                  <div class="font-semibold text-center">Catégorie</div>
                </th>
                <th class="p-2">
                  <div class="font-semibold text-center">Prix</div>
                </th>
                <th class="p-2">
                  <div class="font-semibold text-center">ID Produit</div>
                </th>
              </tr>
            </thead>
            <tbody class="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700/60">
              <tr v-for="(product, index) in paginatedProducts" :key="index">
                <td class="p-2">
                  <div class="flex items-center text-gray-800 dark:text-gray-100">
                    {{ product.ProductName || 'N/A' }}
                  </div>
                </td>
                <td class="p-2">
                  <div class="text-center text-violet-500 hover:text-violet-600 dark:hover:text-violet-400">{{ product.Category || 'N/A' }}</div>
                </td>
                <td class="p-2">
                  <div class="text-center text-green-500">{{ formatCurrency(product.Price) }}</div>
                </td>
                <td class="p-2">
                  <div class="text-center">{{ product.ProductID }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <div class="flex justify-between items-center mt-4">
          <button
            :disabled="currentPage === 1"
            @click="previousPage"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            Précédent
          </button>
          <span class="text-gray-700 dark:text-gray-300">Page {{ currentPage }} sur {{ totalPages }}</span>
          <button
            :disabled="currentPage === totalPages"
            @click="nextPage"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, computed, onMounted } from 'vue';
  import { getAllProducts, Product } from '@/services/analyticsService';
  
  export default defineComponent({
    name:'ProductTable',
    props: {},
    setup() {
      const products =ref<Product[]>([]);
      const currentPage =ref(1);
      const itemsPerPage =8;
  
      const fetchProducts =async () => {
        try {
          const response =await getAllProducts();
          products.value = response;
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      };
  
      const paginatedProducts =computed(() => {
        const start= (currentPage.value - 1) * itemsPerPage;
        const end= start + itemsPerPage;
        return products.value.slice(start,end);
      });
  
      const totalPages =computed(() => Math.ceil(products.value.length / itemsPerPage));
  
      const nextPage = () => {
        if (currentPage.value <totalPages.value) {
          currentPage.value++;
        }
      };
  
      const previousPage = () => {
        if (currentPage.value > 1) {
          currentPage.value--;
        }
      };
  
      const formatCurrency =(value: number): string => {
        return new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'EUR',
          maximumFractionDigits: 2,
        }).format(value);
      };
  
      onMounted(fetchProducts);
  
      return {
        products,
        paginatedProducts,
        formatCurrency,
        currentPage,
        totalPages,
        nextPage,
        previousPage,
      };
    },
  });
  </script>
  
  <style scoped>
  table {
    border-collapse: collapse;
  }
  
  th,
  td {
    text-align: left;
  }
  
  th {
    padding: 12px;
  }
  
  td {
    padding: 8px;
  }
  </style>
  