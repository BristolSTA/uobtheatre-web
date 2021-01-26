import faker from 'faker';
import { belongsTo, Factory, Model } from 'miragejs';

export default {
  registerModels() {
    return {
      ProductionTeamNode: Model.extend({
        production: belongsTo(),
      }),
    };
  },
  registerFactories() {
    return {
      ProductionTeamNode: Factory.extend({
        role: () => faker.random.arrayElement(['Producer', 'Music Director']),
        name: () => faker.name.findName(),
      }),
    };
  },
  registerGQLTypes() {
    return `
      type ProductionTeamNode implements Node {
        id: ID!
        production: ProductionNode
        name: String!
        role: String!
      }
    `;
  },
};
