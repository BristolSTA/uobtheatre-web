import GenericError from '../support/GenericError';
import Errors from '@/classes/Errors';

/**
 * @param {Array} fields A list of fields to provide field_specific errors for
 * @returns {Errors} The errors object
 */
export function fakeValidationErrors(fields = ['email', 'password']) {
  const errors = new Errors([
    GenericError('Some crazy person did something wrong'),
    ...fields.map((field) => {
      return GenericError(`An error on the ${field} field`, field);
    }),
  ]);
  return errors;
}
