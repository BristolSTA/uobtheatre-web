import faker from 'faker';
import { Factory } from 'miragejs';

export default {
  registerFactories() {
    return {
      productionTeamMemberNode: Factory.extend({
        role: () => faker.random.arrayElement(['Producer', 'Music Director']),
        name: () => faker.name.findName(),
      }),
    };
  },
};
