<template>
    <div class="grow flex flex-col justify-center">
      <canvas ref="canvas" :width="width" :height="height"></canvas>
    </div>
  </template>
  
  <script>
  import {ref, onMounted,onUnmounted } from 'vue';
  import { Chart,BarController,BarElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';
  
  Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend);
  
  export default {
    name: 'BarChart03',
    props: ['data','width', 'height'],
    setup(props) {
      const canvas =ref(null); 
      let chart =null;

      onMounted(() => {
        if (canvas.value) {
          chart = new Chart(canvas.value.getContext('2d'), {
            type: 'bar',
            data: props.data,
            options: {
              indexAxis: 'y', 
              responsive:true,
              scales:{
                x: {
                  stacked:true,
                  max: 100, 
                },
                y: {
                  stacked:true,
                },
              },
              plugins:{
                legend:{
                  display:true,
                  position:'bottom',
                },
                tooltip: {
                  callbacks: {
                    label:(context) => `${context.raw}%`,
                  },
                },
              },
              maintainAspectRatio: false,
            },
          });
        } else {
          console.error("Canvas not available!!");
        }
      });
  
      onUnmounted(() =>{
        if(chart) chart.destroy();
      });
  
      return {canvas };
    },
  };
  </script>
  