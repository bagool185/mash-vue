import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MashGame from '../components/MashGame.vue'

describe('MashGame.vue', () => {
  it('renders the game title', () => {
    const wrapper = mount(MashGame)
    expect(wrapper.find('h2').text()).toBe('Fill in your MASH predictions:')
  })

  it('renders Carousel component', () => {
    const wrapper = mount(MashGame)
    expect(wrapper.findComponent({ name: 'Carousel' }).exists()).toBe(true)
  })

  it('starts with no game result', () => {
    const wrapper = mount(MashGame)
    expect(wrapper.find('.input-section').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'GameResult' }).exists()).toBe(false)
  })

  it('initializes with default home values', () => {
    const wrapper = mount(MashGame)
    const component = wrapper.vm
    
    expect(component.inputs.homes).toEqual(['Mansion', 'Apartment', 'Shack', 'House'])
  })

  it('initializes with empty spouse, job, and kid values', () => {
    const wrapper = mount(MashGame)
    const component = wrapper.vm
    
    expect(component.inputs.spouses).toEqual(['', '', '', ''])
    expect(component.inputs.jobs).toEqual(['', '', '', ''])
    expect(component.inputs.kids).toEqual(['', '', '', ''])
  })

  it('initializes magic number to 3', () => {
    const wrapper = mount(MashGame)
    const component = wrapper.vm
    
    expect(component.magicNumber).toBe(3)
  })

  it('eliminateItems function works correctly', () => {
    const wrapper = mount(MashGame)
    const component = wrapper.vm
    
    const items = ['A', 'B', 'C', 'D']
    const result = component.eliminateItems(items, 3)
    
    expect(typeof result).toBe('string')
    expect(['A', 'B', 'C', 'D']).toContain(result)
  })

  it('eliminateItems returns last remaining item', () => {
    const wrapper = mount(MashGame)
    const component = wrapper.vm
    
    const items = ['Only']
    const result = component.eliminateItems(items, 5)
    
    expect(result).toBe('Only')
  })

  it('playGame creates a result object', async () => {
    const wrapper = mount(MashGame)
    const component = wrapper.vm
    
    // Set up valid inputs
    component.inputs.spouses = ['Alice', 'Bob', 'Charlie', 'Diana']
    component.inputs.jobs = ['Teacher', 'Doctor', 'Artist', 'Chef']
    component.inputs.kids = [1, 2, 3, 4]
    component.magicNumber = 2
    
    component.playGame()
    
    expect(component.gameResult).toBeTruthy()
    expect(component.gameResult.home).toBeTruthy()
    expect(component.gameResult.spouse).toBeTruthy()
    expect(component.gameResult.job).toBeTruthy()
    expect(component.gameResult.kids).toBeTruthy()
  })

  it('resetGame clears result and resets step', () => {
    const wrapper = mount(MashGame)
    const component = wrapper.vm
    
    // Set some state
    component.gameResult = { home: 'test', spouse: 'test', job: 'test', kids: 'test' }
    component.currentStep = 3
    
    component.resetGame()
    
    expect(component.gameResult).toBeNull()
    expect(component.currentStep).toBe(0)
  })

  it('shows GameResult component after game is played', async () => {
    const wrapper = mount(MashGame)
    const component = wrapper.vm
    
    // Set up valid inputs and play game
    component.inputs.spouses = ['Alice', 'Bob', 'Charlie', 'Diana']
    component.inputs.jobs = ['Teacher', 'Doctor', 'Artist', 'Chef']
    component.inputs.kids = [1, 2, 3, 4]
    component.magicNumber = 2
    
    component.playGame()
    await wrapper.vm.$nextTick()
    
    expect(wrapper.findComponent({ name: 'GameResult' }).exists()).toBe(true)
    expect(wrapper.find('.input-section').exists()).toBe(false)
  })

  describe('Validation Integration', () => {
    it('canProceed returns false for invalid step 0 (homes)', () => {
      const wrapper = mount(MashGame)
      const component = wrapper.vm
      
      // Set current step to 0 and empty homes (though defaults exist)
      component.currentStep = 0
      component.inputs.homes = ['', '', '', '']
      component.validationStates = { 0: false }
      
      expect(component.canProceed).toBe(false)
    })

    it('canProceed returns true for valid step 0 (homes)', () => {
      const wrapper = mount(MashGame)
      const component = wrapper.vm
      
      component.currentStep = 0
      component.inputs.homes = ['House', 'Apartment', 'Mansion', 'Shack']
      component.validationStates = { 0: true }
      
      expect(component.canProceed).toBe(true)
    })

    it('canProceed returns false for invalid step 1 (spouses)', () => {
      const wrapper = mount(MashGame)
      const component = wrapper.vm
      
      component.currentStep = 1
      component.inputs.spouses = ['Alice', '', '', '']
      component.validationStates = { 1: false }
      
      expect(component.canProceed).toBe(false)
    })

    it('canProceed returns true for valid step 1 (spouses)', () => {
      const wrapper = mount(MashGame)
      const component = wrapper.vm
      
      component.currentStep = 1
      component.inputs.spouses = ['Alice', 'Bob', 'Charlie', 'Diana']
      component.validationStates = { 1: true }
      
      expect(component.canProceed).toBe(true)
    })

    it('canProceed returns false for invalid step 3 (kids)', () => {
      const wrapper = mount(MashGame)
      const component = wrapper.vm
      
      component.currentStep = 3
      component.inputs.kids = [1, '', '', '']
      component.validationStates = { 3: false }
      
      expect(component.canProceed).toBe(false)
    })

    it('canProceed returns false for invalid magic number', () => {
      const wrapper = mount(MashGame)
      const component = wrapper.vm
      
      component.currentStep = 4
      component.magicNumber = 15 // Out of range
      component.magicNumberError = 'Number must be between 1 and 10'
      
      expect(component.canProceed).toBe(false)
    })

    it('canProceed returns true for valid magic number', () => {
      const wrapper = mount(MashGame)
      const component = wrapper.vm
      
      component.currentStep = 4
      component.magicNumber = 5
      component.magicNumberError = null
      
      expect(component.canProceed).toBe(true)
    })

    it('validateMagicNumber sets error for invalid input', () => {
      const wrapper = mount(MashGame)
      const component = wrapper.vm
      
      component.magicNumber = 15
      component.validateMagicNumber()
      
      expect(component.magicNumberError).toBe('Number must be between 1 and 10')
    })

    it('validateMagicNumber sets error for non-integer', () => {
      const wrapper = mount(MashGame)
      const component = wrapper.vm
      
      component.magicNumber = 5.5
      component.validateMagicNumber()
      
      expect(component.magicNumberError).toBe('Please enter a whole number')
    })

    it('validateMagicNumber clears error for valid input', () => {
      const wrapper = mount(MashGame)
      const component = wrapper.vm
      
      component.magicNumber = 5
      component.validateMagicNumber()
      
      expect(component.magicNumberError).toBeNull()
    })

    it('clearMagicNumberError clears the error', () => {
      const wrapper = mount(MashGame)
      const component = wrapper.vm
      
      component.magicNumberError = 'Some error'
      component.clearMagicNumberError()
      
      expect(component.magicNumberError).toBeNull()
    })

    it('onValidationChange updates validation states', () => {
      const wrapper = mount(MashGame)
      const component = wrapper.vm
      
      component.onValidationChange(0, true)
      component.onValidationChange(1, false)
      
      expect(component.validationStates[0]).toBe(true)
      expect(component.validationStates[1]).toBe(false)
    })

    it('resetGame clears validation states and errors', () => {
      const wrapper = mount(MashGame)
      const component = wrapper.vm
      
      // Set some validation state and modify inputs
      component.validationStates = { 0: false, 1: true }
      component.magicNumberError = 'Some error'
      component.gameResult = { home: 'test' }
      component.currentStep = 2
      component.inputs.spouses = ['Modified', 'Values', 'Here', 'Test']
      component.inputs.jobs = ['Changed', 'Job', 'Values', 'Test']
      component.inputs.kids = [5, 3, 1, 2]
      component.magicNumber = 8
      
      component.resetGame()
      
      expect(component.validationStates).toEqual({})
      expect(component.magicNumberError).toBeNull()
      expect(component.gameResult).toBeNull()
      expect(component.currentStep).toBe(0)
      
      // Verify input values are reset to initial state
      expect(component.inputs.homes).toEqual(['Mansion', 'Apartment', 'Shack', 'House'])
      expect(component.inputs.spouses).toEqual(['', '', '', ''])
      expect(component.inputs.jobs).toEqual(['', '', '', ''])
      expect(component.inputs.kids).toEqual(['', '', '', ''])
      expect(component.magicNumber).toBe(3)
    })

    it('magic number input validation triggers on blur', async () => {
      const wrapper = mount(MashGame)
      
      // Navigate to magic number step by accessing the Carousel component
      const carousel = wrapper.findComponent({ name: 'Carousel' })
      const carouselComponent = carousel.vm
      carouselComponent.currentStep = 4
      await wrapper.vm.$nextTick()
      
      const magicInput = wrapper.find('.magic-number input')
      expect(magicInput.exists()).toBe(true)
      
      // Set invalid value and trigger blur
      await magicInput.setValue('15')
      await magicInput.trigger('blur')
      
      expect(wrapper.find('.magic-number .error-message').text()).toBe('Number must be between 1 and 10')
      expect(magicInput.classes()).toContain('error')
    })

    it('magic number error clears on input', async () => {
      const wrapper = mount(MashGame)
      const component = wrapper.vm
      
      // Navigate to magic number step by accessing the Carousel component
      const carousel = wrapper.findComponent({ name: 'Carousel' })
      const carouselComponent = carousel.vm
      carouselComponent.currentStep = 4
      component.magicNumberError = 'Some error'
      await wrapper.vm.$nextTick()
      
      const magicInput = wrapper.find('.magic-number input')
      expect(magicInput.exists()).toBe(true)
      
      await magicInput.setValue('5')
      
      expect(component.magicNumberError).toBeNull()
    })
  })
})