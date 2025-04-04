import { createApp } from 'vue';
// import { createPinia } from './pinia';
// import { router } from './router';
import { createHttpQuick as createHttpQuickAjax } from './utils/ajax';
// import { createHttpQuick as createHttpQuickFetch } from './utils/fetch';
import App from './App.vue';

// const pinia = createPinia();

createApp(App)
  // .use(pinia)
  // .use(router)
  .use(createHttpQuickAjax(), { globalMethod: true })
  // .use(createHttpQuickFetch(), { globalMethod: true, store, router })
  .mount('#app');
