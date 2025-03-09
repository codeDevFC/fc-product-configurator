
<!-- src/components/configurator/FeatureSelector.vue -->
<template>
  <div class="feature-selector">
    <h3 class="selector-title">{{ title || 'Additional Features' }}</h3>
    
    <ErrorBoundary>
      <div v-if="loading" class="loading-container">
        <div class="selector-loader"></div>
        <p>Loading feature options...</p>
      </div>
      
      <div v-else-if="errorMessage" class="error-container">
        <p>{{ errorMessage }}</p>
        <BaseButton @click="retryLoading" variant="outline" size="small">
          Retry
        </BaseButton>
      </div>
      
      <div v-else-if="!features.length" class="empty-container">
        <p>No additional features available for this product.</p>
      </div>
      
      <BaseSelector
        v-else
        v-model="selectedFeatureIds"
        :options="featuresWithDescriptions"
        variant="checkbox"
        layout="list"
        @select="onFeatureToggle"
      />
    </ErrorBoundary>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import BaseSelector from '@/components/ui/BaseSelector.vue'
import ErrorBoundary from '@/components/common/ErrorBoundary.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

export default {
  name: 'FeatureSelector',
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
    const selectedFeatureIds = ref([])
    
    // Get selected product from store
    const selectedProduct = computed(() => store.state.configuration.selectedProduct)
    
    // Get features from selected product
    const features = computed(() => {
      if (!selectedProduct.value || !selectedProduct.value.options) {
        return []
      }
      
      return selectedProduct.value.options.features || []
    })
    
    // Add descriptions to features
    const featuresWithDescriptions = computed(() => {
      return features.value.map(feature => ({
        ...feature,
        description: getFeatureDescription(feature.id)
      }))
    })
    
    // Get selected features from store
    const selectedFeatures = computed(() => {
      const config = store.state.configuration.configuration;
      return Array.isArray(config.features) ? config.features : []
    })
    
    // Handle feature toggle
    const onFeatureToggle = (feature) => {
      try {
        store.dispatch('configuration/toggleFeature', feature)
      } catch (error) {
        console.error('Error toggling feature:', error)
        errorMessage.value = 'Failed to toggle feature. Please try again.'
      }
    }
    
    // Reset error and try loading again
    const retryLoading = () => {
      errorMessage.value = ''
      // No actual loading needed here since features come from the product
    }
    
    // Get description for feature
    const getFeatureDescription = (id) => {
      const descriptions = {
        // T-shirt features
        'pocket': 'Add a convenient chest pocket for a practical and stylish touch.',
        'vneck': 'Classic V-neck style for a more casual and relaxed look.',
        'print': 'Add a custom printed design to make your shirt unique.',
        
        // Suit features
        'slim': 'Modern slim fit design for a contemporary silhouette.',
        'classic': 'Traditional cut with a timeless, refined appearance.',
        'double': 'Sophisticated double-breasted style for a bold statement.',
        'vent': 'Double vent back design for improved movement and comfort.',
        
        // Shoe features
        'laces': 'Traditional lace-up closure for a secure and adjustable fit.',
        'slip': 'Convenient slip-on design for easy on and off.',
        'cushion': 'Extra cushioning in the insole for all-day comfort.',
        'waterproof': 'Water-resistant treatment to keep your feet dry in wet conditions.'
      }
      
      return descriptions[id] || 'Enhance your product with this premium feature.'
    }
    
    // Watch for changes in selected features from store
    watch(selectedFeatures, (newFeatures) => {
      if (Array.isArray(newFeatures)) {
        selectedFeatureIds.value = newFeatures.map(f => f.id)
      } else {
        selectedFeatureIds.value = []
      }
    }, { immediate: true })
    
    return {
      loading,
      errorMessage,
      features,
      featuresWithDescriptions,
      selectedFeatureIds,
      onFeatureToggle,
      retryLoading
    }
  }
}
</script>

<style scoped>
.feature-selector {
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
