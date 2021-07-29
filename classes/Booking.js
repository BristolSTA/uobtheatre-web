import lo from 'lodash'
import { DateTime } from 'luxon'

import Ticket from './Ticket'

export default class Booking {
  /** @member {number} */
  id
  /** @member {string} */
  reference
  /** @member {object} */
  performance
  /** @member {object} */
  payments
  /** @member {Ticket} */
  tickets
  /** @member {object} */
  priceBreakdown
  /** @member {boolean} dirty Whether the booking class is in sync with the API or not */
  dirty = true
  /** @member {object} */
  raw

  constructor() {
    this.tickets = []
    this.payments = []
  }

  /**
   * Creates a booking object from an API response
   *
   * @param {object} bookingData API Booking Data
   * @returns {Booking} A Booking Instance
   * @static
   */
  static fromAPIData(bookingData) {
    const booking = new this()
    booking.updateFromAPIData(bookingData)
    return booking
  }

  /**
   * Updates the booking object from an API response
   *
   * @param {object} bookingData API Booking Data
   */
  updateFromAPIData(bookingData) {
    this.raw = bookingData
    if (bookingData.priceBreakdown) {
      this.priceBreakdown = bookingData.priceBreakdown
      this.priceBreakdown.tickets = this.priceBreakdown.tickets.map(
        (ticketSummary) => {
          ticketSummary.concession_type = ticketSummary.concessionType
          ticketSummary.seat_group = ticketSummary.seatGroup
          return ticketSummary
        }
      )
    }
    if (bookingData.tickets) {
      this.tickets = bookingData.tickets.map((ticketAPIData) =>
        Ticket.fromAPIData(ticketAPIData)
      )
    }
    if (bookingData.performance) {
      this.performance = bookingData.performance
    }
    if (bookingData.reference) {
      this.reference = bookingData.reference
    }
    if (bookingData.payments && bookingData.payments.edges.length) {
      this.payments = bookingData.payments.edges.map((edge) => edge.node)
    }
    this.id = bookingData.id
    this.dirty = false
  }

  /**
   * Returns the booking in the API booking model schema
   *
   * @returns {object} Booking Object
   */
  toAPIData() {
    return {
      tickets: this.tickets.map((ticket) => {
        return ticket.apiData
      }),
    }
  }

  /**
   * Adds a ticket to the booking
   *
   * @param {Ticket} ticket Ticket to add
   * @param {TicketsMatrix} ticketMatrix TicketMatrix Object
   * @param {number} number Number of tickets to add
   */
  addTicket(ticket, ticketMatrix, number = 1) {
    if (!ticketMatrix.canAddTickets(number, ticket.seatGroup.id)) return

    for (let i = 0; i < number; i++) {
      this.tickets.push(ticket)
      ticketMatrix.decrementPerformanceCapacity()
      ticketMatrix.decrementSeatGroupCapacity(ticket.seatGroup.id)
    }
    this.dirty = true
  }

  /**
   * Sets the number of tickets for a certain seat group and concession type to the given number
   *
   * @param {object|null} seat_group Seat Group Object
   * @param {object|null} concession_type Concession Type Object
   * @param {number} count Number of tickets
   * @param {TicketsMatrix} ticketMatrix TicketMatrix Object
   */
  setTicketCount(
    seat_group = null,
    concession_type = null,
    count,
    ticketMatrix
  ) {
    let rollingTotal = 0

    // Step 1 - Check how many matching tickets we have for the criteria. Remove if required (and update TicketMatrix)
    this.tickets = this.tickets.filter((ticket) => {
      if (ticket.matches(seat_group, concession_type)) {
        rollingTotal++
        if (rollingTotal > count) {
          // Remove this ticket
          ticketMatrix.incrementPerformanceCapacity()
          ticketMatrix.incrementSeatGroupCapacity(seat_group.id)
          return false
        }
      }
      return true
    })

    while (rollingTotal < count) {
      this.addTicket(
        new Ticket(seat_group.id, concession_type.id),
        ticketMatrix
      )
      rollingTotal++
    }
    this.dirty = true
  }

  /**
   * Finds tickets, optionally by seat group or concession type
   *
   * @param {object|null} seat_group Seat Group Object
   * @param {object|null} concession_type Concession Type Object
   * @returns {Ticket[]} Matching tickets
   */
  findTickets(seat_group = null, concession_type = null) {
    return this.tickets.filter((ticket) => {
      return ticket.matches(seat_group, concession_type)
    })
  }

  /**
   * Removes 1 ticket by seat group and concession type
   *
   * @param {object} seatGroup Seat Group Object
   * @param {object} concessionType Concession Type Object
   * @param {TicketsMatrix} ticketMatrix TicketMatrix Object
   */
  removeTicket(seatGroup, concessionType, ticketMatrix) {
    this.setTicketCount(
      seatGroup,
      concessionType,
      this.ticketCount(seatGroup, concessionType) - 1,
      ticketMatrix
    )
    this.dirty = true
  }

  /**
   * Finds the number of tickets, optionally by seat group or concession type
   *
   * @param {object} seat_group Seat Group Object
   * @param {object} concession_type Concession Type Object
   * @returns {number} Number of matching tickets
   */
  ticketCount(seat_group = null, concession_type = null) {
    return this.findTickets(seat_group, concession_type).length
  }

  /**
   * Clears the booking's tickets
   */
  clearTickets() {
    this.tickets = []
    this.dirty = true
  }

