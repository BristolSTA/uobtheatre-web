import { RouterLinkStub } from '@vue/test-utils'
import { expect } from 'chai'
import gql from 'graphql-tag'
import { DateTime } from 'luxon'

import PerformanceOverview from '@/components/production/PerformanceOverview.vue'

import {
  mountWithRouterMock,
  executeWithServer,
  fixTextSpacing,
  runApolloQuery,
} from '../../helpers'

describe('Pick Performance Stage', () => {
  let performanceOverviewComponent
  let performance

  beforeAll(async () => {
    await executeWithServer(async (server) => {
      performance = server.create('performanceNode', {
        start: DateTime.fromISO('2020-11-28T16:00:00'),
        end: DateTime.fromISO('2020-11-28T18:10:00'),
        soldOut: false,
        disabled: false,
        isOnline: true,
        isInperson: true,
        venue: server.create('venueNode', {
          name: 'Winston Theatre',
          slug: 'winston-theatre',
        }),
      })
      const gqlResult = await runApolloQuery({
        query: gql`
          {performance(id: ${performance.id}) {
            start
            end
            durationMins
            soldOut
            disabled
            isOnline
            isInperson
            venue {
              name
              slug
            }
          }}
        `,
      })
      performance = gqlResult.data.performance
    })
    performanceOverviewComponent = await mountWithRouterMock(
      PerformanceOverview,
      {
        propsData: {
          performance,
        },
      }
    )
  })

  it('An available in-person & online performance', () => {
    expect(performanceOverviewComponent.text()).to.contain('Saturday 28 Nov')
    expect(performanceOverviewComponent.find('div.bg-sta-green').exists()).to.be
      .true
    expect(fixTextSpacing(performanceOverviewComponent.text())).to.contain(
      'Winston Theatre and Online'
    )
    expect(performanceOverviewComponent.find('a').text()).to.eq(
      'Winston Theatre'
    )
    expect(performanceOverviewComponent.text()).to.contain('Starting at 16:00')
    expect(performanceOverviewComponent.text()).to.contain(
      '2 hours, 10 minutes'
    )
    expect(performanceOverviewComponent.text()).to.contain('Tickets Available')
    expect(performanceOverviewComponent.find('button').text()).to.eq('Book')
  })

  it('has working venue link', () => {
    expect(
      performanceOverviewComponent
        .findAllComponents(RouterLinkStub)
        .at(0)
        .props('to')
    ).to.equal('/venue/winston-theatre')
  })

  it('has correct booking link', async () => {
    await performanceOverviewComponent.find('button').trigger('click')

    expect(performanceOverviewComponent.emitted('select').length).to.eq(1)
    expect(performanceOverviewComponent.emitted('select')[0][0]).to.equal(
      performance
    )
  })

  it('A disabled, in-person performance', async () => {
    await performanceOverviewComponent.setProps({
      performance: Object.assign({}, performance, {
        disabled: true,
        isOnline: false,
        isInperson: true,
      }),
    })

    expect(performanceOverviewComponent.find('div.bg-sta-green').exists()).to.be
      .false
    expect(performanceOverviewComponent.find('div.bg-sta-gray-dark').exists())
      .to.be.true
    expect(performanceOverviewComponent.find('a').text()).to.eq(
      'Winston Theatre'
    )
    expect(performanceOverviewComponent.text()).to.contain(
      'No Tickets Available'
    )
    expect(performanceOverviewComponent.find('button').text()).to.eq(
      'Unavailable'
    )
    expect(
      performanceOverviewComponent.find('button').attributes('disabled')
    ).to.eq('disabled')
  })

  it('A disabled, in-person performance', async () => {
    await performanceOverviewComponent.setProps({
      performance: Object.assign({}, performance, {
        soldOut: true,
        disabled: false,
        isOnline: true,
        isInperson: false,
      }),
    })

    expect(performanceOverviewComponent.find('div.bg-sta-green').exists()).to.be
      .false
    expect(performanceOverviewComponent.find('div.bg-sta-gray-dark').exists())
      .to.be.true
    expect(fixTextSpacing(performanceOverviewComponent.text())).to.contain(
      'Online'
    )
    expect(
      performanceOverviewComponent.findAllComponents(RouterLinkStub).length
    ).to.eq(0)
    expect(performanceOverviewComponent.text()).to.contain(
      'No Tickets Available'
    )
    expect(performanceOverviewComponent.find('button').text()).to.eq('SOLD OUT')
    expect(
      performanceOverviewComponent.find('button').attributes('disabled')
    ).to.eq('disabled')
  })
})
