import Errors from '~~/classes/Errors';

export default class extends Error {
  errors;

  constructor(errors: Errors | string) {
    super('There were validation errors');
    this.name = 'ValidationError';

    this.errors =
      typeof errors === 'string' ? Errors.createFromMessage(errors) : errors;
  }
}
