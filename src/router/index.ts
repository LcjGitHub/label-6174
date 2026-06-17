import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/sightings',
    },
    {
      path: '/sightings',
      name: 'sightings',
      component: () => import('@/views/SightingsList.vue'),
      meta: { title: '目击记录' },
    },
    {
      path: '/new',
      name: 'new',
      component: () => import('@/views/NewSighting.vue'),
      meta: { title: '新建记录' },
    },
    {
      path: '/edit/:id',
      name: 'edit',
      component: () => import('@/views/NewSighting.vue'),
      meta: { title: '编辑记录' },
    },
    {
      path: '/bird/:id',
      name: 'bird-detail',
      component: () => import('@/views/BirdDetail.vue'),
      meta: { title: '鸟种详情' },
    },
    {
      path: '/guide',
      name: 'guide',
      component: () => import('@/views/BirdGuide.vue'),
      meta: { title: '鸟种图鉴' },
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import('@/views/Statistics.vue'),
      meta: { title: '统计概览' },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/Settings.vue'),
      meta: { title: '数据备份' },
    },
  ],
})

router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  document.title = title ? `${title} - 观鸟目击记录` : '观鸟目击记录'
})

export default router
