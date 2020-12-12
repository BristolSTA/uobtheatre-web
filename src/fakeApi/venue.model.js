import faker from 'faker';
import { Factory,Model } from 'miragejs';

export default {
  registerModels() {
    return {
      venue: Model,
    };
  },
  registerSerializers() {
    return {};
  },
  registerFactories() {
    return {
      venue: Factory.extend({
        name: () => `${faker.random.arrayElement(['Winston', 'Pegg'])} Theatre`,
      }),
    };
  },
  registerRoutes() {},
};
