
<!-- src/views/ConfiguratorView.vue -->
<template>
  <div class="configurator-view">
    <div class="container">
      <!-- Configurator Header -->
      <div class="configurator-header">
        <h1 class="page-title">Product Configurator</h1>
        
        <!-- Progress Bar -->
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
          </div>
          
          <div class="step-indicators">
            <div 
              v-for="step in steps" 
              :key="step.id"
              :class="[
                'step-indicator',
                { 'active': currentStep >= step.id },
                { 'current': currentStep === step.id },
                { 'clickable': canNavigateToStep(step.id) }
              ]"
              @click="navigateToStep(step.id)"
            >
              <div class="indicator-circle">
                <span v-if="currentStep > step.id" class="check-icon">✓</span>
                <span v-else class="step-number">{{ step.id }}</span>
              </div>
              <span class="step-label">{{ step.label }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Configurator Content -->
      <div class="configurator-content">
        <ErrorBoundary>
          <!-- Step 1: Product Selection -->
          <div v-if="currentStep === 1" class="configurator-step">
            <ConfiguratorStep
              title="Choose Your Product"
              description="Select the product you want to customize"
              :showBackButton="false"
              finalizeButtonText="Next: Choose Color"
            >
              <div class="products-grid">
                <BaseCard 
                  v-for="product in products" 
                  :key="product.id"
                  :title="product.name"
                  :imageSrc="product.image"
                  :imageAlt="product.name"
                  hoverable
                  :selected="isProductSelected(product.id)"
                  @click="selectProduct(product)"
                >
                  <p class="product-description">{{ product.description }}</p>
                  <p class="product-price">{{ formatPrice(product.basePrice) }}</p>
                </BaseCard>
              </div>
            </ConfiguratorStep>
          </div>
          
          <!-- Step 2: Color Selection -->
          <div v-else-if="currentStep === 2" class="configurator-step">
            <ConfiguratorStep
              title="Choose a Color"
              description="Select your preferred color"
              finalizeButtonText="Next: Choose Material"
            >
              <div class="configurator-layout">
                <ColorSelector />
                <ProductPreview />
              </div>
            </ConfiguratorStep>
          </div>
          
          <!-- Step 3: Material Selection -->
          <div v-else-if="currentStep === 3" class="configurator-step">
            <ConfiguratorStep
              title="Choose Material"
              description="Select the material for your product"
              finalizeButtonText="Next: Add Features"
            >
              <div class="configurator-layout">
                <MaterialSelector />
                <ProductPreview />
              </div>
            </ConfiguratorStep>
          </div>
          
          <!-- Step 4: Feature Selection -->
          <div v-else-if="currentStep === 4" class="configurator-step">
            <ConfiguratorStep
              title="Additional Features"
              description="Enhance your product with additional features"
              finalizeButtonText="Review Configuration"
            >
              <div class="configurator-layout">
                <FeatureSelector />
                <ProductPreview />
              </div>
            </ConfiguratorStep>
          </div>
          
          <!-- Fallback for invalid step -->
          <div v-else class="error-container">
            <p>Invalid configuration step. Please try again.</p>
            <BaseButton @click="resetConfiguration">
              Start Over
            </BaseButton>
          </div>
        </ErrorBoundary>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import BaseCard from '@/components/ui/BaseCard.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import ConfiguratorStep from '@/components/configurator/ConfiguratorStep.vue';
import ColorSelector from '@/components/configurator/ColorSelector.vue';
import MaterialSelector from '@/components/configurator/MaterialSelector.vue';
import FeatureSelector from '@/components/configurator/FeatureSelector.vue';
import ProductPreview from '@/components/configurator/ProductPreview.vue';
import ErrorBoundary from '@/components/common/ErrorBoundary.vue';
import { products } from '@/data/products';

export default {
  name: 'ConfiguratorView',
  components: {
    BaseCard,
    BaseButton,
    ConfiguratorStep,
    ColorSelector,
    MaterialSelector,
    FeatureSelector,
    ProductPreview,
    ErrorBoundary
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    
    // Get current step and progress from store
    const currentStep = computed(() => store.state.configuration.currentStep);
    const progress = computed(() => store.getters['configuration/currentStepProgress']);
    
    // Define configuration steps
    const steps = [
      { id: 1, label: 'Product' },
      { id: 2, label: 'Color' },
      { id: 3, label: 'Material' },
      { id: 4, label: 'Features' }
    ];
    
    // Get selected product from store
    const selectedProduct = computed(() => store.state.configuration.selectedProduct);
    
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
    
    // Check if a product is selected
    const isProductSelected = (productId) => {
      return selectedProduct.value && selectedProduct.value.id === productId;
    };
    
    // Select a product
    const selectProduct = (product) => {
      try {
        store.dispatch('configuration/selectProduct', product);
      } catch (err) {
        console.error('Error selecting product:', err);
        store.commit('configuration/SET_ERROR', 'Failed to select product. Please try again.');
      }
    };
    
    // Navigate to a specific step
    const navigateToStep = (stepId) => {
      if (!canNavigateToStep(stepId)) return;
      
      try {
        store.commit('configuration/SET_CURRENT_STEP', stepId);
      } catch (err) {
        console.error('Error navigating to step:', err);
        store.commit('configuration/SET_ERROR', 'Failed to navigate to step. Please try again.');
      }
    };
    
    // Check if we can navigate to a specific step
    const canNavigateToStep = (stepId) => {
      // Can always go back to previous steps
      if (stepId < currentStep.value) return true;
      
      // Can't skip ahead unless all previous steps are complete
      if (stepId > currentStep.value) return false;
      
      // Current step is always accessible
      return true;
    };
    
    // Reset configuration
    const resetConfiguration = () => {
      try {
        store.dispatch('configuration/resetConfiguration');
      } catch (err) {
        console.error('Error resetting configuration:', err);
        store.commit('configuration/SET_ERROR', 'Failed to reset configuration. Please try again.');
      }
    };
    
    // Parse URL parameters for configuration
    const parseUrlParams = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        
        // If we have product param, try to load configuration
        if (params.has('product')) {
          const configData = {
            productId: params.get('product'),
            colorId: params.get('color'),
            materialId: params.get('material')
          };
          
          // Handle features (comma-separated list)
          if (params.has('features')) {
            const features = params.get('features').split(',');
            if (features.length > 0) {
              configData.featureIds = features;
            }
          }
          
          // Load configuration
          store.dispatch('configuration/loadConfiguration', configData);
        }
      } catch (err) {
        console.error('Error parsing URL params:', err);
        // Don't show error to user - just silently fail and start fresh
      }
    };
    
    // Handle route changes
    watch(() => route.query, () => {
      parseUrlParams();
    });
    
    // Parse URL params on component mount
    onMounted(() => {
      parseUrlParams();
    });
    
    return {
      currentStep,
      progress,
      steps,
      products,
      selectedProduct,
      formatPrice,
      isProductSelected,
      selectProduct,
      navigateToStep,
      canNavigateToStep,
      resetConfiguration
    };
  }
}
</script>

