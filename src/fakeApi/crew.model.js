import faker from 'faker';
import { belongsTo, Factory, Model } from 'miragejs';

export default {
  registerModels() {
    return {
      CrewNode: Model.extend({
        production: belongsTo(),
      }),
    };
  },
  registerFactories() {
    return {
      CrewNode: Factory.extend({
        department: () =>
          faker.random.arrayElement(['Stage Management', 'Lighting', 'Sound']),
        name: () => faker.name.findName(),
      }),
    };
  },
  registerGQLTypes() {
    return `
      type CrewNode implements Node {
        id: ID!
        production: ProductionNode
        name: String!
        deparment: String!
      }
    `;
  },
};
