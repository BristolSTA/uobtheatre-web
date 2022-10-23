import { expect } from 'chai'

import { generateMountOptions, mountWithRouterMock } from '../../helpers'
import GenericApolloResponse from '../../fixtures/support/GenericApolloResponse'
import Production from '../../fixtures/Production'
import ProductionPage from '@/pages/production/_slug/index'
import ProductionCastCredits from '@/components/production/ProductionCastCredits.vue'
import ProductionOverview from '@/components/production/ProductionOverview.vue'
import ProductionBanner from '@/components/production/ProductionBanner.vue'
import ProductionPerformances from '@/components/production/ProductionPerformances.vue'

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
          queryCallstack: [GenericApolloResponse('production', Production())]
        }
      }),
      {
        params: {
          slug: 'legally-ginger'
        }
      }
    )
  })

  const findComponents = () => {
    headerComponent = productionPageComponent.findComponent(ProductionBanner)
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
      overview: false
    })
    findComponents()

    expect(castCreditsComponent.exists()).to.be.true

    expect(castCreditsComponent.props('production').name).to.eq(
      'Legally Ginger'
    )
  })

  it('fetches the production', async () => {
    await productionPageComponent.vm.$nextTick()
    expect(productionPageComponent.vm.production.name).to.eq('Legally Ginger')
  })
})
