import { mirageGraphQLFieldResolver } from '@miragejs/graphql'
import faker from 'faker'
import { DateTime } from 'luxon'
import { Factory, trait } from 'miragejs'

import { handleGraphQLOrderBy, updateIfDoesntHave } from './utils'

export default {
  registerFactories() {
    return {
      productionNode: Factory.extend({
        name: () => faker.random.words(3),
        subtitle: null,
        slug() {
          return this.name
            .toLowerCase()
            .replace(/[^A-z ]/g, '')
            .replace(/ /g, '-')
        },
        ageRating: null,
        facebookEvent: 'https://facebook.com',
        description: () => faker.lorem.paragraphs(3),
        start: () => DateTime.local(),
        end: () =>
          DateTime.local().plus({
            day: faker.datatype.number({ min: 1, max: 3 }),
          }),
        minSeatPrice: () => faker.datatype.number({ min: 100, max: 1000 }),
        isBookable: () => true,

        withCoverImage: trait({
          afterCreate(production, server) {
            production.update({
              coverImage: server.create('ImageNode', {
                url: 'https://via.placeholder.com/1800x1000',
              }),
            })
          },
        }),

        afterCreate(production, server) {
          updateIfDoesntHave(production, {
            posterImage: () => {
              return server.create('ImageNode', {
                url: 'https://via.placeholder.com/400x566',
              })
            },
            featuredImage: () => {
              return server.create('ImageNode', {
                url: 'https://via.placeholder.com/1920x960',
              })
            },
            cast: () => {
              return server.createList('CastMemberNode', 30)
            },
            crew: () => {
              return server.createList('CrewMemberNode', 4)
            },
            productionTeam: () => {
              return server.createList('ProductionTeamMemberNode', 3)
            },
            society: () => {
              return server.create('SocietyNode')
            },
            warnings: () => {
              return [
                server.create('warningNode', {
                  warning: 'Strobe Lighting',
                }),
                server.create('warningNode', {
                  warning: 'Nudity',
                }),
              ]
            },
          })
        },
      }),
    }
  },
  registerGQLQueryResolvers() {
    return {
      productions(obj, args, context, info) {
        const result = handleGraphQLOrderBy((args) => {
          return mirageGraphQLFieldResolver(obj, args, context, info)
        }, args)
        return result
      },
    }
  },
}
