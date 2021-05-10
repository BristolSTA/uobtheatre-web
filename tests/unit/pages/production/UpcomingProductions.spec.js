import { expect } from 'chai'

import ProductionTile from '@/components/production/ProductionTile'
import InfiniteScroll from '@/components/ui/InfiniteScroll'
import UpcomingProductions from '@/pages/productions'

import {
  executeWithServer,
  generateMountOptions,
  mountWithRouterMock,
  waitFor,
} from '../../helpers'

describe('Upcoming Productions', () => {
  let upcomingProductionsComponent, server
  beforeAll(async () => {
    server = await executeWithServer(() => {}, false)
  })
  afterAll(() => {
    server.shutdown()
  })
  beforeEach(async () => {
    upcomingProductionsComponent = await mountWithRouterMock(
      UpcomingProductions,
      generateMountOptions(['apollo'])
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
    beforeAll(() => {
      // Seed 3 x 9 performances
      server.create('productionNode', {
        name: 'Legally Ginger',
      })
      server.createList('productionNode', 9)
    })

    afterAll(() => {
      server.db.emptyData()
    })

    beforeEach(async () => {
      upcomingProductionsComponent = await mountWithRouterMock(
        UpcomingProductions,
        generateMountOptions(['apollo'])
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
    beforeAll(() => {
      server.create('productionNode', {
        name: 'Legally Ginger',
      })
      server.createList('productionNode', 2)
    })

    afterAll(() => {
      server.db.emptyData()
    })

    beforeEach(async () => {
      upcomingProductionsComponent = await mountWithRouterMock(
        UpcomingProductions,
        generateMountOptions(['apollo'])
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
