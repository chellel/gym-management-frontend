import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'
import AdminLayout from '@/layout/admin.vue'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Welcome from '@/views/Welcome.vue'

// 简单的认证检查函数（不依赖Supabase）
const isAuthenticated = () => {
  const user = localStorage.getItem('user')
  return !!user
}

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
    path: '/admin',
    name: 'admin',
    component: AdminLayout,
    children: [
      {
        path: 'members',
        name: 'MemberManagement',
        component: () => import('@/views/member/index.vue')
      },
      {
        path: 'classes',
        name: 'ClassBooking',
        component: () => import('@/views/ClassBooking.vue')
      },
      {
        path: 'schedules',
        name: 'ScheduleManagement',
        component: () => import('@/views/ScheduleManagement.vue')
      },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('@/views/Reports.vue')
      }
    ],
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
  const userIsAuthenticated = isAuthenticated()

  if (requiresAuth && !userIsAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && userIsAuthenticated) {
    next('/welcome')
  } else {
    next()
  }
})

export default router
