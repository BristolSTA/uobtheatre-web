import faker from 'faker';
import { Factory } from 'miragejs';
faker.locale = 'en_GB';

export default {
  registerFactories() {
    return {
      VenueNode: Factory.extend({
        name: () => `${faker.random.arrayElement(['Winston', 'Pegg'])} Theatre`,
        slug() {
          return this.name.toLowerCase().replace(/ /g, '-');
        },
        internal_capacity: () => faker.random.number({ min: 50, max: 200 }),
        description: () => faker.lorem.paragraphs(1),
        image: 'https://via.placeholder.com/1920x960',
        publicly_listed: true,
        address: () => {
          return {
            building_name: `The ${faker.random.words(1)} Building`,
            street: faker.address.streetName(),
            building_number: faker.random.number({ min: 100, max: 110 }),
            city: 'Bristol',
            postcode: faker.address.zipCode(),
            latitude: faker.address.latitude(),
            longitude: faker.address.longitude(),
          };
        },
      }),
    };
  },
};
