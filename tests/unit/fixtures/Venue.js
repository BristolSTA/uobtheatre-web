import Address from './Address'
import GenericConnection from './support/GenericNodeConnection'
import PerformanceNode from './Performance.js'
import ProductionNode from './Production.js'

export default (overrides = {}, includePerformance = false) => {
  return Object.assign(
    {
      id: 1,
      createdAt: '2021-05-08T14:00:00.000',
      updatedAt: '2021-05-08T16:00:00.000',
      name: 'Anson Theatre',
      internalCapacity: 420,
      description: 'not the anson rooms',
      address: Address(),
      image: {
        url: 'https://via.placeholder.com/1920x960',
      },
      publicallyListed: true,
      slug: 'anson-theatre',
      seatGroups: GenericConnection(),
      performances: includePerformance
        ? GenericConnection([PerformanceNode()])
        : GenericConnection(),
      productions: GenericConnection([ProductionNode()]),
    },
    overrides
  )
}
