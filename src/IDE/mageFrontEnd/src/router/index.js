import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'app',
      component: () => import('../App.vue'),
      children: [],
    }
  ],
  // 添加 scrollBehavior 配置
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' };
    }

    if (to.path !== from.path) {
      // 如果目标路径与来源路径不同，则滚动到顶部
      return { left: 0, top: 0 };
    } else if (savedPosition) {
      // 如果是在同一页面内的导航，则返回保存的位置
      return savedPosition;
    } else {
      // 默认行为：滚动到页面顶部
      return { left: 0, top: 0 };
    }
  }
});

export default router;