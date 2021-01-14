import faker from 'faker';
import lo from 'lodash';
import { belongsTo, Factory, hasMany, Model } from 'miragejs';

import {
  DefaultSerializer,
  RelationshipSerializer,
  updateIfDoesntHave,
} from './utils';

export default {
  registerModels() {
    return {
      booking: Model.extend({
        performance: belongsTo('performance'),
        tickets: hasMany('ticket'),
        misc_costs: hasMany('miscCost'),
      }),
      ticket: Model.extend({
        seat_group: belongsTo('seatGroup'),
        concession_type: belongsTo('concessionType'),
      }),
      miscCost: Model,
    };
  },
  registerSerializers() {
    return {
      booking: RelationshipSerializer(['tickets']).extend({
        serialize(object) {
          let json = this.buildPayload(object);
          json.performance_id = object.performanceId;

          let tickets_pricebreakdown = lo
            .chain(object.tickets.models)
            .groupBy((ticket) => [
              ticket.seat_group.id,
              ticket.concession_type.id,
            ])
            .values()
            .map((groupedTickets) => {
              return {
                number: groupedTickets.length,
                concession_type: groupedTickets[0].concession_type,
                seat_group: groupedTickets[0].seat_group,
                ticket_price: groupedTickets[0].concession_type.price,
                total_price:
                  groupedTickets[0].concession_type.price *
                  groupedTickets.length,
              };
            })
            .value();

          let ticket_price = tickets_pricebreakdown
            .map((tickets) => tickets.total_price)
            .reduce((a, b) => a + b, 0);

          // A bit of a bodge...
          let discounts_price = object.performance.discounts.models.length
            ? Math.round(object.performance.discounts.models[0].discount * 100)
            : 0;

          let tickets_inc_discount_price = ticket_price - discounts_price;

          let misc_costs = this.buildPayload(object.performance.misc_costs);
          let misc_costs_price = misc_costs.length
            ? misc_costs
                .map((misc_cost) => misc_cost.value)
                .reduce((a, b) => a + b)
            : 0;

          json.price_breakdown = {
            // Tickets
            tickets: tickets_pricebreakdown,
            tickets_price: ticket_price,
            tickets_discounted_price: tickets_inc_discount_price,
            discounts_value: discounts_price,

            // Misc Costs
            misc_costs: misc_costs,
            misc_costs_value: misc_costs_price,

            // Totals
            subtotal_price: tickets_inc_discount_price,
            total_price: tickets_inc_discount_price + misc_costs_price,
          };

          return json;
        },
        normalize() {
          if (arguments[0].booking.tickets) {
            arguments[0].booking.tickets = arguments[0].booking.tickets.map(
              (ticket) => {
                let ticketModel = this.schema.tickets.create({
                  seat_group: this.schema.seatGroups.find(ticket.seat_group_id),
                  concession_type: this.schema.concessionTypes.find(
                    ticket.concession_type_id
                  ),
                });
                return ticketModel.id;
              }
            );
          }
          return DefaultSerializer.prototype.normalize.apply(this, arguments);
        },
      }),
      ticket: RelationshipSerializer(['seat_group', 'concession_type']),
    };
  },
  registerFactories() {
    return {
      booking: Factory.extend({
        afterCreate(booking, server) {
          updateIfDoesntHave(booking, [
            {
              performance: () => {
                return server.create('performance');
              },
            },
            {
              tickets: () => {
                return server.createList('ticket', 2, {
                  seat_group: () =>
                    faker.random.arrayElement(
                      booking.performance.seat_groups.models
                    ),
                  concession_type: () =>
                    faker.random.arrayElement(
                      booking.performance.concession_types.models
                    ),
                });
              },
            },
          ]);
        },
      }),
      ticket: Factory.extend({
        afterCreate(booking, server) {
          updateIfDoesntHave(booking, {
            seat_group: () => {
              return server.create('seatGroup');
            },
            concession_type: () => {
              return server.create('concessionType');
            },
          });
        },
      }),
      miscCost: Factory.extend({
        name: () =>
          faker.random.arrayElement([
            'Theatre Improvement Levy',
            'Booking Charge',
          ]),
        description: () => faker.lorem.words(5),
        percentage: () => faker.random.arrayElement([null, 0.05]),
        value: () => faker.random.number({ min: 50, max: 400 }),
      }),
    };
  },
  registerRoutes() {
    // Booking resource endpoints
    this.resource('bookings', { except: ['create', 'update'] });
    this.post('bookings', function (schema, request) {
      request.requestBody = JSON.stringify({
        booking: JSON.parse(request.requestBody),
      });
      let attrs = this.normalizedRequestAttrs('booking');
      return schema.bookings.create(attrs);
    });
    this.put('bookings/:id', function (schema, request) {
      request.requestBody = JSON.stringify({
        booking: JSON.parse(request.requestBody),
      });
      let attrs = this.normalizedRequestAttrs('booking');
      return schema.bookings.find(request.params.id).update(attrs);
    });
  },
};
