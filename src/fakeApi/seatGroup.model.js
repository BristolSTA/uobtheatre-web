import faker from 'faker';
import { Factory } from 'miragejs';

export default {
  registerFactories() {
    return {
      seatGroupNode: Factory.extend({
        name: () => faker.random.arrayElement(['Front Row', 'Back Row']),
        description: () => faker.lorem.words(5),
        capacityRemaining: () => faker.random.number({ min: 0, max: 100 }),
      }),
    };
  },
};
