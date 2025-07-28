<template>
  <div class="result-reveal">
    <div v-if="!showResult" class="suspense-container">
      <h2>Calculating your destiny...</h2>
      <div class="spinner-container">
        <div class="spinner"></div>
      </div>
      <div class="dots">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>
    
    <div v-if="showResult" class="result-container">
      <h2 class="reveal-title">Your MASH Result:</h2>
      <div class="result-items">
        <div 
          v-for="(item, index) in resultItems" 
          :key="item.key"
          class="result-item"
          :class="{ 'revealed': item.revealed }"
          :style="{ animationDelay: `${index * 0.5}s` }"
        >
          <p><strong>{{ item.label }}:</strong> <span class="result-value">{{ item.value }}</span></p>
        </div>
      </div>
      <button 
        @click="onReset" 
        class="reset-button"
        :class="{ 'show': allRevealed }"
      >
        Play Again
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const props = defineProps({
  result: {
    type: Object,
    required: true
  },
  onReset: {
    type: Function,
    required: true
  }
})

const showResult = ref(false)
const resultItems = ref([
  { key: 'home', label: 'Home', value: props.result.home, revealed: false },
  { key: 'spouse', label: 'Spouse', value: props.result.spouse, revealed: false },
  { key: 'job', label: 'Job', value: props.result.job, revealed: false },
  { key: 'kids', label: 'Kids', value: props.result.kids, revealed: false }
])

const allRevealed = computed(() => 
  resultItems.value.every(item => item.revealed)
)

onMounted(() => {
  // Show suspense for 3 seconds
  setTimeout(() => {
    showResult.value = true
    
    // Reveal each item with delay
    resultItems.value.forEach((item, index) => {
      setTimeout(() => {
        item.revealed = true
      }, (index + 1) * 800)
    })
  }, 3000)
})
</script>

<style scoped>
.result-reveal {
  text-align: center;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.suspense-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.suspense-container h2 {
  color: #ff7b54;
  font-size: 1.5rem;
  margin: 0;
  animation: pulse 2s infinite;
}

.spinner-container {
  position: relative;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #333;
  border-top: 4px solid #ff7b54;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.dots {
  display: flex;
  gap: 0.5rem;
}

.dot {
  width: 12px;
  height: 12px;
  background-color: #ff7b54;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }

.result-container {
  width: 100%;
  max-width: 500px;
}

.reveal-title {
  color: #ff7b54;
  margin-bottom: 2rem;
  animation: slideDown 0.6s ease-out;
}

.result-items {
  background-color: #2a2a2a;
  border: 2px solid #ff7b54;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.result-item {
  opacity: 0;
  transform: translateX(-50px);
  transition: all 0.6s ease-out;
  margin: 1.5rem 0;
}

.result-item.revealed {
  opacity: 1;
  transform: translateX(0);
}

.result-item p {
  font-size: 1.2rem;
  color: white;
  margin: 0;
}

.result-value {
  color: #ff7b54;
  font-weight: bold;
  animation: glow 2s ease-in-out infinite alternate;
}

.reset-button {
  background-color: #ff7b54;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  opacity: 0;
  transform: translateY(20px);
}

.reset-button.show {
  opacity: 1;
  transform: translateY(0);
}

.reset-button:hover {
  background-color: #e66a47;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 123, 84, 0.3);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  } 40% {
    transform: scale(1);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes glow {
  from {
    text-shadow: 0 0 5px #ff7b54;
  }
  to {
    text-shadow: 0 0 20px #ff7b54, 0 0 30px #ff7b54;
  }
}
</style>