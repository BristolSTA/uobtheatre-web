import { expect } from 'chai'

import ProductionBanner from '@/components/production/ProductionBanner.vue'
import ProductionHeader from '@/components/production/ProductionHeader.vue'

import { mountWithRouterMock } from '../../helpers'
import Production from '../../fixtures/Production'

describe('ProductionHeader', function () {
  let headerContainer
  let productionData

  beforeAll(async () => {
    productionData = Production()
    headerContainer = await mountWithRouterMock(ProductionHeader, {
      propsData: {
        production: productionData,
      },
    })
  })

  it('contains a production banner', () => {
    expect(headerContainer.findComponent(ProductionBanner).exists()).to.be.true
    expect(
      headerContainer.findComponent(ProductionBanner).props('production')
    ).to.eq(productionData)
  })

  it('emits scroll-to-tickets event', async () => {
    await headerContainer
      .findComponent(ProductionBanner)
      .vm.$emit('on-buy-tickets-click')
    expect(headerContainer.emitted('scroll-to-tickets').length).to.eq(1)
  })
})
