import faker from 'faker';
import { Factory } from 'miragejs';

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
      }),
    };
  },
  registerGQLTypes() {
    return `
    type ConcessionTypeBookingType {
      concessionType: ConcessionTypeNode
      price: Int
      pricePounds: String
    } 
    `;
  },
};
