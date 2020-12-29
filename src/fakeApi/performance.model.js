import faker from 'faker';
import { DateTime } from 'luxon';
import { belongsTo, Factory, hasMany, Model } from 'miragejs';

import { RelationshipSerializer, updateIfDoesntHave } from './utils';

export default {
  registerModels() {
    return {
      performance: Model.extend({
        venue: belongsTo(),
        production: belongsTo('performance'),
        seatGroups: hasMany('seat_group'),
        concessionTypes: hasMany('concession_type'),
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
        start() {
          return DateTime.local().plus({
            days: faker.random.number({ min: 1, max: 3 }),
            hours: faker.random.number({ min: 1, max: 3 }),
          });
        },
        end() {
          return DateTime.fromISO(this.start).plus({
            hours: faker.random.number({ min: 1, max: 3 }),
          });
        },
        description: faker.lorem.words(4),
        sold_out: () => faker.random.arrayElement([true, false]),
        disabled: () => false,
        is_online: () => faker.random.arrayElement([true, false]),
        is_inperson: () => faker.random.arrayElement([true, false]),
        duration_mins() {
          return Math.round(
            (DateTime.fromISO(this.end) - DateTime.fromISO(this.start)) /
              (1000 * 60)
          );
        },

        afterCreate(performance, server) {
          updateIfDoesntHave(performance, {
            venue: () => {
              return server.create('venue');
            },

            seatGroups: () => {
              return server.createList('seatGroup', 2);
            },

            concessionTypes: () => {
              return server.createList('concessionType', 2);
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
