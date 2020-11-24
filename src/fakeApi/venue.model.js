import faker from 'faker';
import { Model, Factory } from 'miragejs';

export default class {
  registerModels() {
    return {
      venue: Model,
    };
  }
  registerSerializers() {
    return {};
  }
  registerFactories() {
    return {
      venue: Factory.extend({
        name: () => `${faker.random.arrayElement(['Winston', 'Pegg'])} Theatre`,
      }),
    };
  }
  registerRoutes() {}
}
