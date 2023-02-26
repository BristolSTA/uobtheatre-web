import { Scalars } from '~~/graphql/codegen/operations';

export type IdInput = Scalars['IdInputField'];
export type AtLeastOneIdInput = AtLeastOneOf<IdInput>;
export type AtLeastOneOf<T> = [T, ...T[]];
