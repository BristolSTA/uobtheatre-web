import { mount } from '#testSupport/helpers';
import { expect, vi, beforeEach } from 'vitest';
import { flushPromises } from '@vue/test-utils';

import MatchMediaMock from 'vitest-matchmedia-mock';

import Production from '#testSupport/fixtures/Production.js';
import Society from '#testSupport/fixtures/Society.js';
import ProductionEditor from '@/components/production/editor/ProductionEditor.vue';
import {
  GenericApolloResponse,
  GenericMutationResponse,
  GenericNodeConnection
} from '~/tests/unit/support/helpers/api';

vi.mock('@/utils/alerts', () => ({
  swal: {
    fire: vi.fn()
  }
}));

vi.mock('@/services/imageUploadService', () => ({
  default: vi.fn().mockResolvedValue({
    global_id: 'image_123'
  })
}));

// Mock vue-router to handle router injection
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router');
  return {
    ...actual,
    useRouter: () => ({
      resolve: (route) => ({ fullPath: `/productions/test-production` }),
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn()
    })
  };
});

describe('ProductionEditor', function () {
  let editorComponent;

  const createWithProduction = async (
    productionOverride = null,
    mutationOverride = null
  ) => {
    const mockProduction = Production(productionOverride);

    editorComponent = await mount(ProductionEditor, {
      shallow: false,
      routeInfo: {
        params: {
          productionSlug: mockProduction.slug
        }
      },
      props: {
        production: mockProduction
      },
      apollo: {
        queryResponses: [
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

  beforeEach(() => {
    new MatchMediaMock();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Details Rendering', () => {
    it('renders the editor component', async () => {
      await createWithProduction();

      expect(editorComponent.exists()).to.be.true;
    });

    it('populates production name field', async () => {
      await createWithProduction({ name: 'Test Production' });

      expect(editorComponent.vm.localProduction.name).to.equal(
        'Test Production'
      );
    });

    it('displays computed slug from production name', async () => {
      await createWithProduction({ name: 'My Test Show', slug: '' });

      expect(editorComponent.vm.computedSlug).to.equal('my-test-show');
    });

    it('preserves contact email', async () => {
      const email = 'contact@example.com';
      await createWithProduction({ contactEmail: email });

      expect(editorComponent.vm.localProduction.contactEmail).to.equal(email);
    });

    it('preserves subtitle', async () => {
      const subtitle = 'A great subtitle';
      await createWithProduction({ subtitle });

      expect(editorComponent.vm.localProduction.subtitle).to.equal(subtitle);
    });

    it('preserves age rating', async () => {
      await createWithProduction({ ageRating: 16 });

      expect(editorComponent.vm.localProduction.ageRating).to.equal(16);
    });

    it('preserves facebook event link', async () => {
      const fbLink = 'https://facebook.com/test';
      await createWithProduction({ facebookEvent: fbLink });

      expect(editorComponent.vm.localProduction.facebookEvent).to.equal(fbLink);
    });

    it('preserves production alert', async () => {
      const alert = 'This is an important alert';
      await createWithProduction({ productionAlert: alert });

      expect(editorComponent.vm.localProduction.productionAlert).to.equal(
        alert
      );
    });
  });

  describe('Slug Management', () => {
    it('shows slug as computed from name by default', async () => {
      await createWithProduction({ name: 'Legally Ginger', slug: '' });

      expect(editorComponent.vm.computedSlug).to.equal('legally-ginger');
      expect(editorComponent.vm.changingSlug).to.be.false;
    });

    it('allows changing slug manually', async () => {
      await createWithProduction({ name: 'Test Show', slug: 'test-show' });

      const changeButton = editorComponent
        .findAll('button')
        .find((btn) => btn.text() === 'Change');

      await changeButton.trigger('click');
      await flushPromises();

      expect(editorComponent.vm.changingSlug).to.be.true;
      expect(editorComponent.vm.manualSlug).to.equal('test-show');
    });

    it('applies kebab-case formatting to manual slug', async () => {
      await createWithProduction({ slug: 'test-show' });

      const changeButton = editorComponent
        .findAll('button')
        .find((btn) => btn.text() === 'Change');

      await changeButton.trigger('click');
      await editorComponent.vm.$nextTick();

      const editBox = editorComponent.find('input[value="test-show"]');
      await editBox.setValue('New Slug With Spaces');

      const doneButton = editorComponent
        .findAll('button')
        .find((btn) => btn.text() === 'Done');

      await doneButton.trigger('click');
      await flushPromises();

      expect(editorComponent.vm.manualSlug).to.equal('new-slug-with-spaces');
      expect(editorComponent.vm.localProduction.slug).to.equal(
        'new-slug-with-spaces'
      );
    });

    it('confirms slug change with Done button', async () => {
      await createWithProduction({ slug: 'original-slug' });

      editorComponent.vm.changingSlug = true;
      editorComponent.vm.manualSlug = 'new-slug';
      await editorComponent.vm.$nextTick();

      const doneButton = editorComponent
        .findAll('button')
        .find((btn) => btn.text() === 'Done');

      await doneButton.trigger('click');
      await flushPromises();

      expect(editorComponent.vm.localProduction.slug).to.equal('new-slug');
      expect(editorComponent.vm.changingSlug).to.be.false;
    });
  });

  describe('Society Management', () => {
    it('preserves society data', async () => {
      const society = Society({ id: '1', name: 'Test Society' });
      await createWithProduction({ society }, []);

      expect(editorComponent.vm.localProduction.society).to.not.be.null;
      expect(editorComponent.vm.localProduction.society.name).to.equal(
        'Test Society'
      );
    });

    it('handles no society', async () => {
      const societies = [Society({ id: '1', name: 'Test Society' })];
      await createWithProduction({ society: null }, []);

      expect(editorComponent.vm.localProduction.society).to.be.null;
    });

    it('allows updating society selection', async () => {
      const soc1 = Society({ id: '1', name: 'Society 1' });
      const soc2 = Society({ id: '2', name: 'Society 2' });

      await createWithProduction({ society: soc1 }, []);

      editorComponent.vm.localProduction.society = soc2;
      await editorComponent.vm.$nextTick();

      expect(editorComponent.vm.localProduction.society.id).to.equal('2');
    });
  });

  describe('Content Warnings', () => {
    it('initializes with content warnings array', async () => {
      const warning = { id: '1', shortDescription: 'Strobe Lighting' };
      const prod = Production({
        contentWarnings: [{ warning, information: 'Custom info' }]
      });

      await createWithProduction(prod, [warning]);

      expect(
        editorComponent.vm.localProduction.contentWarnings
      ).to.have.lengthOf(1);
      expect(
        editorComponent.vm.localProduction.contentWarnings[0].information
      ).to.equal('Custom info');
    });

    it('updates warnings when updateWarnings called', async () => {
      const warning = {
        id: '1',
        shortDescription: 'Nudity',
        longDescription: 'Nudity description'
      };
      await createWithProduction({ contentWarnings: [] }, [warning]);

      editorComponent.vm.updateWarnings(warning, true, 'Custom description');
      await editorComponent.vm.$nextTick();

      const warnings = editorComponent.vm.localProduction.contentWarnings;
      expect(warnings).to.have.lengthOf(1);
      expect(warnings[0].warning.id).to.equal('1');
      expect(warnings[0].information).to.equal('Custom description');
    });

    it('removes warning when updateWarnings called with false', async () => {
      const warning = { id: '1', shortDescription: 'Violence' };
      const prod = Production({
        contentWarnings: [{ warning, information: 'Some info' }]
      });

      await createWithProduction(prod, [warning]);

      expect(
        editorComponent.vm.localProduction.contentWarnings
      ).to.have.lengthOf(1);

      editorComponent.vm.updateWarnings(warning, false);
      await editorComponent.vm.$nextTick();

      expect(
        editorComponent.vm.localProduction.contentWarnings
      ).to.have.lengthOf(0);
    });

    it('allows editing warning information', async () => {
      const warning = { id: '1', shortDescription: 'Strobe' };
      const prod = Production({
        contentWarnings: [{ warning, information: 'Initial' }]
      });

      await createWithProduction(prod, [warning]);

      editorComponent.vm.localProduction.contentWarnings[0].information =
        'Updated info';
      await editorComponent.vm.$nextTick();

      expect(
        editorComponent.vm.localProduction.contentWarnings[0].information
      ).to.equal('Updated info');
    });
  });

  describe('Image Management', () => {
    it('preserves featured image', async () => {
      const prod = Production({
        featuredImage: {
          id: 'img_feat_1',
          url: 'http://example.com/featured.jpg'
        }
      });

      await createWithProduction(prod);

      expect(editorComponent.vm.localProduction.featuredImage.id).to.equal(
        'img_feat_1'
      );
    });

    it('preserves poster image', async () => {
      const prod = Production({
        posterImage: { id: 'img_post_1', url: 'http://example.com/poster.jpg' }
      });

      await createWithProduction(prod);

      expect(editorComponent.vm.localProduction.posterImage.id).to.equal(
        'img_post_1'
      );
    });

    it('preserves cover image', async () => {
      const prod = Production({
        coverImage: { id: 'img_cov_1', url: 'http://example.com/cover.jpg' }
      });

      await createWithProduction(prod);

      expect(editorComponent.vm.localProduction.coverImage.id).to.equal(
        'img_cov_1'
      );
    });
  });

  describe('Short Description Field', () => {
    it('preserves short description', async () => {
      await createWithProduction({ shortDescription: 'Short desc' });

      expect(editorComponent.vm.localProduction.shortDescription).to.equal(
        'Short desc'
      );
    });

    it('updates short description', async () => {
      await createWithProduction({ shortDescription: 'Original' });

      editorComponent.vm.localProduction.shortDescription =
        'Updated Short Desc';
      await editorComponent.vm.$nextTick();

      expect(editorComponent.vm.localProduction.shortDescription).to.equal(
        'Updated Short Desc'
      );
    });
  });

  describe('getInputData', () => {
    it('returns production input data', async () => {
      const society = Society({ id: '1' });
      const production = Production({
        id: 1,
        name: 'Test Production',
        slug: 'test-production',
        subtitle: 'A subtitle',
        description: 'A description',
        contactEmail: 'test@example.com',
        ageRating: 16,
        facebookEvent: 'https://facebook.com/test',
        productionAlert: 'Alert text',
        society
      });

      await createWithProduction(production, []);

      const inputData = await editorComponent.vm.getInputData();

      expect(inputData.id).to.equal(1);
      expect(inputData.name).to.equal('Test Production');
      expect(inputData.slug).to.equal('test-production');
      expect(inputData.subtitle).to.equal('A subtitle');
      expect(inputData.description).to.equal('A description');
      expect(inputData.contactEmail).to.equal('test@example.com');
      expect(inputData.ageRating).to.equal(16);
      expect(inputData.facebookEvent).to.equal('https://facebook.com/test');
      expect(inputData.productionAlert).to.equal('Alert text');
      expect(inputData.society).to.equal('1');
    });

    it('excludes id when creating new production', async () => {
      const production = Production(
        { name: 'New Production', id: undefined },
        false
      );

      await createWithProduction(production);

      const inputData = await editorComponent.vm.getInputData();

      expect(inputData.id).to.be.undefined;
    });

    it('converts age rating string to integer', async () => {
      const production = Production({ ageRating: '14' });

      await createWithProduction(production);

      const inputData = await editorComponent.vm.getInputData();

      expect(inputData.ageRating).to.equal(14);
      expect(typeof inputData.ageRating).to.equal('number');
    });

    it('handles null age rating', async () => {
      const production = Production({ ageRating: null });

      await createWithProduction(production);

      const inputData = await editorComponent.vm.getInputData();

      expect(inputData.ageRating).to.be.null;
    });

    it('includes content warnings in correct format', async () => {
      const warning = { id: '1', shortDescription: 'Strobe Lighting' };
      const production = Production({
        contentWarnings: [
          { warning, information: 'Custom strobe warning info' }
        ]
      });

      await createWithProduction(production, [warning]);

      const inputData = await editorComponent.vm.getInputData();

      expect(inputData.contentWarnings).to.have.lengthOf(1);
      expect(inputData.contentWarnings[0].id).to.equal('1');
      expect(inputData.contentWarnings[0].information).to.equal(
        'Custom strobe warning info'
      );
    });

    it('handles production with existing images', async () => {
      const production = Production({
        id: 1,
        featuredImage: {
          id: 'img_feat_1',
          url: 'http://example.com/featured.jpg'
        },
        posterImage: { id: 'img_post_1', url: 'http://example.com/poster.jpg' },
        coverImage: { id: 'img_cov_1', url: 'http://example.com/cover.jpg' }
      });

      await createWithProduction(production);

      const inputData = await editorComponent.vm.getInputData();

      expect(inputData.featuredImage).to.equal('img_feat_1');
      expect(inputData.posterImage).to.equal('img_post_1');
      expect(inputData.coverImage).to.equal('img_cov_1');
    });

    it('handles production without images', async () => {
      const production = Production({
        id: 1,
        featuredImage: null,
        posterImage: null,
        coverImage: null
      });

      await createWithProduction(production);

      const inputData = await editorComponent.vm.getInputData();

      expect(inputData.featuredImage).to.be.null;
      expect(inputData.posterImage).to.be.null;
      expect(inputData.coverImage).to.be.null;
    });
  });

  describe('Emission of Updates', () => {
    it('emits update:production when local production changes', async () => {
      await createWithProduction({ name: 'Original Name' });

      editorComponent.vm.localProduction.name = 'Updated Name';
      await editorComponent.vm.$nextTick();
      await flushPromises();

      const emitted = editorComponent.emitted('update:production');
      expect(emitted).to.be.ok;
      expect(emitted.length).to.be.greaterThan(0);
    });

    it('emits production object with all changes', async () => {
      await createWithProduction({ name: 'Original' });

      editorComponent.vm.localProduction.subtitle = 'New Subtitle';
      await flushPromises();

      const emitted = editorComponent.emitted('update:production');
      const lastEmission = emitted[emitted.length - 1][0];

      expect(lastEmission.subtitle).to.equal('New Subtitle');
    });
  });

  afterEach(() => {
    editorComponent = null;
    vi.clearAllMocks();
  });
});
