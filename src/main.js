import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router'; // Note: Vamos criar este arquivo no Módulo 2

// 1. Importa o Bootstrap (CSS base)
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'

// 2. Importa o nosso tema customizado (Variáveis Instagram)
// Certifique-se que o arquivo existe em: src/assets/styles/theme.css
import './assets/styles/theme.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');