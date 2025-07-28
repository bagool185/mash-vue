<template>
  <div v-if="visible" class="tutorial-overlay" @click="$emit('close')">
    <div class="tutorial-popup" @click.stop>
      <button class="close-button" @click="$emit('close')">&times;</button>
      <h3>How to Play MASH</h3>
      <div class="tutorial-content">
        <p><strong>MASH</strong> stands for <strong>M</strong>ansion, <strong>A</strong>partment, <strong>S</strong>hack, <strong>H</strong>ouse - your potential future homes!</p>
        
        <h4>How it works:</h4>
        <ol>
          <li><strong>Fill in 4 options</strong> for each category:
            <ul>
              <li>Homes (Mansion, Apartment, Shack, House are pre-filled)</li>
              <li>Spouses (people you might marry)</li>
              <li>Jobs (careers you might have)</li>
              <li>Number of kids (how many children you might have)</li>
            </ul>
          </li>
          <li><strong>Pick a magic number</strong> between 1-10</li>
          <li><strong>Click "Play MASH!"</strong> to see your future!</li>
        </ol>
        
        <h4>The Magic:</h4>
        <p>The game uses your magic number to eliminate options one by one from each category until only one remains. That's your predicted future!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['visible'])
defineEmits(['close'])
</script>

<style scoped>
.tutorial-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.tutorial-popup {
  background-color: #2a2a2a;
  color: white;
  border-radius: 10px;
  padding: 2rem;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  border: 2px solid #ff7b54;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  color: #ff7b54;
  font-size: 1.8rem;
  cursor: pointer;
  line-height: 1;
}

.close-button:hover {
  color: #e85a3a;
}

.tutorial-popup h3 {
  color: #ff7b54;
  margin-top: 0;
  margin-bottom: 1rem;
  text-align: center;
}

.tutorial-popup h4 {
  color: #ff7b54;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.tutorial-content p {
  margin-bottom: 1rem;
  line-height: 1.4;
}

.tutorial-content ol {
  margin-left: 1rem;
  text-align: left;
}

.tutorial-content ul {
  margin-left: 1rem;
  margin-top: 0.5rem;
  text-align: left;
}

.tutorial-content li {
  margin-bottom: 0.5rem;
}

.fun-note {
  background-color: #333;
  padding: 1rem;
  border-radius: 5px;
  border-left: 4px solid #ff7b54;
  margin-top: 1.5rem;
  font-style: italic;
}
</style>