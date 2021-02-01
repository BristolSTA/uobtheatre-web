import { mirageGraphQLFieldResolver } from '@miragejs/graphql';
import faker from 'faker';
import { DateTime } from 'luxon';
import { Factory, trait } from 'miragejs';

import { updateIfDoesntHave } from './utils';

export default {
  registerFactories() {
    return {
      productionNode: Factory.extend({
        name: () => faker.random.words(3),
        subtitle: null,
        slug() {
          return this.name.toLowerCase().replace(/ /g, '-');
        },
        ageRating: null,
        facebookEvent: 'https://facebook.com',
        description: () => faker.lorem.paragraphs(3),
        start: () => DateTime.local(),
        end: () =>
          DateTime.local().plus({
            day: faker.random.number({ min: 1, max: 3 }),
          }),
        minSeatPrice: () => faker.random.number({ min: 1, max: 10 }).toFixed(2),
        isBookable: () => true,

        withCoverImage: trait({
          afterCreate(production, server) {
            production.update({
              coverImage: server.create('GrapheneImageFieldNode', {
                url: 'https://via.placeholder.com/1800x1000',
              }),
            });
          },
        }),

        afterCreate(production, server) {
          updateIfDoesntHave(production, {
            posterImage: () => {
              return server.create('GrapheneImageFieldNode', {
                url: 'https://via.placeholder.com/400x566',
              });
            },
            featuredImage: () => {
              return server.create('GrapheneImageFieldNode', {
                url: 'https://via.placeholder.com/1920x960',
              });
            },
            cast: () => {
              return server.createList('CastMemberNode', 30);
            },
            crew: () => {
              return server.createList('CrewMemberNode', 4);
            },
            productionTeam: () => {
              return server.createList('ProductionTeamMemberNode', 3);
            },
            society: () => {
              return server.create('SocietyNode');
            },
            warnings: () => {
              return [
                server.create('warningNode', {
                  warning: 'Strobe Lighting',
                }),
                server.create('warningNode', {
                  warning: 'Nudity',
                }),
              ];
            },
          });
        },
      }),
    };
  },
  registerGQLTypes() {
    return `
    type ProductionNode implements Node {
      id: ID!
      name: String!
      subtitle: String
      description: String
      society: SocietyNode
      posterImage: GrapheneImageFieldNode
      featuredImage: GrapheneImageFieldNode
      coverImage: GrapheneImageFieldNode
      ageRating: Int
      facebookEvent: String
      warnings: [WarningNode!]
      slug: String!
      cast: [CastMemberNode!]
      productionTeam: [ProductionTeamMemberNode!]
      crew: [CrewMemberNode!]
      performances(offset: Int, before: String, after: String, first: Int, last: Int, id: ID, start: DateTime, start_Year_Gt: DateTime): PerformanceNodeConnection!
      start: DateTime
      end: DateTime
      minSeatPrice: Int
      isBookable: Boolean!
    }
    `;
  },
  registerGQLQueries() {
    return `
      production(id: ID
        slug: String): ProductionNode
      productions(
        offset: Int
        before: String
        after: String
        first: Int
        last: Int
        id: ID
        slug: String
        orderBy: String
        future: Boolean
      ): ProductionNodeConnection
  `;
  },
  registerGQLQueryResolvers() {
    return {
      productions(obj, args, context, info) {
        const { orderBy } = args;

        delete args.orderBy;

        const records = mirageGraphQLFieldResolver(obj, args, context, info);

        if (orderBy) {
          const orderByProp = orderBy.substring(1);
          const orderType = orderBy.charAt(0);
          records.edges.sort((edge1, edge2) => {
            if (edge1.node[orderByProp] < edge2.node[orderByProp])
              return orderType == '+' ? -1 : 1;
            if (edge1.node[orderByProp] > edge2.node[orderByProp])
              return orderType == '+' ? 1 : -1;
            return 0;
          });
        }

        return records;
      },
    };
  },
};
