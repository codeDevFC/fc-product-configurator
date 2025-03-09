
<!-- src/components/configurator/ColorSelector.vue -->
<template>
  <div class="color-selector">
    <h3 class="selector-title">{{ title || 'Choose a Color' }}</h3>
    
    <ErrorBoundary>
      <div v-if="loading" class="loading-container">
        <div class="selector-loader"></div>
        <p>Loading color options...</p>
      </div>
      
      <div v-else-if="errorMessage" class="error-container">
        <p>{{ errorMessage }}</p>
        <BaseButton @click="retryLoading" variant="outline" size="small">
          Retry
        </BaseButton>
      </div>
      
      <div v-else-if="!colors.length" class="empty-container">
        <p>No color options available for this product.</p>
      </div>
      
      <BaseSelector
        v-else
        v-model="selectedColorId"
        :options="colors"
        variant="radio"
        layout="grid"
        @select="onColorSelect"
      />
    </ErrorBoundary>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import BaseSelector from '@/components/ui/BaseSelector.vue'
import ErrorBoundary from '@/components/common/ErrorBoundary.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

export default {
  name: 'ColorSelector',
  components: {
    BaseSelector,
    ErrorBoundary,
    BaseButton
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  setup() {
    const store = useStore()
    const loading = ref(false)
    const errorMessage = ref('')
    const selectedColorId = ref('')
    
    // Get selected product from store
    const selectedProduct = computed(() => store.state.configuration.selectedProduct)
    
    // Get colors from selected product
    const colors = computed(() => {
      if (!selectedProduct.value || !selectedProduct.value.options) {
        return []
      }
      
      return selectedProduct.value.options.colors || []
    })
    
    // Get selected color from store
    const selectedColor = computed(() => store.state.configuration.configuration.color)
    
    // Handle color selection
    const onColorSelect = (color) => {
      try {
        store.dispatch('configuration/selectColor', color)
      } catch (error) {
        console.error('Error selecting color:', error)
        errorMessage.value = 'Failed to select color. Please try again.'
      }
    }
    
    // Reset error and try loading again
    const retryLoading = () => {
      errorMessage.value = ''
      // No actual loading needed here since colors come from the product
    }
    
    // Watch for changes in selected color from store
    watch(selectedColor, (newColor) => {
      if (newColor) {
        selectedColorId.value = newColor.id
      } else {
        selectedColorId.value = ''
      }
    }, { immediate: true })
    
    // Initialize with first color if none selected
    onMounted(() => {
      if (colors.value.length > 0 && !selectedColor.value) {
        onColorSelect(colors.value[0])
      }
    })
    
    return {
      loading,
      errorMessage,
      colors,
      selectedColorId,
      onColorSelect,
      retryLoading
    }
  }
}
</script>

<style scoped>
.color-selector {
  margin-bottom: 30px;
}

.selector-title {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
}

.loading-container, .error-container, .empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
  text-align: center;
}

.selector-loader {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(74, 108, 247, 0.2);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

.error-container {
  background-color: #ffebee;
  color: var(--error-color);
}

.error-container p {
  margin-bottom: 15px;
}

.empty-container {
  color: var(--text-light);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
