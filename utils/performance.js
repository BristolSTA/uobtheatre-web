export function singleDiscounts(discountEdges) {
  return [
    ...discountEdges
      .map((edge) => edge.node)
      .filter(
        (discount) =>
          discount.requirements.length === 1 &&
          discount.requirements[0].number === 1
      ),
  ].sort((discount1, discount2) => discount1.percentage - discount2.percentage)
}
