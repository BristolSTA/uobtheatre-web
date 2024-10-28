import type {
  DiscountNode,
  DiscountNodeEdge,
  DiscountRequirementNode
} from '~~/graphql/codegen/operations';

export type SingleDiscount = Omit<DiscountNode, 'requirements'> & {
  requirements: [DiscountRequirementNode & { number: 1 }];
};

function isSingleDiscount(
  discount: DiscountNode | null | undefined
): discount is SingleDiscount {
  return (
    discount?.requirements?.length === 1 &&
    discount.requirements[0].number === 1
  );
}

export function getSingleDiscounts(
  discountEdges: readonly DiscountNodeEdge[]
): SingleDiscount[] {
  return discountEdges
    .map((edge) => edge.node)
    .filter(isSingleDiscount)
    .sort(
      (discount1, discount2) => discount1.percentage - discount2.percentage
    );
}
