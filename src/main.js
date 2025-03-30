import { createApp } from 'vue';
// import { createPinia } from './pinia';
// import { router } from './router';
import { createHttpquick as createHttpquickAjax } from './utils/ajax';
// import { createHttpquick as createHttpquickFetch } from './utils/fetch';
import App from './App.vue';

// const pinia = createPinia();

createApp(App)
  // .use(pinia)
  // .use(router)
  .use(createHttpquickAjax(), { globalMethod: true })
  // .use(createHttpquickFetch(), { globalMethod: true, store, router })
  .mount('#app');
