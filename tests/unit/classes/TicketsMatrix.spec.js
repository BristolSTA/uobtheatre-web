import { expect } from 'chai';

import TicketsMatrix from '@/classes/TicketsMatrix';

import FakePerformance from '../fixtures/FakePerformance';
import { executeWithServer, runApolloQuery } from '../helpers';

describe('TicketsMatrix', () => {
  let matrix;
  let apiData;
  beforeEach(async () => {
    await executeWithServer(async (server) => {
      let performance = server.create(
        'performanceNode',
        Object.assign({}, FakePerformance(server), { capacityRemaining: 100 })
      );
      let { data } = await runApolloQuery({
        query: require('@/graphql/queries/PerformanceTicketOptions.gql'),
        variables: {
          id: performance.id,
        },
      });
      apiData = data.performance;
      matrix = new TicketsMatrix(apiData);
    });
  });

  it('can get ticket options', () => {
    expect(matrix.ticket_options).to.include(apiData.ticketOptions[0]);
  });
  it('can get performance capacity remaining', () => {
    expect(matrix.performance_capacity_remaining).to.eq(100);
  });
  it('can set performance capacity remaining', () => {
    matrix.performance_capacity_remaining = 10;
    expect(matrix.performance_capacity_remaining).to.eq(10);
  });
  it('can decrement performance capacity remaining', () => {
    matrix.decrementPerformanceCapacity();
    expect(matrix.performance_capacity_remaining).to.eq(99);
  });
  it('can increment performance capacity remaining', () => {
    matrix.incrementPerformanceCapacity();
    expect(matrix.performance_capacity_remaining).to.eq(101);
  });
  it('can get capacity remaining for a seat group', () => {
    expect(matrix.capacityRemainingForSeatGroup('1')).to.eq(10);

    // Test that is uses minimum between performance and seat group
    matrix.performance_capacity_remaining = 5;

    expect(matrix.capacityRemainingForSeatGroup('1')).to.eq(5);
  });
  it('can decrement capacity remaining for a seat group', () => {
    matrix.decrementSeatGroupCapacity('1');
    expect(matrix.capacityRemainingForSeatGroup('1')).to.eq(9);
  });
  it('can increment capacity remaining for a seat group', () => {
    matrix.incrementSeatGroupCapacity('1');
    expect(matrix.capacityRemainingForSeatGroup('1')).to.eq(11);
  });
  it('can check if it can add tickets', () => {
    expect(matrix.canAddTickets(1)).to.be.true;
    expect(matrix.canAddTickets(100)).to.be.true;
    expect(matrix.canAddTickets(101)).to.be.false;

    expect(matrix.canAddTickets(10, 1)).to.be.true;
    expect(matrix.canAddTickets(11, 1)).to.be.false;

    matrix.performance_capacity_remaining = 0;
    expect(matrix.canAddTickets(1, 1)).to.be.false;
  });
});
