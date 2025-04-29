// To test, run yarn test:unit unit/pages/admin/BookingLookup.spec.js

import { mount } from '#testSupport/helpers';

import BookingLookupsPage from '@/pages/administration/tools/booking-lookup.vue';
import Production from '#testSupport/fixtures/Production';
import Performance from '#testSupport/fixtures/Performance';
import Booking from '../../support/fixtures/Booking';
import PaginatedTable from '@/components/ui/Tables/PaginatedTable.vue';
import User from '#testSupport/fixtures/User';
import AdminPage from '@/components/admin/AdminPage.vue';
import {
  GenericApolloResponse,
  GenericNodeConnection
} from '#testSupport/helpers/api';

const productions = GenericNodeConnection([
  Production({
    id: 1,
    name: 'Journey to the Unknown',
    performances: GenericNodeConnection([
      Performance({
        doorsOpen: '2020-01-01T10:30:00',
        start: '2020-01-01T10:40:00'
      })
    ])
  })
  // Production({
  //   id: 2,
  //   name: 'The Enchanted Forest',
  //   isBookable: false,
  //   performances: GenericNodeConnection([
  //     Performance({
  //       doorsOpen: '2020-01-01T10:30:00',
  //       start: '2020-01-01T10:40:00'
  //     })
  //   ])
  // }),
  // Production({ id: 3, name: 'Legends of the Hidden Temple' }),
  // Production({ id: 4, name: 'The Phantom of the Opera' }),
  // Production({
  //   id: 5,
  //   name: 'Escape from Alcatraz',
  //   performances: GenericNodeConnection([
  //     Performance({
  //       doorsOpen: '2020-01-02T10:30:00',
  //       start: '2020-01-02T10:40:00'
  //     }),
  //     Performance({
  //       doorsOpen: '2020-01-02T12:30:00',
  //       start: '2020-01-02T12:40:00'
  //     })
  //   ])
  // }),
  // Production({
  //   id: 6,
  //   name: 'The Chronicles of Narnia',
  //   isBookable: true,
  //   performances: GenericNodeConnection([
  //     Performance({
  //       doorsOpen: '2020-01-03T10:30:00',
  //       start: '2020-01-03T10:40:00'
  //     }),
  //     Performance({
  //       doorsOpen: '2020-01-03T14:30:00',
  //       start: '2020-01-03T14:40:00'
  //     })
  //   ])
  // })
]);

const bookings = GenericNodeConnection([
  Booking({
    id: 1,
    creator: User({ firstName: 'Alice' }),
    user: User({ firstName: 'Bob' }),
    status: 'CONFIRMED',
    production: productions.edges[0].node
  })
  // Booking({
  //   id: 2,
  //   creator: User({ firstName: 'Charlie' }),
  //   user: User({ firstName: 'Dave' }),
  //   status: 'PENDING',
  //   production: productions.edges[1].node
  // }),
  // Booking({
  //   id: 3,
  //   creator: User({ firstName: 'Eve' }),
  //   user: User({ firstName: 'Frank' }),
  //   status: 'CANCELLED',
  //   production: productions.edges[2].node
  // }),
  // Booking({
  //   id: 4,
  //   creator: User({ firstName: 'Grace' }),
  //   user: User({ firstName: 'Heidi' }),
  //   status: 'CONFIRMED',
  //   production: productions.edges[3].node
  // }),
  // Booking({
  //   id: 5,
  //   creator: User({ firstName: 'Ivan' }),
  //   user: User({ firstName: 'Judy' }),
  //   status: 'PENDING',
  //   production: productions.edges[4].node
  // }),
  // Booking({
  //   id: 6,
  //   creator: User({ firstName: 'Mallory' }),
  //   user: User({ firstName: 'Niaj' }),
  //   status: 'CANCELLED',
  //   production: productions.edges[5].node
  // }),
  // Booking({
  //   id: 7,
  //   creator: User({ firstName: 'Oscar' }),
  //   user: User({ firstName: 'Peggy' }),
  //   status: 'CONFIRMED',
  //   production: productions.edges[0].node
  // }),
  // Booking({
  //   id: 8,
  //   creator: User({ firstName: 'Quentin' }),
  //   user: User({ firstName: 'Rupert' }),
  //   status: 'PENDING',
  //   production: productions.edges[1].node
  // }),
  // Booking({
  //   id: 9,
  //   creator: User({ firstName: 'Sybil' }),
  //   user: User({ firstName: 'Trent' }),
  //   status: 'CANCELLED',
  //   production: productions.edges[2].node
  // }),
  // Booking({
  //   id: 10,
  //   creator: User({ firstName: 'Uma' }),
  //   user: User({ firstName: 'Victor' }),
  //   status: 'CONFIRMED',
  //   production: productions.edges[3].node
  // })
]);

