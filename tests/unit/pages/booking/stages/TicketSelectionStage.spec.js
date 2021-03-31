import { mount } from '@vue/test-utils'
import { expect } from 'chai'
import gql from 'graphql-tag'
import lo from 'lodash'

import Booking from '@/classes/Booking'
import Ticket from '@/classes/Ticket'
import TicketsMatrix from '@/classes/TicketsMatrix'
import SeatGroup from '@/components/booking/SeatGroup.vue'
import ProductionFragment from '@/graphql/fragments/ProductionFragment.gql'
import PerformanceTicketOptionsQuery from '@/graphql/queries/PerformanceTicketOptions.gql'
import TicketSelectionStage from '@/pages/production/_slug/book/_performanceId/tickets.vue'

import FakePerformance from '../../../fixtures/FakePerformance'
import {
  executeWithServer,
  generateMountOptions,
  runApolloQuery,
} from '../../../helpers'

describe('Ticket Selection Stage', () => {
  let stageComponent
  let server
  let ticketTypes
  let production
  let performanceModel

  beforeEach(async () => {
    server = await executeWithServer(async (server) => {
      performanceModel = server.create(
        'performanceNode',
        FakePerformance(server)
      )

      let gqlResult = await runApolloQuery({
        query: gql`
          query production{
            production(slug: "${performanceModel.production.slug}") {
              ...ProductionBasicInfo
            }
          }
          ${ProductionFragment}
        `,
      })
      production = gqlResult.data.production

      gqlResult = await runApolloQuery({
        query: PerformanceTicketOptionsQuery,
        variables: {
          id: performanceModel.id,
        },
      })
      const ticketOptions = gqlResult.data.performance

      ticketTypes = new TicketsMatrix(ticketOptions)
      const booking = new Booking()
      booking.performance = production.performances.edges[0].node

      stageComponent = mount(
        TicketSelectionStage,
        generateMountOptions(['apollo'], {
          propsData: {
            production,
            booking,
            ticketMatrix: ticketTypes,
          },
        })
      )
    }, false)
  })

  afterEach(() => {
    server.shutdown()
  })

  it('displays the available seat locations', async () => {
    const seatGroupComponents = stageComponent.findAllComponents(SeatGroup)
    expect(seatGroupComponents.length).to.eq(2)
    expect(
      seatGroupComponents.at(0).props('ticketOption').seatGroup.name
    ).to.eq('Best seats in the house')
    expect(
      seatGroupComponents.at(1).props('ticketOption').seatGroup.name
    ).to.eq('The Meh Seats')
    expect(seatGroupComponents.at(1).props('discounts').length).to.eq(1)
    expect(seatGroupComponents.at(1).props('currentTickets').length).to.eq(0)
    expect(seatGroupComponents.at(1).props('groupCapacityRemaining')).to.eq(10)

    ticketTypes.performanceCapacityRemaining = 5
    await stageComponent.vm.$forceUpdate()

    expect(seatGroupComponents.at(1).props('groupCapacityRemaining')).to.eq(5)

    await stageComponent.vm.booking.tickets.push(
      new Ticket(
        performanceModel.ticketOptions.models[0].seatGroup.id,
        performanceModel.ticketOptions.models[0].concessionTypes.models[0].concessionType.id
      )
    )

    expect(seatGroupComponents.at(1).props('currentTickets').length).to.eq(1)
  })

  it('reacts to select location event and toggles accordion', async () => {
    // By default, all should be collpased
    const seatGroupComponents = stageComponent.findAllComponents(SeatGroup)
    expect(
      !seatGroupComponents.at(0).props('expanded') &&
        !seatGroupComponents.at(0).props('expanded')
    ).to.be.true

    await seatGroupComponents.at(0).vm.$emit('select-location')

    expect(seatGroupComponents.at(0).props('expanded')).to.be.true
    expect(seatGroupComponents.at(1).props('expanded')).to.be.false

    await seatGroupComponents.at(1).vm.$emit('select-location')
    expect(seatGroupComponents.at(0).props('expanded')).to.be.false
    expect(seatGroupComponents.at(1).props('expanded')).to.be.true

    await seatGroupComponents.at(1).vm.$emit('select-location')
    expect(seatGroupComponents.at(0).props('expanded')).to.be.false
    expect(seatGroupComponents.at(1).props('expanded')).to.be.false
  })

  it('reacts to add ticket event', async () => {
    stageComponent.vm.interaction_timer = jest.fn()
    await stageComponent
      .findComponent(SeatGroup)
      .vm.$emit(
        'add-ticket',
        ticketTypes.ticketOptions[0].seatGroup,
        ticketTypes.ticketOptions[0].concessionTypes[0].concessionType
      )
    expect(stageComponent.vm.booking.tickets.length).to.eq(1)
    expect(stageComponent.vm.booking.tickets[0].seatGroup.id).to.eq('1')
    expect(stageComponent.vm.booking.tickets[0].concessionType.id).to.eq('1')
    expect(stageComponent.vm.interaction_timer.mock.calls.length).to.eq(1)
  })

  it('reacts to add ticket event (multiple)', async () => {
    stageComponent.vm.interaction_timer = jest.fn()
    await stageComponent
      .findComponent(SeatGroup)
      .vm.$emit(
        'add-ticket',
        ticketTypes.ticketOptions[0].seatGroup,
        ticketTypes.ticketOptions[0].concessionTypes[0].concessionType,
        3
      )
    expect(stageComponent.vm.booking.tickets.length).to.eq(3)
    expect(stageComponent.vm.booking.tickets[0].seatGroup.id).to.eq('1')
    expect(stageComponent.vm.booking.tickets[0].concessionType.id).to.eq('1')
    expect(stageComponent.vm.interaction_timer.mock.calls.length).to.eq(1)
  })

  it('reacts to set ticket number event', async () => {
    stageComponent.vm.interaction_timer = jest.fn()
    await stageComponent
      .findComponent(SeatGroup)
      .vm.$emit(
        'set-tickets',
        ticketTypes.ticketOptions[0].seatGroup,
        ticketTypes.ticketOptions[0].concessionTypes[0].concessionType,
        2
      )
    expect(stageComponent.vm.booking.tickets.length).to.eq(2)
    expect(stageComponent.vm.booking.tickets[0].seatGroup.id).to.eq('1')
    expect(stageComponent.vm.booking.tickets[0].concessionType.id).to.eq('1')
    expect(stageComponent.vm.interaction_timer.mock.calls.length).to.eq(1)
  })

  it('reacts to remove ticket event', async () => {
    stageComponent.vm.interaction_timer = jest.fn()
    stageComponent.vm.booking.tickets = [
      new Ticket(
        performanceModel.ticketOptions.models[0].seatGroup.id,
        performanceModel.ticketOptions.models[0].concessionTypes.models[0].concessionType.id
      ),
    ]
    await stageComponent
      .findComponent(SeatGroup)
      .vm.$emit(
        'remove-ticket',
        ticketTypes.ticketOptions[0].seatGroup,
        ticketTypes.ticketOptions[0].concessionTypes[0].concessionType
      )
    expect(stageComponent.vm.booking.tickets.length).to.eq(0)
    expect(stageComponent.vm.interaction_timer.mock.calls.length).to.eq(1)
  })

  it('calls update API once interaction timer debounced', () => {
    jest.spyOn(lo, 'debounce')

    stageComponent = mount(TicketSelectionStage, {
      propsData: {
        production,
        booking: stageComponent.vm.booking,
        ticketMatrix: ticketTypes,
      },
    })
    expect(lo.debounce.mock.calls.length).to.eq(1)
    expect(lo.debounce.mock.calls[0][0]).to.eq(stageComponent.vm.updateAPI)
    expect(lo.debounce.mock.calls[0][1]).to.eq(2000)

    lo.debounce.mockReset()
  })

  describe('with selected tickets', () => {
    beforeEach(async () => {
      const booking = new Booking()
      booking.performance = production.performances.edges[0].node
      booking.tickets = [
        new Ticket(
          performanceModel.ticketOptions.models[0].seatGroup.id,
          performanceModel.ticketOptions.models[0].concessionTypes.models[0].concessionType.id
        ),
        new Ticket(
          performanceModel.ticketOptions.models[0].seatGroup.id,
          performanceModel.ticketOptions.models[0].concessionTypes.models[0].concessionType.id
        ),
        new Ticket(
          performanceModel.ticketOptions.models[0].seatGroup.id,
          performanceModel.ticketOptions.models[0].concessionTypes.models[1].concessionType.id
        ),
        new Ticket(
          performanceModel.ticketOptions.models[1].seatGroup.id,
          performanceModel.ticketOptions.models[0].concessionTypes.models[1].concessionType.id
        ),
      ]
      await stageComponent.setProps({
        booking,
      })
    })

    it('displays selected tickets', () => {
      expect(stageComponent.text()).to.contain('Selected Tickets')
      const overview = stageComponent.find('table')

      // 3 unique combinations of seat group + conession type
      expect(overview.findAll('tbody tr').length).to.eq(3)

      // Test the first row
      const columns = overview.findAll('tbody tr:first-of-type td')
      expect(columns.at(0).text()).to.eq('Best seats in the house')
      expect(columns.at(1).text()).to.eq('Adult')
      expect(columns.at(2).text()).to.eq('2')
      expect(columns.at(3).text()).to.eq('£20.00')
    })

    it('shows discount line if discount applied', async () => {
      await stageComponent.vm.updateAPI() // Need to fetch from API to get discount on the tickets

      expect(
        stageComponent.find('table tfoot tr:first-of-type th').text()
      ).to.eq('Discounts')
      expect(
        stageComponent
          .find('table tfoot tr:first-of-type td:last-of-type')
          .text()
      ).to.eq('-£0.50') // Fake API will do discount * 100 (pennies)

      // Delete the discount
      performanceModel.discounts.models[0].destroy()

      await stageComponent.vm.updateAPI() // Need to fetch from API to get discount on the tickets
      expect(stageComponent.find('table').text()).not.to.contain('Discounts')
    })

    it('shows subtotal', async () => {
      await stageComponent.vm.updateAPI() // Need to fetch from API to get discount on the tickets

      expect(
        stageComponent.find('table tfoot tr:last-of-type').text()
      ).to.contain('Subtotal')
      expect(
        stageComponent.find('table tfoot tr:last-of-type').text()
      ).to.contain('£35.50') // £3.00 of tickets - £0.50 of discount
    })

    it('shows loading spinner for subtotal while dirty', async () => {
      expect(stageComponent.find('table').text()).to.contain('Subtotal')
      expect(stageComponent.findComponent({ ref: 'subtotalSpinner' }).exists())
        .to.be.true

      await stageComponent.vm.updateAPI()

      expect(stageComponent.findComponent({ ref: 'subtotalSpinner' }).exists())
        .not.to.be.true
    })
  })
})
