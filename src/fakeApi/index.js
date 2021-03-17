import { stitchSchemas } from '@graphql-tools/stitch';
import { DateTime } from 'luxon';
import { createServer } from 'miragejs';

import BookingInterface from './booking.model';
import CastInterface from './cast.model';
import ConcessionTypeInterface from './concessionType.model';
import CrewInterface from './crew.model';
import DiscountInterface from './discount.model';
import { createGraphQLHandler } from './mirageOverrides/handler';
import PerformanceInterface from './performance.model';
import ProductionInterface from './production.model';
import ProductionTeamInterface from './productionTeam.model';
import BaseGQLSchema from './schema.graphql';
import SeatGroupInterface from './seatGroup.model';
import SocietyInterface from './society.model';
import UserInterface from './user.model';
import { generateConcessionTypeBookingTypes } from './utils';
import VenueInterface from './venue.model';
let apiModels = [
  ProductionInterface,
  PerformanceInterface,
  SocietyInterface,
  CastInterface,
  CrewInterface,
  ProductionTeamInterface,
  VenueInterface,
  UserInterface,
  SeatGroupInterface,
  ConcessionTypeInterface,
  BookingInterface,
  DiscountInterface,
];

let models = {};
let factories = {};
let queryResolvers = {};
let mutationResolvers = {};
let customResolvers = {};

/**
 * Creates and installs the Mirage JS mock API server
 *
 * @param {string} environment The environment the server is being used in
 * @returns {createServer} MirageJS Server instance
 */
