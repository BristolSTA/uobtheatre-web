import { RouterLinkStub } from '@vue/test-utils'
import { expect } from 'chai'

import { mountWithRouterMock } from '../../helpers'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'

describe('Breadcrumbs', () => {
  let breadcrumsComponent

  beforeEach(async () => {
    breadcrumsComponent = await mountWithRouterMock(Breadcrumbs, {
      stubs: { 'font-awesome-icon': true },
      mocks: {
        $route: {
          fullPath: '/productions/legally-ginger/book'
        }
      },
      propsData: {
        crumbs: [
          { text: 'Whats On', path: '/productions' },
          {
            text: 'Legally Ginger',
            path: '/productions/legally-ginger'
          },
          { text: 'Book' }
        ]
      }
    })
  })

  it('has 2 chevrons', () => {
    expect(breadcrumsComponent.findAll('font-awesome-icon-stub')).length(2)
  })

  it('has corrct text', () => {
    expect(breadcrumsComponent.text()).to.contain('Whats On')
    expect(breadcrumsComponent.text()).to.contain('Legally Ginger')
    expect(breadcrumsComponent.text()).to.contain('Book')
  })

  it('has correct links', () => {
    expect(
      breadcrumsComponent.findAllComponents(RouterLinkStub).length
    ).to.equal(2)
    expect(
      breadcrumsComponent.findAllComponents(RouterLinkStub).at(0).props('to')
    ).to.equal('/productions')
    expect(
      breadcrumsComponent.findAllComponents(RouterLinkStub).at(1).props('to')
    ).to.equal('/productions/legally-ginger')
  })
})
