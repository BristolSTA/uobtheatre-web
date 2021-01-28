import faker from 'faker';
import { belongsTo, Factory, Model } from 'miragejs';

export default {
  registerModels() {
    return {
      castNode: Model.extend({
        production: belongsTo(),
      }),
    };
  },
  registerFactories() {
    return {
      castNode: Factory.extend({
        name: () => faker.name.findName(),
        profile_picture: () =>
          faker.random.arrayElement([
            'https://via.placeholder.com/100x100/FBD400',
            null,
          ]),
        role: () =>
          faker.random.arrayElement(['Peter Pan', 'The Wizard', 'Gary']),
      }),
    };
  },
  registerGQLTypes() {
    return `
      type CastNode implements Node {
        id: ID!
        production: ProductionNode
        name: String!
        profile_picture: String
        role: String!
      }
      type CastNodeConnection {
        pageInfo: PageInfo!
        edges: [CastNodeEdge]!
      }
      type CastNodeEdge {
        node: CastNode
        cursor: String!
      }
    `;
  },
};
