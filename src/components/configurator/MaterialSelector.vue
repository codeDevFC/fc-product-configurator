
<!-- src/components/configurator/MaterialSelector.vue -->
<template>
  <div class="material-selector">
    <h3 class="selector-title">{{ title || 'Choose a Material' }}</h3>
    
    <ErrorBoundary>
      <div v-if="loading" class="loading-container">
        <div class="selector-loader"></div>
        <p>Loading material options...</p>
      </div>
      
      <div v-else-if="errorMessage" class="error-container">
        <p>{{ errorMessage }}</p>
        <BaseButton @click="retryLoading" variant="outline" size="small">
          Retry
        </BaseButton>
      </div>
      
      <div v-else-if="!materials.length" class="empty-container">
        <p>No material options available for this product.</p>
      </div>
      
      <BaseSelector
        v-else
        v-model="selectedMaterialId"
        :options="materialsWithDescriptions"
        variant="radio"
        layout="list"
        @select="onMaterialSelect"
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
  name: 'MaterialSelector',
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
    const selectedMaterialId = ref('')
    
    // Get selected product from store
    const selectedProduct = computed(() => store.state.configuration.selectedProduct)
    
    // Get materials from selected product
    const materials = computed(() => {
      if (!selectedProduct.value || !selectedProduct.value.options) {
        return []
      }
      
      return selectedProduct.value.options.materials || []
    })
    
    // Add descriptions to materials
    const materialsWithDescriptions = computed(() => {
      return materials.value.map(material => ({
        ...material,
        description: getMaterialDescription(material.id)
      }))
    })
    
    // Get selected material from store
    const selectedMaterial = computed(() => store.state.configuration.configuration.material)
    
    // Handle material selection
    const onMaterialSelect = (material) => {
      try {
        store.dispatch('configuration/selectMaterial', material)
      } catch (error) {
        console.error('Error selecting material:', error)
        errorMessage.value = 'Failed to select material. Please try again.'
      }
    }
    
    // Reset error and try loading again
    const retryLoading = () => {
      errorMessage.value = ''
      // No actual loading needed here since materials come from the product
    }
    
    // Get description for material
    const getMaterialDescription = (id) => {
      const descriptions = {
        // Clothing materials
        'cotton': 'Soft and breathable cotton fabric for everyday comfort.',
        'organic': 'Eco-friendly organic cotton grown without harmful chemicals.',
        'premium': 'Luxurious premium blend for exceptional comfort and durability.',
        
        // Suit materials
        'polyester': 'Durable polyester blend that resists wrinkles and maintains shape.',
        'wool': 'Classic wool fabric that offers warmth and a refined appearance.',
        'cashmere': 'Ultra-soft cashmere blend for the ultimate in luxury and comfort.',
        
        // Shoe materials
        'synthetic': 'Durable synthetic leather that's easy to clean and maintain.',
        'genuine': 'Real leather with natural grain and excellent durability.',
        'fullgrain': 'Premium full-grain leather that develops a beautiful patina over time.'
      }
      
      return descriptions[id] || 'High-quality material for your product.'
    }
    
    // Watch for changes in selected material from store
    watch(selectedMaterial, (newMaterial) => {
      if (newMaterial) {
        selectedMaterialId.value = newMaterial.id
      } else {
        selectedMaterialId.value = ''
      }
    }, { immediate: true })
    
    // Initialize with first material if none selected
    onMounted(() => {
      if (materials.value.length > 0 && !selectedMaterial.value) {
        onMaterialSelect(materials.value[0])
      }
    })
    
    return {
      loading,
      errorMessage,
      materials,
      materialsWithDescriptions,
      selectedMaterialId,
      onMaterialSelect,
      retryLoading
    }
  }
}
</script>

<style scoped>
.material-selector {
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
