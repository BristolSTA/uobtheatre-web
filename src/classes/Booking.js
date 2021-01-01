import lo from 'lodash';

import Ticket from './Ticket';
export default class Booking {
  /** @member {number} */
  id;
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
    this.price_breakdown = bookingData.price_breakdown;
    if (bookingData.tickets) {
      this.tickets = bookingData.tickets.map((ticketAPIData) =>
        Ticket.fromAPIData(ticketAPIData)
      );
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
   * @returns {Ticket[]} Array of tickets
   */
  get tickets() {
    return this.tickets;
  }

  /**
   * Adds a ticket to the booking
   *
   * @param {Ticket} ticket Ticket to add
   * @param {number} number Number of tickets to add
   */
  addTicket(ticket, number = 1) {
    for (let i = 0; i < number; i++) {
      this.tickets.push(ticket);
    }
    this.dirty = true;
  }

  /**
   * Sets the number of tickets for a certain seat group and concession type to the given number
   *
   * @param {object|null} seat_group Seat Group Object
   * @param {object|null} concession_type Concession Type Object
   * @param {number} count Number of tickets
   */
  setTicketCount(seat_group = null, concession_type = null, count) {
    let rolling_total = 0;
    this.tickets = this.tickets.filter((ticket) => {
      if (ticket.matches(seat_group, concession_type)) {
        rolling_total++;
        if (rolling_total > count) return false;
      }
      return true;
    });

    while (rolling_total < count) {
      this.addTicket(new Ticket(seat_group.id, concession_type.id));
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
   */
  removeTicket(seat_group, concession_type) {
    this.setTicketCount(
      seat_group,
      concession_type,
      this.ticketCount(seat_group, concession_type) - 1
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
   * @param {object} ticket_options Raw data from the ticket_types endpoint (i.e. grouped Seat Group -> Concession Types data) which contains the price data
   * @returns {number} Total price of the tickets (without discounts), in pennies
   */
  tickets_total_price_estimate(ticket_options) {
    return this.tickets
      .map((ticket) => ticket.price(ticket_options))
      .reduce((a, b) => a + b, 0);
  }

  /**
   * Calculates the total price (in pounds) of the tickets (pre-discounts/charges)
   *
   * @param {object} ticket_options Raw data from the ticket_types endpoint (i.e. grouped Seat Group -> Concession Types data) which contains the price data
   * @returns {number} Total price of the booking, in pounds to 2 d.p.
   */
  tickets_total_price_pounds_estimate(ticket_options) {
    return (this.tickets_total_price_estimate(ticket_options) / 100).toFixed(2);
  }

  /**
   * @returns {string} Total cost / price of the booking in pounds
   */
  get total_price_pounds() {
    if (!this.price_breakdown) return (0).toFixed(2);
    return (this.price_breakdown.total_price / 100).toFixed(2);
  }

  /**
   * @returns {string} Price of tickets minus any discounts in pounds
   */
  get sub_total_price_pounds() {
    if (!this.price_breakdown) return (0).toFixed(2);
    return (this.price_breakdown.subtotal_price / 100).toFixed(2);
  }

  /**
   * @returns {string} Total cost / price of the tickets in pounds
   */
  get tickets_price_pounds() {
    if (!this.price_breakdown) return (0).toFixed(2);
    return (this.price_breakdown.tickets_price / 100).toFixed(2);
  }

  /**
   * @returns {boolean} True if the booking has discounts applied
   */
  get has_discounts() {
    if (!this.price_breakdown) return false;
    return this.price_breakdown.discounts_value != 0;
  }

  /**
   * @returns {string} Total cost / price of the group discounts in pounds
   */
  get discounts_value_pounds() {
    if (!this.price_breakdown) return (0).toFixed(2);
    return (this.price_breakdown.discounts_value / 100).toFixed(2);
  }

  /**
   * @param {object} ticket_options Raw data from the ticket_types endpoint (i.e. grouped Seat Group -> Concession Types data) which contains the price data
   * @returns {Array} List of tickets grouped by seat group & concession type, giving capacity and price
   */
  ticket_overview(ticket_options) {
    if (!this.price_breakdown || this.dirty)
      return this.ticket_overview_estimate(ticket_options);
    return this.price_breakdown.tickets;
  }

  /**
   * @param {object} ticket_options Raw data from the ticket_types endpoint (i.e. grouped Seat Group -> Concession Types data) which contains the price data
   * @returns {Array} List of tickets grouped by seat group & concession type, giving capacity and price (based on selected tickets and not API data)
   */
  ticket_overview_estimate(ticket_options) {
    return lo
      .chain(this.tickets)
      .groupBy((ticket) => [ticket.seat_group_id, ticket.concession_type_id])
      .values()
      .map((groupedTickets) => {
        let seatLocation = ticket_options.find(
          (location) =>
            location.seat_group.id == groupedTickets[0].seat_group_id
        );
        let seatGroup = seatLocation.seat_group;
        let concessionType = seatLocation.concession_types.find(
          (type) => type.id == groupedTickets[0].concession_type_id
        );
        return {
          number: groupedTickets.length,
          concession_type: concessionType,
          seat_group: seatGroup,
          ticket_price: concessionType.price,
          total_price: concessionType.price * groupedTickets.length,
        };
      })
      .value();
  }

  /**
   * @returns {Array} List of misc costs, giving name, description, an optional perctange value and the calcualted additional cost
   */
  get misc_costs() {
    if (!this.price_breakdown) return [];
    return this.price_breakdown.misc_costs;
  }
}
