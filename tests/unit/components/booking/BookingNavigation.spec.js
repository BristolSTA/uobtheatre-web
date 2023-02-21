import { mount } from '#testSupport/helpers';
import { expect, vi } from 'vitest';
import Booking from '~~/classes/Booking';
import BookingNavgiation from '@/components/booking/BookingNavigation.vue';
import Stages from '@/pages/production/[slug]/book/-bookingStages';

describe('Booking Navigation', () => {
  let navigationComponent;

  describe('using all stages', () => {
    beforeEach(async () => {
      // Set all the stages to report they should be used
      Stages.forEach((stageComponent) => {
        vi.spyOn(stageComponent.stageInfo, 'shouldBeUsed').mockReturnValue(
          true
        );
      });
      const booking = new Booking();
      booking.performance = { id: 1 };
      navigationComponent = await mount(BookingNavgiation, {
        props: {
          currentStageIndex: 0,
          production: {
            warnings: ['Generic Warning Here']
          },
          booking
        }
      });
    });

    it('has a button for each stage in order', () => {
      expect(navigationComponent.findAll('button').length).to.eq(Stages.length);
      Stages.forEach((stageComponent, index) => {
        expect(navigationComponent.findAll('button').at(index).text()).to.eq(
          stageComponent.stageInfo.name
        );
      });
    });

    it('highlights current stage, and displays old stages highlighted', async () => {
      expect(navigationComponent.findAll('button').at(0).classes()).to.include(
        'btn-orange'
      );
      expect(
        navigationComponent.findAll('button').at(1).classes()
      ).not.to.include('btn-orange');

      await navigationComponent.setProps({
        currentStageIndex: 1,
        maxAllowedStageIndex: 1
      });

      expect(
        navigationComponent.findAll('button').at(0).classes()
      ).not.to.include('btn-orange');
      expect(navigationComponent.findAll('button').at(0).classes()).to.include(
        'btn-green'
      );
      expect(navigationComponent.findAll('button').at(1).classes()).to.include(
        'btn-orange'
      );
    });

    it('correctly disables buttons', async () => {
      await navigationComponent.setProps({
        currentStageIndex: Math.round(Stages.length / 2),
        maxAllowedStageIndex: Math.round(Stages.length / 2)
      });

      vi.spyOn(navigationComponent.vm, 'onSelectStage');

      for (const [index] of Stages.entries()) {
        if (index > navigationComponent.vm.currentStageIndex) {
          // Should be disabled
          expect(
            navigationComponent
              .findAll('button')
              .at(index)
              .attributes('disabled')
          ).to.eq('');
          await navigationComponent
            .findAll('button')
            .at(index)
            .trigger('click');
          expect(navigationComponent.vm.onSelectStage.mock.calls.length).to.eq(
            0
          );
        } else {
          // Should not be disabled
          expect(
            navigationComponent
              .findAll('button')
              .at(index)
              .attributes('disabled')
          ).to.be.undefined;
          await navigationComponent
            .findAll('button')
            .at(index)
            .trigger('click');
          expect(navigationComponent.vm.onSelectStage.mock.calls.length).to.eq(
            1
          );
        }
        navigationComponent.vm.onSelectStage.mockClear();
      }
      navigationComponent.vm.onSelectStage.mockReset();
    });

    it('doesnt emits event when current navigation block clicked', async () => {
      await navigationComponent.findAll('button').at(0).trigger('click');
      expect(navigationComponent.emitted()['goto-stage']).to.not.be.ok;
    });

    it('emits event when valid navigation block clicked', async () => {
      await navigationComponent.setProps({
        currentStageIndex: 1,
        maxAllowedStageIndex: 1
      });
      await navigationComponent.findAll('button').at(0).trigger('click');
      expect(navigationComponent.emitted()['goto-stage'].length).to.eq(1);
      expect(navigationComponent.emitted()['goto-stage'][0][0]).to.eq(
        Stages[0]
      );
    });

    it('makes buttons with index more than max allowed disabled', () => {
      expect(navigationComponent.findAll('button').length).to.eq(Stages.length);
      Stages.forEach((stageComponent, index) => {
        expect(navigationComponent.findAll('button').at(index).text()).to.eq(
          stageComponent.stageInfo.name
        );
      });
    });
  });

  describe('with optional stage', () => {
    beforeEach(async () => {
      Stages.forEach((stageComponent, index) => {
        vi.spyOn(stageComponent.stageInfo, 'shouldBeUsed').mockReturnValue(
          index !== 1
        );
      });
      navigationComponent = await mount(BookingNavgiation, {
        props: {
          currentStageIndex: 0,
          maxAllowedStageIndex: 0,
          production: {
            warnings: ['Generic Warning Here']
          },
          booking: new Booking()
        }
      });
    });

    it('doesnt show optional stage', () => {
      expect(navigationComponent.text()).not.to.contain(
        Stages[1].stageInfo.name
      );
      expect(navigationComponent.findAll('button').at(1).text()).to.eq(
        Stages[2].stageInfo.name
      );
    });
  });
});
