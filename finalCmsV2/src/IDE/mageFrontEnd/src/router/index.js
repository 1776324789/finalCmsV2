import { createRouter, createWebHistory } from 'vue-router';
import WebController from '../views/FunctionPages/WebController/WebController.vue';
import DataAnalysis from '../views/FunctionPages/DataAnalysis/DataAnalysis.vue';
import SystemDataAnalysis from '../views/Console/view/systemDataAnalysis.vue';
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
    },
    {
      path: '/systemDataAnalysis',
      name: 'systemDataAnalysis',
      component: SystemDataAnalysis
    }
  ]
});

export default router;