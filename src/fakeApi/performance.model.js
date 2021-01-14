import faker from 'faker';
import { DateTime } from 'luxon';
import { belongsTo, Factory, hasMany, Model } from 'miragejs';

import {
  NotFoundResponse,
  RelationshipSerializer,
  updateIfDoesntHave,
} from './utils';

export default {
  registerModels() {
    return {
      performance: Model.extend({
        venue: belongsTo(),
        production: belongsTo('production'),
        seat_groups: hasMany('seat_group'),
        concession_types: hasMany('concession_type'),
        discounts: hasMany('discount'),
        misc_costs: hasMany('miscCost'),
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
        doors_open() {
          return DateTime.fromISO(this.start).minus({
            hours: faker.random.number({ min: 1, max: 2 }),
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

            seat_groups: () => {
              return server.createList('seatGroup', 2);
            },

            concession_types: () => {
              return server.createList('concessionType', 2);
            },
          });
        },
      }),
    };
  },
  registerRoutes() {
    this.resource('performances');

    // All ticket (concession) types by performance by production
    this.get(
      'productions/:slug/performances/:performance_id/ticket_types',
      function (schema, request) {
        let performance = schema.performances.find(
          request.params.performance_id
        );
        if (!performance) {
          return NotFoundResponse();
        }

        let seatGroups = this.serialize(performance.seat_groups);

        let concessionTypes = this.serialize(performance.concession_types);

        /*  */
        return {
          ticket_types: seatGroups.map((seatGroup) => {
            return {
              seat_group: seatGroup,
              concession_types: concessionTypes,
            };
          }),
          capacity_remaining: seatGroups
            .map((seat_group) => seat_group.capacity_remaining)
            .reduce((a, b) => a + b, 0),
        };
      }
    );

    // All discounts for performance
    this.get(
      'productions/:slug/performances/:performance_id/discounts',
      function (schema, request) {
        let performance = schema.performances.find(
          request.params.performance_id
        );
        if (!performance) {
          return NotFoundResponse();
        }

        return performance.discounts;
      }
    );
  },
};
