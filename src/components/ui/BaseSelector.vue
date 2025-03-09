
<!-- src/components/ui/BaseSelector.vue -->
<template>
  <div 
    :class="[
      'base-selector',
      `base-selector--${variant}`,
      { 'base-selector--disabled': disabled }
    ]"
  >
    <label v-if="label" class="selector-label" :for="id">
      {{ label }}
      <span v-if="required" class="required-indicator">*</span>
    </label>
    
    <!-- Grid layout for options -->
    <div 
      :class="[
        'selector-options',
        `selector-options--${layout}`,
        { 'selector-options--has-images': hasImages }
      ]"
    >
      <!-- Radio button style selection -->
      <template v-if="variant === 'radio'">
        <div 
          v-for="option in options" 
          :key="option.id"
          :class="[
            'selector-option',
            { 'selected': isSelected(option.id) }
          ]"
          @click="selectOption(option)"
        >
          <div class="option-content">
            <div v-if="option.image" class="option-image">
              <img 
                :src="option.image" 
                :alt="option.name"
                @error="(e) => handleImageError(e, option)"
              />
            </div>
            <div class="option-details">
              <div class="option-name">{{ option.name }}</div>
              <div v-if="option.price !== undefined" class="option-price">
                {{ option.price > 0 ? '+' : '' }}{{ formatPrice(option.price) }}
              </div>
              <div v-if="option.description" class="option-description">
                {{ option.description }}
              </div>
            </div>
          </div>
        </div>
      </template>
      
      <!-- Checkbox style selection -->
      <template v-else-if="variant === 'checkbox'">
        <div 
          v-for="option in options" 
          :key="option.id"
          :class="[
            'selector-option',
            'selector-option--checkbox',
            { 'selected': isSelected(option.id) }
          ]"
          @click="toggleOption(option)"
        >
          <div class="checkbox-indicator">
            <span v-if="isSelected(option.id)" class="checkbox-icon">✓</span>
          </div>
          <div class="option-content">
            <div v-if="option.image" class="option-image">
              <img 
                :src="option.image" 
                :alt="option.name"
                @error="(e) => handleImageError(e, option)"
              />
            </div>
            <div class="option-details">
              <div class="option-name">{{ option.name }}</div>
              <div v-if="option.price !== undefined" class="option-price">
                {{ option.price > 0 ? '+' : '' }}{{ formatPrice(option.price) }}
              </div>
              <div v-if="option.description" class="option-description">
                {{ option.description }}
              </div>
            </div>
          </div>
        </div>
      </template>
      
      <!-- Dropdown style selection -->
      <template v-else-if="variant === 'dropdown'">
        <div class="dropdown-wrapper">
          <select 
            :id="id" 
            class="dropdown-select"
            :value="modelValue"
            @change="onDropdownChange"
            :disabled="disabled"
          >
            <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
            <option 
              v-for="option in options" 
              :key="option.id" 
              :value="option.id"
            >
              {{ option.name }} {{ option.price > 0 ? `(+${formatPrice(option.price)})` : '' }}
            </option>
          </select>
          <div class="dropdown-arrow">▼</div>
        </div>
      </template>
    </div>
    
    <div v-if="error" class="error-message">{{ error }}</div>
    <div v-if="helperText" class="helper-text">{{ helperText }}</div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'BaseSelector',
  props: {
    // Core props
    modelValue: {
      type: [String, Array],
      default: ''
    },
    options: {
      type: Array,
      required: true,
      validator: (options) => {
        return Array.isArray(options) && options.every(option => option && 'id' in option && 'name' in option);
      }
    },
    // Appearance props
    variant: {
      type: String,
      default: 'radio',
      validator: (value) => ['radio', 'checkbox', 'dropdown'].includes(value)
    },
    layout: {
      type: String,
      default: 'grid',
      validator: (value) => ['grid', 'list'].includes(value)
    },
    // Additional props
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Select an option'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    },
    helperText: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default() {
        return `selector-${Math.random().toString(36).substring(2, 9)}`
      }
    },
    currencyCode: {
      type: String,
      default: 'USD'
    }
  },
  emits: ['update:modelValue', 'select', 'change'],
  setup(props, { emit }) {
    // Check if options have images
    const hasImages = computed(() => {
      if (!Array.isArray(props.options)) return false
      return props.options.some(option => option && !!option.image)
    })
    
    // Format price with currency
    const formatPrice = (price) => {
      if (price === undefined || price === null) return ''
      
      try {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: props.currencyCode,
          minimumFractionDigits: 2
        }).format(price)
      } catch (error) {
        console.error('Error formatting price:', error)
        return `$${price.toFixed(2)}`
      }
    }
    
    // Check if an option is selected
    const isSelected = (optionId) => {
      try {
        if (Array.isArray(props.modelValue)) {
          return props.modelValue.includes(optionId)
        }
        return props.modelValue === optionId
      } catch (error) {
        console.error('Error checking if option is selected:', error)
        return false
      }
    }
    
    // Select a single option (radio/dropdown)
    const selectOption = (option) => {
      if (props.disabled) return
      
      try {
        emit('update:modelValue', option.id)
        emit('select', option)
        emit('change', option)
      } catch (error) {
        console.error('Error selecting option:', error)
      }
    }
    
    // Toggle an option (checkbox)
    const toggleOption = (option) => {
      if (props.disabled) return
      
      try {
        let newValue
        
        if (Array.isArray(props.modelValue)) {
          if (isSelected(option.id)) {
            // Remove from selection
            newValue = props.modelValue.filter(id => id !== option.id)
          } else {
            // Add to selection
            newValue = [...props.modelValue, option.id]
          }
        } else {
          // Convert to array if not already
          newValue = isSelected(option.id) ? [] : [option.id]
        }
        
        emit('update:modelValue', newValue)
        emit('select', option)
        emit('change', newValue)
      } catch (error) {
        console.error('Error toggling option:', error)
      }
    }
    
    // Handle dropdown change
    const onDropdownChange = (event) => {
      try {
        const selectedId = event.target.value
        if (!selectedId) return
        
        const selectedOption = props.options.find(option => option.id === selectedId)
        
        if (selectedOption) {
          selectOption(selectedOption)
        }
      } catch (error) {
        console.error('Error handling dropdown change:', error)
      }
    }
    
    // Handle image loading error
    const handleImageError = (event, option) => {
      try {
        // Hide the broken image
        event.target.style.display = 'none'
        
        // Create a colored background based on option ID
        const container = event.target.parentNode
        
        // Set a background color
        container.style.backgroundColor = getColorForOption(option.id)
        
        // Add option name as text
        const textElement = document.createElement('span')
        textElement.textContent = option.name
        textElement.style.color = '#fff'
        textElement.style.fontWeight = '500'
        textElement.style.textAlign = 'center'
        textElement.style.padding = '10px'
        
        container.appendChild(textElement)
      } catch (error) {
        console.error('Error handling image error:', error)
      }
    }
    
    // Generate a color based on option ID
    const getColorForOption = (id) => {
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
        'navy': '#303f9f',
        
        // Materials
        'cotton': '#90caf9',
        'wool': '#a1887f',
        'leather': '#8d6e63',
        'synthetic': '#b0bec5',
        'organic': '#a5d6a7',
        'premium': '#ffcc80',
        'polyester': '#b39ddb',
        'cashmere': '#ffe0b2',
        'fullgrain': '#bcaaa4'
      }
      
      // Return the color if it exists, otherwise generate one from the ID
      return colors[id] || `hsl(${hashString(id) % 360}, 70%, 45%)`
    }
    
    // Generate a hash number from a string
    const hashString = (str) => {
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i)
        hash |= 0 // Convert to 32bit integer
      }
      return Math.abs(hash)
    }
    
    return {
      hasImages,
      formatPrice,
      isSelected,
      selectOption,
      toggleOption,
      onDropdownChange,
      handleImageError
    }
  }
}
</script>

