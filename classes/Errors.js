/**
 * Errors class for wrapping (validaiton) errors from the API
 */
export default class {
  /**
   * Create a new Errors instance.
   *
   * @param {?Array} errors Optional GraphQL Errors
   */
  constructor(errors = []) {
    this.reset();
    if (errors.length) {
      this.record(errors);
    }
  }

  static createFromAPI(errors) {
    return new this(errors);
  }

  static createFromMessage(message, field = null, code = null) {
    return new this([
      {
        __typename: field ? 'FieldError' : 'NonFieldError',
        message,
        field,
        code
      }
    ]);
  }

  /**
   * Resets errors object
   */
  reset() {
    this.errors = {
      field_errors: [],
      non_field_errors: []
    };
  }

  /**
   * Determine if an error exists for the given field.
   *
   * @param {string} field The field name
   * @returns {boolean} Whether the field has errors
   */
  has(field) {
    return !!this.errors.field_errors.find((error) => error.field === field);
  }

  /**
   * Determine if at least one error has the given code
   *
   * @param {string} code The code to search for
   * @returns {boolean}
   */
  hasCode(code) {
    return this.allErrors.some((error) => error.code === code);
  }

  /**
   * Determine if we have any errors.
   *
   * @returns {boolean} Whether there are any errors
   */
  any() {
    return (
      !!this.errors.field_errors.length || !!this.errors.non_field_errors.length
    );
  }

  /**
   * Retrieve the first error message for a field.
   *
   * @param {string} field The field name
   * @returns {object} The error object
   */
  first(field) {
    return this.errors.field_errors.find((error) => error.field === field);
  }

  /**
   * Retrieve the error messages for a field.
   *
   * @param {string} field The field name
   * @returns {Array<object>} List of error objects
   */
  get(field) {
    return this.errors.field_errors.filter((error) => error.field === field);
  }

  /**
   * @returns {boolean} Whether there are generic errors
   */
  hasNonFieldErrors() {
    return this.nonFieldErrors.length !== 0;
  }

  /**
   * @returns {Array<object>} List of errors
   */
  get nonFieldErrors() {
    return this.errors.non_field_errors;
  }

  /**
   * @returns {Array<object>} List of field errors
   */
  get fieldErrors() {
    return this.errors.field_errors;
  }

  /**
   * @returns {Array<object>} List of errors
   */
  get allErrors() {
    return [...this.nonFieldErrors, ...this.fieldErrors];
  }

  /**
   * Record the new errors.
   *
   * @param {object} errors GraphQL Errors Object
   */
  record(errors) {
    this.errors = {
      field_errors: errors.filter((error) => {
        return error.__typename === 'FieldError';
      }),
      non_field_errors: errors.filter((error) => {
        return error.__typename === 'NonFieldError' || !error.__typename;
      })
    };
  }

  /**
   * Pushes an error to the stack
   * @param {object} errorObject An error dictionary
   * @param {string} errorObject.message The error's message
   * @param {string} [errorObject.field] The error's field
   * @param {string} [errorObject.code] The error's code
   */
  push({ message, field, code }) {
    const error = {
      message,
      code,
      field
    };
    if (error.field) {
      this.errors.field_errors.push(error);
    } else {
      this.errors.non_field_errors.push(error);
    }
  }

  /**
   * Clear one or all error fields.
   *
   * @param {string|null} field The field name. If supplied, will only delete errors for the supplied field
   */
  clear(field) {
    if (field) {
      this.errors.field_errors = this.errors.field_errors.filter(
        (err) => err.field !== field
      );

      return;
    }

    this.reset();
  }
}
