<template>
  <div class="result-section">
    <h2>Your MASH Result:</h2>
    <div class="result">
      <p><strong>Home:</strong> {{ result.home }}</p>
      <p><strong>Spouse:</strong> {{ result.spouse }}</p>
      <p><strong>Job:</strong> {{ result.job }}</p>
      <p><strong>Kids:</strong> {{ result.kids }}</p>
    </div>
    <button @click="onReset" class="reset-button">Play Again</button>
  </div>
</template>

<script setup>
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
</script>

<style scoped>
.result-section {
  text-align: center;
}

.result {
  background-color: #2a2a2a;
  border: 2px solid #ff7b54;
  border-radius: 8px;
  padding: 2rem;
  margin: 2rem 0;
}

.result p {
  font-size: 1.2rem;
  margin: 1rem 0;
  color: white;
}

.reset-button {
  background-color: #ff7b54;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.reset-button:hover {
  background-color: #e66a47;
}
</style>