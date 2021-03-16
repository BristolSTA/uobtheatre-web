import faker from 'faker';
import lo from 'lodash';
import { belongsTo, Factory, Model, trait } from 'miragejs';

import { authedUser, updateIfDoesntHave } from './utils';

export default {
  registerModels() {
    return {
      miscCostNode: Model.extend({
        production: belongsTo('productionNode'),
      }),
    };
  },
  registerFactories() {
    return {
      bookingNode: Factory.extend({
        reference: () => faker.random.alphaNumeric(12),
        status: 'INPROGRESS',

        paid: trait({
          status: 'PAID',
          afterCreate(node, server) {
            updateIfDoesntHave(node, {
              payments: () => {
                return [server.create('paymentNode')];
              },
            });
          },
        }),
        afterCreate(node, server) {
          updateIfDoesntHave(node, {
            performance: () => {
              return server.create('performanceNode');
            },
          });
          node.update({
            priceBreakdown: server.create(
              'PriceBreakdownNode',
              generatePriceBreakdown(server.schema, node)
            ),
          });
        },
      }),
      ticketNode: Factory.extend({
        afterCreate(booking, server) {
          updateIfDoesntHave(booking, {
            seatGroup: () => {
              return server.create('seatGroupNode');
            },
            concessionType: () => {
              return server.create('concessionTypeNode');
            },
          });
        },
      }),
      miscCostNode: Factory.extend({
        name: () =>
          faker.random.arrayElement([
            'Theatre Improvement Levy',
            'Booking Fee',
          ]),
        description: () => faker.lorem.words(5),
        percentage: () => faker.random.arrayElement([null, 0.05]),
        value: () => faker.random.number({ min: 50, max: 400 }),
      }),
      paymentNode: Factory.extend({
        provider: () =>
          faker.random.arrayElement(['CASH', 'SQUARE_ONLINE', 'SQUARE_POS']),
        value: () => faker.random.number({ min: 1000, max: 3000 }),
        type: 'PURCHASE',
        curreny: 'GBP',
        cardBrand: () =>
          faker.random.arrayElement(['VISA', 'MASTERCARD', 'AMERICAN_EXPRESS']),
        last4: '1234',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    };
  },
  registerGQLMutationResolvers() {
    return {
      createBooking(obj, args, context) {
        // Create the tickets
        let tickets = [];
        if (args.tickets) {
          tickets = args.tickets.map((ticket) =>
            context.mirageSchema.create('ticketNode', {
              seatGroupId: ticket.seatGroupId,
              concessionTypeId: ticket.concessionTypeId,
            })
          );
        }

        // Create the booking
        let booking = context.mirageSchema.create('bookingNode', {
          performance: context.mirageSchema.performanceNodes.find(
            args.performanceId
          ),
          status: 'INPROGRESS',
          reference: faker.random.uuid(),
          tickets: tickets,
          user: authedUser(context),
        });

        booking.update({
          priceBreakdown: context.mirageSchema.create(
            'priceBreakdownNode',
            generatePriceBreakdown(context.mirageSchema, booking)
          ),
        });

        return { booking };
      },
      updateBooking(obj, args, { mirageSchema }) {
        // Update the tickets
        let tickets = [];
        if (args.tickets) {
          tickets = args.tickets.map((ticket) => {
            if (ticket.id) {
              return mirageSchema.ticketNodes.find(ticket.id);
            }
            return mirageSchema.create('ticketNode', {
              seatGroupId: ticket.seatGroupId,
              concessionTypeId: ticket.concessionTypeId,
            });
          });
        }
        // Update the booking
        let booking = mirageSchema.bookingNodes.find(args.bookingId);
        booking.update({
          tickets: tickets,
        });
        booking.priceBreakdown.update(
          generatePriceBreakdown(mirageSchema, booking)
        );

        return { booking };
      },
    };
  },
  registerGQLQueries() {
    return `
      booking(id: ID!): BookingNode
    `;
  },
  registerGQLTypes() {
    return `
      input CreateTicketInput {
        id: ID
        seatGroupId: ID!
        concessionTypeId: ID!
      }

      enum PaymentProvider {
        CASH
        SQUARE_ONLINE
        SQUARE_POS
      }
      
      type BookingNode implements Node {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        performance: PerformanceNode!
        status: BookingStatus!
        tickets: [TicketNode!]
        priceBreakdown: PriceBreakdownNode
        payments(offset: Int, before: String, after: String, first: Int, last: Int, type: String, provider: String, createdAt: DateTime, id: ID): PaymentNodeConnection

        user: UserNode
        reference: UUID!
      }

      type PriceBreakdownNode implements Node {
        id: ID!
        tickets: [PriceBreakdownTicketNode]
        ticketsPrice: Int
        discountsValue: Int
        miscCosts: [MiscCostNode]
        subtotalPrice: Int
        miscCostsValue: Int
        totalPrice: Int

        ticketsDiscountedPrice: Int
      }

      type PriceBreakdownTicketNode {
        ticketPrice: Int
        number: Int
        seatGroup: SeatGroupNode
        totalPrice: Int

        concessionType: ConcessionTypeNode
      }

    `;
  },
};

/**
 * @param {any} mirageSchema MirageJS Schema Instance
 * @param {object} booking MirageJS Booking Child
 * @returns {object} PriceBreakdownNode Data
 */
export function generatePriceBreakdown(mirageSchema, booking) {
  let performance = booking.performance;

  let ticketSummaries = lo
    .chain(booking.tickets.models)
    .groupBy((ticket) => [ticket.seatGroup.id, ticket.concessionType.id])
    .values()
    .map((groupedTickets) => {
      let ticketOption = performance.ticketOptions.models.find((option) => {
        return option.seatGroupId == groupedTickets[0].seatGroup.id;
      });
      let concessionTypeEdge = ticketOption.concessionTypes.models.find(
        (concessionTypeEdge) => {
          return (
            concessionTypeEdge.concessionTypeId ==
            groupedTickets[0].concessionType.id
          );
        }
      );

      return mirageSchema.create('priceBreakdownTicketNode', {
        number: groupedTickets.length,
        concessionType: concessionTypeEdge.concessionType,
        seatGroup: ticketOption.seatGroup,
        ticketPrice: concessionTypeEdge.price,
        totalPrice: concessionTypeEdge.price * groupedTickets.length,
      });
    })
    .value();

  let ticket_price = ticketSummaries
    .map((tickets) => tickets.totalPrice)
    .reduce((a, b) => a + b, 0);

  // A bit of a bodge...
  let discounts_price = performance.discounts.models.length
    ? Math.round(performance.discounts.models[0].percentage * 100)
    : 0;

  let tickets_inc_discount_price = ticket_price - discounts_price;

  let misc_costs = mirageSchema.miscCostNodes.where({
    productionId: performance.production.id,
  });
  misc_costs.models.forEach((misc_cost) => {
    if (misc_cost.percentage) {
      misc_cost.update({
        value: Math.round(misc_cost.percentage * tickets_inc_discount_price),
      });
    }
  });

  let misc_costs_price = misc_costs.models.length
    ? misc_costs.models
        .map((misc_cost) => misc_cost.value)
        .reduce((a, b) => a + b)
    : 0;

  let result = {
    // Tickets
    tickets: ticketSummaries,
    ticketsPrice: ticket_price,
    ticketsDiscountedPrice: tickets_inc_discount_price,
    discountsValue: discounts_price,

    // Misc Costs
    miscCosts: misc_costs,
    miscCostsValue: misc_costs_price,

    // Totals
    subtotalPrice: tickets_inc_discount_price,
    totalPrice: tickets_inc_discount_price + misc_costs_price,
  };

  return result;
}
