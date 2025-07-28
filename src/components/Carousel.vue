<template>
  <div class="carousel-container">
    <div class="step-indicator">
      <span 
        v-for="(step, index) in steps" 
        :key="index"
        :class="{ active: currentStep === index }"
        class="step-dot"
      ></span>
    </div>

    <div class="carousel-content">
      <slot :currentStep="currentStep"></slot>
    </div>

    <div class="navigation-controls">
      <button 
        @click="previousStep" 
        :disabled="currentStep === 0"
        class="nav-button prev-button"
      >
        Previous
      </button>
      
      <button 
        v-if="currentStep < steps.length - 1"
        @click="nextStep" 
        :disabled="!canProceed"
        class="nav-button next-button"
      >
        Next
      </button>
      
      <button 
        v-if="currentStep === steps.length - 1"
        @click="onComplete" 
        :disabled="!canProceed"
        class="complete-button"
      >
        {{ completeButtonText }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  steps: {
    type: Array,
    required: true
  },
  completeButtonText: {
    type: String,
    default: 'Complete'
  },
  onComplete: {
    type: Function,
    required: true
  },
  reset: {
    type: Boolean,
    default: false
  },
  canProceed: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['step-change'])

const currentStep = ref(0)

const nextStep = () => {
  if (currentStep.value < props.steps.length - 1) {
    currentStep.value++
    emit('step-change', currentStep.value) 
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    emit('step-change', currentStep.value)
  }
}

defineExpose({
  currentStep,
  nextStep,
  previousStep
})
</script>

<style scoped>
.carousel-container {
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

.step-indicator {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 0.5rem;
}

.step-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #555;
  transition: background-color 0.3s;
}

.step-dot.active {
  background-color: #ff7b54;
}

.carousel-content {
  flex: 1;
  display: flex;
  align-items: flex-start;
  min-height: 200px;
}

.navigation-controls {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  gap: 1rem;
}

.nav-button {
  padding: 0.75rem 1.5rem;
  border: 2px solid #ff7b54;
  background-color: #2a2a2a;
  color: #ff7b54;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.nav-button:hover:not(:disabled) {
  background-color: #ff7b54;
  color: white;
}

.nav-button:disabled {
  border-color: #ccc;
  color: #ccc;
  cursor: not-allowed;
}

.complete-button {
  background-color: #ff7b54;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.complete-button:hover:not(:disabled) {
  background-color: #e66a47;
}

.complete-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>