import { Scalars } from '~~/graphql/codegen/operations';

export type IdInput = Scalars['IdInputField'];
export type AtLeastOneIdInput = AtLeastOneOf<IdInput>;
export type AtLeastOneOf<T> = [T, ...T[]];

export type MaybeRef<T> = T | Ref<T>;

export type PaginationInfo = {
  currentOffset: number;
  pageMaxLength: number;
  hasNextPage: boolean;
};
