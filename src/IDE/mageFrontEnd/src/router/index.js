import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'app',
      component: () => import('../App.vue'),
      children: [],
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('@/views/Index/Index.vue'),
      children: [
        {
          path: '/webController',
          name: 'webController',
          component: () => import('@/views/WebController/WebController.vue'),
        }],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      children: [],
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/Home/Home.vue'),
      children: [],
    }
  ]
});

export default router;