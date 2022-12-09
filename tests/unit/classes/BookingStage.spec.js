import { describe, expect, vi, it, beforeEach } from 'vitest';
import BookingStage from '@/classes/BookingStage';

describe('BookingStage Class', () => {
  let stage;

  beforeEach(() => {
    stage = new BookingStage({
      name: 'My Booking Stage',
      routeName: 'my-booking-stage'
    });
  });

  it('can get the route (if defined)', () => {
    expect(stage.routeName).to.eq('my-booking-stage');

    // Add some route options
    stage = new BookingStage({ name: 'My Booking Stage' });
    expect(stage.routeName).to.be.undefined;
  });

  it('can detemine if it should be used', () => {
    const fakeProduction = {
      id: 1
    };
    const fakeBooking = {
      id: 2
    };
    const shouldBeUsedFn = vi.fn();
    expect(stage.shouldBeUsed(fakeProduction, fakeBooking)).to.be.true; // No should be used fn

    stage = new BookingStage({
      name: 'My Booking Stage',
      shouldBeUsed: shouldBeUsedFn.mockReturnValueOnce(false)
    });

    expect(stage.shouldBeUsed(fakeProduction, fakeBooking)).to.be.false;
    expect(shouldBeUsedFn.mock.calls.length).to.eq(1);
    expect(shouldBeUsedFn.mock.calls[0][0]).to.eq(fakeProduction);
    expect(shouldBeUsedFn.mock.calls[0][1]).to.eq(fakeBooking);
  });

  it('can detemine if it is eligable', () => {
    const fakeProduction = {
      id: 1
    };
    const fakeBooking = {
      id: 2,
      performance: { id: 1 }
    };
    const eligableFn = vi.fn();
    // Requires performance defaults to true, so this should be false (no performance in booking)
    expect(stage.eligable(fakeProduction, { id: 2 })).to.be.false;

    // Set requires performance to be false (no eligable function)
    stage = new BookingStage({
      name: 'My Booking Stage',
      requiresPerformance: false
    });
    expect(stage.eligable(fakeProduction, fakeBooking)).to.be.true;

    // Requires performance = true with eligable function that returns true
    stage = new BookingStage({
      name: 'My Booking Stage',
      eligable: eligableFn.mockReturnValueOnce(true)
    });
    expect(stage.eligable(fakeProduction, fakeBooking)).to.be.true;
    expect(eligableFn.mock.calls.length).to.eq(1);
    expect(eligableFn.mock.calls[0][0]).to.eq(fakeProduction);
    expect(eligableFn.mock.calls[0][1]).to.eq(fakeBooking);
  });
});
