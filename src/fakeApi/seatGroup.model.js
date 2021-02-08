import faker from 'faker';
import { Factory } from 'miragejs';

export default {
  registerFactories() {
    return {
      seatGroupNode: Factory.extend({
        name: () => faker.random.arrayElement(['Front Row', 'Back Row']),
        description: () => faker.lorem.words(5),
      }),
    };
  },
};
