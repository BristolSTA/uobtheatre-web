import faker from 'faker';
import { Factory,Model } from 'miragejs';

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
        logo_image: 'https://via.placeholder.com/500x500/0000FF',
      }),
    };
  },
  registerRoutes() {
    this.resource('societies');
  },
};
