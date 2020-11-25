import faker from 'faker';
import { Model, Factory, belongsTo } from 'miragejs';

export default {
  registerModels() {
    return {
      crew: Model.extend({
        production: belongsTo(),
      }),
    };
  },
  registerSerializers() {
    return {};
  },
  registerFactories() {
    return {
      crew: Factory.extend({
        department: () =>
          faker.random.arrayElement(['Stage Management', 'Lighting', 'Sound']),
        name: () => faker.name.findName(),
      }),
    };
  },
  registerRoutes() {},
};
