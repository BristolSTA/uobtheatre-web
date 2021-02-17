import faker from 'faker';
import { Factory } from 'miragejs';

import { updateIfDoesntHave } from './utils';

export default {
  registerFactories() {
    return {
      concessionTypeNode: Factory.extend({
        name: () => faker.random.arrayElement(['Adult', 'Student']),
        description: () => faker.lorem.words(5),
      }),
      concessionTypeBookingType: Factory.extend({
        price() {
          return faker.random.number({ min: 1, max: 10 }) * 100;
        },
        afterCreate(node, server) {
          updateIfDoesntHave(node, {
            concessionType: () => {
              return server.create('concessionTypeNode');
            },
          });
        },
      }),
    };
  },
  registerGQLTypes() {
    return `
    type ConcessionTypeBookingType {
      price: Int
      pricePounds: String
      
      concessionType: ConcessionTypeNode
    } 
    `;
  },
};