<style scoped>
.base-selector {
  margin-bottom: 20px;
  width: 100%;
}

.selector-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--text-color);
}

.required-indicator {
  color: var(--error-color);
  margin-left: 3px;
}

.selector-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.selector-options--grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
}

.selector-options--list {
  flex-direction: column;
}

<!-- Continuing the BaseSelector.vue style section -->

.selector-options--has-images .selector-option {
  flex-direction: column;
  align-items: center;
}

.selector-option {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  background-color: white;
}

.selector-option:hover {
  border-color: #bbdefb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.selector-option.selected {
  border-color: var(--primary-color);
  background-color: rgba(74, 108, 247, 0.05);
}

.option-content {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.option-image {
  margin-bottom: 10px;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 4px;
  background-color: #f5f5f7;
}

.option-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.option-details {
  flex: 1;
}

.option-name {
  font-weight: 500;
  margin-bottom: 4px;
}

.option-price {
  color: var(--primary-color);
  font-size: 14px;
  margin-bottom: 4px;
}

.option-description {
  font-size: 12px;
  color: var(--text-light);
  line-height: 1.4;
}

/* Checkbox specific styles */
.selector-option--checkbox {
  display: flex;
  align-items: flex-start;
}

.checkbox-indicator {
  width: 20px;
  height: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.selector-option.selected .checkbox-indicator {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.checkbox-icon {
  color: white;
  font-size: 14px;
  line-height: 1;
}

/* Dropdown specific styles */
.dropdown-wrapper {
  position: relative;
  width: 100%;
}

.dropdown-select {
  width: 100%;
  padding: 12px 16px;
  padding-right: 40px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background-color: white;
  font-size: 16px;
  appearance: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dropdown-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.2);
}

.dropdown-arrow {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #666;
  font-size: 12px;
}

/* Helper and error text */
.helper-text, .error-message {
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.4;
}

.helper-text {
  color: var(--text-light);
}

.error-message {
  color: var(--error-color);
}

/* Disabled state */
.base-selector--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.base-selector--disabled .selector-option,
.base-selector--disabled .dropdown-select {
  pointer-events: none;
  cursor: not-allowed;
}
</style>
