import faker from 'faker';
import { Model, Factory, belongsTo } from 'miragejs';

export default class {
  registerModels() {
    return {
      production_team: Model.extend({
        production: belongsTo(),
      }),
    };
  }
  registerSerializers() {
    return {};
  }
  registerFactories() {
    return {
      productionTeam: Factory.extend({
        role: () => faker.random.arrayElement(['Producer', 'Music Director']),
        name: () => faker.name.findName(),
      }),
    };
  }
  registerRoutes() {}
}
