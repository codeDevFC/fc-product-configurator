
<!-- src/components/configurator/ConfiguratorStep.vue -->
<template>
  <div class="configurator-step">
    <div class="step-header">
      <h2 class="step-title">{{ title }}</h2>
      <p v-if="description" class="step-description">{{ description }}</p>
    </div>
    
    <div class="step-content">
      <slot></slot>
    </div>
    
    <div class="step-actions">
      <BaseButton 
        v-if="showBackButton" 
        variant="outline" 
        @click="goBack"
        :disabled="loading"
      >
        Back
      </BaseButton>
      
      <BaseButton 
        v-if="!isLastStep"
        @click="goNext"
        :disabled="!canProceed || loading"
        :loading="loading"
      >
        Continue
      </BaseButton>
      
      <BaseButton 
        v-else 
        @click="finalize"
        :disabled="!canProceed || loading"
        :loading="loading"
      >
        {{ finalizeButtonText }}
      </BaseButton>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'

export default {
  name: 'ConfiguratorStep',
  components: {
    BaseButton
  },
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    showBackButton: {
      type: Boolean,
      default: true
    },
    finalizeButtonText: {
      type: String,
      default: 'Finalize Configuration'
    }
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const loading = ref(false)
    
    // Get current step and total steps from store
    const currentStep = computed(() => store.state.configuration.currentStep)
    const totalSteps = computed(() => store.state.configuration.totalSteps)
    
    // Check if this is the last step
    const isLastStep = computed(() => currentStep.value === totalSteps.value)
    
    // Check if we can proceed to the next step
    const canProceed = computed(() => store.getters['configuration/canProceed'])
    
    // Go to previous step
    const goBack = () => {
      try {
        store.dispatch('configuration/prevStep')
      } catch (error) {
        console.error('Error navigating to previous step:', error)
      }
    }
    
    // Go to next step
    const goNext = async () => {
      if (!canProceed.value) return
      
      try {
        loading.value = true
        await store.dispatch('configuration/nextStep')
      } catch (error) {
        console.error('Error navigating to next step:', error)
        store.commit('configuration/SET_ERROR', 'Failed to proceed to next step')
      } finally {
        loading.value = false
      }
    }
    
    // Finalize configuration
    const finalize = async () => {
      if (!canProceed.value) return
      
      try {
        loading.value = true
        
        // Save configuration
        const result = await store.dispatch('configuration/saveConfiguration')
        
        if (result.success) {
          // Navigate to summary page
          router.push('/summary')
        } else {
          throw new Error(result.error || 'Failed to save configuration')
        }
      } catch (error) {
        console.error('Error finalizing configuration:', error)
        store.commit('configuration/SET_ERROR', 'Failed to finalize configuration')
      } finally {
        loading.value = false
      }
    }
    
    return {
      currentStep,
      totalSteps,
      isLastStep,
      canProceed,
      loading,
      goBack,
      goNext,
      finalize
    }
  }
}
</script>

<style scoped>
.configurator-step {
  margin-bottom: 40px;
}

.step-header {
  margin-bottom: 30px;
}

.step-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--text-color);
}

.step-description {
  color: var(--text-light);
  max-width: 800px;
}

.step-content {
  margin-bottom: 30px;
}

.step-actions {
  display: flex;
  justify-content: space-between;
}

@media (max-width: 576px) {
  .step-title {
    font-size: 20px;
  }
  
  .step-actions {
    flex-direction: column;
    gap: 10px;
  }
  
  .step-actions button {
    width: 100%;
  }
}
</style>
