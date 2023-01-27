import { describe, expect, it, beforeEach } from 'vitest';
import Performance from '#testSupport/fixtures/Performance';
import TicketsMatrix from '@/classes/TicketsMatrix';

describe('TicketsMatrix', () => {
  let matrix;
  let apiData;
  beforeEach(async () => {
    apiData = Performance();
    matrix = new TicketsMatrix(apiData);
  });

  it('can get ticket options', () => {
    expect(matrix.ticketOptions[0].id).to.eq(apiData.ticketOptions[0].id);
  });
  it('can get performance capacity remaining', () => {
    expect(matrix.performanceCapacityRemaining).to.eq(69);
  });
  it('can set performance capacity remaining', () => {
    matrix.performanceCapacityRemaining = 10;
    expect(matrix.performanceCapacityRemaining).to.eq(10);
  });
  it('can decrement performance capacity remaining', () => {
    matrix.decrementPerformanceCapacity();
    expect(matrix.performanceCapacityRemaining).to.eq(68);
  });
  it('can increment performance capacity remaining', () => {
    matrix.incrementPerformanceCapacity();
    expect(matrix.performanceCapacityRemaining).to.eq(70);
  });
  it('can get capacity remaining for a seat group', () => {
    expect(matrix.capacityRemainingForSeatGroup(1)).to.eq(30);

    // Test that is uses minimum between performance and seat group
    matrix.performanceCapacityRemaining = 5;

    expect(matrix.capacityRemainingForSeatGroup(1)).to.eq(5);
  });
  it('can decrement capacity remaining for a seat group', () => {
    matrix.decrementSeatGroupCapacity(1);
    expect(matrix.capacityRemainingForSeatGroup(1)).to.eq(29);
  });
  it('can increment capacity remaining for a seat group', () => {
    matrix.incrementSeatGroupCapacity(1);
    expect(matrix.capacityRemainingForSeatGroup(1)).to.eq(31);
  });
  it('can check if it can add tickets', () => {
    expect(matrix.canAddTickets(1)).to.be.true;
    expect(matrix.canAddTickets(69)).to.be.true;
    expect(matrix.canAddTickets(70)).to.be.false;

    expect(matrix.canAddTickets(30, 1)).to.be.true;
    expect(matrix.canAddTickets(31, 1)).to.be.false;

    matrix.performanceCapacityRemaining = 0;
    expect(matrix.canAddTickets(1, 1)).to.be.false;
  });
});
