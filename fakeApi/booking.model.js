import faker from 'faker'
import lo from 'lodash'
import { belongsTo, Factory, Model, trait } from 'miragejs'

import {
  authedUser,
  mutationWithErrorsResolver,
  NonFieldError,
  updateIfDoesntHave,
} from './utils'

export const statusEnums = []

export default {
  registerModels() {
    return {
      miscCostNode: Model.extend({
        production: belongsTo('productionNode'),
      }),
      // paymentNode: Model.extend({
      //   providerPaymentId: () => faker.datatype.uuid(),
      //   // referenceId: () => faker.datatype.uuid(),
      //   value: () => faker.datatype.number({ min: 100, max: 1000 }),
      //   currency: 'GBP',
      //   createdAt: new Date(),
      //   status: 'COMPLETED',
      //   cardBrand: 'VISA',
      //   last4: '4567',
      // }),
    }
  },
  registerFactories() {
    return {
      bookingNode: Factory.extend({
        reference: () => faker.random.alphaNumeric(12),

        paid: trait({
          afterCreate(node, server) {
            updateIfDoesntHave(node, {
              payments: () => {
                return [server.create('paymentNode')]
              },
              status: () =>
                server.create('enumNode', {
                  value: 'PAID',
                  description: 'Paid',
                }),
            })
          },
        }),
        afterCreate(node, server) {
          updateIfDoesntHave(node, {
            performance: () => {
              return server.create('performanceNode')
            },
            status: () =>
              server.create('enumNode', {
                value: 'IN_PROGRESS',
                description: 'In Progress',
              }),
          })
          node.update({
            priceBreakdown: server.create(
              'PriceBreakdownNode',
              generatePriceBreakdown(server.schema, node)
            ),
          })
        },
      }),
      ticketNode: Factory.extend({
        afterCreate(booking, server) {
          updateIfDoesntHave(booking, {
            seatGroup: () => {
              return server.create('seatGroupNode')
            },
            concessionType: () => {
              return server.create('concessionTypeNode')
            },
          })
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
        value: () => faker.datatype.number({ min: 50, max: 400 }),
      }),
      paymentNode: Factory.extend({
        value: () => faker.datatype.number({ min: 1000, max: 3000 }),
        curreny: 'GBP',
        cardBrand: () =>
          faker.random.arrayElement(['VISA', 'MASTERCARD', 'AMERICAN_EXPRESS']),
        last4: '1234',
        createdAt: new Date(),
        updatedAt: new Date(),
        afterCreate(node, server) {
          updateIfDoesntHave(node, {
            provider: () =>
              server.create(
                'enumNode',
                faker.random.arrayElement([
                  { value: 'CASH', description: 'Cash' },
                  { value: 'SQUARE_ONLINE', description: 'Square Online' },
                  { value: 'SQUARE_POS', description: 'Square Point-of-Sale' },
                ])
              ),
            type: () =>
              server.create('enumNode', {
                value: 'PURCHASE',
                description: 'Purchase',
              }),
          })
        },
      }),
    }
  },
  registerGQLMutationResolvers() {
    return {
      createBooking: mutationWithErrorsResolver((obj, args, context) => {
        // Create the tickets
        let tickets = []
        if (args.tickets) {
          tickets = args.tickets.map((ticket) =>
            context.mirageSchema.create('ticketNode', {
              seatGroupId: ticket.seatGroupId,
              concessionTypeId: ticket.concessionTypeId,
            })
          )
        }

        // Create the booking
        const booking = context.mirageSchema.create('bookingNode', {
          performance: context.mirageSchema.performanceNodes.find(
            args.performanceId
          ),
          reference: faker.random.alphaNumeric(12),
          status: 'IN_PROGRESS',
          tickets,
          user: authedUser(context),
        })

        booking.update({
          priceBreakdown: context.mirageSchema.create(
            'priceBreakdownNode',
            generatePriceBreakdown(context.mirageSchema, booking)
          ),
        })

        return { booking }
      }),
      updateBooking: mutationWithErrorsResolver(
        (obj, args, { mirageSchema }) => {
          // Update the tickets
          let tickets = []
          if (args.tickets) {
            tickets = args.tickets.map((ticket) => {
              if (ticket.id) {
                return mirageSchema.ticketNodes.find(ticket.id)
              }
              return mirageSchema.create('ticketNode', {
                seatGroupId: ticket.seatGroupId,
                concessionTypeId: ticket.concessionTypeId,
              })
            })
          }
          // Update the booking
          const booking = mirageSchema.bookingNodes.find(args.bookingId)
          booking.update({
            tickets,
          })
          booking.priceBreakdown.update(
            generatePriceBreakdown(mirageSchema, booking)
          )

          return { booking }
        }
      ),
      payBooking: mutationWithErrorsResolver((obj, args, { mirageSchema }) => {
        const booking = mirageSchema.bookingNodes.find(args.bookingId)

        // Check same price
        if (args.price !== booking.priceBreakdown.totalPrice) {
          throw new NonFieldError(
            'There was a price difference between the booking and the requested price'
          )
        }

        booking.update({
          status: 'PAID',
        })

        const payment = booking.createPayment({
          type: 'PURCHASE',
          provider: 'SQUARE_ONLINE',
          providerPaymentId: faker.datatype.uuid(),
          value: booking.priceBreakdown.totalPrice,
          currency: 'GBP',
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'COMPLETED',
          cardBrand: 'VISA',
          last4: '4567',
        })

        return {
          booking,
          payment,
        }
      }),
    }
  },
  registerGQLQueries() {
    // only here for tests, not expected to be in the real schema
    return `
      booking(id: ID!): BookingNode
    `
  },
}

/**
 * @param {any} mirageSchema MirageJS Schema Instance
 * @param {object} booking MirageJS Booking Child
 * @returns {object} PriceBreakdownNode Data
 */
export function generatePriceBreakdown(mirageSchema, booking) {
  const performance = booking.performance

  const ticketSummaries = lo
    .chain(booking.tickets.models)
    .groupBy((ticket) => [ticket.seatGroup.id, ticket.concessionType.id])
    .values()
    .map((groupedTickets) => {
      const ticketOption = performance.ticketOptions.models.find((option) => {
        return option.seatGroupId === groupedTickets[0].seatGroup.id
      })
      const concessionTypeEdge = ticketOption.concessionTypes.models.find(
        (concessionTypeEdge) => {
          return (
            concessionTypeEdge.concessionTypeId ===
            groupedTickets[0].concessionType.id
          )
        }
      )

      return mirageSchema.create('priceBreakdownTicketNode', {
        number: groupedTickets.length,
        concessionType: concessionTypeEdge.concessionType,
        seatGroup: ticketOption.seatGroup,
        ticketPrice: concessionTypeEdge.price,
        totalPrice: concessionTypeEdge.price * groupedTickets.length,
      })
    })
    .value()

  const ticketPrice = ticketSummaries
    .map((tickets) => tickets.totalPrice)
    .reduce((a, b) => a + b, 0)

  // A bit of a bodge...
  const discountsPrice = performance.discounts.models.length
    ? Math.round(performance.discounts.models[0].percentage * 100)
    : 0

  const ticketsIncDiscountPrice = ticketPrice - discountsPrice

  const miscCosts = mirageSchema.miscCostNodes.where({
    productionId: performance.production.id,
  })
  miscCosts.models.forEach((miscCost) => {
    if (miscCost.percentage) {
      miscCost.update({
        value: Math.round(miscCost.percentage * ticketsIncDiscountPrice),
      })
    }
  })

  const miscCostsPrice = miscCosts.models.length
    ? miscCosts.models.map((miscCost) => miscCost.value).reduce((a, b) => a + b)
    : 0

  const result = {
    // Tickets
    tickets: ticketSummaries,
    ticketsPrice: ticketPrice,
    ticketsDiscountedPrice: ticketsIncDiscountPrice,
    discountsValue: discountsPrice,

    // Misc Costs
    miscCosts,
    miscCostsValue: miscCostsPrice,

    // Totals
    subtotalPrice: ticketsIncDiscountPrice,
    totalPrice: ticketsIncDiscountPrice + miscCostsPrice,
  }

  return result
}
