<template>
  <div class="input-group">
    <label>{{ title }}:</label>
    <div v-for="(value, index) in modelValue" :key="index" class="input-wrapper">
      <input 
        :value="value"
        @input="updateValue(index, $event.target.value)"
        @blur="validateInput(index, inputType === 'number' ? modelValue[index] : $event.target.value)"
        :placeholder="getPlaceholder(index)"
        :type="inputType"
        :min="inputType === 'number' ? min : undefined"
        :max="inputType === 'number' ? max : undefined"
        :class="{ 'error': errors[index] }"
      />
      <div v-if="errors[index]" class="error-message">{{ errors[index] }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  modelValue: {
    type: Array,
    required: true
  },
  placeholderPrefix: {
    type: String,
    default: ''
  },
  inputType: {
    type: String,
    default: 'text'
  },
  min: {
    type: Number,
    default: undefined
  },
  max: {
    type: Number,
    default: undefined
  },
  maxLength: {
    type: Number,
    default: 50
  }
})

const emit = defineEmits(['update:modelValue', 'validation-change'])

const errors = ref({})

const updateValue = (index, value) => {
  const newArray = [...props.modelValue]
  newArray[index] = props.inputType === 'number' ? Number(value) : value
  emit('update:modelValue', newArray)
  
  // Clear error when user starts typing
  if (errors.value[index]) {
    errors.value = { ...errors.value, [index]: null }
  }
  
  // Always emit validation state after input change
  emitValidationState()
}

const validateInput = (index, value) => {
  let error = null
  
  if (props.inputType === 'text') {
    if (!value || value.trim().length === 0) {
      error = 'This field is required'
    } else if (value.trim().length > props.maxLength) {
      error = `Maximum ${props.maxLength} characters allowed`
    }
  } else if (props.inputType === 'number') {
    if (value === '' || value === null || value === undefined) {
      error = 'Please enter a valid number'
    } else {
      const num = typeof value === 'number' ? value : Number(value)
      if (isNaN(num)) {
        error = 'Please enter a valid number'
      } else if (props.min !== undefined && num < props.min) {
        error = `Minimum value is ${props.min}`
      } else if (props.max !== undefined && num > props.max) {
        error = `Maximum value is ${props.max}`
      } else if (!Number.isInteger(num)) {
        error = 'Please enter a whole number'
      }
    }
  }
  
  errors.value = { ...errors.value, [index]: error }
  emitValidationState()
}

const emitValidationState = () => {
  const hasErrors = Object.values(errors.value).some(error => error !== null)
  emit('validation-change', !hasErrors)
}

const isValid = computed(() => {
  return !Object.values(errors.value).some(error => error !== null)
})

const getPlaceholder = (index) => {
  return props.placeholderPrefix ? `${props.placeholderPrefix} ${index + 1}` : ''
}

defineExpose({
  isValid,
  validateAll: () => {
    props.modelValue.forEach((value, index) => {
      validateInput(index, value)
    })
  },
  clearErrors: () => {
    errors.value = {}
    emitValidationState()
  }
})
</script>

<style scoped>
.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: white;
}

.input-wrapper {
  margin-bottom: 0.5rem;
}

.input-group input {
  display: block;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #555;
  border-radius: 4px;
  font-size: 1rem;
  background-color: #2a2a2a;
  color: white;
  transition: border-color 0.3s;
}

.input-group input:focus {
  outline: none;
  border-color: #ff7b54;
}

.input-group input.error {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>