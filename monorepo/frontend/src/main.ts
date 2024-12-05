import './assets/main.css'; 
import './css/style.css'; 
import 'flatpickr/dist/flatpickr.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);

// Use the router
app.use(router);

app.mount('#app');
