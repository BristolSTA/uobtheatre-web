import faker from 'faker';
import { DateTime } from 'luxon';
import { Factory } from 'miragejs';

import { updateIfDoesntHave } from './utils';

export default {
  registerFactories() {
    return {
      PerformanceNode: Factory.extend({
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
        duration_mins() {
          return Math.round(
            (DateTime.fromISO(this.end) - DateTime.fromISO(this.start)) /
              (1000 * 60)
          );
        },

        afterCreate(performance, server) {
          updateIfDoesntHave(performance, {
            venue: () => {
              return server.create('VenueNode');
            },
          });
        },
      }),
    };
  },
};
