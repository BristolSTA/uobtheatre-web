import faker from 'faker'
import { Factory } from 'miragejs'

import { updateIfDoesntHave } from './utils'

export default {
  registerFactories() {
    return {
      discountNode: Factory.extend({
        name: () =>
          faker.random.arrayElement([
            'Group Discount',
            'Family Discount',
            'Mates Rate Discount',
          ]),
        percentage: () => faker.datatype.float({ max: 0.5, min: 0 }),
      }),
      discountRequirementNode: Factory.extend({
        number: () => faker.datatype.number({ min: 1, max: 10 }),

        afterCreate(discountRequirement, server) {
          updateIfDoesntHave(discountRequirement, {
            concessionType: () => server.create('concessionTypeNode'),
          })
        },
      }),
    }
  },
}
