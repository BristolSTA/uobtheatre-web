export default class {
  /**
   *
   * @param {object} seat_group Seat Group / Location Data Object
   * @param {object} concession_type Concession Data Object
   */
  constructor(seat_group, concession_type) {
    this.seat_group = seat_group;
    this.concession_type = concession_type;
  }

  /**
   * Returns if this ticket matches the given parameters
   *
   * @param {object|null} seat_group Seat Group Data Object
   * @param {object|null} concession_type Concession Data Object
   * @returns {boolean} True if ticket matches
   */
  matches(seat_group, concession_type) {
    let matches_seat_group = seat_group
      ? this.seat_group.id == seat_group.id
      : true;
    let matches_concession_type = concession_type
      ? this.concession_type.id == concession_type.id
      : true;
    return matches_seat_group && matches_concession_type;
  }

  /**
   * @returns {number} Price of the ticket in pennies
   */
  get price() {
    return this.concession_type.price;
  }

  /**
   * @returns {number} Price of the ticket in pounds (2 d.p.)
   */
  get price_pounds() {
    return this.concession_type.price_pounds;
  }

  /**
   * @returns {object} API Data object that represents the ticket
   */
  get apiSchema() {
    return {
      seat_group_id: this.seat_group.id,
      concession_type_id: this.concession_type.id,
    };
  }
}
