import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'
import MashGame from '../components/MashGame.vue'

describe('App.vue', () => {
  it('renders the app title', () => {
    const wrapper = mount(App)
    expect(wrapper.find('h1').text()).toBe('MASH Game')
  })

  it('contains the MashGame component', () => {
    const wrapper = mount(App)
    expect(wrapper.findComponent(MashGame).exists()).toBe(true)
  })

  it('has correct CSS classes', () => {
    const wrapper = mount(App)
    expect(wrapper.find('#app').exists()).toBe(true)
  })
})