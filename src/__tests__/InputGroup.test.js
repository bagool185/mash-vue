import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import InputGroup from '../components/InputGroup.vue'

describe('InputGroup.vue', () => {
  const defaultProps = {
    title: 'Test Title',
    modelValue: ['', '', '', ''],
    placeholderPrefix: 'Test'
  }

  it('renders the title correctly', () => {
    const wrapper = mount(InputGroup, { props: defaultProps })
    expect(wrapper.find('label').text()).toBe('Test Title:')
  })

  it('renders correct number of inputs', () => {
    const wrapper = mount(InputGroup, { props: defaultProps })
    expect(wrapper.findAll('input')).toHaveLength(4)
  })

  it('generates correct placeholders', () => {
    const wrapper = mount(InputGroup, { props: defaultProps })
    const inputs = wrapper.findAll('input')
    
    expect(inputs[0].attributes('placeholder')).toBe('Test 1')
    expect(inputs[1].attributes('placeholder')).toBe('Test 2')
    expect(inputs[2].attributes('placeholder')).toBe('Test 3')
    expect(inputs[3].attributes('placeholder')).toBe('Test 4')
  })

  it('emits update:modelValue when input changes', async () => {
    const wrapper = mount(InputGroup, { props: defaultProps })
    const firstInput = wrapper.find('input')
    
    await firstInput.setValue('New Value')
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0][0]).toEqual(['New Value', '', '', ''])
  })

  it('handles number input type correctly', async () => {
    const props = {
      ...defaultProps,
      inputType: 'number',
      min: 1,
      max: 10
    }
    const wrapper = mount(InputGroup, { props })
    const inputs = wrapper.findAll('input')
    
    inputs.forEach(input => {
      expect(input.attributes('type')).toBe('number')
      expect(input.attributes('min')).toBe('1')
      expect(input.attributes('max')).toBe('10')
    })
  })

  it('converts string to number for number inputs', async () => {
    const props = {
      ...defaultProps,
      inputType: 'number'
    }
    const wrapper = mount(InputGroup, { props })
    const firstInput = wrapper.find('input')
    
    await firstInput.setValue('5')
    
    expect(wrapper.emitted('update:modelValue')[0][0]).toEqual([5, '', '', ''])
  })

  describe('Validation', () => {
    it('shows error for empty text input on blur', async () => {
      const wrapper = mount(InputGroup, { props: defaultProps })
      const firstInput = wrapper.find('input')
      
      await firstInput.trigger('blur')
      
      expect(wrapper.find('.error-message').text()).toBe('This field is required')
      expect(firstInput.classes()).toContain('error')
    })

    it('shows error for text exceeding max length', async () => {
      const props = { ...defaultProps, maxLength: 5 }
      const wrapper = mount(InputGroup, { props })
      const firstInput = wrapper.find('input')
      
      await firstInput.setValue('Very long text')
      await firstInput.trigger('blur')
      
      expect(wrapper.find('.error-message').text()).toBe('Maximum 5 characters allowed')
      expect(firstInput.classes()).toContain('error')
    })

    it('clears error when user starts typing', async () => {
      const wrapper = mount(InputGroup, { props: defaultProps })
      const firstInput = wrapper.find('input')
      
      // Trigger error first
      await firstInput.trigger('blur')
      expect(wrapper.find('.error-message').exists()).toBe(true)
      
      // Start typing to clear error
      await firstInput.setValue('test')
      expect(wrapper.find('.error-message').exists()).toBe(false)
      expect(firstInput.classes()).not.toContain('error')
    })

    it('validates number inputs correctly', async () => {
      const props = {
        ...defaultProps,
        inputType: 'number',
        min: 1,
        max: 10
      }
      const wrapper = mount(InputGroup, { props })
      const firstInput = wrapper.find('input')
      
      // Test invalid number
      await firstInput.setValue('abc')
      await firstInput.trigger('blur')
      expect(wrapper.find('.error-message').text()).toBe('Please enter a valid number')
      
      // Test number below minimum
      await firstInput.setValue('0')
      await wrapper.vm.$nextTick()
      // Manually call validation with the expected value
      wrapper.vm.validateInput(0, 0) // The model should have 0 as a number
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.error-message').text()).toBe('Minimum value is 1')
      
      // Test number above maximum
      await firstInput.setValue('15')
      await wrapper.vm.$nextTick()
      wrapper.vm.validateInput(0, 15)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.error-message').text()).toBe('Maximum value is 10')
      
      // Test non-integer
      await firstInput.setValue('5.5')
      await wrapper.vm.$nextTick()
      wrapper.vm.validateInput(0, 5.5)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.error-message').text()).toBe('Please enter a whole number')
    })

    it('emits validation-change event correctly', async () => {
      const wrapper = mount(InputGroup, { props: defaultProps })
      const firstInput = wrapper.find('input')
      
      // Valid input should emit true
      await firstInput.setValue('valid text')
      await firstInput.trigger('blur')
      
      const validationEvents = wrapper.emitted('validation-change')
      expect(validationEvents).toBeTruthy()
      expect(validationEvents[validationEvents.length - 1][0]).toBe(true)
      
      // Invalid input should emit false
      await firstInput.setValue('')
      await firstInput.trigger('blur')
      
      const updatedEvents = wrapper.emitted('validation-change')
      expect(updatedEvents[updatedEvents.length - 1][0]).toBe(false)
    })

    it('validates all inputs when validateAll is called', async () => {
      const wrapper = mount(InputGroup, { props: defaultProps })
      
      // Access the component instance
      const vm = wrapper.vm
      vm.validateAll()
      
      await wrapper.vm.$nextTick()
      
      // Should show errors for all empty inputs
      const errorMessages = wrapper.findAll('.error-message')
      expect(errorMessages).toHaveLength(4)
      errorMessages.forEach(error => {
        expect(error.text()).toBe('This field is required')
      })
    })

    it('handles number validation edge cases', async () => {
      const props = {
        ...defaultProps,
        inputType: 'number'
      }
      const wrapper = mount(InputGroup, { props })
      const firstInput = wrapper.find('input')
      
      // Test empty number input
      await firstInput.setValue('')
      await firstInput.trigger('blur')
      expect(wrapper.find('.error-message').text()).toBe('Please enter a valid number')
      
      // Test valid number
      await firstInput.setValue('5')
      await wrapper.vm.$nextTick()
      // Manually call validation with the expected value
      wrapper.vm.validateInput(0, 5) // The model should have 5 as a number
      await wrapper.vm.$nextTick()
      
      expect(wrapper.find('.error-message').exists()).toBe(false)
    })
  })
})