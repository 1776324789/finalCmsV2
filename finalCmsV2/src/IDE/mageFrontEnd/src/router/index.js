import { createRouter, createWebHistory } from 'vue-router';
import ListController from '../views/FunctionPages/ListController/ListController.vue';
import NodeController from '../views/FunctionPages/ListController/view/NodeController.vue';
import DataAnalysis from '../views/FunctionPages/DataAnalysis/DataAnalysis.vue';
import SystemDataAnalysis from '../views/Console/view/SystemDataAnalysis/systemDataAnalysis.vue';
import SystemUserManage from '../views/Console/view/SystemUserManage/SystemUserManage.vue';
import SystemFunctionManage from '../views/Console/view/SystemFunctionManage/SystemFunctionManage.vue';
import SystemRoleManage from '../views/Console/view/SystemRoleManage/SystemRoleManage.vue';
import SystemWebsiteMenuManage from '../views/Console/view/SystemWebsiteMenuManage/SystemWebsiteMenuManage.vue';
import SystemWebsiteManage from '../views/Console/view/SystemWebsiteManage/SystemWebsiteManage.vue';
import FileController from '../views/FunctionPages/FileController/FileController.vue';
import RoleMage from '../views/FunctionPages/RoleController/RoleMage.vue';
import UserMage from '../views/FunctionPages/UserController/UserMage.vue';
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
    },
    {
      path: '/systemUserManage',
      name: 'systemUserManage',
      component: SystemUserManage
    },
    {
      path: '/systemFunctionManage',
      name: 'systemFunctionManage',
      component: SystemFunctionManage
    },
    {
      path: '/systemRoleManage',
      name: 'systemRoleManage',
      component: SystemRoleManage
    },
    {
      path: '/systemWebsiteMenuManage',
      name: 'systemWebsiteMenuManage',
      component: SystemWebsiteMenuManage
    },
    {
      path: '/systemWebsiteManage',
      name: 'systemWebsiteManage',
      component: SystemWebsiteManage
    },
    {
      path: '/userMage',
      name: 'userMage',
      component: UserMage
    },
    {
      path: '/fileMage',
      name: 'fileMage',
      component: FileController
    },
    {
      path: '/roleMage',
      name: 'roleMage',
      component: RoleMage
    }
  ]
});

export default router;