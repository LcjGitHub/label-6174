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
      path: '/guide',
      name: 'guide',
      component: () => import('@/views/BirdGuide.vue'),
      meta: { title: '鸟种图鉴' },
    },
  ],
})

router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  document.title = title ? `${title} - 观鸟目击记录` : '观鸟目击记录'
})

export default router
