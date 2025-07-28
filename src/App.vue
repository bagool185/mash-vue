<script setup>
import MashGame from './components/MashGame.vue'
</script>

<template>
  <div id="app">
    <h1>MASH Game</h1>
    <MashGame />
  </div>
</template>

<style scoped>
#app {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  background-color: #1a1a1a;
  color: white;
  min-height: 100vh;
}

h1 {
  color: white;
  margin-bottom: 2rem;
}
</style>
