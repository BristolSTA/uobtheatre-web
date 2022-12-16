import { UseMutationReturn } from '@vue/apollo-composable';
import { GqlErrorUnion } from '@/graphql/codegen/operations';
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

interface ValidationMutationResponse {
  success: boolean;
  errors?: GqlErrorUnion[] | null;
}

export const doMutation = async <
  TResult extends {
    [key in ResponseKey]?: ValidationMutationResponse | null;
  },
  ResponseKey extends keyof TResult
>(
  mutationFunctionReturn: UseMutationReturn<TResult, any>,
  mutationPrimaryIndex: ResponseKey
): Promise<NonNullable<TResult[ResponseKey]>> => {
  const response = await mutationFunctionReturn.mutate();

  const mutationResponse = response?.data?.[mutationPrimaryIndex];

  if (mutationResponse == null)
    throw new ValidationError(
      Errors.createFromMessage('An unknown error occured')
    );

  // Check it was successful
  if (!mutationResponse.success) {
    throw new ValidationError(
      mutationResponse.errors
        ? Errors.createFromAPI(mutationResponse.errors)
        : Errors.createFromMessage('An error occured')
    );
  }

  return mutationResponse;
};
