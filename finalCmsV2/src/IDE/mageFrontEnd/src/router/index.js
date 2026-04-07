import { createRouter, createWebHistory } from 'vue-router';
import ListController from '../views/FunctionPages/ListController/ListController.vue';
import NodeController from '../views/FunctionPages/ListController/view/NodeController.vue';
import DataAnalysis from '../views/FunctionPages/DataAnalysis/DataAnalysis.vue';
import SystemDataAnalysis from '../views/Console/view/systemDataAnalysis.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/listController',
      name: 'listController',
      component: ListController,
    },
    {
      path: '/nodeController',
      name: 'nodeController',
      component: NodeController
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