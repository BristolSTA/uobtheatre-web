import faker from 'faker';
import { Factory } from 'miragejs';

import { updateIfDoesntHave } from './utils';

export default {
  registerFactories() {
    return {
      crewMemberNode: Factory.extend({
        name: () => faker.name.findName(),
        afterCreate(node, server) {
          updateIfDoesntHave(node, {
            role: () => server.create('CrewRoleNode'),
          });
        },
      }),
      crewRoleNode: Factory.extend({
        name: null,
        department: () =>
          faker.random.arrayElement(['Stage Management', 'Lighting', 'Sound']),
      }),
    };
  },
  registerGQLTypes() {
    return `
    type CrewRoleNode implements Node {
      id: ID!
      name: String
      crewMembers(offset: Int, before: String, after: String, first: Int, last: Int): CrewMemberNodeConnection!
      
      department: String!
    }
    `;
  },
};
