import { createRouter, createWebHistory } from 'vue-router'
import DailyHomeView from './views/DailyHomeView.vue'
import AdminDashboard from './components/AdminDashboard.vue'
import AdminLogin from './components/AdminLogin.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DailyHomeView  
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminDashboard,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: AdminLogin
    }
  ]
})

// Navigation guard pour protéger la route admin
router.beforeEach((to, _, next) => {
  if (to.meta.requiresAuth) {
    const isAuthenticated = localStorage.getItem('admin-authenticated') === 'true'
    if (isAuthenticated) {
      next()
    } else {
      next('/admin/login')
    }
  } else {
    next()
  }
})

export default router 