import faker from 'faker';
import { Factory } from 'miragejs';

export default {
  registerFactories() {
    return {
      ConcessionTypeNode: Factory.extend({
        name: () => faker.random.arrayElement(['Adult', 'Student']),
        price() {
          return faker.random.number({ min: 1, max: 10 }) * 100;
        },
        description: () => faker.lorem.words(5),
      }),
      ConcessionTypeBookingType: Factory.extend({
        price() {
          return faker.random.number({ min: 1, max: 10 }) * 100;
        },
      }),
    };
  },
};
