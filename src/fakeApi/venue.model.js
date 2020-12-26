import faker from 'faker';
import { Factory, Model } from 'miragejs';

import { NotFoundResponse } from './utils';

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
        slug() {
          return this.name.toLowerCase().replace(/ /g, '-');
        },
        internal_capacity: () => faker.random.number({ min: 50, max: 200 }),
        description: () => faker.lorem.paragraphs(1),
        address: () => faker.random.words(3),
        venue_image: 'https://via.placeholder.com/1920x960',
        publicly_listed: true,
      }),
    };
  },
  registerRoutes() {
    this.get('venues/:slug', function (schema, request) {
      return (
        schema.venues.findBy({ slug: request.params.slug }) ??
        NotFoundResponse()
      );
    });
  },
};
