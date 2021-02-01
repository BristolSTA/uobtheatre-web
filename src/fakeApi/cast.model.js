import faker from 'faker';
import { belongsTo,Factory, Model } from 'miragejs';

export default {
  registerModels() {
    return {
      cast: Model.extend({
        production: belongsTo(),
      }),
    };
  },
  registerSerializers() {
    return {};
  },
  registerFactories() {
    return {
      cast: Factory.extend({
        name: () => faker.name.findName(),
        profile_picture: () =>
          faker.random.arrayElement([
            'https://via.placeholder.com/100x100/FBD400',
            null,
          ]),
        role: () =>
          faker.random.arrayElement(['Peter Pan', 'The Wizard', 'Gary']),
      }),
    };
  },
  registerRoutes() {},
};
