import { mount } from '@vue/test-utils'
import { expect } from 'chai'
import gql from 'graphql-tag'

import OverviewBox from '@/components/booking/overview/OverviewBox.vue'
import PerformanceOverview from '@/components/booking/overview/PerformanceOverview.vue'

import { executeWithServer, runApolloQuery } from '../../../helpers'

describe('Performance Overview', function () {
  let performanceOverviewComponent
  let production
  let performance

  beforeAll(async () => {
    await executeWithServer(async (server) => {
      production = server.create('productionNode', {
        name: 'Legally Ginger',
      })
      performance = server.create('performanceNode', {
        production,
        doorsOpen: '2020-12-25T09:00:00',
        start: '2020-12-25T10:00:00',
        end: '2020-12-25T12:00:00',
        soldOut: false,
      })

      const { data } = await runApolloQuery({
        query: gql`
          {
            performance(id: ${performance.id}) {
              start
              doorsOpen
              production {
                name
              }
            }
          }
        `,
      })

      performanceOverviewComponent = mount(PerformanceOverview, {
        propsData: {
          production: data.performance.production,
          performance: data.performance,
        },
      })
    })
  })

  it('has overview box component', () => {
    expect(performanceOverviewComponent.findComponent(OverviewBox).exists()).to
      .be.true
  })

  describe('performance overview component', () => {
    it('has the correct performance information', () => {
      expect(performanceOverviewComponent.text()).to.contain('Performance')
      expect(performanceOverviewComponent.text()).to.contain(
        'Friday 25 December 2020'
      )
      expect(performanceOverviewComponent.text()).to.contain(
        'Doors Open: 09:00'
      )
      expect(performanceOverviewComponent.text()).to.contain(
        'Performance Starts: 10:00'
      )
    })
  })
})
