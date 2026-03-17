import { createRouter, createWebHistory } from 'vue-router';
import WebController from '../views/FunctionPages/WebController/WebController.vue';
import DataAnalysis from '../views/FunctionPages/DataAnalysis/DataAnalysis.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/webController',
      name: 'webController',
      component: WebController
    },
    {
      path: '/dataAnalysis',
      name: 'dataAnalysis',
      component: DataAnalysis
    }
  ]
});

export default router;