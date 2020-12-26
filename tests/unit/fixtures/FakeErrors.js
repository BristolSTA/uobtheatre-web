import { Errors } from '@/services/api';

/**
 * @param {Array} fields A list of fields to provide field_specific errors for
 * @returns {Errors} The errors object
 */
export function fakeValidationErrors(fields = ['email', 'password']) {
  let errors = new Errors();

  let errors_obj = {};
  fields.forEach((field) => {
    errors_obj[field] = [`An error on the ${field} field`];
  });

  errors.record(
    Object.assign(errors_obj, {
      non_field_errors: ['Some crazy person did something wrong'],
    })
  );
  return errors;
}
