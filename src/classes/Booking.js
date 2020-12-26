import Ticket from './Ticket';
export default class Booking {
  /** @member {string} */
  reference;
  /** @member {object} */
  performance;
  /** @member {Ticket} */
  tickets;

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
    booking.performance = bookingData.performance;
    booking.reference = bookingData.booking_reference;
    return booking;
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
   */
  addTicket(ticket) {
    this.tickets.push(ticket);
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
      this.addTicket(new Ticket(seat_group, concession_type));
      rolling_total++;
    }
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
  }

  /**
   * @returns {number} Total price of the booking, in pennies
   */
  get total_price() {
    return this.tickets
      .map((ticket) => ticket.price)
      .reduce((a, b) => a + b, 0);
  }

  /**
   * @returns {number} Total price of the booking, in pounds to 2 d.p.
   */
  get total_price_pounds() {
    return (this.total_price / 100).toFixed(2);
  }
}
