import faker from 'faker';
import { belongsTo, Factory, hasMany, Model } from 'miragejs';

import { RelationshipSerializer, updateIfDoesntHave } from './utils';

export default {
  registerModels() {
    return {
      discount: Model.extend({
        performance: belongsTo('performance'),
        seat_group: belongsTo('seat_group'),
        discount_requirements: hasMany('discount_requirement'),
      }),
      discountRequirement: Model.extend({
        concession_type: belongsTo('concession_type'),
      }),
    };
  },
  registerSerializers() {
    return {
      discount: RelationshipSerializer(['discount_requirements', 'seat_group']),
      discountRequirement: RelationshipSerializer(['concession_type']),
    };
  },
  registerFactories() {
    return {
      discount: Factory.extend({
        name: () =>
          faker.random.arrayElement(['Group Discount', 'Family Discount']),
        discount: () => faker.random.float({ max: 0.5, min: 0 }),
        total_price: () => faker.random.number({ max: 2000, min: 100 }),
        afterCreate(discount, server) {
          updateIfDoesntHave(discount, [
            {
              performance: () => {
                return server.create('performance');
              },
            },
            {
              // seat_group: () =>
              //   faker.random.arrayElement(
              //     discount.performance.seatGroups.models
              //   ),
              discount_requirements: () => {
                return server.createList('discountRequirement', 2, {
                  concession_type: () =>
                    faker.random.arrayElement(
                      discount.performance.concessionTypes.models
                    ),
                });
              },
            },
          ]);
        },
      }),
      discountRequirement: Factory.extend({
        number: () => faker.random.number({ min: 1, max: 10 }),

        afterCreate(booking, server) {
          updateIfDoesntHave(booking, {
            concession_type: () => {
              return server.create('concessionType');
            },
          });
        },
      }),
    };
  },
  registerRoutes() {
    this.get('productions/:slug/performances/:performance_id/discounts');
  },
};
