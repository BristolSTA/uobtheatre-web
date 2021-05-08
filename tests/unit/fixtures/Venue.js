import address from './Address'
import GenericConnection from './support/GenericNodeConnection'
import PerformanceNode from './Performance.js'
import ProductionNode from './Production.js'

export default (overrides = {}) => {
  return Object.assign(
    {
      id: 1,
      createdAt: '2021-05-08T14:00:00.000',
      updatedAt: '2021-05-08T16:00:00.000',
      name: 'Winston Theatre',
      internalCapacity: 205,
      description: 'A big theatre in the SU building',
      address: address(),
      image: {
        url: 'https://via.placeholder.com/1920x960',
      },
      publicallyListed: true,
      slug: 'winston_theatre',
      seatGroups: GenericConnection(),
      performances: GenericConnection([PerformanceNode()]),
      productions: GenericConnection([ProductionNode()]),
    },
    overrides
  )
}
