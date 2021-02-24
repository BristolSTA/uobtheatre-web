import Errors from '@/classes/Errors';

/**
 * @param {Array} fields A list of fields to provide field_specific errors for
 * @returns {Errors} The errors object
 */
export function fakeValidationErrors(fields = ['email', 'password']) {
  let errors = new Errors([
    {
      message: 'Some crazy person did something wrong',
      __typename: 'NonFieldError',
    },
    ...fields.map((field) => {
      return {
        message: `An error on the ${field} field`,
        field,
        __typename: 'FieldError',
      };
    }),
  ]);
  return errors;
}