<style scoped>
.configurator-view {
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.configurator-header {
  margin-bottom: 40px;
}

.page-title {
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 30px;
  color: var(--text-color);
}

.progress-container {
  max-width: 800px;
  margin: 0 auto;
}

.progress-bar {
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 20px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
}

.step-indicators {
  display: flex;
  justify-content: space-between;
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
}

.step-indicator:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 16px;
  left: 50%;
  width: 100%;
  height: 2px;
  background-color: #e0e0e0;
  z-index: 1;
}

.step-indicator.active:not(:last-child)::after {
  background-color: var(--primary-color);
}

.indicator-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f5f5f7;
  border: 2px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  position: relative;
  z-index: 2;
  transition: all 0.2s ease;
}

.step-number, .check-icon {
  font-size: 14px;
  font-weight: 600;
  color: #757575;
}

.step-label {
  font-size: 14px;
  color: #757575;
  text-align: center;
  max-width: 120px;
}

.step-indicator.active .indicator-circle {
  border-color: var(--primary-color);
  background-color: #fff;
}

.step-indicator.current .indicator-circle {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.step-indicator.current .step-number {
  color: #fff;
}

.step-indicator.active .check-icon {
  color: var(--primary-color);
}

.step-indicator.active .step-label {
  color: var(--text-color);
  font-weight: 500;
}

.step-indicator.clickable {
  cursor: pointer;
}

.step-indicator.clickable:hover .indicator-circle {
  transform: scale(1.1);
}

.configurator-content {
  margin-top: 40px;
}

.configurator-step {
  margin-bottom: 40px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
}

.product-description {
  color: var(--text-light);
  margin-bottom: 10px;
  font-size: 14px;
}

.product-price {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-color);
  margin-top: 10px;
}

.configurator-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
}

.error-container {
  text-align: center;
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin: 40px auto;
  max-width: 600px;
}

.error-container p {
  margin-bottom: 20px;
  color: var(--error-color);
}

@media (min-width: 768px) {
  .configurator-layout {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 576px) {
  .step-label {
    display: none;
  }
  
  .indicator-circle {
    margin-bottom: 0;
  }
}
</style>
