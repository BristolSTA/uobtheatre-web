import { Scalars } from '~~/graphql/codegen/operations';

export type AtLeastOneIdInput = AtLeastOneOf<Scalars['IdInputField']>;
export type AtLeastOneOf<T> = [T, ...T[]];
