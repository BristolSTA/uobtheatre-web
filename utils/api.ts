import Errors from '~~/classes/Errors';
import ValidationError from '~~/errors/ValidationError';
// TODO: Type all the things
/**
 * Catches only the given error(s). Otherwise, throws.
 *
 * @param {Array|Class} errors List or single error class
 * @param {Error} caughtError The caught error
 * @param {Function} callback The function to call if is a valid exception
 */
export function catchOnly(errors, caughtError, callback) {
  if (!Array.isArray(errors)) {
    errors = [errors];
  }

  if (errors.some((errorClass) => caughtError instanceof errorClass)) {
    return callback(caughtError);
  }

  throw caughtError;
}

/**
 * TODO
 * @param error TODO
 * @param throwExp Whether to throw exceptions
 */
export function getValidationErrors(error, throwExp = true): Errors {
  if (!(error instanceof ValidationError)) {
    if (!throwExp) {
      return;
    }
    throw error;
  }
  return error.errors;
}
