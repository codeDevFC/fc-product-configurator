
<!-- src/components/common/ErrorBoundary.vue -->
<template>
  <div>
    <slot v-if="!hasError"></slot>
    <div v-else class="error-boundary">
      <h3>Something went wrong</h3>
      <p>{{ error }}</p>
      <button @click="resetError" class="retry-button">Try Again</button>
    </div>
  </div>
</template>

<script>
import { ref, onErrorCaptured } from 'vue'

export default {
  name: 'ErrorBoundary',
  setup() {
    const hasError = ref(false)
    const error = ref(null)
    
    // Reset error state
    const resetError = () => {
      hasError.value = false
      error.value = null
    }
    
    // Capture errors from child components
    onErrorCaptured((err, instance, info) => {
      // Ignore browser extension errors
      if (err.message && (
        err.message.includes('extension') || 
        err.message.includes('webext') ||
        err.message.includes('content-script')
      )) {
        console.warn('Ignoring browser extension error:', err.message)
        return false
      }
      
      // Set error state
      hasError.value = true
      error.value = err.message || 'An unexpected error occurred'
      
      // Log the error
      console.error('Component error captured:', err)
      console.error('Component instance:', instance)
      console.error('Error info:', info)
      
      // Prevent error from propagating
      return false
    })
    
    return {
      hasError,
      error,
      resetError
    }
  }
}
</script>

<style scoped>
.error-boundary {
  padding: 20px;
  margin: 20px 0;
  background-color: #ffebee;
  border-radius: 8px;
  text-align: center;
}

.retry-button {
  margin-top: 15px;
  padding: 8px 16px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.retry-button:hover {
  background-color: #3a5bd9;
}
</style>
