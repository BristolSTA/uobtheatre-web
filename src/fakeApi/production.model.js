import faker from 'faker';
import { DateTime } from 'luxon';
import { Factory } from 'miragejs';

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
        age_rating: null,
        facebook_event: 'https://facebook.com',
        description: () => faker.lorem.paragraphs(3),
        warnings: ['Strobe Lighting', 'Nudity'],
        start_date: () => DateTime.local(),
        end_date: () =>
          DateTime.local().plus({
            day: faker.random.number({ min: 1, max: 3 }),
          }),
        min_ticket_price: () =>
          faker.random.number({ min: 1, max: 10 }).toFixed(2),
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
            coverImage: () => {
              return server.create('GrapheneImageFieldNode', {
                url: 'https://via.placeholder.com/1800x1000',
              });
            },
            cast: () => {
              return server.createList('CastNode', 30);
            },
            crew: () => {
              return server.createList('CrewNode', 4);
            },
            productionTeam: () => {
              return server.createList('ProductionTeamNode', 3);
            },
            society: () => {
              return server.create('SocietyNode');
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
      slug: String!
      cast: [CastNode]
      crew: [CrewNode]
      productionTeam: [ProductionTeamNode]
      start_date: DateTime
      end_date: DateTime
      performances(
        offset: Int
        before: String
        after: String
        first: Int
        last: Int
        id: ID
        start: DateTime
        start_Year_Gt: DateTime
      ): PerformanceNodeConnection!
    }`;
  },
};
