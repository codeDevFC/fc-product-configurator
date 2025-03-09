
// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/scss/main.scss'

// Create the app
const app = createApp(App)

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Global error:', err)
  console.error('Component:', vm)
  console.error('Info:', info)
  
  // Don't handle errors from extensions
  if (err.message && (
    err.message.includes('extension') || 
    err.message.includes('webext') ||
    err.message.includes('content-script')
  )) {
    console.warn('Ignoring browser extension error')
    return
  }
  
  // Update store with error
  if (store) {
    store.commit('configuration/SET_ERROR', `An error occurred: ${err.message}`)
  }
  
  // Hide loading spinner if it's still visible
  const loadingEl = document.getElementById('app-loading')
  if (loadingEl) {
    loadingEl.style.display = 'none'
  }
}

// Performance tracking in development
if (process.env.NODE_ENV === 'development') {
  app.config.performance = true
}

// Use plugins
app.use(store)
app.use(router)

// Mount app with error handling
try {
  app.mount('#app')
  console.log('App mounted successfully')
} catch (error) {
  console.error('Failed to mount app:', error)
  // Show fallback UI
  document.getElementById('app-fallback').style.display = 'block'
  document.getElementById('app-loading').style.display = 'none'
}
