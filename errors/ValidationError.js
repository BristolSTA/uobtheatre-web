export default class extends Error {
  /**
   *
   * @param {Errors} errors An Errors class instance
   */
  constructor(errors) {
    super('There were validation errors')
    this.name = 'ValidationError'
    this.errors = errors
  }
}
