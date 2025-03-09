
<!-- src/components/ui/BaseCard.vue -->
<template>
  <div 
    :class="[
      'base-card',
      `base-card--${variant}`,
      { 'base-card--hoverable': hoverable },
      { 'base-card--selected': selected },
      { 'base-card--clickable': clickable || $attrs.onClick }
    ]"
    :style="cardStyle"
    @click="handleClick"
  >
    <!-- Header slot -->
    <div v-if="$slots.header || title" class="card-header">
      <slot name="header">
        <h3 v-if="title" class="card-title">{{ title }}</h3>
      </slot>
    </div>
    
    <!-- Image slot -->
    <div v-if="$slots.image || imageSrc" class="card-image">
      <slot name="image">
        <img 
          v-if="imageSrc" 
          :src="imageSrc" 
          :alt="imageAlt" 
          @error="handleImageError"
        />
      </slot>
    </div>
    
    <!-- Content slot -->
    <div class="card-content">
      <slot></slot>
    </div>
    
    <!-- Footer slot -->
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'BaseCard',
  props: {
    variant: {
      type: String,
      default: 'default',
      validator: value => ['default', 'outline', 'flat', 'elevated'].includes(value)
    },
    title: {
      type: String,
      default: ''
    },
    imageSrc: {
      type: String,
      default: ''
    },
    imageAlt: {
      type: String,
      default: 'Card image'
    },
    hoverable: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    },
    clickable: {
      type: Boolean,
      default: false
    },
    width: {
      type: [String, Number],
      default: ''
    },
    height: {
      type: [String, Number],
      default: ''
    },
    fallbackImage: {
      type: String,
      default: ''
    }
  },
  emits: ['click', 'image-error'],
  setup(props, { emit }) {
    // Generate card styles
    const cardStyle = computed(() => {
      const styles = {}
      
      if (props.width) {
        styles.width = typeof props.width === 'number' ? `${props.width}px` : props.width
      }
      
      if (props.height) {
        styles.height = typeof props.height === 'number' ? `${props.height}px` : props.height
      }
      
      return styles
    })
    
    // Handle card click
    const handleClick = (event) => {
      if (props.clickable) {
        emit('click', event)
      }
    }
    
    // Handle image loading error
    const handleImageError = (event) => {
      try {
        // Try to use fallback image if provided
        if (props.fallbackImage) {
          event.target.src = props.fallbackImage
        } else {
          // Otherwise, create a placeholder
          event.target.style.display = 'none'
          
          // Create a placeholder element
          const placeholder = document.createElement('div')
          placeholder.className = 'image-placeholder'
          placeholder.textContent = props.imageAlt || 'Image not available'
          
          // Insert the placeholder
          event.target.parentNode.appendChild(placeholder)
        }
        
        // Emit the error event
        emit('image-error', event)
      } catch (error) {
        console.error('Error handling image fallback:', error)
      }
    }
    
    return {
      cardStyle,
      handleClick,
      handleImageError
    }
  }
}
</script>

<style scoped>
.base-card {
  border-radius: 8px;
  overflow: hidden;
  background-color: #ffffff;
  transition: all 0.2s ease;
}

/* Variant styles */
.base-card--default {
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.base-card--outline {
  border: 1px solid var(--border-color);
  box-shadow: none;
}

.base-card--flat {
  border: none;
  box-shadow: none;
}

.base-card--elevated {
  border: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

/* Interaction styles */
.base-card--hoverable:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.base-card--selected {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.2);
}

.base-card--clickable {
  cursor: pointer;
}

/* Card sections */
.card-header {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}

.card-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
}

.card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  color: #666;
  font-size: 14px;
  text-align: center;
  padding: 20px;
}

.card-content {
  padding: 16px;
}

.card-footer {
  padding: 16px;
  border-top: 1px solid var(--border-color);
}

/* Media queries for responsive design */
@media (max-width: 768px) {
  .card-header, .card-content, .card-footer {
    padding: 12px;
  }
  
  .card-title {
    font-size: 16px;
  }
}
</style>
