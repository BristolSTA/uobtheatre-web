import { stitchSchemas } from '@graphql-tools/stitch';
import { createGraphQLHandler } from '@miragejs/graphql';
import { DateTime } from 'luxon';
import { createServer } from 'miragejs';

import BookingInterface from './booking.model';
import CastInterface from './cast.model';
import ConcessionTypeInterface from './concessionType.model';
import CrewInterface from './crew.model';
import DiscountInterface from './discount.model';
import PerformanceInterface from './performance.model';
import ProductionInterface from './production.model';
import ProductionTeamInterface from './productionTeam.model';
import BaseGQLSchema from './schema.graphql';
import SeatGroupInterface from './seatGroup.model';
import SocietyInterface from './society.model';
import UserInterface from './user.model';
import { RelationshipSerializer } from './utils';
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
let serializers = {};
let factories = {};
let queryResolvers = {};
let mutationResolvers = {};

/**
 * Creates and installs the Mirage JS mock API server
 *
 * @param {string} environment The environment the server is being used in
 * @returns {createServer} MirageJS Server instance
 */
export function makeServer({ environment = 'development' } = {}) {
  apiModels.forEach((model) => {
    if (model.registerModels)
      models = Object.assign(models, model.registerModels());
    if (model.registerSerializers)
      serializers = Object.assign(serializers, model.registerSerializers());
    if (model.registerFactories)
      factories = Object.assign(factories, model.registerFactories());
    if (model.registerGQLQueryResolvers)
      queryResolvers = Object.assign(
        queryResolvers,
        model.registerGQLQueryResolvers()
      );
    if (model.registerGQLMutationResolvers)
      mutationResolvers = Object.assign(
        mutationResolvers,
        model.registerGQLMutationResolvers()
      );
  });

  return createServer({
    environment,

    models: Object.assign({}, models),

    serializers: Object.assign(
      {
        application: RelationshipSerializer(true),
      },
      serializers
    ),

    factories: Object.assign({}, factories),

    seeds(server) {
      /**
       * Fake Performance 1 - Legally Blonde, MTB, with 3 performances (19th,20th,21st (sold out))
       */

      let performances = server.createList('PerformanceNode', 3);
      performances[0].sold_out = false;
      performances[0].start = '2020-12-19T10:00:00';
      performances[0].end = '2020-12-19T11:30:00';
      performances[0].seat_groups = [
        server.create('seatGroup', {
          name: 'The best seats in the house',
          description: 'They are sooooo good',
        }),
        server.create('seatGroup', {
          name: 'Proj Seats',
          description: null,
        }),
        server.create('seatGroup', {
          name: 'Sold out group',
          capacity_remaining: 0,
        }),
      ];
      performances[0].concession_types = [
        server.create('concessionType', {
          name: 'Adult',
          description: null,
        }),
        server.create('concessionType', {
          name: 'Child',
          description: 'Under 17.5 years',
        }),
        server.create('concessionType', {
          name: 'Student',
          description: 'Valid ID not required',
        }),
      ];
      performances[0].discounts = server.createList('discount', 2, {
        performance: performances[0],
      });
      performances[0].misc_costs = server.createList('miscCost', 1);

      performances[1].sold_out = false;
      performances[1].doors_open = '2020-12-20T14:14:00';
      performances[1].start = '2020-12-20T14:15:00';
      performances[1].end = '2020-12-20T15:15:00';

      performances[2].sold_out = true;
      performances[2].start = '2020-12-21T18:00:00';
      performances[2].end = '2020-12-21T20:30:00';

      let winston = server.create('venue', {
        name: 'Winston Theatre',
      });

      server.create('ProductionNode', 'withCoverImage', {
        name: 'Legally Blonde',
        ageRating: 10,
        society: server.create('SocietyNode', {
          name: 'MTB',
        }),
        performances: performances,
      });

      /**
       * Fake Performance 2 - TRASh, Dramsoc, 1 performance, no warnings
       */

      let dramsoc = server.create('SocietyNode', {
        name: 'Dramsoc',
        logo_image: null,
      });

      server.create('ProductionNode', {
        name: 'TRASh',
        subtitle: 'The Really Artsy Show',
        society: dramsoc,
        start: DateTime.fromISO('2020-11-19'),
        end: DateTime.fromISO('2020-11-19'),
        performances: server.createList('PerformanceNode', 1, {
          venue: winston,
        }),
      });

      /**
       * Fake Performance 3 - Present laughter
       */

      server.create('ProductionNode', {
        name: 'Present Laughter',
        society: dramsoc,
      });

      /**
       * Fake Performance 4 - A complete random production called A Default Production
       */
      server.create('ProductionNode', {
        name: 'A Default Production',
      });

      /**
       * A user
       */

      server.create('user', {
        password: 'admin',
        email: 'admin@bristolsta.com',
        token: '36c86c19f8f8d73aa59c3a00814137bdee0ab8de',
      });
    },

    async routes() {
      this.namespace = '/fakeapi';

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
          Mutations: mutationResolvers,
        },
      });
      this.post('/graphql', graphQLHandler);
    },
  });
}
