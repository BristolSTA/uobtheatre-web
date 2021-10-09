import { expect } from 'chai'

import ProductionTile from '@/components/production/ProductionTile'
import InfiniteScroll from '@/components/ui/InfiniteScroll'
import UpcomingProductions from '@/pages/productions'

import {
  generateMountOptions,
  mountWithRouterMock,
  waitFor,
} from '../../helpers'
import GenericApolloResponse from '../../fixtures/support/GenericApolloResponse'
import GenericNodeConnection from '../../fixtures/support/GenericNodeConnection'
import Production from '../../fixtures/Production'

jest.mock('@/utils.js', () => ({
  ...jest.requireActual('@/utils.js'),
  isInViewport: jest.fn(() => false),
}))
describe('Upcoming Productions', () => {
  let upcomingProductionsComponent
  beforeEach(async () => {
    upcomingProductionsComponent = await mountWithRouterMock(
      UpcomingProductions,
      generateMountOptions(['apollo'], {
        apollo: {
          queryCallstack: [
            GenericApolloResponse('productions', GenericNodeConnection()),
          ],
        },
      })
    )
  })

  it('contains an infinite scroll instance', () => {
    expect(upcomingProductionsComponent.findComponent(InfiniteScroll).exists())
      .to.be.true
  })

  describe('with no productions', () => {
    it('displays no productions notice', async () => {
      await waitFor(
        () =>
          !upcomingProductionsComponent.findComponent(InfiniteScroll).vm.loading
      )
      expect(upcomingProductionsComponent.text()).to.contain(
        'There are currently no upcoming productions'
      )
    })
  })

  describe('with many productions', () => {
    let upcomingProductionsComponent
    beforeEach(async () => {
      upcomingProductionsComponent = await mountWithRouterMock(
        UpcomingProductions,
        generateMountOptions(['apollo'], {
          apollo: {
            queryCallstack: [
              GenericApolloResponse(
                'productions',
                GenericNodeConnection(Array(9).fill(Production()), {
                  hasNextPage: true,
                })
              ),
            ],
          },
        })
      )
    })

    it('fetches first 9 performances and displays loader', async () => {
      await waitFor(
        () =>
          !upcomingProductionsComponent.findComponent(InfiniteScroll).vm.loading
      )
      expect(
        upcomingProductionsComponent.findAllComponents(ProductionTile)
      ).length(9)
      expect(
        upcomingProductionsComponent
          .findComponent(ProductionTile)
          .props('production').name
      ).to.eq('Legally Ginger')

      expect(
        upcomingProductionsComponent
          .findComponent(InfiniteScroll)
          .findComponent({ ref: 'bottom-loader' })
          .exists()
      ).to.be.true
    })
  })

  describe('with some productions', () => {
    let upcomingProductionsComponent

    beforeEach(async () => {
      upcomingProductionsComponent = await mountWithRouterMock(
        UpcomingProductions,
        generateMountOptions(['apollo'], {
          apollo: {
            queryCallstack: [
              GenericApolloResponse(
                'productions',
                GenericNodeConnection(Array(3).fill(Production()))
              ),
            ],
          },
        })
      )
    })

    it('fetches all the productions and doesnt display loader', async () => {
      await waitFor(
        () =>
          !upcomingProductionsComponent.findComponent(InfiniteScroll).vm.loading
      )
      expect(
        upcomingProductionsComponent.findAllComponents(ProductionTile)
      ).length(3)
      expect(
        upcomingProductionsComponent
          .findComponent(ProductionTile)
          .props('production').name
      ).to.eq('Legally Ginger')

      expect(
        upcomingProductionsComponent
          .findComponent(InfiniteScroll)
          .findComponent({ ref: 'bottom-loader' })
          .exists()
      ).to.be.false
    })
  })
})
