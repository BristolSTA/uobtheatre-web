import { expect } from 'chai'
import { DateTime } from 'luxon'

import Booking from '@/classes/Booking'
import Ticket from '@/classes/Ticket'
import TicketsMatrix from '@/classes/TicketsMatrix'
import { generateConcessionTypeBookingTypes } from '@/fakeApi/utils'

import FakeBooking from '../fixtures/FakeBooking'
import FakePerformance from '../fixtures/FakePerformance'
import {
  assertNoVisualDifference,
  executeWithServer,
  runApolloQuery,
} from '../helpers'
describe('Booking Class', () => {
  /** @member {Booking} */
  let booking
  let seatGroup
  let concession100Edge
  let concession1000Edge
  let concession500Edge
  let ticketsMatrix
  let bookingAPIData

  jest.spyOn(DateTime, 'local')

  beforeAll(async () => {
    await executeWithServer(async (server) => {
      const performance = server.create(
        'performanceNode',
        Object.assign({}, FakePerformance(server), {
          ticketOptions: [
            server.create('PerformanceSeatGroupNode', {
              capacityRemaining: 100,
              seatGroup: server.create('seatGroupNode'),
              concessionTypes: generateConcessionTypeBookingTypes(
                [
                  server.create('concessionTypeNode'),
                  server.create('concessionTypeNode'),
                  server.create('concessionTypeNode'),
                ],
                server,
                [{ price: 100 }, { price: 1000 }, { price: 500 }]
              ),
            }),
          ],
        })
      )

      seatGroup = performance.ticketOptions.models[0].seatGroup
      concession100Edge =
        performance.ticketOptions.models[0].concessionTypes.models[0]
      concession1000Edge =
        performance.ticketOptions.models[0].concessionTypes.models[1]
      concession500Edge =
        performance.ticketOptions.models[0].concessionTypes.models[2]

      const { data } = await runApolloQuery({
        query: require('@/graphql/queries/PerformanceTicketOptions.gql'),
        variables: {
          id: performance.id,
        },
      })
      ticketsMatrix = new TicketsMatrix(data.performance)

      const bookingModel = FakeBooking(server)
      const gqlResult = await runApolloQuery({
        query: require('@/graphql/queries/BookingInformation.gql'),
        variables: {
          bookingId: bookingModel.id,
        },
      })
      bookingAPIData = gqlResult.data.booking
    })
  })

  beforeEach(() => {
    booking = new Booking()
    booking.dirty = false
  })

  const fakeTicket = (concessionEdge = null) => {
    return new Ticket(
      seatGroup.id,
      concessionEdge
        ? concessionEdge.concessionType.id
        : concession100Edge.concessionType.id
    )
  }

  it('can be constructed from API data', async () => {
    let apiData
    await executeWithServer(async (server) => {
      const bookingModel = FakeBooking(server)
      const { data } = await runApolloQuery({
        query: require('@/graphql/queries/BookingInformation.gql'),
        variables: {
          bookingId: bookingModel.id,
        },
      })
      apiData = data.booking
    })
    booking = Booking.fromAPIData(apiData)
    expect(booking).to.be.instanceOf(Booking)
    expect(booking.priceBreakdown).to.eq(apiData.priceBreakdown)
    expect(booking.tickets.length).to.eq(4)
    expect(booking.performance).to.eq(apiData.performance)
    expect(booking.dirty).to.be.false
  })
  it('can get tickets', () => {
    expect(booking.tickets).to.be.instanceOf(Array)
    expect(booking.tickets).to.be.empty

    booking.tickets.push(['An Item'])

    expect(booking.tickets.length).to.eq(1)
  })
  it('can add a ticket', () => {
    const ticket = fakeTicket()
    booking.addTicket(ticket, ticketsMatrix)

    expect(booking.tickets).to.include(ticket)
    expect(booking.dirty).to.be.true
  })

  it('cant add a ticket if matrix doesnt allow', () => {
    const ticket = fakeTicket()
    jest.spyOn(ticketsMatrix, 'canAddTickets').mockReturnValueOnce(false)
    booking.addTicket(ticket, ticketsMatrix)

    expect(booking.tickets).not.to.include(ticket)
    expect(booking.dirty).to.be.false
  })

  it('can set number of tickets', () => {
    booking.setTicketCount(seatGroup, concession100Edge, 10, ticketsMatrix)
    expect(booking.ticketCount(seatGroup, concession100Edge)).to.eq(10)

    booking.setTicketCount(seatGroup, concession100Edge, 5, ticketsMatrix)
    expect(booking.ticketCount(seatGroup, concession100Edge)).to.eq(5)

    booking.setTicketCount(seatGroup, concession100Edge, 0, ticketsMatrix)
    expect(booking.ticketCount(seatGroup, concession100Edge)).to.eq(0)

    booking.setTicketCount(null, null, 0, ticketsMatrix)
    expect(booking.tickets.length).to.eq(0)

    expect(booking.dirty).to.be.true
  })

  describe('Matching Tickets', () => {
    let ticket1
    let ticket2
    let ticket3
    let ticket4
    beforeEach(() => {
      ticket1 = fakeTicket(concession100Edge)
      ticket2 = fakeTicket(concession1000Edge)
      ticket3 = fakeTicket(concession500Edge)
      ticket4 = new Ticket(2, concession100Edge.concessionType.id)
      booking.tickets = [ticket1, ticket2, ticket3, ticket4]
    })

    it('can find matching tickets', () => {
      expect(booking.findTickets()).to.include(
        ticket1,
        ticket2,
        ticket3,
        ticket4
      )

      expect(booking.findTickets({ id: 2 })).to.include(ticket4)
      expect(
        booking.findTickets(null, concession100Edge.concessionType)
      ).to.include(ticket1, ticket4)
      expect(booking.findTickets({ id: 4 }, { id: 100 })).to.be.empty
    })

    it('can find number of matching tickets', () => {
      expect(booking.ticketCount()).to.eq(4)

      expect(booking.ticketCount({ id: 2 })).to.eq(1)
      expect(booking.ticketCount(null, concession100Edge.concessionType)).to.eq(
        2
      )
      expect(booking.ticketCount({ id: 4 }, { id: 100 })).to.eq(0)
    })
  })

  it('can remove a single ticket', () => {
    const t1 = fakeTicket()
    const t2 = fakeTicket()
    const t3 = fakeTicket(concession1000Edge)
    booking.tickets = [t1, t2, t3]

    booking.removeTicket(
      seatGroup,
      concession100Edge.concessionType,
      ticketsMatrix
    )

    expect(booking.tickets.length).to.eq(2)
    expect(booking.tickets).to.include(t1, t3)
    expect(booking.dirty).to.be.true
  })

  it('can clear tickets', () => {
    booking.tickets = [1, 2, 3]

    booking.clearTickets()

    expect(booking.tickets.length).to.eq(0)
    expect(booking.dirty).to.be.true
  })
  it('can get tickets total price estimate in pennies', () => {
    expect(booking.ticketsTotalPriceEstimate(ticketsMatrix)).to.eq(0)

    booking.tickets = [
      fakeTicket(concession100Edge),
      fakeTicket(concession1000Edge),
      fakeTicket(concession500Edge),
    ]
    expect(booking.ticketsTotalPriceEstimate(ticketsMatrix)).to.eq(1600)
  })
  it('can get tickets total price estimate in pounds', () => {
    expect(booking.ticketsTotalPricePoundsEstimate(ticketsMatrix)).to.eq('0.00')

    booking.tickets = [
      fakeTicket(concession100Edge),
      fakeTicket(concession1000Edge),
      fakeTicket(concession500Edge),
    ]

    expect(booking.ticketsTotalPricePoundsEstimate(ticketsMatrix)).to.eq(
      '16.00'
    )
  })
  it('can get total booking price in pounds', () => {
    expect(booking.totalPrice).to.eq(0)

    booking.priceBreakdown = bookingAPIData.priceBreakdown

    expect(booking.totalPrice).to.eq(3728)
  })
  it('can get total booking price in pounds', () => {
    expect(booking.totalPricePounds).to.eq('0.00')

    booking.priceBreakdown = bookingAPIData.priceBreakdown

    expect(booking.totalPricePounds).to.eq('37.28')
  })
  it('can get sub total booking price in pounds', () => {
    expect(booking.subTotalPricePounds).to.eq('0.00')

    booking.priceBreakdown = bookingAPIData.priceBreakdown

    expect(booking.subTotalPricePounds).to.eq('35.50')
  })
  it('can get tickets price in pounds', () => {
    expect(booking.ticketsPricePounds).to.eq('0.00')

    booking.priceBreakdown = bookingAPIData.priceBreakdown

    expect(booking.ticketsPricePounds).to.eq('36.00')
  })
  it('can get tickets discounted price in pounds', () => {
    expect(booking.ticketsDiscountedPricePounds).to.eq('0.00')

    booking.priceBreakdown = bookingAPIData.priceBreakdown

    expect(booking.ticketsDiscountedPricePounds).to.eq('35.50')
  })
  it('can tell if booking has discounts applied', () => {
    expect(booking.hasDiscounts).to.be.false

    booking.priceBreakdown = bookingAPIData.priceBreakdown

    expect(booking.hasDiscounts).to.be.true
  })
  it('can get discounts value in pounds', () => {
    expect(booking.discountsValuePounds).to.eq('0.00')

    booking.priceBreakdown = bookingAPIData.priceBreakdown

    expect(booking.discountsValuePounds).to.eq('0.50')
  })
  it('can get ticket overview', () => {
    expect(booking.ticketOverview(ticketsMatrix)).to.be.empty

    booking.priceBreakdown = bookingAPIData.priceBreakdown
    booking.tickets = [fakeTicket(concession100Edge)]

    booking.dirty = true // Test that when dirty, it uses the estimate
    expect(JSON.stringify(booking.ticketOverview(ticketsMatrix))).to.equal(
      JSON.stringify(booking.ticketOverviewEstimate(ticketsMatrix))
    ) // Stringified here due to not being visually difference, but generated at different times through mapping

    booking.dirty = false

    expect(booking.ticketOverview(ticketsMatrix)).to.eq(
      bookingAPIData.priceBreakdown.tickets
    )
  })
  it('can generate ticket overview estimate', () => {
    expect(booking.ticketOverviewEstimate(ticketsMatrix)).to.be.empty

    booking.tickets = [
      fakeTicket(concession100Edge),
      fakeTicket(concession1000Edge),
      fakeTicket(concession1000Edge),
      fakeTicket(concession500Edge),
    ]
    expect(booking.ticketOverviewEstimate(ticketsMatrix).length).to.eq(3)
    expect(booking.ticketOverviewEstimate(ticketsMatrix)[0]).to.include({
      number: 1,
      totalPrice: 100,
      ticketPrice: 100,
    })
    expect(
      booking.ticketOverviewEstimate(ticketsMatrix)[0].seatGroup.name
    ).to.eq(seatGroup.name)
    expect(
      booking.ticketOverviewEstimate(ticketsMatrix)[0].concessionType.name
    ).to.include(concession100Edge.concessionType.name)
    expect(booking.ticketOverviewEstimate(ticketsMatrix)[1]).to.include({
      number: 2,
      totalPrice: 2000,
      ticketPrice: 1000,
    })
  })
  it('can get misc costs', () => {
    expect(booking.miscCosts).to.be.empty

    booking.priceBreakdown = bookingAPIData.priceBreakdown

    assertNoVisualDifference(
      booking.miscCosts,
      bookingAPIData.priceBreakdown.miscCosts
    )
  })
  it('can tell if a booking is active', () => {
    booking.updateFromAPIData(bookingAPIData)
    // Day before
    DateTime.local.mockReturnValue(DateTime.fromISO('2020-03-08T10:00:00'))
    expect(booking.isActive).to.be.true

    // 6 Hours before start
    DateTime.local.mockReturnValue(DateTime.fromISO('2020-03-09T10:00:00'))
    expect(booking.isActive).to.be.true

    // 40 minutes in
    DateTime.local.mockReturnValue(DateTime.fromISO('2020-03-09T16:40:00'))
    expect(booking.isActive).to.be.true

    // At end time
    DateTime.local.mockReturnValue(DateTime.fromISO('2020-03-09T18:00:00'))
    expect(booking.isActive).to.be.true

    // 1 Hour After Finish
    DateTime.local.mockReturnValue(DateTime.fromISO('2020-03-09T19:00:00'))
    expect(booking.isActive).to.be.true
  })
  it('can tell if a booking is inactive', () => {
    booking.updateFromAPIData(bookingAPIData)
    // Midnight next day
    DateTime.local.mockReturnValue(DateTime.fromISO('2020-03-10T00:00:00'))
    expect(booking.isActive).to.be.false

    // 10AM Next Day
    DateTime.local.mockReturnValue(DateTime.fromISO('2020-03-10T10:00:00'))
    expect(booking.isActive).to.be.false
  })
})
