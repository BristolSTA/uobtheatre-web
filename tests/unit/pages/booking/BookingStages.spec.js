import { expect } from 'chai';

import BookingStage from '@/classes/BookingStage';
import stages, {
  getNextStage,
  getPreviousStage,
  getStageIndex,
} from '@/pages/production/_slug/book/-bookingStages';

describe('Booking Stages', () => {
  const fakeComponent = new (class {})();

  it('can get stage index', () => {
    const stage = new BookingStage('My Booking Stage', fakeComponent, {
      path: 'my-booking-stage',
    });
    expect(getStageIndex(stage)).to.eq(-1);

    expect(getStageIndex(stages[0].stageInfo)).to.eq(0);
    expect(getStageIndex(stages[4].stageInfo)).to.eq(4);

    expect(getStageIndex(undefined)).to.eq(-1);
  });

  it('can get the next stage', () => {
    expect(
      getStageIndex(
        getNextStage(null, {
          contentWarnings: [
            { warning: { shortDescription: 'Strobe lighting' } },
          ],
        })
      )
    ).to.eq(1);

    // with warnings and no perf_description
    expect(
      getStageIndex(
        getNextStage(
          0,
          {
            contentWarnings: [
              { warning: { shortDescription: 'Strobe lighting' } },
            ],
          },
          { performance: { description: 'perf_description' } }
        )
      )
    ).to.eq(1);
    expect(
      getStageIndex(
        getNextStage(
          1,
          {
            contentWarnings: [
              { warning: { shortDescription: 'Strobe lighting' } },
            ],
          },
          { performance: { description: 'perf_description' } }
        )
      )
    ).to.eq(2);

    // with warnings and perf_description
    expect(
      getStageIndex(
        getNextStage(
          0,
          {
            contentWarnings: [
              { warning: { shortDescription: 'Strobe lighting' } },
            ],
          },
          { performance: { description: 'perf_description' } }
        )
      )
    ).to.eq(1);
    expect(
      getStageIndex(
        getNextStage(
          1,
          {
            contentWarnings: [
              { warning: { shortDescription: 'Strobe lighting' } },
            ],
          },
          { performance: { description: 'perf_description' } }
        )
      )
    ).to.eq(2);

    // perf description, and no warnings
    expect(
      getStageIndex(
        getNextStage(
          0,
          { contentWarnings: [] },
          { performance: { description: 'perf_description' } }
        )
      )
    ).to.eq(1);
    expect(
      getStageIndex(
        getNextStage(
          1,
          { contentWarnings: [] },
          { performance: { description: 'perf_description' } }
        )
      )
    ).to.eq(2);

    // no warnings and no perf description
    expect(
      getStageIndex(
        getNextStage(
          0,
          { contentWarnings: [] },
          { performance: { description: null } }
        )
      )
    ).to.eq(2);

    expect(getStageIndex(getNextStage(2, {}))).to.eq(3);
    expect(getStageIndex(getNextStage(3, {}))).to.eq(4);
  });

  it('can get the previous stage', () => {
    expect(
      getStageIndex(
        getPreviousStage(
          stages[1],
          {
            contentWarnings: [
              { warning: { shortDescription: 'Strobe lighting' } },
            ],
          },
          { performance: { description: 'perf_description' } }
        )
      )
    ).to.eq(0);
    expect(
      getStageIndex(
        getPreviousStage(
          1,
          {
            contentWarnings: [
              { warning: { shortDescription: 'Strobe lighting' } },
            ],
          },
          { performance: { description: 'perf_description' } }
        )
      )
    ).to.eq(0);

    expect(
      getStageIndex(
        getPreviousStage(
          2,
          { contentWarnings: [] },
          { performance: { description: null } }
        )
      )
    ).to.eq(0);
    expect(
      getStageIndex(
        getPreviousStage(
          2,
          { contentWarnings: [] },
          { performance: { description: 'perf_description' } }
        )
      )
    ).to.eq(1);
  });
});
