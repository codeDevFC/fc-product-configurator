
<!-- src/views/SummaryView.vue -->
<template>
  <div class="summary-view">
    <div class="container">
      <div class="summary-header">
        <h1 class="page-title">Configuration Summary</h1>
        <p class="page-subtitle">Review your custom product configuration</p>
      </div>
      
      <ErrorBoundary>
        <div v-if="!selectedProduct" class="no-configuration">
          <h2>No Product Selected</h2>
          <p>You haven't configured a product yet.</p>
          <BaseButton @click="goToConfigurator">
            Start Configuring
          </BaseButton>
        </div>
        
        <div v-else class="summary-content">
          <div class="product-showcase">
            <img 
              v-if="configuration.color && configuration.color.image"
              :src="configuration.color.image" 
              :alt="selectedProduct.name" 
              class="product-image"
              @error="handleImageError"
            />
            <img 
              v-else
              :src="selectedProduct.image" 
              :alt="selectedProduct.name" 
              class="product-image"
              @error="handleImageError"
            />
          </div>
          
          <div class="configuration-details">
            <h2 class="product-name">{{ selectedProduct.name }}</h2>
            <p class="product-description">{{ selectedProduct.description }}</p>
            
            <div class="details-section">
              <h3 class="section-title">Configuration Details</h3>
              
              <div v-if="configuration.color" class="detail-item">
                <span class="detail-label">Color:</span>
                <div class="detail-value">
                 <span class="color-swatch" :style="{ backgroundColor: getColorCode(configuration.color.id) }"></span>
                  {{ configuration.color.name }}
                </div>
              </div>
              
              <div v-if="configuration.material" class="detail-item">
                <span class="detail-label">Material:</span>
                <span class="detail-value">{{ configuration.material.name }}</span>
              </div>
              
              <div class="detail-item">
                <span class="detail-label">Features:</span>
                <div class="features-list">
                  <span 
                    v-for="feature in configuration.features" 
                    :key="feature.id" 
                    class="feature-tag"
                  >
                    {{ feature.name }}
                  </span>
                  <span v-if="!configuration.features.length" class="no-features">
                    No additional features
                  </span>
                </div>
              </div>
            </div>
            
            <div class="price-section">
              <h3 class="section-title">Price Summary</h3>
              
              <div class="price-item">
                <span>Base Price:</span>
                <span>{{ formatPrice(selectedProduct.basePrice) }}</span>
              </div>
              
              <div v-if="configuration.color && configuration.color.price > 0" class="price-item">
                <span>Color ({{ configuration.color.name }}):</span>
                <span>+{{ formatPrice(configuration.color.price) }}</span>
              </div>
              
              <div v-if="configuration.material && configuration.material.price > 0" class="price-item">
                <span>Material ({{ configuration.material.name }}):</span>
                <span>+{{ formatPrice(configuration.material.price) }}</span>
              </div>
              
              <template v-if="configuration.features && configuration.features.length > 0">
                <div v-for="feature in configuration.features" :key="feature.id" class="price-item">
                  <span>{{ feature.name }}:</span>
                  <span>+{{ formatPrice(feature.price) }}</span>
                </div>
              </template>
              
              <div class="price-total">
                <span>Total:</span>
                <span>{{ formatPrice(configuration.totalPrice) }}</span>
              </div>
            </div>
            
            <div class="share-section">
              <h3 class="section-title">Share Your Configuration</h3>
              <div class="share-url">
                <input type="text" :value="shareableUrl" readonly ref="shareInput" />
                <BaseButton @click="copyShareUrl" size="small">
                  {{ copyStatus }}
                </BaseButton>
              </div>
            </div>
            
            <div class="action-buttons">
              <BaseButton @click="modifyConfiguration" variant="outline">
                Modify Configuration
              </BaseButton>
              <BaseButton @click="checkout" variant="primary">
                Proceed to Checkout
              </BaseButton>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import BaseButton from '@/components/ui/BaseButton.vue';
import ErrorBoundary from '@/components/common/ErrorBoundary.vue';

export default {
  name: 'SummaryView',
  components: {
    BaseButton,
    ErrorBoundary
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const shareInput = ref(null);
    const copyStatus = ref('Copy');
    
    // Get data from store
    const selectedProduct = computed(() => store.state.configuration.selectedProduct);
    const configuration = computed(() => store.state.configuration.configuration);
    const shareableUrl = computed(() => store.getters['configuration/shareableUrl']);
    
    // Format price with currency
    const formatPrice = (price) => {
      if (price === undefined || price === null) return '$0.00';
      
      try {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2
        }).format(price);
      } catch (err) {
        console.error('Error formatting price:', err);
        return `$${price.toFixed(2)}`;
      }
    };
    
    // Handle logo loading error
    const handleImageError = (event) => {
      event.target.onerror = null;
      event.target.src = '/placeholder.png';
    };
    
    // Generate a color based on option ID
    const getColorCode = (colorId) => {
      const colors = {
        // Colors
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
      };
      
      return colors[colorId] || '#cccccc';
    };
    
    // Copy share URL
    const copyShareUrl = () => {
      try {
        if (shareInput.value) {
          shareInput.value.select();
          document.execCommand('copy');
          copyStatus.value = 'Copied!';
          
          setTimeout(() => {
            copyStatus.value = 'Copy';
          }, 2000);
        }
      } catch (err) {
        console.error('Error copying share URL:', err);
      }
    };
    
    // Navigate to configurator
    const modifyConfiguration = () => {
      try {
        router.push('/configurator');
      } catch (err) {
        console.error('Error navigating to configurator:', err);
      }
    };
    
    // Proceed to checkout
    const checkout = () => {
      try {
        // In a real app, this would redirect to checkout
        alert('Proceeding to checkout... (This would redirect to a checkout page in a real application)');
      } catch (err) {
        console.error('Error proceeding to checkout:', err);
      }
    };
    
    return {
      selectedProduct,
      configuration,
      shareableUrl,
      copyStatus,
      formatPrice,
      getColorCode,
      handleImageError,
      copyShareUrl,
      modifyConfiguration,
      checkout,
      shareInput
    };
  }
}
</script>

<style scoped>
.summary-view {
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.summary-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--text-color);
}

.page-subtitle {
  color: var(--text-light);
}

.summary-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
}

@media (min-width: 768px) {
  .summary-content {
    grid-template-columns: 1fr 1fr;
  }
}

.product-showcase {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.product-image {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
}

.configuration-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-name {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 5px;
  color: var(--text-color);
}

.product-description {
  color: var(--text-light);
  line-height: 1.6;
}

.details-section, .price-section, .share-section {
  background-color: #f5f5f7;
  border-radius: 8px;
  padding: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  color: var(--text-color);
}

.detail-item {
  margin-bottom: 15px;
}

.detail-label {
  font-weight: 600;
  display: block;
  margin-bottom: 5px;
  color: var(--text-color);
}

.detail-value {
  font-size: 14px;
}

.features-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.feature-tag {
  background-color: #e0e7ff;
  color: #4a6cf7;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
}

.no-features {
  color: var(--text-light);
  font-style: italic;
}

.price-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}

.price-total {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #ddd;
  font-weight: 600;
  font-size: 18px;
}

.share-url {
  display: flex;
}

.share-url input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 14px;
}

.copy-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0 15px;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.copy-button:hover {
  background-color: #3a5bd9;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}
</style>

