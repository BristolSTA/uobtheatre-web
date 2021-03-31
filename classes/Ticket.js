export default class {
  seatGroup = {}
  concessionType = {}
  id = null

  /**
   * @param {object} seatGroupId Seat Group / Location ID
   * @param {object} concessionTypeId Concession Type ID
   * @param {string} id Optional ID of ticket in database
   */
  constructor(seatGroupId, concessionTypeId, id = null) {
    this.seatGroup.id = seatGroupId
    this.concessionType.id = concessionTypeId
    this.id = id
  }

  static fromAPIData(ticketAPIData) {
    const ticket = new this(
      ticketAPIData.seatGroup.id,
      ticketAPIData.concessionType.id,
      ticketAPIData.id
    )
    ticket.seatGroup = ticketAPIData.seatGroup
    ticket.concessionType = ticketAPIData.concessionType
    return ticket
  }

  /**
   * Returns if this ticket matches the given parameters
   *
   * @param {object|null} seatGroup Seat Group Data Object
   * @param {object|null} concessionType Concession Data Object
   * @returns {boolean} True if ticket matches
   */
  matches(seatGroup, concessionType) {
    const matchesSeatGroup = seatGroup
      ? this.seatGroup.id === seatGroup.id
      : true
    const matchesConcessionType = concessionType
      ? this.concessionType.id === concessionType.id
      : true
    return matchesSeatGroup && matchesConcessionType
  }

  /**
   * Returns the price for one of this ticket, based on the concession applied to the seat group
   *
   * @param {object} ticketOptions Raw data from the ticket_types endpoint (i.e. grouped Seat Group -> Concession Types data) which contains the price data
   * @returns {number} Price of the ticket in pennies
   */
  price(ticketOptions) {
    return ticketOptions
      .find((option) => option.seatGroup.id === this.seatGroup.id)
      .concessionTypes.find(
        (concessionEdge) =>
          concessionEdge.concessionType.id === this.concessionType.id
      ).price
  }

  /**
   * Returns the Base 64 encoded string to use in the QR code
   *
   * @param {string} bookingReference Booking Reference
   * @returns {string} Base 64 encoded string
   */
  generateQRCodeString(bookingReference) {
    return btoa([bookingReference, this.id])
  }

  /**
   * @returns {object} API Data object that represents the ticket
   */
  get apiData() {
    const ticketData = {
      seatGroupId: this.seatGroup.id,
      concessionTypeId: this.concessionType.id,
    }
    if (this.id) ticketData.id = this.id

    return ticketData
  }
}
