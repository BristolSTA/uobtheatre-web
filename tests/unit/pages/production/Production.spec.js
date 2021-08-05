import { expect } from 'chai'

import ProductionPage from '@/pages/production/_slug/index'
import ProductionCastCredits from '@/components/production/ProductionCastCredits.vue'
import ProductionOverview from '@/components/production/ProductionOverview.vue'
import ProductionHeader from '@/components/production/ProductionHeader.vue'
import ProductionPerformances from '@/components/production/ProductionPerformances.vue'

import {
  generateMountOptions,
  mountWithRouterMock,
  waitFor,
} from '../../helpers'
import GenericApolloResponse from '../../fixtures/support/GenericApolloResponse'
import Production from '../../fixtures/Production'

describe('Production', function () {
  let productionPageComponent,
    headerComponent,
    castCreditsComponent,
    performancesComponent,
    overviewComponent

  beforeEach(async () => {
    productionPageComponent = await mountWithRouterMock(
      ProductionPage,
      generateMountOptions(['apollo'], {
        apollo: {
          queryCallstack: [GenericApolloResponse('production', Production())],
        },
      }),
      {
        params: {
          slug: 'legally-ginger',
        },
      }
    )
  })

  const findComponents = () => {
    headerComponent = productionPageComponent.findComponent(ProductionHeader)
    castCreditsComponent = productionPageComponent.findComponent(
      ProductionCastCredits
    )
    overviewComponent =
      productionPageComponent.findComponent(ProductionOverview)
    performancesComponent = productionPageComponent.findComponent(
      ProductionPerformances
    )
  }

  it('contains the correct components', () => {
    findComponents()

    expect(headerComponent.exists()).to.be.true
    expect(overviewComponent.exists()).to.be.true
    expect(performancesComponent.exists()).to.be.true

    expect(headerComponent.props('production').name).to.eq('Legally Ginger')
    expect(overviewComponent.props('production').name).to.eq('Legally Ginger')
    expect(performancesComponent.props('production').name).to.eq(
      'Legally Ginger'
    )
  })

  it('can show cast credits component', async () => {
    await productionPageComponent.setData({
      overview: false,
    })
    findComponents()

    expect(castCreditsComponent.exists()).to.be.true

    expect(castCreditsComponent.props('production').name).to.eq(
      'Legally Ginger'
    )
  })

  it('fetches the production', async () => {
    await waitFor(() => productionPageComponent.vm.production)
    expect(productionPageComponent.vm.production.name).to.eq('Legally Ginger')
  })
})
