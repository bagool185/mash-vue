<template>
  <div class="mash-game">
    <div v-if="!gameResult" class="input-section">
      <div class="header">
        <h2>Fill in your MASH predictions:</h2>
        <button class="tutorial-button" @click="showTutorial = true" title="How to play MASH">
          ?
        </button>
      </div>
      
      <Carousel 
        :steps="steps"
        complete-button-text="Play MASH!"
        :on-complete="playGame"
        :reset="gameResult === null && currentStep !== 0"
        :can-proceed="canProceed"
        @step-change="onStepChange"
      >
        <template #default="{ currentStep }">
          <div v-if="currentStep === 0">
            <InputGroup 
              ref="homesInputGroup"
              title="Homes (4 options)"
              v-model="inputs.homes"
              placeholder-prefix="Home"
              @validation-change="(isValid) => onValidationChange(0, isValid)"
            />
          </div>

          <div v-if="currentStep === 1">
            <InputGroup 
              ref="spousesInputGroup"
              title="Spouses (4 options)"
              v-model="inputs.spouses"
              placeholder-prefix="Spouse"
              @validation-change="(isValid) => onValidationChange(1, isValid)"
            />
          </div>

          <div v-if="currentStep === 2">
            <InputGroup 
              ref="jobsInputGroup"
              title="Jobs (4 options)"
              v-model="inputs.jobs"
              placeholder-prefix="Job"
              @validation-change="(isValid) => onValidationChange(2, isValid)"
            />
          </div>

          <div v-if="currentStep === 3">
            <InputGroup 
              ref="kidsInputGroup"
              title="Number of Kids (4 options)"
              v-model="inputs.kids"
              placeholder-prefix="Number"
              input-type="number"
              :min="0"
              :max="20"
              @validation-change="(isValid) => onValidationChange(3, isValid)"
            />
          </div>

          <div v-if="currentStep === 4">
            <div class="magic-number">
              <label>Magic Number (1-10):</label>
              <div class="input-wrapper">
                <input 
                  v-model.number="magicNumber" 
                  type="number" 
                  min="1" 
                  max="10" 
                  placeholder="Pick a number"
                  @blur="validateMagicNumber"
                  @input="clearMagicNumberError"
                  :class="{ 'error': magicNumberError }"
                />
                <div v-if="magicNumberError" class="error-message">{{ magicNumberError }}</div>
              </div>
            </div>
          </div>
        </template>
      </Carousel>
    </div>

    <ResultReveal 
      v-if="gameResult"
      :result="gameResult" 
      :onReset="resetGame"
    />

    <Tutorial :visible="showTutorial" @close="showTutorial = false" />
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import InputGroup from './InputGroup.vue'
import ResultReveal from './ResultReveal.vue'
import Carousel from './Carousel.vue'
import Tutorial from './Tutorial.vue'

const inputs = ref({
  homes: ['Mansion', 'Apartment', 'Shack', 'House'],
  spouses: ['', '', '', ''],
  jobs: ['', '', '', ''],
  kids: ['', '', '', '']
})

const magicNumber = ref(3)
const gameResult = ref(null)
const currentStep = ref(0)
const magicNumberError = ref(null)
const validationStates = ref({})
const showTutorial = ref(false)

// Template refs for InputGroup components
const homesInputGroup = ref(null)
const spousesInputGroup = ref(null)
const jobsInputGroup = ref(null)
const kidsInputGroup = ref(null)

const steps = ['Homes', 'Spouses', 'Jobs', 'Kids', 'Magic Number']


const canProceed = computed(() => {
  switch (currentStep.value) {
    case 0:
      return inputs.value.homes.every(h => h && h.trim()) && (validationStates.value[0] === undefined || validationStates.value[0] === true)
    case 1:
      return inputs.value.spouses.every(s => s && s.trim()) && (validationStates.value[1] === undefined || validationStates.value[1] === true)
    case 2:
      return inputs.value.jobs.every(j => j && j.trim()) && (validationStates.value[2] === undefined || validationStates.value[2] === true)
    case 3:
      return inputs.value.kids.every(k => k !== null && k !== undefined && k.toString().trim()) && (validationStates.value[3] === undefined || validationStates.value[3] === true)
    case 4:
      return magicNumber.value >= 1 && magicNumber.value <= 10 && !magicNumberError.value
    default:
      return false
  }
})

const onStepChange = (step) => {
  currentStep.value = step
}

const playGame = () => {
  const categories = [
    inputs.value.homes,
    inputs.value.spouses,
    inputs.value.jobs,
    inputs.value.kids
  ]

  const results = categories.map(category => eliminateItems(category, magicNumber.value))

  gameResult.value = {
    home: results[0],
    spouse: results[1],
    job: results[2],
    kids: results[3]
  }
}

const eliminateItems = (items, number) => {
  const list = [...items]
  let currentIndex = 0

  while (list.length > 1) {
    currentIndex = (currentIndex + number - 1) % list.length
    list.splice(currentIndex, 1)
    if (currentIndex >= list.length) {
      currentIndex = 0
    }
  }

  return list[0]
}

const resetGame = () => {
  gameResult.value = null
  currentStep.value = 0
  magicNumberError.value = null
  validationStates.value = {}
  
  // Reset all input values to their initial state
  inputs.value = {
    homes: ['Mansion', 'Apartment', 'Shack', 'House'],
    spouses: ['', '', '', ''],
    jobs: ['', '', '', ''],
    kids: ['', '', '', '']
  }
  
  // Reset magic number to initial value
  magicNumber.value = 3
  
  // Clear any validation errors from InputGroup components
  // Note: We need to wait for the next tick since the components are conditionally rendered
  nextTick(() => {
    const refs = [
      homesInputGroup.value,
      spousesInputGroup.value, 
      jobsInputGroup.value,
      kidsInputGroup.value
    ]
    
    refs.forEach(ref => {
      if (ref && ref.clearErrors) {
        ref.clearErrors()
      }
    })
  })
}

const validateMagicNumber = () => {
  const num = magicNumber.value
  if (!num || isNaN(num)) {
    magicNumberError.value = 'Please enter a valid number'
  } else if (num < 1 || num > 10) {
    magicNumberError.value = 'Number must be between 1 and 10'
  } else if (!Number.isInteger(num)) {
    magicNumberError.value = 'Please enter a whole number'
  } else {
    magicNumberError.value = null
  }
}

const clearMagicNumberError = () => {
  if (magicNumberError.value) {
    magicNumberError.value = null
  }
}

const onValidationChange = (stepIndex, isValid) => {
  validationStates.value = { ...validationStates.value, [stepIndex]: isValid }
}
</script>

<style scoped>
.mash-game {
  max-width: 600px;
  margin: 0 auto;
}

.input-section {
  text-align: left;
}


.magic-number {
  margin-bottom: 2rem;
}

.magic-number label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: white;
}

.magic-number .input-wrapper {
  margin-top: 0.5rem;
}

.magic-number input {
  padding: 0.5rem;
  border: 1px solid #555;
  border-radius: 4px;
  font-size: 1rem;
  width: 200px;
  background-color: #2a2a2a;
  color: white;
  transition: border-color 0.3s;
}

.magic-number input:focus {
  outline: none;
  border-color: #ff7b54;
}

.magic-number input.error {
  border-color: #e74c3c;
}

.magic-number .error-message {
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.tutorial-button {
  background-color: #ff7b54;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.tutorial-button:hover {
  background-color: #e85a3a;
  transform: scale(1.1);
}


</style>