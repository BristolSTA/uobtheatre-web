import { stitchSchemas } from '@graphql-tools/stitch';
import { createGraphQLHandler } from '@miragejs/graphql';
import { DateTime } from 'luxon';
import { createServer } from 'miragejs';

import CastInterface from './cast.model';
import CrewInterface from './crew.model';
import PerformanceInterface from './performance.model';
import ProductionInterface from './production.model';
import ProductionTeamInterface from './productionTeam.model';
import BaseGQLSchema from './schema.graphql';
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
      let dramsoc = server.create('SocietyNode', {
        name: 'Dramsoc',
        logo_image: null,
      });

      let winston = server.create('VenueNode', {
        name: 'Winston Theatre',
      });

      server.create('ProductionNode', 'withCoverImage', {
        name: 'Legally Blonde',
        ageRating: 10,
        society: server.create('SocietyNode', {
          name: 'MTB',
        }),
        performances: server.createList('PerformanceNode', 3),
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

      server.create('ProductionNode', {
        name: 'Present Laughter',
        society: dramsoc,
        start: DateTime.fromISO('2019-11-16'),
        end: DateTime.fromISO('2019-11-19'),
        isBookable: false,
      });

      server.create('ProductionNode', {
        name: 'Decade',
        society: dramsoc,
        start: DateTime.fromISO('2018-10-18'),
        end: DateTime.fromISO('2018-10-18'),
        isBookable: false,
      });

      server.create('ProductionNode', {
        name: 'A Default Production',
      });

      server.create('user', {
        password: 'admin',
        email: 'admin@bristolsta.com',
        token: '36c86c19f8f8d73aa59c3a00814137bdee0ab8de',
      });
    },

    async routes() {
      this.namespace = 'api';

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
