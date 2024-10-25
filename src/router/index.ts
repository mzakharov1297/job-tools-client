import { createRouter, createWebHistory } from 'vue-router'
import type {
  RouteRecordRaw,
  RouteLocationNormalized,
  NavigationGuardNext,
} from 'vue-router'
import { onAuthStateChanged, getAuth } from 'firebase/auth'

const checkAuth = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  let isAuth = false
  next()
  // onAuthStateChanged(getAuth(), user => {
  //   if (user && !isAuth) {
  //     isAuth = true
  //     next()
  //   } else if (!user && !isAuth) {
  //     isAuth = true
  //     next('/')
  //   }
  // })
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/PageHome/PageHome.vue'),
    beforeEnter: checkAuth,
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/views/PageAuth/PageAuth.vue'),
  },
  {
    path: '/interview/:id',
    name: 'Interview',
    component: () => import('@/views/PageInterview/PageInterview.vue'),
    beforeEnter: checkAuth,
  },
  {
    path: '/list',
    name: 'List',
    component: () => import('@/views/PageList/PageList.vue'),
    beforeEnter: checkAuth,
  },
  {
    path: '/statistic',
    name: 'Statistic',
    component: () => import('@/views/PageStatistic.vue'),
    beforeEnter: checkAuth,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
