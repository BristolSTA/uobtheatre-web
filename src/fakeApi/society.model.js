import faker from 'faker';
import { Factory, Model } from 'miragejs';

import { NotFoundResponse } from './utils';

export default {
  registerModels() {
    return {
      society: Model,
    };
  },
  registerSerializers() {
    return {};
  },
  registerFactories() {
    return {
      society: Factory.extend({
        name: () => faker.name.findName(),
        slug() {
          return this.name.toLowerCase().replace(/ /g, '-');
        },
        logo_image: 'https://via.placeholder.com/500x500/0000FF',
        banner_image: 'https://via.placeholder.com/1200x480',
        description: () => faker.lorem.paragraphs(1),
      }),
    };
  },
  registerRoutes() {
    this.resource('societies');
    this.get('societies/:slug', function (schema, request) {
      return (
        schema.societies.findBy({ slug: request.params.slug }) ??
        NotFoundResponse()
      );
    });
  },
};