describe('Admin Bookings Lookup', function () {
  let bookingsLookupPageComponent, adminPageComponent, bookingsTableComponent;

  // Mount the page before each test
  // TODO: Test this https://github.com/vuejs/apollo/issues/1266
  //       and this https://github.com/vuejs/vue-test-utils/issues/1562

  function getApolloFunc(funcName) {
    const nameParts = funcName.split('-');

    return bookingsLookupPageComponent.vm.$options.apollo[nameParts[0]][
      nameParts[1]
    ].bind(bookingsLookupPageComponent.vm);
  }

  beforeEach(async () => {
    bookingsLookupPageComponent = await mount(BookingLookupsPage, {
      // Load all the gory props on the page
      shallow: false,
      apollo: {
        queryResponses: [
          // These mock the queries that would otherwise be made,
          // using the name of each query in a given .gql file
          GenericApolloResponse('bookings', bookings),
          GenericApolloResponse('productions', productions),
          GenericApolloResponse('production', Production({}, true)),
          GenericApolloResponse('performances', GenericNodeConnection([]))
        ]
      }
    });

    // Create a dictionary of every apollo function from booking-lookup.vue
    // and bind them to the component instance, then call them in the order
    // they get called in booking-lookup.ve

    const functions = [
      { f: 'bookings-variables' },
      { f: 'productions-variables' },
      { f: 'performances-skip' },
      { f: 'bookings-variables' },
      {
        f: 'productions-update',
        p: GenericApolloResponse('productions', productions).data
      },
      {
        f: 'productions-result',
        p: GenericApolloResponse('productions', productions)
      },
      {
        f: 'bookings-update',
        p: GenericApolloResponse('bookings', bookings).data
      },
      { f: 'bookings-result', p: GenericApolloResponse('bookings', bookings) }
    ];

    functions.forEach(async (d) => {
      const f = getApolloFunc(d.f);

      if (d.p) {
        console.log('Props for function', d.f, JSON.stringify(d.p));
        f(d.p);
      } else {
        f();
      }

      // Force the component to re-render
      bookingsLookupPageComponent.vm.$forceUpdate();
      // Wait for the next tick
      bookingsLookupPageComponent.vm.$nextTick();
    });
  });

  // A simple function to return the page component
  const findComponents = () => {
    adminPageComponent = bookingsLookupPageComponent.findComponent(AdminPage);
    bookingsTableComponent = adminPageComponent.findComponent(PaginatedTable);
  };

  // A few basic stubs for later on
  const stubMethods = () => {};

  // And then all the tests

  // it('contains the correct components', () => {
  //   findComponents();

  //   expect(adminPageComponent.exists()).to.be.true;
  //   expect(adminPageComponent.props('title')).to.eq('Bookings Lookup');
  // });

  // it('passes the correct props to the table', async () => {});

  it('correctly displays all bookings before any search is made', async () => {
    findComponents();

    // console.log(
    //   JSON.stringify(Object.getOwnPropertyNames(bookingsTableComponent))
    // );

    // console.log('Bookings table items:', bookingsTableComponent.props('items'));

    // console.log(
    //   'Bookings from the main component:',
    //   bookingsLookupPageComponent.props('bookings')
    // );

    console.log('Table inner HTML:', bookingsTableComponent.html());

    // Verify that the data is passed to the table
    // expect(bookingsLookupPageComponent.vm.bookings).to.deep.equal(
    //   bookings.edges.map((edge) => edge.node)
    // );
    // expect(bookingsTableComponent.props('items')).to.deep.equal(
    //   bookings.edges.map((edge) => edge.node)
    // );
    // expect(bookingsTableComponent.props('loading')).to.be.false;

    // // Verify that the table displays the correct number of rows
    // const rows = bookingsTableComponent.findAll('table-row');
    // expect(rows.length).to.eq(bookings.edges.length);

    // // Verify the content of the first row
    // const firstRow = rows[0];
    // expect(firstRow.text()).to.include('Alice');
    // expect(firstRow.text()).to.include('Bob');
    // expect(firstRow.text()).to.include('Journey to the Unknown');
  });

  // it("correctly filters by a user's name", () => {});

  // it("correctly filters by a creator's name", () => {});

  // it("correctly filters by a production's name", () => {});

  // it('works when the production search has no associated productions', () => {});

  // it('works when the production search has fewer than 5 associated productions', () => {});

  // it('works when the production search has more than 5 associated productions', () => {});

  // it('allows for filtering by performance after a production has been selected', () => {});

  // it('correctly filters by a selected performance', () => {});

  // it('correctly filters by a selected booking status', () => {});
});
