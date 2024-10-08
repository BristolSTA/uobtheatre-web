import type { UseMutationReturn, UseQueryReturn } from '@vue/apollo-composable';
import type { GqlErrorUnion } from '@/graphql/codegen/operations';
import Errors from '~~/classes/Errors';
import ValidationError from '~~/errors/ValidationError';
import type { ApolloQueryResult, OperationVariables } from '@apollo/client';
// TODO: Type all the things
/**
 * Catches only the given error(s). Otherwise, throws.
 *
 * @param {Array|Class} errors List or single error class
 * @param {Error} caughtError The caught error
 * @param {Function} callback The function to call if is a valid exception
 */
export function catchOnly<T>(
  errors: any[],
  caughtError: unknown,
  callback: (e: unknown) => T
): T {
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
export function getValidationErrors(
  error: unknown,
  throwExp = true
): Errors | undefined {
  if (!(error instanceof ValidationError)) {
    if (!throwExp) {
      return undefined;
    }
    throw error;
  }
  return error.errors;
}

export const performMutation = (
  apollo: any,
  options: object,
  mutationName: string
) => {
  return new Promise((resolve, reject) => {
    apollo
      .mutate(options)
      .then(({ data }: { data: any }) => {
        if (!data[mutationName].success) {
          return reject(
            new ValidationError(Errors.createFromAPI(data[mutationName].errors))
          );
        }
        resolve(data);
      })
      .catch((e: typeof Error) => {
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

export const waitForQuery = <TQuery, TVars extends OperationVariables>(
  useQueryReturn: UseQueryReturn<TQuery, TVars>
): Promise<ApolloQueryResult<TQuery>> => {
  const { onResult } = useQueryReturn;
  return new Promise((resolve) => {
    onResult((result) => {
      resolve(result);
    });
  });
};
