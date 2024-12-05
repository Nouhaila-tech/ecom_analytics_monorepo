<template>
  <flat-pickr
    class="form-input"
    v-model="selectedDates"
    :config="config"
    @on-change="emitDateChange"
  />
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