export function makeServer({ environment = 'development' } = {}) {
  apiModels.forEach((model) => {
    // Register models
    if (model.registerModels)
      models = Object.assign(models, model.registerModels());

    // Register factories
    if (model.registerFactories)
      factories = Object.assign(factories, model.registerFactories());

    // Register query type resolvers
    if (model.registerGQLQueryResolvers)
      queryResolvers = Object.assign(
        queryResolvers,
        model.registerGQLQueryResolvers()
      );

    // Register mutation type resolvers
    if (model.registerGQLMutationResolvers)
      mutationResolvers = Object.assign(
        mutationResolvers,
        model.registerGQLMutationResolvers()
      );

    // Register custom-typed resolvers
    if (model.registerGQLCustomResolvers)
      customResolvers = Object.assign(
        customResolvers,
        model.registerGQLCustomResolvers()
      );
  });

  return createServer({
    environment,

    models: Object.assign({}, models),

    factories: Object.assign({}, factories),

    seeds(server) {
      let AdultConcession = server.create('ConcessionTypeNode', {
        name: 'Adult',
        description: null,
      });
      let ChildConcession = server.create('ConcessionTypeNode', {
        name: 'Child',
      });
      let StudentConcession = server.create('ConcessionTypeNode', {
        name: 'Student',
        description: 'Valid ID NOT required',
      });
      let BestSeatGroup = server.create('SeatGroupNode', {
        name: 'The best seats in the house',
        description: 'They are sooooo good',
      });
      let ProjSeatGroup = server.create('SeatGroupNode', {
        name: 'Proj Seats',
        description: null,
      });

      let FamilyDiscount = server.create('DiscountNode', {
        name: 'Family Discount',
        discount: 0.2,
        seatGroup: null,
        requirements: [
          server.create('DiscountRequirementNode', {
            number: 2,
            concessionType: AdultConcession,
          }),
          server.create('DiscountRequirementNode', {
            number: 2,
            concessionType: ChildConcession,
          }),
        ],
      });

      let ticketOptions = [
        server.create('PerformanceSeatGroupNode', {
          seatGroup: BestSeatGroup,
          concessionTypes: generateConcessionTypeBookingTypes(
            [AdultConcession, ChildConcession, StudentConcession],
            server
          ),
        }),
        server.create('PerformanceSeatGroupNode', {
          seatGroup: ProjSeatGroup,
          concessionTypes: generateConcessionTypeBookingTypes(
            [AdultConcession, ChildConcession, StudentConcession],
            server
          ),
        }),
      ];

      /**
       * Fake Production 1 - Legally Blonde, MTB, with 4 performances (19th,20th,21st (sold out), 22nd (online))
       */

      let performances = server.createList('PerformanceNode', 4, {
        __dont_factory: ['production'],
      });
      performances[0].update({
        soldOut: false,
        isInperson: true,
        isOnline: false,
        doorsOpen: '2020-12-19T09:30:00',
        start: '2020-12-19T10:00:00',
        end: '2020-12-19T11:30:00',
        ticketOptions: ticketOptions,
        discounts: [FamilyDiscount],
      });

      performances[1].update({
        soldOut: false,
        isInperson: true,
        isOnline: false,
        doorsOpen: '2020-12-20T15:30:00',
        start: '2020-12-20T16:00:00',
        end: '2020-12-20T20:30:00',
        ticketOptions: [
          server.create('PerformanceSeatGroupNode', {
            seatGroup: server.create('seatGroupNode', {
              name: 'Seated',
            }),
            concessionTypes: generateConcessionTypeBookingTypes(
              [AdultConcession, ChildConcession, StudentConcession],
              server
            ),
          }),
        ],
      });
      performances[2].update({
        soldOut: true,
        isInperson: true,
        isOnline: false,
        doorsOpen: '2020-12-21T15:30:00',
        start: '2020-12-21T16:00:00',
        end: '2020-12-21T20:30:00',
      });
      performances[3].update({
        soldOut: false,
        isInperson: false,
        isOnline: true,
        doorsOpen: '2020-12-22T15:30:00',
        start: '2020-12-22T16:00:00',
        end: '2020-12-22T20:30:00',
        ticketOptions: [
          server.create('PerformanceSeatGroupNode', {
            seatGroup: server.create('seatGroupNode', {
              name: 'Online Livestream',
            }),
            concessionTypes: [
              server.create('concessionTypeBookingType', {
                concessionType: server.create('concessionTypeNode', {
                  name: 'Adult',
                }),
              }),
            ],
          }),
        ],
      });

      let legallyBlonde = server.create('ProductionNode', 'withCoverImage', {
        name: 'Legally Blonde',
        ageRating: 10,
        society: server.create('SocietyNode', {
          name: 'MTB',
        }),
        performances: performances,
      });

      server.create('MiscCostNode', {
        production: legallyBlonde,
        name: 'Booking Fee',
        percentage: 0.05,
      });

      /**
       * Fake Produciton 2 - TRASh, Dramsoc, 1 performance, no warnings
       */

      let dramsoc = server.create('SocietyNode', {
        name: 'Dramsoc',
        logo_image: null,
      });

      server.create('ProductionNode', {
        name: 'TRASh',
        subtitle: 'The Really Artsy Show',
        warnings: [],
        society: dramsoc,
        start: DateTime.fromISO('2020-11-19'),
        end: DateTime.fromISO('2020-11-19'),
        performances: server.createList('PerformanceNode', 1, {
          ticketOptions: ticketOptions,
        }),
        __dont_factory: ['warnings'],
      });

      /**
       * Fake Production 3 - Present laughter - Not bookable
       */

      server.create('ProductionNode', 'withCoverImage', {
        name: 'Present Laughter',
        society: dramsoc,
        start: DateTime.fromISO('2019-11-16'),
        end: DateTime.fromISO('2019-11-19'),
        isBookable: false,
      });

      /**
       * Fake Production 4 - A complete random production called A Default Production
       */
      server.create('ProductionNode', {
        name: 'A Default Production',
      });

      /**
       * A user
       */

      let user = server.create('userNode', {
        password: 'admin',
        email: 'admin@bristolsta.com',
        token: '36c86c19f8f8d73aa59c3a00814137bdee0ab8de',
      });

      /**
       * A booking
       */

      server.create('bookingNode', 'paid', {
        user: user,
        reference: 'abcdef123456',
        performance: performances[0],
        tickets: [
          server.create('ticketNode', {
            concessionType: AdultConcession,
            seatGroup: BestSeatGroup,
          }),
          server.create('ticketNode', {
            concessionType: StudentConcession,
            seatGroup: BestSeatGroup,
          }),
          server.create('ticketNode', {
            concessionType: ChildConcession,
            seatGroup: ProjSeatGroup,
          }),
          server.create('ticketNode', {
            concessionType: ChildConcession,
            seatGroup: ProjSeatGroup,
          }),
        ],
      });

      server.create('bookingNode', 'paid', {
        user: user,
        performance: server.create('PerformanceNode', {
          soldOut: false,
          isInperson: true,
          isOnline: false,
          doorsOpen: DateTime.fromISO('2019-10-07T17:30:00'),
          start: DateTime.fromISO('2019-10-07T18:00:00'),
          end: DateTime.fromISO('2019-10-07T19:30:00'),
          ticketOptions: ticketOptions,
          discounts: [FamilyDiscount],
          production: server.create('ProductionNode', 'withCoverImage', {
            name: 'Chicago',
            society: server.create('SocietyNode', {
              name: 'Music Theatre Brizzle',
            }),
          }),
        }),
        tickets: [
          server.create('ticketNode', {
            concessionType: AdultConcession,
            seatGroup: BestSeatGroup,
          }),
        ],
      });

      server.create('bookingNode', 'paid', {
        user: user,
        reference: '123456abcdef',
        performance: server.create('PerformanceNode', {
          soldOut: false,
          isInperson: true,
          isOnline: false,
          doorsOpen: DateTime.local().plus({
            days: 1,
          }),
          start: DateTime.local().plus({
            days: 1,
            hours: 2,
          }),
          end: DateTime.local().plus({
            days: 1,
            hours: 3,
          }),
          ticketOptions: ticketOptions,
          discounts: [FamilyDiscount],
          production: server.create('ProductionNode', 'withCoverImage', {
            name: 'TRASh',
            society: server.create('SocietyNode', {
              name: 'Dramsoc',
            }),
          }),
        }),
        tickets: [
          server.create('ticketNode', {
            concessionType: AdultConcession,
            seatGroup: BestSeatGroup,
          }),
        ],
      });
    },

    async routes() {
      this.namespace = '/fakeapi';
      this.passthrough();

      apiModels.forEach((model) => {
        if (model.registerRoutes) model.registerRoutes.bind(this)();
      });

      // Generate custom Fake API schema
      let fakeAPISchema = `${apiModels
        .filter((model) => model.registerGQLTypes)
        .map((model) => model.registerGQLTypes())
        .join('\n')}`;

      const queries = apiModels
        .filter((model) => model.registerGQLQueries)
        .map((model) => model.registerGQLQueries())
        .join('\n');
      const mutations = apiModels
        .filter((model) => model.registerGQLMutations)
        .map((model) => model.registerGQLMutations())
        .join('\n');

      if (queries.length)
        fakeAPISchema += `
          type Query {
            ${queries}
          }
        `;
      if (mutations.length)
        fakeAPISchema += `
          type Mutation {
            ${mutations}
          }
        `;

      // Merge fake api with real api schema export
      let schemas = [BaseGQLSchema];
      if (fakeAPISchema) schemas.push(fakeAPISchema);
      const graphQLSchema = stitchSchemas({
        schemas: schemas,
      });

      // Create GraphQL Route and Handler
      const graphQLHandler = createGraphQLHandler(graphQLSchema, this.schema, {
        resolvers: {
          Query: queryResolvers,
          Mutation: mutationResolvers,
          ...customResolvers,
        },
      });
      this.post('/graphql', graphQLHandler);
    },
  });
}
