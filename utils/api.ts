import { UseMutationReturn } from '@vue/apollo-composable';
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

export const performMutation = (apollo, options, mutationName) => {
  return new Promise((resolve, reject) => {
    apollo
      .mutate(options)
      .then(({ data }) => {
        if (!data[mutationName].success) {
          return reject(
            new ValidationError(Errors.createFromAPI(data[mutationName].errors))
          );
        }
        resolve(data);
      })
      .catch((e) => {
        errorHandler(e);
        reject(e);
      });
  });
};

// interface IMutationResult<TMutationIndex extends string> {
//   [k in TMutationIndex]: {
//     success: boolean;
//   };
// }

export const doMutation = async <TResult>(
  mutationFunctionReturn: UseMutationReturn<TResult, any>,
  mutationPrimaryIndex: string
): Promise<TResult> => {
  const response = await mutationFunctionReturn.mutate();
  if (!response || !response.data)
    throw new ValidationError(
      Errors.createFromMessage('An unknown error occured')
    );
  const data = response.data;

  // Check it was successful
  // @ts-ignore
  if (!data?.[mutationPrimaryIndex]?.success) {
    throw new ValidationError( // @ts-ignore
      Errors.createFromAPI(data?.[mutationPrimaryIndex]?.errors)
    );
  }

  return data;
};
