
// src/store/modules/configuration.js
import { v4 as uuidv4 } from 'uuid'
import { getProductById } from '@/data/products'

// Default empty configuration
const defaultConfiguration = {
  id: null,
  productId: null,
  color: null,
  material: null,
  features: [],
  totalPrice: 0
}

export default {
  namespaced: true,
  
  state: () => ({
    currentStep: 1,
    totalSteps: 4,
    selectedProduct: null,
    configuration: { ...defaultConfiguration },
    error: null
  }),
  
  mutations: {
    SET_CURRENT_STEP(state, step) {
      state.currentStep = step
    },
    
    SELECT_PRODUCT(state, product) {
      try {
        if (!product) {
          throw new Error('Invalid product selected')
        }
        
        state.selectedProduct = product
        state.configuration.productId = product.id
        state.configuration.id = uuidv4()
        state.configuration.totalPrice = product.basePrice || 0
        state.error = null
      } catch (error) {
        console.error('Error selecting product:', error)
        state.error = 'Failed to select product. Please try again.'
      }
    },
    
    SET_COLOR(state, color) {
      try {
        if (!color) return
        
        state.configuration.color = color
        state.error = null
      } catch (error) {
        console.error('Error setting color:', error)
        state.error = 'Failed to select color. Please try again.'
      }
    },
    
    SET_MATERIAL(state, material) {
      try {
        if (!material) return
        
        state.configuration.material = material
        state.error = null
      } catch (error) {
        console.error('Error setting material:', error)
        state.error = 'Failed to select material. Please try again.'
      }
    },
    
    ADD_FEATURE(state, feature) {
      try {
        if (!feature) return
        
        // Make sure features is an array
        if (!Array.isArray(state.configuration.features)) {
          state.configuration.features = []
        }
        
        // Avoid duplicates
        if (!state.configuration.features.some(f => f && f.id === feature.id)) {
          state.configuration.features.push(feature)
        }
        state.error = null
      } catch (error) {
        console.error('Error adding feature:', error)
        state.error = 'Failed to add feature. Please try again.'
      }
    },
    
    REMOVE_FEATURE(state, featureId) {
      try {
        // Make sure features is an array
        if (!Array.isArray(state.configuration.features)) {
          state.configuration.features = []
          return
        }
        
        const index = state.configuration.features.findIndex(f => f && f.id === featureId)
        if (index > -1) {
          state.configuration.features.splice(index, 1)
        }
        state.error = null
      } catch (error) {
        console.error('Error removing feature:', error)
        state.error = 'Failed to remove feature. Please try again.'
      }
    },
    
    CALCULATE_TOTAL(state) {
      try {
        // Verify we have a product selected
        if (!state.selectedProduct) {
          console.warn('Cannot calculate total: No product selected')
          return
        }
        
        // Start with base price
        let total = state.selectedProduct.basePrice || 0
        
        // Add color price with null checks
        if (state.configuration.color && 
            typeof state.configuration.color.price === 'number') {
          total += state.configuration.color.price
        }
        
        // Add material price with null checks
        if (state.configuration.material && 
            typeof state.configuration.material.price === 'number') {
          total += state.configuration.material.price
        }
        
        // Add features price with comprehensive checks
        if (state.configuration.features) {
          // Ensure features is an array
          if (Array.isArray(state.configuration.features)) {
            state.configuration.features.forEach(feature => {
              // Verify feature is an object with a price
              if (feature && typeof feature.price === 'number') {
                total += feature.price
              }
            })
          } else {
            console.warn('Features is not an array, skipping price calculation')
            // Fix the features array
            state.configuration.features = []
          }
        }
        
        // Ensure total is a valid number
        if (isNaN(total) || !isFinite(total)) {
          console.warn('Invalid total calculated, using base price as fallback')
          total = state.selectedProduct.basePrice || 0
        }
        
        // Update the total price
        state.configuration.totalPrice = total
        
        // Clear any previous errors
        state.error = null
      } catch (error) {
        console.error('Error calculating total:', error)
        
        // Set error and use fallback price
        state.error = 'Failed to calculate price. Using base price as fallback.'
        
        // Fallback to base price
        if (state.selectedProduct) {
          state.configuration.totalPrice = state.selectedProduct.basePrice || 0
        } else {
          state.configuration.totalPrice = 0
        }
      }
    },
    
    RESET_CONFIGURATION(state) {
      state.currentStep = 1
      state.selectedProduct = null
      state.configuration = { ...defaultConfiguration }
      state.error = null
    },
    
    SET_ERROR(state, error) {
      state.error = error
    },
    
    CLEAR_ERROR(state) {
      state.error = null
    }
  },
  
  actions: {
    nextStep({ commit, state }) {
      if (state.currentStep < state.totalSteps) {
        commit('SET_CURRENT_STEP', state.currentStep + 1)
      }
    },
    
    prevStep({ commit, state }) {
      if (state.currentStep > 1) {
        commit('SET_CURRENT_STEP', state.currentStep - 1)
      }
    },
    
    selectProduct({ commit, dispatch }, product) {
      commit('SELECT_PRODUCT', product)
      dispatch('calculateTotal')
    },
    
    selectColor({ commit, dispatch }, color) {
      commit('SET_COLOR', color)
      dispatch('calculateTotal')
    },
    
    selectMaterial({ commit, dispatch }, material) {
      commit('SET_MATERIAL', material)
      dispatch('calculateTotal')
    },
    
    toggleFeature({ commit, state, dispatch }, feature) {
      try {
        if (!feature) return
        
        // Ensure features is an array
        if (!Array.isArray(state.configuration.features)) {
          commit('SET_ERROR', 'Features array is invalid. Resetting features.')
          state.configuration.features = []
          return
        }
        
        const hasFeature = state.configuration.features.some(f => f && f.id === feature.id)
        
        if (hasFeature) {
          commit('REMOVE_FEATURE', feature.id)
        } else {
          commit('ADD_FEATURE', feature)
        }
        
        dispatch('calculateTotal')
      } catch (error) {
        console.error('Error toggling feature:', error)
        commit('SET_ERROR', 'Failed to toggle feature. Please try again.')
      }
    },
    
    calculateTotal({ commit }) {
      commit('CALCULATE_TOTAL')
    },
    
    resetConfiguration({ commit }) {
      commit('RESET_CONFIGURATION')
    },
    
    loadConfiguration({ commit, dispatch }, configData) {
      try {
        // Validate input
        if (!configData) {
          console.warn('No configuration data provided')
          return false
        }
        
        // Extract product ID with fallback
        const productId = configData.product || configData.productId
        
        if (!productId) {
          console.warn('No product ID in configuration data')
          return false
        }
        
        // Get product with error handling
        const product = getProductById(productId)
        if (!product) {
          console.warn(`Product not found: ${productId}`)
          return false
        }
        
        // Reset and select product
        commit('RESET_CONFIGURATION')
        commit('SELECT_PRODUCT', product)
        
        // Set color if provided and exists in product options
        const colorId = configData.color || configData.colorId
        if (colorId && product.options && product.options.colors) {
          const color = product.options.colors.find(c => c.id === colorId)
          if (color) {
            commit('SET_COLOR', color)
          } else {
            console.warn(`Color not found: ${colorId}`)
          }
        }
        
        // Set material if provided and exists in product options
        const materialId = configData.material || configData.materialId
        if (materialId && product.options && product.options.materials) {
          const material = product.options.materials.find(m => m.id === materialId)
          if (material) {
            commit('SET_MATERIAL', material)
          } else {
            console.warn(`Material not found: ${materialId}`)
          }
        }
        
        // Set features if provided and exists in product options
        const featuresParam = configData.features || configData.featureIds
        if (featuresParam && product.options && product.options.features) {
          // Handle both array and comma-separated string
          const featureIds = Array.isArray(featuresParam) 
            ? featuresParam 
            : String(featuresParam).split(',')
          
          // Add each feature that exists
          featureIds.forEach(featureId => {
            if (!featureId) return
            
            const feature = product.options.features.find(f => f.id === featureId)
            if (feature) {
              commit('ADD_FEATURE', feature)
            } else {
              console.warn(`Feature not found: ${featureId}`)
            }
          })
        }
        
        // Calculate total price
        dispatch('calculateTotal')
        return true
      } catch (error) {
        console.error('Error loading configuration:', error)
        commit('SET_ERROR', 'Failed to load configuration. Starting with default options.')
        return false
      }
    },
    
    saveConfiguration({ state }) {
      try {
        if (!state.configuration.id || !state.selectedProduct) {
          throw new Error('No valid configuration to save')
        }
        
        // Save to localStorage with error handling
        const configToSave = JSON.stringify(state.configuration)
        localStorage.setItem(`fc_config_${state.configuration.id}`, configToSave)
        
        return {
          success: true,
          configId: state.configuration.id
        }
      } catch (error) {
        console.error('Error saving configuration:', error)
        return {
          success: false,
          error: 'Failed to save configuration. Please try again.'
        }
      }
    }
  },
  
  getters: {
    currentStepProgress: state => {
      return Math.round((state.currentStep / state.totalSteps) * 100)
    },
    
    isFeatureSelected: state => featureId => {
      // Check if features is an array
      if (!Array.isArray(state.configuration.features)) {
        return false
      }
      return state.configuration.features.some(f => f && f.id === featureId)
    },
    
    canProceed: state => {
      switch (state.currentStep) {
        case 1: return state.selectedProduct !== null
        case 2: return state.configuration.color !== null
        case 3: return state.configuration.material !== null
        default: return true
      }
    },
    
    shareableUrl: state => {
      try {
        // Check if we have a valid product selected
        if (!state.configuration || !state.configuration.productId) {
          console.warn('Cannot create shareable URL: No product selected')
          return ''
        }
        
        // Create URL parameters with proper error handling
        const params = new URLSearchParams()
        
        // Always add product ID
        params.append('product', state.configuration.productId)
        
        // Add color if available (with null check)
        if (state.configuration.color && state.configuration.color.id) {
          params.append('color', state.configuration.color.id)
        }
        
        // Add material if available (with null check)
        if (state.configuration.material && state.configuration.material.id) {
          params.append('material', state.configuration.material.id)
        }
        
        // Add features if available (with multiple null checks)
        if (state.configuration.features && 
            Array.isArray(state.configuration.features) && 
            state.configuration.features.length > 0) {
          
          // Safely map feature IDs with additional error handling
          const featureIds = state.configuration.features
            .filter(f => f && f.id) // Only include features with valid IDs
            .map(f => f.id)
            .join(',')
          
          if (featureIds) {
            params.append('features', featureIds)
          }
        }
        
        // Safely construct the URL using window location
        const origin = window.location.origin || ''
        const pathname = window.location.pathname || ''
        
        // Return the complete URL with hash for better compatibility
        return `${origin}${pathname}#/configurator?${params.toString()}`
      } catch (error) {
        // Log error and return empty string as fallback
        console.error('Error generating shareable URL:', error)
        return ''
      }
    },
    
    hasError: state => !!state.error
  }
}
