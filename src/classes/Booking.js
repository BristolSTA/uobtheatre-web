import lo from 'lodash';
import { DateTime } from 'luxon';

import Ticket from './Ticket';
import TicketsMatrix from './TicketsMatrix';

export default class Booking {
  /** @member {number} */
  id;
  /** @member {string} */
  bookingReference;
  /** @member {object} */
  performance;
  /** @member {Ticket} */
  tickets;
  /** @member {object} */
  price_breakdown;
  /** @member {boolean} dirty Whether the booking class is in sync with the API or not */
  dirty = true;

  constructor() {
    this.tickets = [];
  }

  /**
   * Creates a booking object from an API response
   *
   * @param {object} bookingData API Booking Data
   * @returns {Booking} A Booking Instance
   * @static
   */
  static fromAPIData(bookingData) {
    let booking = new this();
    booking.updateFromAPIData(bookingData);
    return booking;
  }

  /**
   * Updates the booking object from an API response
   *
   * @param {object} bookingData API Booking Data
   */
  updateFromAPIData(bookingData) {
    this.price_breakdown = bookingData.priceBreakdown;
    this.price_breakdown.tickets = this.price_breakdown.tickets.map(
      (ticketSummary) => {
        ticketSummary.concession_type = ticketSummary.concessionType;
        ticketSummary.seat_group = ticketSummary.seatGroup;
        return ticketSummary;
      }
    );
    if (bookingData.tickets) {
      this.tickets = bookingData.tickets.map((ticketAPIData) =>
        Ticket.fromAPIData(ticketAPIData)
      );
    }
    if (bookingData.performance) {
      this.performance = bookingData.performance;
    }
    if (bookingData.bookingReference) {
      this.bookingReference = bookingData.bookingReference;
    }
    this.id = bookingData.id;
    this.dirty = false;
  }

  /**
   * Returns the booking in the API booking model schema
   *
   * @returns {object} Booking Object
   */
  toAPIData() {
    return {
      tickets: this.tickets.map((ticket) => {
        return ticket.apiData;
      }),
    };
  }

