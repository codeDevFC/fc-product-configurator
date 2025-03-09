
<!-- src/components/ui/BaseButton.vue -->
<template>
  <button
    :class="[
      'base-button',
      `base-button--${variant}`,
      { 'base-button--block': block },
      { 'base-button--loading': loading },
      { 'base-button--disabled': disabled || loading }
    ]"
    :disabled="disabled || loading"
    :type="type"
    @click="handleClick"
  >
    <span v-if="loading" class="button-loader"></span>
    <span v-else class="button-content">
      <i v-if="icon" :class="icon" class="button-icon"></i>
      <slot></slot>
    </span>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: value => ['primary', 'secondary', 'outline', 'text'].includes(value)
    },
    type: {
      type: String,
      default: 'button'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const handleClick = (event) => {
      if (props.disabled || props.loading) return
      
      try {
        emit('click', event)
      } catch (error) {
        console.error('Error in button click handler:', error)
      }
    }
    
    return {
      handleClick
    }
  }
}
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  min-height: 42px;
  position: relative;
  overflow: hidden;
}

.base-button--primary {
  background-color: var(--primary-color);
  color: white;
}

.base-button--primary:hover:not(.base-button--disabled) {
  background-color: #3a5bd9;
}

.base-button--secondary {
  background-color: var(--secondary-color);
  color: var(--text-color);
}

.base-button--secondary:hover:not(.base-button--disabled) {
  background-color: #e5e5e7;
}

.base-button--outline {
  background-color: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
}

.base-button--outline:hover:not(.base-button--disabled) {
  background-color: rgba(74, 108, 247, 0.05);
}

.base-button--text {
  background-color: transparent;
  color: var(--primary-color);
  padding: 8px 16px;
}

.base-button--text:hover:not(.base-button--disabled) {
  background-color: rgba(74, 108, 247, 0.05);
}

.base-button--block {
  display: flex;
  width: 100%;
}

.base-button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-icon {
  margin-right: 8px;
}

.button-loader {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

.base-button--secondary .button-loader,
.base-button--outline .button-loader,
.base-button--text .button-loader {
  border: 2px solid rgba(74, 108, 247, 0.3);
  border-top-color: var(--primary-color);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
