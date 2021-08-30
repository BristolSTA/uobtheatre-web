import { mount } from '@vue/test-utils'
import { expect } from 'chai'
import { DateTime } from 'luxon'

import PerformanceOverview from '@/components/performance/PerformanceOverview.vue'
import ProductionPerformances from '@/components/production/ProductionPerformances.vue'

import { fixTextSpacing, generateMountOptions } from '../../helpers.js'
import GenericNodeConnection from '../../fixtures/support/GenericNodeConnection.js'
import Production from '../../fixtures/Production.js'
import Performance from '../../fixtures/Performance.js'

describe('Production Performances', function () {
  let performancesContainer
  let fakeJestPush

  it('shows no performances available if none returned', () => {
    createWithPerformances([])
    expect(performancesContainer.text()).to.contain('No Upcoming Performances')
  })

  describe('With performances', () => {
    beforeEach(() => {
      createWithPerformances([
        // An available in-person & online performance
        {
          start: DateTime.fromISO('2020-11-28T16:00:00'),
          end: DateTime.fromISO('2020-11-28T18:00:00'),
          soldOut: false,
          disabled: false,
          isOnline: true,
          isInperson: true,
        },
        // A sold out performance
        {
          id: 2,
          start: DateTime.fromISO('2020-11-30T18:00:00'),
          end: DateTime.fromISO('2020-11-30T20:00:00'),
          soldOut: true,
          disabled: false,
          isOnline: true,
          isInperson: false,
        },
      ])
    })

    it('displays two performances', () => {
      expect(performancesContainer.findAll('.performance').length).to.eq(2)
    })

    it('displays the correct number of performance overviews', () => {
      const overviews =
        performancesContainer.findAllComponents(PerformanceOverview)
      const production = performancesContainer.vm.production
      expect(overviews.length).to.eq(2)
      expect(overviews.at(0).props('performance')).to.eq(
        production.performances.edges[0].node
      )
      expect(overviews.at(1).props('performance')).to.eq(
        production.performances.edges[1].node
      )
    })

    it('second performance is sold out and correct', () => {
      const performance = performancesContainer.findAll('.performance').at(1)

      expect(performance.text()).to.contain('Monday 30 Nov')
      expect(performance.find('div.bg-sta-green').exists()).to.be.false
      expect(performance.find('div.bg-sta-gray-dark').exists()).to.be.true
      expect(fixTextSpacing(performance.text())).to.contain('Online')
      expect(performance.text()).to.contain('Starting at 18:00')
      expect(performance.text()).to.contain('No Tickets Available')
      expect(performance.find('button').text()).to.eq('SOLD OUT')
    })

    it('sends user to warnings stage when they click book', async () => {
      await performancesContainer
        .findComponent(PerformanceOverview)
        .vm.$emit('select')
      expect(fakeJestPush.mock.calls.length).to.eq(1)
      expect(fakeJestPush.mock.calls[0][0]).to.eq(
        `/production/legally-ginger/book/${performancesContainer.vm.production.performances.edges[0].node.id}`
      )
    })
  })

  const createWithPerformances = (performances, productionOverrides) => {
    const production = Production(productionOverrides)
    production.performances = GenericNodeConnection(
      performances.map((performance) => Performance(performance))
    )

    performancesContainer = mount(
      ProductionPerformances,
      generateMountOptions(['router'], {
        propsData: {
          production,
        },

        mocks: {
          $router: {
            push: (fakeJestPush = jest.fn()),
          },
        },
      })
    )
  }
})
