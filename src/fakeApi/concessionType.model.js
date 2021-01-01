import faker from 'faker';
import { belongsTo, Factory, Model } from 'miragejs';

export default {
  registerModels() {
    return {
      concessionType: Model.extend({
        performance: belongsTo('performance'),
      }),
    };
  },
  registerSerializers() {
    return {};
  },
  registerFactories() {
    return {
      concessionType: Factory.extend({
        name: () => faker.random.arrayElement(['Adult', 'Student']),
        price() {
          return faker.random.number({ min: 1, max: 10 }) * 100;
        },
        description: () => faker.lorem.words(5),
      }),
    };
  },
  registerRoutes() {},
};
