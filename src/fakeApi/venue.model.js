import faker from 'faker';
import { Factory } from 'miragejs';

import { updateIfDoesntHave } from './utils';
faker.locale = 'en_GB';

export default {
  registerFactories() {
    return {
      venueNode: Factory.extend({
        name: () => `${faker.random.arrayElement(['Winston', 'Pegg'])} Theatre`,
        slug() {
          return this.name.toLowerCase().replace(/ /g, '-');
        },
        internalCapacity: () => faker.random.number({ min: 50, max: 200 }),
        description: () => faker.lorem.paragraphs(1),
        publiclyListed: true,
        afterCreate(venue, server) {
          updateIfDoesntHave(venue, {
            image: () => {
              return server.create('GrapheneImageFieldNode', {
                url: 'https://via.placeholder.com/1920x960',
              });
            },
            address: () => {
              return server.create('AddressNode');
            },
          });
        },
      }),
      addressNode: Factory.extend({
        buildingName: () => `The ${faker.random.words(1)} Building`,
        street: () => faker.address.streetName(),
        buildingNumber: () => faker.random.number({ min: 100, max: 110 }),
        city: 'Bristol',
        postcode: () => faker.address.zipCode(),
        latitude: () => faker.address.latitude(),
        longitude: () => faker.address.longitude(),
      }),
    };
  },
  registerGQLTypes() {
    return `
      type VenueNode implements Node {
        id: ID!
        name: String!
        internalCapacity: Int!
        description: String
        image: GrapheneImageFieldNode
        publiclyListed: Boolean!
        slug: String!
        address: AddressNode
        seatGroups(
          offset: Int
          before: String
          after: String
          first: Int
          last: Int
        ): SeatGroupNodeConnection!
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
      }
      type AddressNode implements Node {
        id: ID!
        buildingNumber: String
        buildingName: String
        street: String
        city: String!
        postcode: String!
        latitude: Float
        longitude: Float
      }
    `;
  },
  registerGQLQueries() {
    return `
      venue(
        id: ID
        slug: String
      ): VenueNode
      venues(
        offset: Int
        before: String
        after: String
        first: Int
        last: Int
        id: ID
        slug: String
      ): VenueNodeConnection
    `;
  },
};
