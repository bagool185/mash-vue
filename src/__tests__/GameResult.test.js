import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import GameResult from '../components/GameResult.vue'

describe('GameResult.vue', () => {
  const defaultProps = {
    result: {
      home: 'Mansion',
      spouse: 'John Doe',
      job: 'Engineer',
      kids: '2'
    },
    onReset: vi.fn()
  }

  it('renders the result title', () => {
    const wrapper = mount(GameResult, { props: defaultProps })
    expect(wrapper.find('h2').text()).toBe('Your MASH Result:')
  })

  it('displays all result properties correctly', () => {
    const wrapper = mount(GameResult, { props: defaultProps })
    const paragraphs = wrapper.findAll('.result p')
    
    expect(paragraphs).toHaveLength(4)
    expect(paragraphs[0].text()).toContain('Home: Mansion')
    expect(paragraphs[1].text()).toContain('Spouse: John Doe')
    expect(paragraphs[2].text()).toContain('Job: Engineer')
    expect(paragraphs[3].text()).toContain('Kids: 2')
  })

  it('calls onReset when reset button is clicked', async () => {
    const onReset = vi.fn()
    const wrapper = mount(GameResult, { 
      props: { ...defaultProps, onReset }
    })
    
    await wrapper.find('.reset-button').trigger('click')
    
    expect(onReset).toHaveBeenCalled()
  })

  it('renders reset button with correct text', () => {
    const wrapper = mount(GameResult, { props: defaultProps })
    const resetButton = wrapper.find('.reset-button')
    
    expect(resetButton.exists()).toBe(true)
    expect(resetButton.text()).toBe('Play Again')
  })

  it('has correct CSS classes', () => {
    const wrapper = mount(GameResult, { props: defaultProps })
    
    expect(wrapper.find('.result-section').exists()).toBe(true)
    expect(wrapper.find('.result').exists()).toBe(true)
    expect(wrapper.find('.reset-button').exists()).toBe(true)
  })
})