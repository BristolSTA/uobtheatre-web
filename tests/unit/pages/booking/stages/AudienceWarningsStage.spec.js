import { expect } from 'vitest';
import { mount } from '#testSupport/helpers';

import BookingCls from '~~/classes/Booking';

import AudienceWarningsStage from '@/pages/production/[slug]/book/[performanceId]/warnings.vue';
import Production from '#testSupport/fixtures/Production';
import Booking from '#testSupport/fixtures/Booking';

describe('Audience Warnings Stage', () => {
  let warningComponent;

  describe('with warnings, and no performance description', () => {
    beforeAll(async () => {
      warningComponent = await mount(AudienceWarningsStage, {
        shallow: false,
        propsData: {
          production: Production(),
          booking: BookingCls.fromAPIData(
            Booking({ performance: { descrption: null } })
          )
        }
      });
    });

    it('doesnt display any production description', () => {
      expect(warningComponent.text()).to.not.contain(
        'Performance-Specific Information'
      );
      expect(warningComponent.text()).to.not.contain(
        'the performance description'
      );
    });

    it('displays the production warning', () => {
      expect(warningComponent.text()).to.contain('Production Warnings');
      expect(warningComponent.text()).to.contain('This is a production alert.');
    });

    it('displays the content warnings', () => {
      expect(warningComponent.text()).to.contain('Strobe Lighting');
      expect(warningComponent.text()).to.contain('Nudity');
    });

    it('emits event on understood', () => {
      warningComponent.find('button').trigger('click');
      expect(warningComponent.emitted('next-stage').length).to.eq(1);
    });
  });

  describe('with performance description and no warnings', () => {
    beforeAll(async () => {
      warningComponent = await mount(AudienceWarningsStage, {
        shallow: false,
        propsData: {
          production: Production({
            contentWarnings: [],
            productionAlert: null
          }),
          booking: BookingCls.fromAPIData(Booking())
        }
      });
    });

    it('displays the production description', () => {
      expect(warningComponent.text()).to.contain(
        'Performance-Specific Information'
      );
      expect(warningComponent.text()).to.contain('the performance description');
    });

    it('doesnt display the production warning', () => {
      expect(warningComponent.text()).to.not.contain('Production Warnings');
      expect(warningComponent.text()).to.not.contain(
        'This is a production alert.'
      );
    });

    it('doesnt display any content warnings', () => {
      expect(warningComponent.text()).to.not.contain('Strobe Lighting');
      expect(warningComponent.text()).to.not.contain('Nudity');
    });

    it('emits event on understood', () => {
      warningComponent.find('button').trigger('click');
      expect(warningComponent.emitted('next-stage').length).to.eq(1);
    });
  });
});
