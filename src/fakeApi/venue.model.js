import faker from 'faker';
import { Factory, Model } from 'miragejs';

faker.locale = 'en_GB';

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
        description: () => faker.lorem.paragraphs(2),
        address: () => {
          return {
            street: faker.address.streetName(),
            city: 'Bristol',
            postcode: faker.address.zipCode(),
            latitude: faker.address.latitude(),
            longitude: faker.address.longitude(),
          };
        },
      }),
    };
  },
  registerRoutes() {},
};
