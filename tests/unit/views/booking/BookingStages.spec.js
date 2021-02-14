import { expect } from 'chai';

import BookingStage from '@/classes/BookingStage';
import stages, {
  getNextStage,
  getPreviousStage,
  getRoutes,
  getStageIndex,
} from '@/views/booking/bookingStages';

import { assertNoVisualDifference } from '../../helpers';

describe('Booking Stages', () => {
  let fakeComponent = new (class {})();

  it('get routes', () => {
    assertNoVisualDifference(
      getRoutes(),
      stages.map((stage) => stage.generateRoute())
    );
  });

  it('test index', () => {
    let stage = new BookingStage('My Booking Stage', fakeComponent, {
      path: 'my-booking-stage',
    });
    expect(getStageIndex(stage)).to.eq(-1);

    expect(getStageIndex(stages[0])).to.eq(0);
    expect(getStageIndex(stages[4])).to.eq(4);

    expect(getStageIndex(stages[5])).to.eq(-1);
  });

  it('gets the next stage', () => {
    expect(
      getStageIndex(getNextStage(null, { warnings: ['strobe lighting'] }))
    ).to.eq(1);
    //with warnings
    expect(
      getStageIndex(getNextStage(0, { warnings: ['strobe lighting'] }))
    ).to.eq(1);
    expect(
      getStageIndex(getNextStage(1, { warnings: ['strobe lighting'] }))
    ).to.eq(2);
    //no warnings
    expect(getStageIndex(getNextStage(0, { warnings: [] }))).to.eq(2);

    expect(getStageIndex(getNextStage(2, {}))).to.eq(3);
    expect(getStageIndex(getNextStage(3, {}))).to.eq(4);
  });

  //   it('gets the previous stage', () => {
  //     expect(
  //       getStageIndex(getPreviousStage(4, { warnings: ['strobe lighting'] }, {}))
  //     ).to.eq(3);
  //     //   expect(getStageIndex(getPreviousStage(4, {}))).to.eq(3);
  //   });
});
