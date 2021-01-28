import faker from 'faker';
import { Factory } from 'miragejs';

export default {
  registerFactories() {
    return {
      societyNode: Factory.extend({
        name: () => faker.name.findName(),
        logo_image: 'https://via.placeholder.com/500x500/0000FF',
      }),
    };
  },
};
