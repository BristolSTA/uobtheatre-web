import faker from 'faker';
import { Factory, Model } from 'miragejs';

export default {
  registerModels() {
    return {
      seatLocation: Model,
    };
  },
  registerSerializers() {
    return {};
  },
  registerFactories() {
    return {
      seatLocation: Factory.extend({
        name: () => faker.random.arrayElement(['Front Row', 'Back Row']),
        description: () => faker.lorem.words(5),
      }),
    };
  },
  registerRoutes() {},
};
