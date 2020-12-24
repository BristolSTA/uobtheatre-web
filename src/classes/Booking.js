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
   * Removes a ticket by a given index in the tickets array
   *
   * @param {number} ticketIndex Index of ticket to remove
   */
  removeTicketByIndex(ticketIndex) {
    this.tickets = this.tickets.filter((ticket, index) => {
      return index !== ticketIndex;
    });
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
