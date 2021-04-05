import { mount } from '@vue/test-utils'
import { expect } from 'chai'

import FooterBar from '@/components/layout/FooterBar.vue'

import { fixTextSpacing } from '../../helpers'

describe('FooterBar', function () {
  let footerBarComponent

  beforeEach(() => {
    footerBarComponent = mount(FooterBar, {
      stubs: ['NuxtLink'],
    })
  })

  it('displays our name and current year', () => {
    expect(fixTextSpacing(footerBarComponent.text())).to.contain(
      `Bristol Stage Technicians' Association ${new Date().getFullYear()}`
    )
  })

  it('displays links correctly', async () => {
    // Set navbar's navigation links manually
    await footerBarComponent.setData({
      navItems: [
        ['/privacy', 'Privacy'],
        ['/terms', 'Terms'],
      ],
    })
    const links = footerBarComponent.findAll('ul nuxtlink-stub')

    expect(links.length).to.equal(2)

    // First link should direct to privacy
    expect(links.at(0).attributes('to')).to.equal('/privacy')
    expect(links.at(0).text()).to.equal('Privacy')

    // Second link should be terms
    expect(links.at(1).attributes('to')).to.equal('/terms')
    expect(links.at(1).text()).to.equal('Terms')
  })
})
