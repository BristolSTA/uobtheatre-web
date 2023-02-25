/**
 * Helper function to remove null or undefined items from an array, such that typescript recognizes it
 * Courtest of https://www.chakshunyu.com/blog/how-to-filter-nullable-values-from-an-array-using-typescript/
 */
export function isNonNullable<TValue>(
  value: TValue | undefined | null
): value is TValue {
  return value != null;
}
