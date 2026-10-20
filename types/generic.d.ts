import type { Scalars } from '~~/graphql/codegen/base-types.generated';

export type IdInput = Scalars['IdInputField']['input'];
export type AtLeastOneIdInput = AtLeastOneOf<IdInput>;
export type AtLeastOneOf<T> = [T, ...T[]];

export type PaginationInfo = {
  currentOffset: number;
  pageMaxLength: number;
  hasNextPage: boolean;
};
