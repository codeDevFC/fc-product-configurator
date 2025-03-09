

<!-- src/components/configurator/ProductPreview.vue -->
<template>
  <div class="product-preview">
    <h3 class="preview-title">{{ title || 'Product Preview' }}</h3>
    
    <div class="preview-container">
      <div v-if="loading" class="preview-loading">
        <div class="preview-loader"></div>
        <p>Loading preview...</p>
      </div>
      
      <div v-else-if="!selectedProduct" class="preview-placeholder">
        <p>Select a product to preview</p>
      </div>
      
      <div v-else class="preview-content">
        <div class="preview-image-container">
          <img 
            v-if="configuration.color && configuration.color.image"
            :src="configuration.color.image" 
            :alt="selectedProduct.name" 
            class="preview-image"
            @error="handleImageError"
          />
          <img 
            v-else
            :src="selectedProduct.image" 
            :alt="selectedProduct.name" 
            class="preview-image"
            @error="handleImageError"
          />
        </div>
        
        <div class="preview-details">
          <h4 class="product-name">{{ selectedProduct.name }}</h4>
          
          <div class="selected-options">
            <div v-if="configuration.color" class="option-badge color-badge">
              <span class="color-swatch" :style="{ backgroundColor: getColorCode(configuration.color.id) }"></span>
              <span>{{ configuration.color.name }}</span>
            </div>
            
            <div v-if="configuration.material" class="option-badge">
              {{ configuration.material.name }}
            </div>
            
            <div 
              v-for="feature in configuration.features" 
              :key="feature.id"
              class="option-badge feature-badge"
            >
              {{ feature.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="price-summary" v-if="selectedProduct">
      <h4 class="summary-title">Price Summary</h4>
      
      <div class="summary-item">
        <span>Base Price:</span>
        <span>{{ formatPrice(selectedProduct.basePrice) }}</span>
      </div>
      
      <div v-if="configuration.color && configuration.color.price > 0" class="summary-item">
        <span>Color ({{ configuration.color.name }}):</span>
        <span>+{{ formatPrice(configuration.color.price) }}</span>
      </div>
      
      <div v-if="configuration.material && configuration.material.price > 0" class="summary-item">
        <span>Material ({{ configuration.material.name }}):</span>
        <span>+{{ formatPrice(configuration.material.price) }}</span>
      </div>
      
      <template v-if="configuration.features && configuration.features.length > 0">
        <div v-for="feature in configuration.features" :key="feature.id" class="summary-item">
          <span>{{ feature.name }}:</span>
          <span>+{{ formatPrice(feature.price) }}</span>
        </div>
      </template>
      
      <div class="summary-total">
        <span>Total:</span>
        <span>{{ formatPrice(configuration.totalPrice) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ProductPreview',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  setup() {
    const store = useStore()
    const loading = ref(false)
    
    // Get data from store
    const selectedProduct = computed(() => store.state.configuration.selectedProduct)
    const configuration = computed(() => store.state.configuration.configuration)
    
    // Format price
    const formatPrice = (price) => {
      if (price === undefined || price === null) return '$0.00'
      
      try {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2
        }).format(price)
      } catch (error) {
        console.error('Error formatting price:', error)
        return `$${price.toFixed(2)}`
      }
    }
    
    // Get color code for swatches
    const getColorCode = (colorId) => {
      const colorMap = {
        'black': '#333333',
        'blue': '#4a6cf7',
        'red': '#e53935',
        'green': '#43a047',
        'yellow': '#fdd835',
        'purple': '#8e24aa',
        'orange': '#fb8c00',
        'white': '#f5f5f7',
        'grey': '#9e9e9e',
        'brown': '#795548',
        'tan': '#d7ccc8',
        'navy': '#303f9f'
      }
      
      return colorMap[colorId] || '#cccccc'
    }
    
    // Handle image error
    const handleImageError = (event) => {
      try {
        // Hide the broken image
        event.target.style.display = 'none'
        
        // Get the container
        const container = event.target.parentNode
        
        // Create a placeholder with product info
        container.style.backgroundColor = '#f0f0f0'
        container.style.display = 'flex'
        container.style.flexDirection = 'column'
        container.style.alignItems = 'center'
        container.style.justifyContent = 'center'
        container.style.padding = '20px'
        
        // Add product name
        const nameEl = document.createElement('div')
        nameEl.textContent = selectedProduct.value?.name || 'Product'
        nameEl.style.fontWeight = 'bold'
        nameEl.style.fontSize = '18px'
        nameEl.style.marginBottom = '10px'
        container.appendChild(nameEl)
        
        // Add color info if available
        if (configuration.value?.color) {
          const colorEl = document.createElement('div')
          colorEl.textContent = `Color: ${configuration.value.color.name}`
          colorEl.style.marginBottom = '10px'
          container.appendChild(colorEl)
          
          // Add color swatch
          const swatchEl = document.createElement('div')
          swatchEl.style.width = '30px'
          swatchEl.style.height = '30px'
          swatchEl.style.borderRadius = '50%'
          swatchEl.style.backgroundColor = getColorCode(configuration.value.color.id)
          swatchEl.style.border = '2px solid #fff'
          swatchEl.style.boxShadow = '0 0 0 1px #ddd'
          container.appendChild(swatchEl)
        }
      } catch (error) {
        console.error('Error handling image error:', error)
      }
    }
    
    return {
      loading,
      selectedProduct,
      configuration,
      formatPrice,
      getColorCode,
      handleImageError
    }
  }
}
</script>

<style scoped>
.product-preview {
  margin-bottom: 30px;
}

.preview-title {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
}

.preview-container {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-loading, .preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--text-light);
}

.preview-loader {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(74, 108, 247, 0.2);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

.preview-content {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.preview-image-container {
  width: 100%;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.preview-details {
  text-align: center;
}

.product-name {
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: 600;
}

.selected-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.option-badge {
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
}

.color-badge {
  background-color: #f5f5f5;
  color: #333;
}


.feature-badge {
  background-color: #e8f5e9;
  color: #388e3c;
}

.color-swatch {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin-right: 6px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.price-summary {
  background-color: #f5f5f7;
  border-radius: 8px;
  padding: 20px;
}

.summary-title {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 600;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e0e0e0;
  font-weight: 600;
  font-size: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (min-width: 768px) {
  .preview-content {
    flex-direction: row;
    align-items: center;
  }
  
  .preview-image-container {
    width: 60%;
    margin-bottom: 0;
    margin-right: 20px;
  }
  
  .preview-details {
    width: 40%;
    text-align: left;
  }
  
  .selected-options {
    justify-content: flex-start;
  }
}
</style>

