import { expect, vi } from 'vitest';

import { mount } from '#testSupport/helpers';
import GenericMutationResponse from '#testSupport/fixtures/support/GenericMutationResponse';
import GenericApolloResponse from '#testSupport/fixtures/support/GenericApolloResponse';
import { swal } from '~/utils/alerts';
import ChangeEmail from '@/components/user/ChangeEmail.vue';

describe('Change Email', () => {
  let component;
  beforeEach(() => {
    component = mount(ChangeEmail, {
      apollo: {
        mutationResponses: [
          GenericApolloResponse(
            'sendSecondaryEmailActivation',
            GenericMutationResponse()
          )
        ]
      },
      shallow: false
    });
  });

  it('can request email change', async () => {
    const stub = vi.spyOn(swal, 'fire');
    const inputs = component.findAll('input');
    inputs.at(0).setValue('joe.bloggs@example.org');
    inputs.at(1).setValue('mypassword');
    await component.find('form').trigger('submit');

    await component.vm.$nextTick();
    expect(stub.mock.calls).length(1);
  });
});
