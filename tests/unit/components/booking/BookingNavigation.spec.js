import { mount } from '@vue/test-utils';
import { expect } from 'chai';

import Booking from '@/classes/Booking';
import BookingNavgiation from '@/components/booking/BookingNavigation.vue';
import Stages from '@/views/booking/bookingStages';

describe('Booking Navigation', () => {
  let navigationComponent;

  describe('using all stages', () => {
    beforeEach(() => {
      // Set all the stages to report they should be used
      Stages.forEach((stage) => {
        jest.spyOn(stage, 'shouldBeUsed').mockReturnValue(true);
      });
      navigationComponent = mount(BookingNavgiation, {
        propsData: {
          currentStageIndex: 0,
          maxAllowedStageIndex: 0,
          production: {
            warnings: ['Generic Warning Here'],
          },
          booking: new Booking(),
        },
      });
    });

    it('has a button for each stage in order', () => {
      expect(navigationComponent.findAll('button').length).to.eq(Stages.length);
      Stages.forEach((stage, index) => {
        expect(navigationComponent.findAll('button').at(index).text()).to.eq(
          stage.name
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
        maxAllowedStageIndex: 1,
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
        maxAllowedStageIndex: Math.round(Stages.length / 2),
      });

      jest.spyOn(navigationComponent.vm, 'onSelectStage');

      for (const [index] of Stages.entries()) {
        if (index > navigationComponent.vm.currentStageIndex) {
          // Should be disabled
          expect(
            navigationComponent
              .findAll('button')
              .at(index)
              .attributes('disabled')
          ).to.eq('disabled');
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
        maxAllowedStageIndex: 1,
      });
      await navigationComponent.findAll('button').at(0).trigger('click');
      expect(navigationComponent.emitted()['goto-stage'].length).to.eq(1);
      expect(navigationComponent.emitted()['goto-stage'][0][0]).to.eq(
        Stages[0]
      );
    });

    it('makes buttons with index more than max allowed disabled', () => {
      expect(navigationComponent.findAll('button').length).to.eq(Stages.length);
      Stages.forEach((stage, index) => {
        expect(navigationComponent.findAll('button').at(index).text()).to.eq(
          stage.name
        );
      });
    });
  });

  describe('with optional stage', () => {
    beforeEach(() => {
      Stages.forEach((stage, index) => {
        jest
          .spyOn(stage, 'shouldBeUsed')
          .mockReturnValue(index == 1 ? false : true);
      });
      navigationComponent = mount(BookingNavgiation, {
        propsData: {
          currentStageIndex: 0,
          maxAllowedStageIndex: 0,
          production: {
            warnings: ['Generic Warning Here'],
          },
          booking: new Booking(),
        },
      });
    });

    it('doesnt show optional stage', () => {
      expect(navigationComponent.text()).not.to.contain(Stages[1].name);
      expect(navigationComponent.findAll('button').at(1).text()).to.eq(
        Stages[2].name
      );
    });
  });
});
