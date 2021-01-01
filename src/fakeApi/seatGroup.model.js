import faker from 'faker';
import { belongsTo, Factory, Model } from 'miragejs';

export default {
  registerModels() {
    return {
      seatGroup: Model.extend({
        performance: belongsTo('performance'),
      }),
    };
  },
  registerSerializers() {
    return {};
  },
  registerFactories() {
    return {
      seatGroup: Factory.extend({
        name: () => faker.random.arrayElement(['Front Row', 'Back Row']),
        description: () => faker.lorem.words(5),
      }),
    };
  },
  registerRoutes() {},
};
