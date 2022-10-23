import { expect } from 'chai'
import { DateTime } from 'luxon'

import PerformanceFixture from '../fixtures/Performance'

import { assertNoVisualDifference } from '../helpers'
import ConcessionTypeBookingType from '../fixtures/ConcessionTypeBookingType'
import BookingFixture from '../fixtures/Booking'
import ConcessionType from '../fixtures/ConcessionType'
import TicketsMatrix from '@/classes/TicketsMatrix'
import Ticket from '@/classes/Ticket'
import Booking from '@/classes/Booking'
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

  beforeAll(() => {
    const performance = PerformanceFixture()
    seatGroup = performance.ticketOptions[0].seatGroup
    concession100Edge = ConcessionTypeBookingType({
      price: 100,
      pricePounds: '1.00'
    })
    concession1000Edge = ConcessionTypeBookingType({
      concessionType: ConcessionType({ id: 2 }),
      price: 1000,
      pricePounds: '10.00'
    })
    concession500Edge = ConcessionTypeBookingType({
      concessionType: ConcessionType({ id: 3 }),
      price: 500,
      pricePounds: '5.00'
    })
    performance.ticketOptions[0].concessionTypes = [
      concession100Edge,
      concession1000Edge,
      concession500Edge
    ]

    ticketsMatrix = new TicketsMatrix(performance)

    bookingAPIData = BookingFixture()
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

  it('can be constructed from booking data', () => {
    booking = Booking.fromAPIData(bookingAPIData)
    expect(booking).to.be.instanceOf(Booking)
    expect(booking.priceBreakdown).to.eq(bookingAPIData.priceBreakdown)
    expect(booking.tickets.length).to.eq(1)
    expect(booking.performance).to.eq(bookingAPIData.performance)
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
      fakeTicket(concession500Edge)
    ]
    expect(booking.ticketsTotalPriceEstimate(ticketsMatrix)).to.eq(1600)
  })
  it('can get tickets total price estimate in pounds', () => {
    expect(booking.ticketsTotalPricePoundsEstimate(ticketsMatrix)).to.eq('0.00')

    booking.tickets = [
      fakeTicket(concession100Edge),
      fakeTicket(concession1000Edge),
      fakeTicket(concession500Edge)
    ]

    expect(booking.ticketsTotalPricePoundsEstimate(ticketsMatrix)).to.eq(
      '16.00'
    )
  })
  it('can get total booking price in pounds', () => {
    expect(booking.totalPrice).to.eq(0)

    booking.priceBreakdown = bookingAPIData.priceBreakdown

    expect(booking.totalPrice).to.eq(495)
  })
  it('can get total booking price in pounds', () => {
    expect(booking.totalPricePounds).to.eq('0.00')

    booking.priceBreakdown = bookingAPIData.priceBreakdown

    expect(booking.totalPricePounds).to.eq('4.95')
  })
  it('can get sub total booking price in pounds', () => {
    expect(booking.subTotalPricePounds).to.eq('0.00')

    booking.priceBreakdown = bookingAPIData.priceBreakdown

    expect(booking.subTotalPricePounds).to.eq('4.90')
  })
  it('can get tickets price in pounds', () => {
    expect(booking.ticketsPricePounds).to.eq('0.00')

    booking.priceBreakdown = bookingAPIData.priceBreakdown

    expect(booking.ticketsPricePounds).to.eq('5.00')
  })
  it('can get tickets discounted price in pounds', () => {
    expect(booking.ticketsDiscountedPricePounds).to.eq('0.00')

    booking.priceBreakdown = bookingAPIData.priceBreakdown

    expect(booking.ticketsDiscountedPricePounds).to.eq('4.90')
  })
  it('can tell if booking has discounts applied', () => {
    expect(booking.hasDiscounts).to.be.false

    booking.priceBreakdown = bookingAPIData.priceBreakdown

    expect(booking.hasDiscounts).to.be.true
  })
  it('can get discounts value in pounds', () => {
    expect(booking.discountsValuePounds).to.eq('0.00')

    booking.priceBreakdown = bookingAPIData.priceBreakdown

    expect(booking.discountsValuePounds).to.eq('0.10')
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
      fakeTicket(concession500Edge)
    ]
    expect(booking.ticketOverviewEstimate(ticketsMatrix).length).to.eq(3)
    expect(booking.ticketOverviewEstimate(ticketsMatrix)[0]).to.include({
      number: 1,
      totalPrice: 100,
      ticketPrice: 100
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
      ticketPrice: 1000
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
