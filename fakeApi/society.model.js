import faker from 'faker'
import { Factory } from 'miragejs'

import { updateIfDoesntHave } from './utils'
export default {
  registerFactories() {
    return {
      societyNode: Factory.extend({
        name: () => faker.name.findName(),
        description: () => faker.lorem.paragraphs(1),
        slug() {
          return this.name.toLowerCase().replace(/ /g, '-')
        },
        afterCreate(node, server) {
          updateIfDoesntHave(node, {
            logo: () => {
              return server.create('ImageNode', {
                url: 'https://via.placeholder.com/500x500/0000FF',
              })
            },
            banner: () => {
              return server.create('ImageNode', {
                url: 'https://via.placeholder.com/1200x720',
              })
            },
          })
        },
      }),
    }
  },
}