import faker from 'faker';
import { DateTime } from 'luxon';
import { Model, Factory, belongsTo } from 'miragejs';
import { RelationshipSerializer, updateIfDoesntHave } from './utils';

export default {
  registerModels() {
    return {
      performance: Model.extend({
        venue: belongsTo(),
        production: belongsTo('performance'),
      }),
    };
  },
  registerSerializers() {
    return {
      performance: RelationshipSerializer(['venue']),
    };
  },
  registerFactories() {
    return {
      performance: Factory.extend({
        start: () => DateTime.local(),
        end: () =>
          DateTime.local().plus({
            hours: faker.random.number({ min: 1, max: 3 }),
          }),
        description: faker.lorem.words(4),
        sold_out: () => faker.random.arrayElement([true, false]),
        disabled: () => false,
        is_online: () => faker.random.arrayElement([true, false]),
        is_inperson: () => faker.random.arrayElement([true, false]),
        duration_mins: 100,

        afterCreate(performance, server) {
          updateIfDoesntHave(performance, {
            venue: () => {
              return server.create('venue');
            },
          });
        },
      }),
    };
  },
  registerRoutes() {
    this.resource('performances');
  },
};
