import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '../supabase.js'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Welcome from '../views/Welcome.vue'
import MemberManagement from '../views/MemberManagement.vue'
import ClassBooking from '../views/ClassBooking.vue'
import ScheduleManagement from '../views/ScheduleManagement.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: Welcome,
    meta: { requiresAuth: true }
  },
  {
    path: '/members',
    name: 'MemberManagement',
    component: MemberManagement,
    meta: { requiresAuth: true }
  },
  {
    path: '/classes',
    name: 'ClassBooking',
    component: ClassBooking,
    meta: { requiresAuth: true }
  },
  {
    path: '/schedules',
    name: 'ScheduleManagement',
    component: ScheduleManagement,
    meta: { requiresAuth: true }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('../views/Reports.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 导航守卫
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = authService.isAuthenticated()

  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/welcome')
  } else {
    next()
  }
})

export default router
