import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'
import AdminLayout from '@/layout/admin.vue'
import CoachLayout from '@/layout/coach.vue'
import Login from '@/views/Login/index.vue'

// 认证和角色检查函数
const isAuthenticated = () => {
  const user = localStorage.getItem('user')
  return !!user
}

const getUserRole = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user).role : null
}

const hasRole = (requiredRole) => {
  const userRole = getUserRole()
  return userRole === requiredRole
}

// 根据用户角色获取对应的首页路径
const getHomePathByRole = (userRole) => {
  switch (userRole) {
    case 'admin':
      return '/admin/home'
    case 'coach':
      return '/coach/workbench'
    case 'member':
      return '/member/center'
    default:
      return '/login'
  }
}

// 根据用户角色重定向到对应首页
const redirectToHomeByRole = (next, userRole) => {
  const homePath = getHomePathByRole(userRole)
  next(homePath)
}

const routes = [
  {
    path: '/',
    name: 'Root',
    redirect: (to) => {
      // 根据用户角色重定向到对应的首页
      const userRole = getUserRole()
      return getHomePathByRole(userRole)
    }
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
    component: CoachLayout,
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
  const requiredRole = to.meta.role
  const userIsAuthenticated = isAuthenticated()
  const userRole = getUserRole()

  // 检查是否需要认证
  if (requiresAuth && !userIsAuthenticated) {
    next('/login')
    return
  }
  // 检查角色权限
  if (requiredRole && !hasRole(requiredRole)) {
    // 根据用户角色重定向到合适的页面
    redirectToHomeByRole(next, userRole)
    return
  }
  // 如果已登录用户访问登录页面，重定向到合适的首页
  if (to.path === '/login' && userIsAuthenticated) {
    redirectToHomeByRole(next, userRole)
    return
  }

  next()
})

export default router
