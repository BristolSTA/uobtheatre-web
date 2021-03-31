import { expect } from 'chai'

import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import ProductionPage from '@/pages/production/_slug/index'
import ProductionCastCredits from '@/components/production/ProductionCastCredits.vue'
import ProductionHeader from '@/components/production/ProductionHeader.vue'
import ProductionPerformances from '@/components/production/ProductionPerformances.vue'

import {
  assertNoVisualDifference,
  executeWithServer,
  mountWithRouterMock,
  waitFor,
} from '../../helpers'

describe('Production', function () {
  let productionPageComponent
  let server

  let headerComponent, castCreditsComponent, performancesComponent

  beforeEach(async () => {
    server = await executeWithServer(async (server) => {
      // Create a production
      server.create('productionNode', {
        name: 'Legally Ginger',
        slug: 'legally-ginger',
      })

      productionPageComponent = await mountWithRouterMock(
        ProductionPage,
        {},
        {
          params: {
            slug: 'legally-ginger',
          },
        }
      )
    }, false)
  })

  afterEach(() => {
    server.shutdown()
  })

  const findComponents = () => {
    headerComponent = productionPageComponent.findComponent(ProductionHeader)
    castCreditsComponent = productionPageComponent.findComponent(
      ProductionCastCredits
    )
    performancesComponent = productionPageComponent.findComponent(
      ProductionPerformances
    )
  }

  it('contains the correct components', () => {
    findComponents()

    expect(headerComponent.exists()).to.be.true
    expect(castCreditsComponent.exists()).to.be.true
    expect(performancesComponent.exists()).to.be.true

    expect(headerComponent.props('production').name).to.eq('Legally Ginger')
    expect(castCreditsComponent.props('production').name).to.eq(
      'Legally Ginger'
    )
    expect(performancesComponent.props('production').name).to.eq(
      'Legally Ginger'
    )
  })

  it('fetches the production', async () => {
    await waitFor(() => productionPageComponent.vm.production)
    expect(productionPageComponent.vm.production.name).to.eq('Legally Ginger')
  })

  it('has correct breadcrumbs', () => {
    const breadcrumbs = productionPageComponent.findComponent(Breadcrumbs)
    expect(breadcrumbs.exists()).to.be.true

    assertNoVisualDifference(breadcrumbs.props('crumbs'), [
      { text: 'Whats On', route: '/productions' },
      {
        text: 'Legally Ginger',
      },
    ])
  })
})
