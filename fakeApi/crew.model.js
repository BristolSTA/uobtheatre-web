import faker from 'faker'
import { Factory } from 'miragejs'

import { updateIfDoesntHave } from './utils'

export default {
  registerFactories() {
    return {
      crewMemberNode: Factory.extend({
        name: () => faker.name.findName(),
        afterCreate(node, server) {
          updateIfDoesntHave(node, {
            role: () => server.create('CrewRoleNode'),
          })
        },
      }),
      crewRoleNode: Factory.extend({
        name: null,
        afterCreate(node, server) {
          updateIfDoesntHave(node, {
            department: () =>
              server.create(
                'enumNode',
                faker.random.arrayElement([
                  {
                    value: 'STAGE_MANAGEMENT',
                    description: 'Stage Management',
                  },
                  { value: 'LIGHTING', description: 'Lighting' },
                  {
                    value: 'SOUND',
                    description: 'Sound',
                  },
                ])
              ),
          })
        },
      }),
    }
  },
}
