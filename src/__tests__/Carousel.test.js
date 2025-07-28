import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Carousel from '../components/Carousel.vue'

describe('Carousel.vue', () => {
  const defaultProps = {
    steps: ['Step 1', 'Step 2', 'Step 3'],
    onComplete: vi.fn(),
    completeButtonText: 'Complete'
  }

  it('renders step indicators correctly', () => {
    const wrapper = mount(Carousel, { props: defaultProps })
    const stepDots = wrapper.findAll('.step-dot')
    
    expect(stepDots).toHaveLength(3)
    expect(stepDots[0].classes()).toContain('active')
    expect(stepDots[1].classes()).not.toContain('active')
    expect(stepDots[2].classes()).not.toContain('active')
  })

  it('renders navigation buttons correctly', () => {
    const wrapper = mount(Carousel, { props: defaultProps })
    
    const prevButton = wrapper.find('.prev-button')
    const nextButton = wrapper.find('.next-button')
    
    expect(prevButton.exists()).toBe(true)
    expect(nextButton.exists()).toBe(true)
    expect(prevButton.attributes('disabled')).toBeDefined()
  })

  it('navigates to next step correctly', async () => {
    const wrapper = mount(Carousel, { props: defaultProps })
    const nextButton = wrapper.find('.next-button')
    
    await nextButton.trigger('click')
    
    expect(wrapper.emitted('step-change')).toBeTruthy()
    expect(wrapper.emitted('step-change')[0][0]).toBe(1)
    
    const stepDots = wrapper.findAll('.step-dot')
    expect(stepDots[1].classes()).toContain('active')
  })

  it('navigates to previous step correctly', async () => {
    const wrapper = mount(Carousel, { props: defaultProps })
    
    // First go to step 2
    await wrapper.find('.next-button').trigger('click')
    // Then go back
    await wrapper.find('.prev-button').trigger('click')
    
    const stepDots = wrapper.findAll('.step-dot')
    expect(stepDots[0].classes()).toContain('active')
  })

  it('shows complete button on last step', async () => {
    const wrapper = mount(Carousel, { props: defaultProps })
    
    // Navigate to last step
    await wrapper.find('.next-button').trigger('click')
    await wrapper.find('.next-button').trigger('click')
    
    const completeButton = wrapper.find('.complete-button')
    expect(completeButton.exists()).toBe(true)
    expect(completeButton.text()).toBe('Complete')
    expect(wrapper.find('.next-button').exists()).toBe(false)
  })

  it('calls onComplete when complete button is clicked', async () => {
    const onComplete = vi.fn()
    const wrapper = mount(Carousel, { 
      props: { ...defaultProps, onComplete }
    })
    
    // Navigate to last step
    await wrapper.find('.next-button').trigger('click')
    await wrapper.find('.next-button').trigger('click')
    
    await wrapper.find('.complete-button').trigger('click')
    
    expect(onComplete).toHaveBeenCalled()
  })

  it('renders slot content with currentStep', () => {
    const wrapper = mount(Carousel, {
      props: defaultProps,
      slots: {
        default: '<div class="test-content">Step {{ currentStep }}</div>'
      }
    })
    
    expect(wrapper.find('.test-content').exists()).toBe(true)
  })

  describe('Validation State Handling', () => {
    it('disables next button when canProceed is false', async () => {
      const props = { ...defaultProps, canProceed: false }
      const wrapper = mount(Carousel, { props })
      
      const nextButton = wrapper.find('.next-button')
      expect(nextButton.attributes('disabled')).toBeDefined()
    })

    it('enables next button when canProceed is true', async () => {
      const props = { ...defaultProps, canProceed: true }
      const wrapper = mount(Carousel, { props })
      
      const nextButton = wrapper.find('.next-button')
      expect(nextButton.attributes('disabled')).toBeUndefined()
    })

    it('disables complete button when canProceed is false', async () => {
      const props = { ...defaultProps, canProceed: false }
      const wrapper = mount(Carousel, { props })
      
      // Navigate to last step
      const component = wrapper.vm
      component.currentStep = 2
      await wrapper.vm.$nextTick()
      
      const completeButton = wrapper.find('.complete-button')
      expect(completeButton.attributes('disabled')).toBeDefined()
    })

    it('enables complete button when canProceed is true', async () => {
      const props = { ...defaultProps, canProceed: true }
      const wrapper = mount(Carousel, { props })
      
      // Navigate to last step
      const component = wrapper.vm
      component.currentStep = 2
      await wrapper.vm.$nextTick()
      
      const completeButton = wrapper.find('.complete-button')
      expect(completeButton.attributes('disabled')).toBeUndefined()
    })

    it('prevents next button click when disabled', async () => {
      const props = { ...defaultProps, canProceed: false }
      const wrapper = mount(Carousel, { props })
      
      const nextButton = wrapper.find('.next-button')
      const initialStep = wrapper.vm.currentStep
      
      await nextButton.trigger('click')
      
      // Step should not have changed
      expect(wrapper.vm.currentStep).toBe(initialStep)
      expect(wrapper.emitted('step-change')).toBeFalsy()
    })

    it('prevents complete button click when disabled', async () => {
      const onComplete = vi.fn()
      const props = { ...defaultProps, canProceed: false, onComplete }
      const wrapper = mount(Carousel, { props })
      
      // Navigate to last step
      const component = wrapper.vm
      component.currentStep = 2
      await wrapper.vm.$nextTick()
      
      const completeButton = wrapper.find('.complete-button')
      await completeButton.trigger('click')
      
      // onComplete should not have been called
      expect(onComplete).not.toHaveBeenCalled()
    })

    it('allows next button click when enabled', async () => {
      const props = { ...defaultProps, canProceed: true }
      const wrapper = mount(Carousel, { props })
      
      const nextButton = wrapper.find('.next-button')
      
      await nextButton.trigger('click')
      
      expect(wrapper.vm.currentStep).toBe(1)
      expect(wrapper.emitted('step-change')).toBeTruthy()
    })

    it('allows complete button click when enabled', async () => {
      const onComplete = vi.fn()
      const props = { ...defaultProps, canProceed: true, onComplete }
      const wrapper = mount(Carousel, { props })
      
      // Navigate to last step
      const component = wrapper.vm
      component.currentStep = 2
      await wrapper.vm.$nextTick()
      
      const completeButton = wrapper.find('.complete-button')
      await completeButton.trigger('click')
      
      expect(onComplete).toHaveBeenCalled()
    })

    it('canProceed defaults to true when not provided', () => {
      const props = { ...defaultProps }
      delete props.canProceed
      const wrapper = mount(Carousel, { props })
      
      const nextButton = wrapper.find('.next-button')
      expect(nextButton.attributes('disabled')).toBeUndefined()
    })

    it('updates button states when canProceed prop changes', async () => {
      const wrapper = mount(Carousel, { 
        props: { ...defaultProps, canProceed: true }
      })
      
      const nextButton = wrapper.find('.next-button')
      expect(nextButton.attributes('disabled')).toBeUndefined()
      
      // Change canProceed to false
      await wrapper.setProps({ canProceed: false })
      
      expect(nextButton.attributes('disabled')).toBeDefined()
      
      // Change back to true
      await wrapper.setProps({ canProceed: true })
      
      expect(nextButton.attributes('disabled')).toBeUndefined()
    })
  })
})