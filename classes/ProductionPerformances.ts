// Production:
// performances: Edge/node array

import {
  PerformanceNode,
  ProductionPerformancesFragment
} from '~~/graphql/codegen/operations';

export default class ProductionPerformances {
  performances: PerformanceNode[];

  constructor() {
    this.performances = [];
  }

  /**
   * Creates list of Performances object from an API response
   *
   * @param {object} performanceData API ProductionPerformances Data
   * @returns {ProductionPerformances} A ProductionPerformances Instance
   * @static
   */
  static fromAPIData(
    productionPerformancesData: ProductionPerformancesFragment
  ) {
    const productionPerformances = new this();
    productionPerformances.updateFromAPIData(productionPerformancesData);
    return productionPerformances;
  }

  /**
   * Updates the ProductionPerformances object from an API response
   *
   * @param {object} performanceData API ProductionPerformances Data
   */
  updateFromAPIData(
    productionPerformancesData: ProductionPerformancesFragment
  ) {
    if (
      productionPerformancesData.performances &&
      productionPerformancesData.performances.edges.length
    ) {
      this.performances = productionPerformancesData.performances.edges
        .map((edge) => edge?.node)
        .filter(
          (performance) => performance !== undefined
        ) as PerformanceNode[];
    }
  }
}
