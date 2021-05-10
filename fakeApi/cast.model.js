import faker from 'faker'
import { Factory } from 'miragejs'

import { updateIfDoesntHave } from './utils'

export default {
  registerFactories() {
    return {
      castMemberNode: Factory.extend({
        name: () => faker.name.findName(),
        role: () =>
          faker.random.arrayElement(['Peter Pan', 'The Wizard', 'Gary']),
        afterCreate(castNode, server) {
          if (Math.random() > 0.5) {
            updateIfDoesntHave(castNode, {
              profilePicture: () =>
                server.create('ImageNode', {
                  url: 'https://via.placeholder.com/100x100/FBD400',
                }),
            })
          }
        },
      }),
    }
  },
}
