import faker from 'faker';
import { Factory, Model } from 'miragejs';

export default {
  registerModels() {
    return {
      ticketType: Model,
    };
  },
  registerSerializers() {
    return {};
  },
  registerFactories() {
    return {
      ticketType: Factory.extend({
        name: () => faker.random.arrayElement(['Adult', 'Student']),
        price_pounds: () => faker.random.number({ min: 1, max: 10 }).toFixed(2),
        description: () => faker.lorem.words(5),
      }),
    };
  },
  registerRoutes() {},
};
