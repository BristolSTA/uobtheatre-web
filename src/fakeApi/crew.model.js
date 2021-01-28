import faker from 'faker';
import { belongsTo, Factory, Model } from 'miragejs';

export default {
  registerModels() {
    return {
      crewNode: Model.extend({
        production: belongsTo(),
      }),
    };
  },
  registerFactories() {
    return {
      crewNode: Factory.extend({
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
        department: String!
      }
      type CrewNodeConnection {
        pageInfo: PageInfo!
        edges: [CrewNodeEdge]!
      }
      type CrewNodeEdge {
        node: CrewNode
        cursor: String!
      }
    `;
  },
};
