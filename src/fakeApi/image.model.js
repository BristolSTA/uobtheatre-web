import faker from 'faker';
import { Factory } from 'miragejs';

export default {
  registerFactories() {
    return {
      ImageNode: Factory.extend({
        url: 'https://via.placeholder.com/1920x960',
        altText: () => faker.lorem.words(2),
      }),
    };
  },
};
