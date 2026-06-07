import { expect, vi, afterEach } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import { mount } from '#testSupport/helpers';

import MatchMediaMock from 'vitest-matchmedia-mock';

import Production from '../../../support/fixtures/Production';
import Society from '../../../support/fixtures/Society';
import ProductionEditPage from '@/pages/administration/productions/[productionSlug]/edit.vue';
import ProductionEditor from '@/components/production/editor/ProductionEditor.vue';
import {
  GenericApolloResponse,
  GenericMutationResponse,
  GenericNodeConnection
} from '~/tests/unit/support/helpers/api';

import { successToast, loadingSwal } from '@/utils/alerts';
import Swal from 'sweetalert2';

vi.mock('@/services/imageUploadService', () => ({
  default: vi.fn().mockResolvedValue({
    global_id: 'image_123'
  })
}));

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    resolve: ({ path }) => ({ fullPath: path })
  })
}));

describe('Production Edit Page', () => {
  let editPageComponent, successToastSpy, loadingSwalSpy, swalCloseSpy;

  const createEditPage = async (
    productionOverride = null,
    mutationOverride = null
  ) => {
    const mockProduction = Production(productionOverride);

    editPageComponent = await mount(ProductionEditPage, {
      shallow: false,
      routeInfo: {
        params: {
          productionSlug: mockProduction.slug
        }
      },
      apollo: {
        queryResponses: [
          GenericApolloResponse('production', mockProduction),
          GenericApolloResponse('warnings', GenericNodeConnection()),
          GenericApolloResponse(
            'societies',
            GenericNodeConnection([Array(3).fill(Society())])
          )
        ],
        mutationResponses: [
          GenericApolloResponse(
            'production',
            GenericMutationResponse({
              production: mockProduction,
              ...mutationOverride
            })
          )
        ]
      }
    });

    await flushPromises();
  };

  const swalSpy = () => {
    loadingSwalSpy = vi.spyOn(loadingSwal, 'fire');
    successToastSpy = vi.spyOn(successToast, 'fire');
    swalCloseSpy = vi.spyOn(Swal, 'close');
  };

  beforeEach(() => {
    new MatchMediaMock();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the page', async () => {
    await createEditPage();

    expect(editPageComponent.exists()).to.be.true;
  });

  it('displays the production name in the title', async () => {
    const production = Production({ name: 'My Test Show' });
    await createEditPage(production);

    expect(editPageComponent.text()).to.contain('Edit My Test Show');
  });

  it('includes the ProductionEditor component', async () => {
    await createEditPage();

    const editor = editPageComponent.findComponent(ProductionEditor);
    expect(editor.exists()).to.be.true;
  });

  it('passes production to the editor', async () => {
    const production = Production({
      id: 1,
      name: 'Test Show',
      slug: 'test-show'
    });

    await createEditPage(production);

    const editor = editPageComponent.findComponent(ProductionEditor);
    expect(editor.props('production').name).to.equal('Test Show');
    expect(editor.props('production').slug).to.equal('test-show');
  });

  describe('Toolbar Buttons', () => {
    it('has a Save Changes button', async () => {
      await createEditPage();

      const buttons = editPageComponent.findAll('button');
      const saveButton = buttons.find((btn) =>
        btn.text().includes('Save Changes')
      );

      expect(saveButton).to.exist;
    });

    it('saves changes when Save Changes button is clicked', async () => {
      await createEditPage(null, {
        production: Production({ name: 'Updated Show Name' })
      });
      swalSpy();

      // Make a change to the production data in the editor
      const editor = editPageComponent.findComponent(ProductionEditor);
      const inputs = editor.findAll('input');
      await inputs.at(0).setValue('Updated Show Name');

      // Check the data has been updated in the editor
      expect(editor.vm.localProduction.name).to.equal('Updated Show Name');

      // Check the data was emitted to the parent page
      expect(editor.emitted('update:production')).toBeTruthy();
      expect(editPageComponent.vm.production.name).to.equal(
        'Updated Show Name'
      );

      // Save the production
      const buttons = editPageComponent.findAll('button');
      const saveButton = buttons.find((btn) =>
        btn.text().includes('Save Changes')
      );
      await saveButton.trigger('click');

      // Wait for the mutation to resolve and the page to react to it
      await flushPromises();

      // Expect the save stages to have occures
      expect(loadingSwalSpy).toHaveBeenCalled();
      expect(useRouter().push).toHaveBeenCalledWith(
        '/administration/productions/legally-ginger'
      );
      expect(successToastSpy).toHaveBeenCalled();
      expect(swalCloseSpy).not.toHaveBeenCalled();

      // Check the data did actually update in the editor
      expect(editPageComponent.vm.production.name).to.equal(
        'Updated Show Name'
      );
    });

    it('has a Cancel button', async () => {
      await createEditPage();

      const buttons = editPageComponent.findAll('button');
      const cancelButton = buttons.find((btn) => btn.text().includes('Cancel'));

      expect(cancelButton).to.exist;
    });
  });
});
