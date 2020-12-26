import faker from 'faker';
import { belongsTo,Factory, Model } from 'miragejs';

export default {
  registerModels() {
    return {
      production_team: Model.extend({
        production: belongsTo(),
      }),
    };
  },
  registerSerializers() {
    return {};
  },
  registerFactories() {
    return {
      productionTeam: Factory.extend({
        role: () => faker.random.arrayElement(['Producer', 'Music Director']),
        name: () => faker.name.findName(),
      }),
    };
  },
  registerRoutes() {},
};
