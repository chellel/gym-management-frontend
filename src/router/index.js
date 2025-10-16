import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'
import AdminLayout from '@/layout/admin.vue'
import Home from '@/views/Home.vue'
import Login from '@/views/Login/index.vue'

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
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Login/Registor.vue')
  },
  // 前台会员功能
  {
    path: '/member',
    name: 'MemberFrontend',
    component: Layout,
    children: [
      {
        path: 'checkin',
        name: 'MemberCheckin',
        component: () => import('@/views/Member/Checkin.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'center',
        name: 'MemberCenter',
        component: () => import('@/views/Member/Center.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'booking',
        name: 'MemberBooking',
        component: () => import('@/views/Member/Booking.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'courses',
        name: 'MemberCourses',
        component: () => import('@/views/Member/Courses.vue'),
        meta: { requiresAuth: true }
      }
    ],
    meta: { requiresAuth: true }
  },
  // 后台管理功能
  {
    path: '/admin',
    name: 'admin',
    component: AdminLayout,
    children: [
      {
        path: 'home',
        name: 'AdminHome',
        component: () => import('@/admin/Home/index.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'member',
        name: 'MemberManagement',
        component: () => import('@/admin/member/index.vue')
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
  },
  // 教练工作台
  {
    path: '/coach',
    name: 'coach',
    component: AdminLayout,
    children: [
      {
        path: 'workbench',
        name: 'CoachWorkbench',
        component: () => import('@/views/CoachWorkbench.vue'),
        meta: { requiresAuth: true, role: 'coach' }
      }
    ],
    meta: { requiresAuth: true, role: 'coach' }
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
    next('/admin/home')
  } else {
    next()
  }
})

export default router
