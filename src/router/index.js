
// src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
import HomeView from '../views/HomeView.vue';


// Import views or use lazy loading
const HomeView = () => import('@/views/HomeView.vue')
const ConfiguratorView = () => import('@/views/ConfiguratorView.vue')
const SummaryView = () => import('@/views/SummaryView.vue')

// Fallback component for route errors
const NotFoundView = {
  template: `
    <div class="not-found">
      <h1>Page Not Found</h1>
      <p>Sorry, the page you are looking for doesn't exist or has been moved.</p>
      <router-link to="/" class="home-link">Go to Home Page</router-link>
    </div>
  `,
  created() {
    console.warn('Route not found:', this.$route.path)
  }
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'FC Product Configurator - Home' }
  },
  {
    path: '/configurator',
    name: 'configurator',
    component: ConfiguratorView,
    meta: { title: 'Design Your Product' }
  },
  {
    path: '/summary',
    name: 'summary',
    component: SummaryView,
    meta: { title: 'Configuration Summary' },
    beforeEnter: (to, from, next) => {
      // Only allow access if a product is selected
      if (!store.state.configuration.selectedProduct) {
        console.warn('Attempted to access summary without selecting a product')
        next({ name: 'configurator' })
      } else {
        next()
      }
    }
  },
  // Catch-all route for 404s
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: { title: 'Page Not Found' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Update page title
router.afterEach((to) => {
  document.title = to.meta.title || 'FC Product Configurator'
})

// Global error handler for navigation
router.onError((error) => {
  console.error('Router error:', error)
  router.push({ name: 'home' })
})

export default router
