

<!-- src/views/HomeView.vue -->
<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Design Your Perfect Product</h1>
          <p class="hero-description">
            Customize clothing, suits, and shoes to match your unique style with our
            interactive product configurator.
          </p>
          <BaseButton 
            @click="startConfiguring" 
            size="large" 
            icon="fas fa-tools"
          >
            Start Configuring
          </BaseButton>
        </div>
        <div class="hero-image">
          <img 
            src="@/assets/images/hero-image.png" 
            alt="Product Configurator"
            @error="handleImageError"
          />
        </div>
      </div>
    </section>
    
    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">How It Works</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-tshirt"></i>
            </div>
            <h3 class="feature-title">Choose Your Product</h3>
            <p class="feature-description">
              Select from our collection of customizable clothing, suits, and shoes.
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-palette"></i>
            </div>
            <h3 class="feature-title">Pick Your Colors</h3>
            <p class="feature-description">
              Customize with a wide range of colors to match your style.
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-layer-group"></i>
            </div>
            <h3 class="feature-title">Select Materials</h3>
            <p class="feature-description">
              Choose from premium materials for comfort and durability.
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-cogs"></i>
            </div>
            <h3 class="feature-title">Add Features</h3>
            <p class="feature-description">
              Enhance your product with additional features and options.
            </p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Products Preview Section -->
    <section class="products-section">
      <div class="container">
        <h2 class="section-title">Featured Products</h2>
        <ErrorBoundary>
          <div v-if="loading" class="loading-container">
            <div class="loader"></div>
            <p>Loading products...</p>
          </div>
          
          <div v-else-if="error" class="error-container">
            <p>{{ error }}</p>
            <BaseButton @click="loadProducts" variant="outline">
              Try Again
            </BaseButton>
          </div>
          
          <div v-else-if="!products.length" class="empty-container">
            <p>No products available at the moment.</p>
          </div>
          
          <div v-else class="products-grid">
            <BaseCard 
              v-for="product in products" 
              :key="product.id"
              :title="product.name"
              :imageSrc="product.image"
              :imageAlt="product.name"
              hoverable
              clickable
              @click="configureProduct(product)"
            >
              <p class="product-description">{{ product.description }}</p>
              <p class="product-price">{{ formatPrice(product.basePrice) }}</p>
              
              <template #footer>
                <BaseButton 
                  @click.stop="configureProduct(product)" 
                  block
                >
                  Configure
                </BaseButton>
              </template>
            </BaseCard>
          </div>
        </ErrorBoundary>
      </div>
    </section>
    
    <!-- Call-to-Action Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Ready to Create Your Custom Product?</h2>
          <p class="cta-description">
            Start designing your perfect product today with our easy-to-use configurator.
          </p>
          <BaseButton 
            @click="startConfiguring" 
            variant="primary" 
            size="large"
          >
            Get Started Now
          </BaseButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseCard from '@/components/ui/BaseCard.vue';
import ErrorBoundary from '@/components/common/ErrorBoundary.vue';
import { products } from '@/data/products';

export default {
  name: 'HomeView',
  components: {
    BaseButton,
    BaseCard,
    ErrorBoundary
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    
    const loading = ref(false);
    const error = ref('');
    const featuredProducts = ref([]);
    
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
    
    // Start configuring
    const startConfiguring = () => {
      try {
        // Reset configuration
        store.dispatch('configuration/resetConfiguration');
        
        // Navigate to configurator
        router.push('/configurator');
      } catch (err) {
        console.error('Error starting configuration:', err);
        error.value = 'Failed to start configuration. Please try again.';
      }
    };
    
    // Configure specific product
    const configureProduct = (product) => {
      try {
        // Reset configuration
        store.dispatch('configuration/resetConfiguration');
        
        // Select product
        store.dispatch('configuration/selectProduct', product);
        
        // Navigate to configurator
        router.push('/configurator');
      } catch (err) {
        console.error('Error configuring product:', err);
        error.value = 'Failed to configure product. Please try again.';
      }
    };
    
    // Handle image error
    const handleImageError = (event) => {
      try {
        // Replace with a colored placeholder
        event.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22300%22%20viewBox%3D%220%200%20400%20300%22%3E%3Crect%20fill%3D%22%234a6cf7%22%20width%3D%22400%22%20height%3D%22300%22%2F%3E%3Ctext%20fill%3D%22%23ffffff%22%20font-family%3D%22sans-serif%22%20font-size%3D%2230%22%20text-anchor%3D%22middle%22%20x%3D%22200%22%20y%3D%22150%22%3EProduct%20Configurator%3C%2Ftext%3E%3C%2Fsvg%3E';
      } catch (err) {
        console.error('Error handling image error:', err);
      }
    };
    
    // Load products
    const loadProducts = async () => {
      try {
        loading.value = true;
        error.value = '';
        
        // In a real app, this would be an API call
        // For this demo, we'll use the sample data with a delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get a subset of products to display
        featuredProducts.value = products.slice(0, 3);
      } catch (err) {
        console.error('Error loading products:', err);
        error.value = 'Failed to load products. Please try again.';
      } finally {
        loading.value = false;
      }
    };
    
    // Load products on component mount
    onMounted(() => {
      loadProducts();
    });
    
    return {
      loading,
      error,
      products: featuredProducts,
      formatPrice,
      startConfiguring,
      configureProduct,
      handleImageError,
      loadProducts
    };
  }
}
</script>

<style scoped>
.home-view {
  padding-bottom: 40px;
}

/* Hero Section */
.hero-section {
  padding: 60px 0;
  background-color: #f8f9fa;
  margin-bottom: 60px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--text-color);
}

.hero-description {
  font-size: 18px;
  color: var(--text-light);
  margin-bottom: 30px;
}

.hero-image {
  max-width: 600px;
  margin: 40px auto 0;
}

.hero-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: var(--shadow);
}

/* Features Section */
.features-section {
  padding: 60px 0;
  margin-bottom: 60px;
}

.section-title {
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 40px;
  color: var(--text-color);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
}

.feature-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  width: 70px;
  height: 70px;
  background-color: rgba(74, 108, 247, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.feature-icon i {
  font-size: 30px;
  color: var(--primary-color);
}

.feature-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 15px;
  color: var(--text-color);
}

.feature-description {
  color: var(--text-light);
  font-size: 15px;
  line-height: 1.6;
}

/* Products Section */
.products-section {
  padding: 60px 0;
  margin-bottom: 60px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
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
  margin-bottom: 20px;
}

.loading-container, .error-container, .empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  text-align: center;
}

.loader {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(74, 108, 247, 0.2);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.error-container {
  color: var(--error-color);
}

.error-container p {
  margin-bottom: 20px;
}

.empty-container {
  color: var(--text-light);
}

/* CTA Section */
.cta-section {
  padding: 80px 0;
  background-color: #f8f9fa;
  text-align: center;
}

.cta-content {
  max-width: 700px;
  margin: 0 auto;
}

.cta-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--text-color);
}

.cta-description {
  font-size: 18px;
  color: var(--text-light);
  margin-bottom: 30px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive Adjustments */
@media (min-width: 768px) {
  .hero-section {
    padding: 80px 0;
  }
  
  .hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .hero-title {
    font-size: 48px;
  }
}

@media (max-width: 767px) {
  .hero-title {
    font-size: 32px;
  }
  
  .section-title {
    font-size: 28px;
  }
  
  .cta-title {
    font-size: 28px;
  }
}
</style>
