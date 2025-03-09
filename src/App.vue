
<!-- src/App.vue -->
<template>
  <div id="app">
    <ErrorBoundary>
      <AppHeader />
    </ErrorBoundary>
    
    <main class="app-content">
      <ErrorBoundary>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </ErrorBoundary>
      
      <!-- Global error display -->
      <div v-if="error" class="global-error">
        <div class="error-content">
          <h3>Something went wrong</h3>
          <p>{{ error }}</p>
          <button @click="clearError" class="error-dismiss">Dismiss</button>
        </div>
      </div>
    </main>
    
    <ErrorBoundary>
      <AppFooter />
    </ErrorBoundary>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import ErrorBoundary from '@/components/common/ErrorBoundary.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    ErrorBoundary
  },
  setup() {
    const store = useStore()
    
    // Get error from store
    const error = computed(() => store.state.configuration.error)
    
    // Clear error
    const clearError = () => {
      store.commit('configuration/CLEAR_ERROR')
    }
    
    // Hide loading spinner when app is mounted
    const hideLoadingSpinner = () => {
      const loadingEl = document.getElementById('app-loading')
      if (loadingEl) {
        loadingEl.classList.add('fade-out')
        setTimeout(() => {
          loadingEl.style.display = 'none'
        }, 300)
      }
      
      // Hide fallback content
      const fallbackEl = document.getElementById('app-fallback')
      if (fallbackEl) {
        fallbackEl.style.display = 'none'
      }
    }
    
    // Call when component is mounted
    onMounted(() => {
      hideLoadingSpinner()
    })
    
    return {
      error,
      clearError
    }
  }
}
</script>

<style>
:root {
  --primary-color: #4a6cf7;
  --secondary-color: #f5f5f7;
  --text-color: #333;
  --text-light: #666;
  --border-color: #eee;
  --error-color: #e53935;
  --success-color: #4caf50;
  --warning-color: #ff9800;
  --shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: var(--text-color);
  line-height: 1.6;
  background-color: #fff;
}

a {
  text-decoration: none;
  color: inherit;
}

.app-content {
  min-height: calc(100vh - 140px);
  position: relative;
  padding-bottom: 40px;
}

/* Global error display */
.global-error {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 400px;
  background-color: #ffebee;
  border-left: 4px solid var(--error-color);
  border-radius: 4px;
  box-shadow: var(--shadow);
  animation: slide-in 0.3s ease-out;
}

.error-content {
  padding: 15px 20px;
  position: relative;
}

.error-content h3 {
  margin-bottom: 5px;
  color: var(--error-color);
}

.error-dismiss {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 12px;
  padding: 5px;
}

.error-dismiss:hover {
  color: #333;
  text-decoration: underline;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
