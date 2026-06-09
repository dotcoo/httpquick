import { createWebHashHistory, createRouter } from 'vue-router';

import Login from './views/Login.vue';
import Layout from './views/Layout.vue';
import Page from './views/Page.vue';

const routes = [
  { path: '/', name: 'Home', redirect: { name: 'Page', query: { id: 0 } } },
  { path: '/login', name: 'Login', component: Login, meta: { title: 'Login', login: false } },
  {
    path: '/layout',
    name: 'Layout',
    component: Layout,
    redirect: { name: 'Page', query: { id: 0 } },
    children: [
      { path: '/page', name: 'Page', component: Page, meta: { title: 'Page' } },
    ],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from) => {
  if (to.meta.login === false) { return; }
  if (!localStorage.getItem('token')) { return { name: 'Login', replace: true }; }
});
