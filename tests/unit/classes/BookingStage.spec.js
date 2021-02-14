import { expect } from 'chai';

import BookingStage from '@/classes/BookingStage';
import { auth } from '@/middleware';

describe('BookingStage Class', () => {
  let stage;
  let fakeComponent = new (class {})();

  beforeEach(() => {
    stage = new BookingStage('My Booking Stage', fakeComponent, {
      path: 'my-booking-stage',
    });
  });

  it('can generate the route', () => {
    let route = stage.generateRoute();
    expect(route.component).to.eq(fakeComponent);
    expect(route.name).to.eq('production.book.my-booking-stage');
    expect(route.meta.stage).to.eq(stage);
    expect(route.meta.middleware).to.include(auth);
    expect(stage.generateRoute().beforeRouteEnter).to.be.undefined;

    // Add some route options
    stage = new BookingStage('My Booking Stage', fakeComponent, {
      path: 'my-booking-stage',
      name: 'my.custom.route.name',
      beforeRouteEnter: () => {},
    });
    expect(stage.generateRoute().name).to.eq('my.custom.route.name');
    expect(stage.generateRoute().beforeRouteEnter).not.to.be.undefined;
  });

  it('can get the route name', () => {
    expect(stage.getRouteName()).to.eq('production.book.my-booking-stage');
  });

  it('can detemine if it should be used', () => {
    let fakeProduction = {
      id: 1,
    };
    let fakeBooking = {
      id: 2,
    };
    let shouldBeUsedFn = jest.fn();
    expect(stage.shouldBeUsed(fakeProduction, fakeBooking)).to.be.true; // No should be used fn

    stage = new BookingStage(
      'My Booking Stage',
      fakeComponent,
      null,
      shouldBeUsedFn.mockReturnValueOnce(false)
    );

    expect(stage.shouldBeUsed(fakeProduction, fakeBooking)).to.be.false;
    expect(shouldBeUsedFn.mock.calls.length).to.eq(1);
    expect(shouldBeUsedFn.mock.calls[0][0]).to.eq(fakeProduction);
    expect(shouldBeUsedFn.mock.calls[0][1]).to.eq(fakeBooking);
  });

  it('can detemine if it is eligable', () => {
    let fakeProduction = {
      id: 1,
    };
    let fakeBooking = {
      id: 2,
      performance: { id: 1 },
    };
    let eligableFn = jest.fn();
    // Requires performance defaults to true, so this should be false (no performance in booking)
    expect(stage.eligable(fakeProduction, { id: 2 })).to.be.false;

    // Set requires performance to be false (no eligable function)
    stage = new BookingStage(
      'My Booking Stage',
      fakeComponent,
      {
        path: 'my-booking-stage',
      },
      null,
      null,
      false
    );
    expect(stage.eligable(fakeProduction, fakeBooking)).to.be.true;

    // Requires performance = true with eligable function that returns true
    stage = new BookingStage(
      'My Booking Stage',
      fakeComponent,
      {
        path: 'my-booking-stage',
      },
      null,
      eligableFn.mockReturnValueOnce(true)
    );
    expect(stage.eligable(fakeProduction, fakeBooking)).to.be.true;
    expect(eligableFn.mock.calls.length).to.eq(1);
    expect(eligableFn.mock.calls[0][0]).to.eq(fakeProduction);
    expect(eligableFn.mock.calls[0][1]).to.eq(fakeBooking);
  });
});