  /**
   * Adds a ticket to the booking
   *
   * @param {Ticket} ticket Ticket to add
   * @param {TicketsMatrix} ticketMatrix TicketMatrix Object
   * @param {number} number Number of tickets to add
   */
  addTicket(ticket, ticketMatrix, number = 1) {
    if (!ticketMatrix.canAddTickets(number, ticket.seat_group.id)) return;

    for (let i = 0; i < number; i++) {
      this.tickets.push(ticket);
      ticketMatrix.decrementPerformanceCapacity();
      ticketMatrix.decrementSeatGroupCapacity(ticket.seat_group.id);
    }
    this.dirty = true;
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
    let rolling_total = 0;

    // Step 1 - Check how many matching tickets we have for the criteria. Remove if required (and update TicketMatrix)
    this.tickets = this.tickets.filter((ticket) => {
      if (ticket.matches(seat_group, concession_type)) {
        rolling_total++;
        if (rolling_total > count) {
          // Remove this ticket
          ticketMatrix.incrementPerformanceCapacity();
          ticketMatrix.incrementSeatGroupCapacity(seat_group.id);
          return false;
        }
      }
      return true;
    });

    while (rolling_total < count) {
      this.addTicket(
        new Ticket(seat_group.id, concession_type.id),
        ticketMatrix
      );
      rolling_total++;
    }
    this.dirty = true;
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
      return ticket.matches(seat_group, concession_type);
    });
  }

  /**
   * Removes 1 ticket by seat group and concession type
   *
   * @param {object} seat_group Seat Group Object
   * @param {object} concession_type Concession Type Object
   * @param {TicketsMatrix} ticketMatrix TicketMatrix Object
   */
  removeTicket(seat_group, concession_type, ticketMatrix) {
    this.setTicketCount(
      seat_group,
      concession_type,
      this.ticketCount(seat_group, concession_type) - 1,
      ticketMatrix
    );
    this.dirty = true;
  }

  /**
   * Finds the number of tickets, optionally by seat group or concession type
   *
   * @param {object} seat_group Seat Group Object
   * @param {object} concession_type Concession Type Object
   * @returns {number} Number of matching tickets
   */
  ticketCount(seat_group = null, concession_type = null) {
    return this.findTickets(seat_group, concession_type).length;
  }

  /**
   * Clears the booking's tickets
   */
  clearTickets() {
    this.tickets = [];
    this.dirty = true;
  }

  /**
   * Calculates the total price (in pennies) of the tickets (pre-discounts/charges)
   *
   * @param {TicketsMatrix} ticket_matrix Ticket Matrix instance
   * @returns {number} Total price of the tickets (without discounts), in pennies
   */
  tickets_total_price_estimate(ticket_matrix) {
    return this.tickets
      .map((ticket) => ticket.price(ticket_matrix.ticket_options))
      .reduce((a, b) => a + b, 0);
  }

  /**
   * Calculates the total price (in pounds) of the tickets (pre-discounts/charges)
   *
   * @param {TicketsMatrix} ticket_matrix Ticket Matrix instance
   * @returns {number} Total price of the booking, in pounds to 2 d.p.
   */
  tickets_total_price_pounds_estimate(ticket_matrix) {
    return (this.tickets_total_price_estimate(ticket_matrix) / 100).toFixed(2);
  }

  /**
   * @returns {string} Total cost / price of the booking in pounds
   */
  get total_price_pounds() {
    if (!this.price_breakdown) return (0).toFixed(2);
    return (this.price_breakdown.totalPrice / 100).toFixed(2);
  }

  /**
   * @returns {string} Price of tickets minus any discounts in pounds
   */
  get sub_total_price_pounds() {
    if (!this.price_breakdown) return (0).toFixed(2);
    return (this.price_breakdown.subtotalPrice / 100).toFixed(2);
  }

  /**
   * @returns {string} Total cost / price of the tickets in pounds
   */
  get tickets_price_pounds() {
    if (!this.price_breakdown) return (0).toFixed(2);
    return (this.price_breakdown.ticketsPrice / 100).toFixed(2);
  }

  /**
   * @returns {string} Total cost / price of the tickets in pounds taking into account any discounts
   */
  get tickets_discounted_price_pounds() {
    if (!this.price_breakdown) return (0).toFixed(2);
    return (this.price_breakdown.ticketsDiscountedPrice / 100).toFixed(2);
  }

  /**
   * @returns {boolean} True if the booking has discounts applied
   */
  get has_discounts() {
    if (!this.price_breakdown) return false;
    return this.price_breakdown.discountsValue != 0;
  }

  /**
   * @returns {string} Total cost / price of the group discounts in pounds
   */
  get discounts_value_pounds() {
    if (!this.price_breakdown) return (0).toFixed(2);
    return (this.price_breakdown.discountsValue / 100).toFixed(2);
  }

  /**
   * @param {TicketsMatrix} ticket_matrix Ticket Matrix instance
   * @returns {Array} List of tickets grouped by seat group & concession type, giving capacity and price
   */
  ticket_overview(ticket_matrix = null) {
    if (!this.price_breakdown || this.dirty)
      return this.ticket_overview_estimate(ticket_matrix);
    return this.price_breakdown.tickets;
  }

  /**
   * @param {TicketsMatrix} ticket_matrix Ticket Matrix instance
   * @returns {Array} List of tickets grouped by seat group & concession type, giving capacity and price (based on selected tickets and not API data)
   */
  ticket_overview_estimate(ticket_matrix) {
    return lo
      .chain(this.tickets)
      .groupBy((ticket) => [ticket.seat_group.id, ticket.concession_type.id])
      .values()
      .map((groupedTickets) => {
        let option = ticket_matrix.ticket_options.find(
          (option) => option.seatGroup.id == groupedTickets[0].seat_group.id
        );
        let seatGroup = option.seatGroup;
        let concessionTypeEdge = option.concessionTypes.find(
          (cocnession_type_edge) =>
            cocnession_type_edge.concessionType.id ==
            groupedTickets[0].concession_type.id
        );
        return {
          number: groupedTickets.length,
          concession_type: concessionTypeEdge.concessionType,
          seat_group: seatGroup,
          ticketPrice: concessionTypeEdge.price,
          totalPrice: concessionTypeEdge.price * groupedTickets.length,
        };
      })
      .value();
  }

  /**
   * @returns {Array} List of misc costs, giving name, description, an optional perctange value and the additional cost (in pounds)
   */
  get misc_costs() {
    if (!this.price_breakdown) return [];
    return this.price_breakdown.miscCosts.map((misc_cost) => {
      return Object.assign(misc_cost, {
        valuePounds: (misc_cost.value / 100).toFixed(2),
      });
    });
  }

  /**
   * @returns {boolean} True if in the future / current day or false
   */
  get is_active() {
    // TODO: Should be active if performance end date date (i.e. day) is in the past (i.e. active whole day of show)
    let performanceEndTime = DateTime.fromISO(this.performance.end);
    return performanceEndTime > DateTime.local();
  }
}
