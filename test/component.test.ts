import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MobileFooter from '../src/components/MobileFooter.vue'

describe('MobileFooter.vue', () => {
  it('should render', () => {
    const wrapper = mount(MobileFooter)
    expect(wrapper.text()).toContain('Rechercher')
    // expect(wrapper.html()).toMatchSnapshot()
  })

  //   it('should be interactive', async () => {
  //     const wrapper = mount(MobileFooter, { props: { initial: 0 } })
  //     expect(wrapper.text()).toContain('0')

  //     expect(wrapper.find('.inc').exists()).toBe(true)

  //     expect(wrapper.find('.dec').exists()).toBe(true)

  //     await wrapper.get('.inc').trigger('click')

  //     expect(wrapper.text()).toContain('1')

  //     await wrapper.get('.dec').trigger('click')

//     expect(wrapper.text()).toContain('0')
//   })
})