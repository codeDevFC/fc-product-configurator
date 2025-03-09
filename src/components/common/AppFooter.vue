
<!-- src/components/common/AppFooter.vue -->
<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-brand">
          <img 
            v-if="logoSrc" 
            :src="logoSrc" 
            :alt="logoAlt || brandName" 
            class="footer-logo"
            @error="handleLogoError"
          />
          <h3 class="footer-title">{{ brandName }}</h3>
          <p class="footer-description">{{ description }}</p>
        </div>
        
        <div class="footer-links">
          <div class="links-section">
            <h4 class="section-title">Quick Links</h4>
            <ul class="link-list">
              <li v-for="link in quickLinks" :key="link.path">
                <router-link :to="link.path">{{ link.label }}</router-link>
              </li>
            </ul>
          </div>
          
          <div class="links-section">
            <h4 class="section-title">Contact</h4>
            <ul class="contact-list">
              <li v-if="email">
                <i class="fas fa-envelope"></i>
                <a :href="`mailto:${email}`">{{ email }}</a>
              </li>
              <li v-if="phone">
                <i class="fas fa-phone"></i>
                <a :href="`tel:${phone}`">{{ phone }}</a>
              </li>
              <li v-if="address">
                <i class="fas fa-map-marker-alt"></i>
                <span>{{ address }}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="footer-social">
          <h4 class="section-title">Follow Us</h4>
          <div class="social-links">
            <a 
              v-for="social in socialLinks" 
              :key="social.name"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              :aria-label="social.name"
            >
              <i :class="social.icon"></i>
            </a>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p class="copyright">
          &copy; {{ currentYear }} {{ brandName }}. All rights reserved.
        </p>
        <div class="bottom-links">
          <a 
            v-for="link in legalLinks" 
            :key="link.label"
            :href="link.url"
            class="legal-link"
          >
            {{ link.label }}
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'AppFooter',
  props: {
    brandName: {
      type: String,
      default: 'FC Product Configurator'
    },
    logoSrc: {
      type: String,
      default: '/favicon.ico'
    },
    logoAlt: {
      type: String,
      default: 'FC Logo'
    },
    description: {
      type: String,
      default: 'Create your perfect product with our easy-to-use configurator. Choose colors, materials, and features to match your style and needs.'
    },
    quickLinks: {
      type: Array,
      default: () => [
        { path: '/', label: 'Home' },
        { path: '/configurator', label: 'Configure' }
      ]
    },
    email: {
      type: String,
      default: 'felixcobby@gmail.com'
    },
    phone: {
      type: String,
      default: '+447907666278'
    },
    address: {
      type: String,
      default: 'Stockholm, Sweden'
    },
    socialLinks: {
      type: Array,
      default: () => [
        { name: 'GitHub', icon: 'fab fa-github', url: 'https://github.com' },
        { name: 'LinkedIn', icon: 'fab fa-linkedin', url: 'https://linkedin.com' },
        { name: 'Twitter', icon: 'fab fa-twitter', url: 'https://twitter.com' }
      ]
    },
    legalLinks: {
      type: Array,
      default: () => [
        { label: 'Privacy Policy', url: '#' },
        { label: 'Terms of Service', url: '#' }
      ]
    }
  },
  setup() {
    // Get current year for copyright
    const currentYear = computed(() => new Date().getFullYear())
    
    // Handle logo loading error
    const handleLogoError = (event) => {
      // Use a text fallback instead of the image
      event.target.style.display = 'none'
    }
    
    return {
      currentYear,
      handleLogoError
    }
  }
}
</script>

<style scoped>
.app-footer {
  background-color: #f8f9fa;
  color: var(--text-color);
  padding: 60px 0 20px;
  margin-top: 60px;
  border-top: 1px solid #e0e0e0;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  margin-bottom: 40px;
}

@media (min-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 992px) {
  .footer-content {
    grid-template-columns: 2fr 2fr 1fr;
  }
}

.footer-brand {
  display: flex;
  flex-direction: column;
}

.footer-logo {
  height: 40px;
  width: auto;
  margin-bottom: 15px;
}

.footer-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 15px;
  color: var(--primary-color);
}

.footer-description {
  color: var(--text-light);
  line-height: 1.6;
  margin: 0;
  font-size: 14px;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 30px;
}

.section-title {
  color: var(--text-color);
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 20px 0;
}

.link-list, .contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.link-list li, .contact-list li {
  margin-bottom: 10px;
}

.link-list a, .contact-list a {
  color: var(--text-light);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.link-list a:hover, .contact-list a:hover {
  color: var(--primary-color);
}

.contact-list li {
  display: flex;
  align-items: flex-start;
}

.contact-list i {
  width: 20px;
  margin-right: 10px;
  color: var(--primary-color);
}

.contact-list span {
  color: var(--text-light);
  font-size: 14px;
}

.social-links {
  display: flex;
  gap: 15px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #f0f0f0;
  color: var(--text-light);
  transition: all 0.2s ease;
}

.social-link:hover {
  background-color: var(--primary-color);
  color: white;
}

.footer-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
  text-align: center;
}

@media (min-width: 768px) {
  .footer-bottom {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
}

.copyright {
  font-size: 14px;
  color: var(--text-light);
  margin-bottom: 10px;
}

@media (min-width: 768px) {
  .copyright {
    margin-bottom: 0;
  }
}

.bottom-links {
  display: flex;
  gap: 20px;
}

.legal-link {
  font-size: 14px;
  color: var(--text-light);
  text-decoration: none;
  transition: color 0.2s ease;
}

.legal-link:hover {
  color: var(--primary-color);
}
</style>
