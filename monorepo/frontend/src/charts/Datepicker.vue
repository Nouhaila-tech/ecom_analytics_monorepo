<template>
      <flat-pickr class="form-input pl-9 dark:bg-gray-800 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 font-medium w-[15.5rem]" 
      v-model="selectedDates"
    :config="config"
    @on-change="emitDateChange"></flat-pickr>

  
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';

export default {
  name:'Datepicker',
  components: { flatPickr },
  data() {
    return {
      selectedDates: ['2024-01-01', '2024-07-30'], 
      config: {
        mode:'range',
        dateFormat:'Y-m-d', 
      },
    };
  },
  methods: {
    emitDateChange(selectedDates) {
      if (selectedDates.length === 2) {
        this.$emit('dateChange',selectedDates); 
      }
    },
  },
};
</script>