  /**
   * Calculates the total price (in pennies) of the tickets (pre-discounts/charges)
   *
   * @param {TicketsMatrix} ticketMatrix Ticket Matrix instance
   * @returns {number} Total price of the tickets (without discounts), in pennies
   */
  ticketsTotalPriceEstimate(ticketMatrix) {
    return this.tickets
      .map((ticket) => ticket.price(ticketMatrix.ticketOptions))
      .reduce((a, b) => a + b, 0)
  }

  /**
   * Calculates the total price (in pounds) of the tickets (pre-discounts/charges)
   *
   * @param {TicketsMatrix} ticketMatrix Ticket Matrix instance
   * @returns {number} Total price of the booking, in pounds to 2 d.p.
   */
  ticketsTotalPricePoundsEstimate(ticketMatrix) {
    return (this.ticketsTotalPriceEstimate(ticketMatrix) / 100).toFixed(2)
  }

  get allCheckedIn() {
    return this.tickets.every((ticket) => ticket.checkedIn)
  }

  get numberCheckedIn() {
    return this.tickets.filter((ticket) => ticket.checkedIn).length
  }

  /**
   * @returns {number} Total cost / price of the booking in pennies
   */
  get totalPrice() {
    if (!this.priceBreakdown) return 0
    return this.priceBreakdown.totalPrice
  }

  /**
   * @returns {string} Total cost / price of the booking in pounds
   */
  get totalPricePounds() {
    return (this.totalPrice / 100).toFixed(2)
  }

  /**
   * @returns {string} Price of tickets minus any discounts in pounds
   */
  get subTotalPricePounds() {
    if (!this.priceBreakdown) return (0).toFixed(2)
    return (this.priceBreakdown.subtotalPrice / 100).toFixed(2)
  }

  /**
   * @returns {string} Total cost / price of the tickets in pounds
   */
  get ticketsPricePounds() {
    if (!this.priceBreakdown) return (0).toFixed(2)
    return (this.priceBreakdown.ticketsPrice / 100).toFixed(2)
  }

  /**
   * @returns {string} Total cost / price of the tickets in pounds taking into account any discounts
   */
  get ticketsDiscountedPricePounds() {
    if (!this.priceBreakdown) return (0).toFixed(2)
    return (this.priceBreakdown.ticketsDiscountedPrice / 100).toFixed(2)
  }

  /**
   * @returns {boolean} True if the booking has discounts applied
   */
  get hasDiscounts() {
    if (!this.priceBreakdown) return false
    return this.priceBreakdown.discountsValue !== 0
  }

  /**
   * @returns {string} Total cost / price of the group discounts in pounds
   */
  get discountsValuePounds() {
    if (!this.priceBreakdown) return (0).toFixed(2)
    return (this.priceBreakdown.discountsValue / 100).toFixed(2)
  }

  /**
   * @param {TicketsMatrix} ticketMatrix Ticket Matrix instance
   * @returns {Array} List of tickets grouped by seat group & concession type, giving capacity and price
   */
  ticketOverview(ticketMatrix = null) {
    if (!this.priceBreakdown || this.dirty) {
      if (!ticketMatrix)
        throw new Error(
          'A ticket matrix is required to generate the ticket overview'
        )
      return this.ticketOverviewEstimate(ticketMatrix)
    }
    return this.priceBreakdown.tickets
  }

  /**
   * @param {TicketsMatrix} ticketMatrix Ticket Matrix instance
   * @returns {Array} List of tickets grouped by seat group & concession type, giving capacity and price (based on selected tickets and not API data)
   */
  ticketOverviewEstimate(ticketMatrix) {
    return lo
      .chain(this.tickets)
      .groupBy((ticket) => [ticket.seatGroup.id, ticket.concessionType.id])
      .values()
      .map((groupedTickets) => {
        const option = ticketMatrix.ticketOptions.find(
          (option) => option.seatGroup.id === groupedTickets[0].seatGroup.id
        )

        if (!option) {
          throw new Error(
            `No matching ticket option found for ticket details (Seat Group ID: ${groupedTickets[0].seatGroup.id})`
          )
        }

        const seatGroup = option.seatGroup
        const concessionTypeEdge = option.concessionTypes.find(
          (cocnessionTypeEdge) =>
            cocnessionTypeEdge.concessionType.id ===
            groupedTickets[0].concessionType.id
        )

        if (!concessionTypeEdge) {
          throw new Error(
            `No matching concession type found for ticket details (Concession Type ID: ${groupedTickets[0].concessionType.id})`
          )
        }

        return {
          number: groupedTickets.length,
          concessionType: concessionTypeEdge.concessionType,
          seatGroup,
          ticketPrice: concessionTypeEdge.price,
          totalPrice: concessionTypeEdge.price * groupedTickets.length,
        }
      })
      .value()
  }

  /**
   * @returns {Array} List of misc costs, giving name, description, an optional perctange value and the additional cost (in pounds)
   */
  get miscCosts() {
    if (!this.priceBreakdown) return []
    return this.priceBreakdown.miscCosts.map((miscCost) => {
      return Object.assign(miscCost, {
        valuePounds: (miscCost.value / 100).toFixed(2),
      })
    })
  }

  /**
   * @returns {boolean} True if in the future / current day or false
   */
  get isActive() {
    const performanceEndTime = DateTime.fromISO(this.performance.end)
    return (
      performanceEndTime > DateTime.local() ||
      performanceEndTime.hasSame(DateTime.local(), 'day')
    )
  }

  get status() {
    if (!this.raw.status) return ''
    return this.raw.status
  }
}
