import faker from 'faker';
import { Factory } from 'miragejs';

import { updateIfDoesntHave } from './utils';
export default {
  registerFactories() {
    return {
      societyNode: Factory.extend({
        name: () => faker.name.findName(),
        afterCreate(node, server) {
          updateIfDoesntHave(node, {
            logo: () => {
              return server.create('GrapheneImageFieldNode', {
                url: 'https://via.placeholder.com/500x500/0000FF',
              });
            },
          });
        },
      }),
    };
  },
};
