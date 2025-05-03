import { mount } from '#testSupport/helpers';
import { expect } from 'vitest';

import RelaxedCategoriesDisplay from '@/components/performance/relaxed-categories/RelaxedCategoriesDisplay.vue';
import RelaxedCategoryDisplay from '@/components/performance/relaxed-categories/RelaxedCategoryDisplay.vue';

describe('Relaxed Categories Display', () => {
  let relaxedCategoriesDisplayComponent;
  let relaxedCategoryDisplayComponents;

  beforeEach(async () => {
    relaxedCategoriesDisplayComponent = await mount(RelaxedCategoriesDisplay, {
      shallow: false,
      props: {
        relaxedCategories: [
          {
            "id": "1",
            "shortDescription": "No strobe",
            "longDescription": "This performance will not feature strobe lighting."
          },
          {
            "id": "2",
            "shortDescription": "No pyro",
            "longDescription": "Pyrotechnic effects will not be used in this performance."
          },
          {
            "id": "3",
            "shortDescription": "No loud noises"
          }
        ],
        thisRelaxedName: 'Cool'
      }
    });
    relaxedCategoryDisplayComponents = relaxedCategoriesDisplayComponent.findAllComponents(RelaxedCategoryDisplay);
  });

  it('shows correct name', async () => {
    await relaxedCategoriesDisplayComponent.setProps({
      thisRelaxedName: 'Quiet'
    })

    expect(relaxedCategoriesDisplayComponent.text()).to.contain('Quiet Performance');
  });

  it('shows the right number of categories', () => {
    expect(relaxedCategoryDisplayComponents.length).to.equal(3);
  });

  it('shows the description on click', async () => {
    let category = relaxedCategoryDisplayComponents.at(0);
    await category.find({ ref: 'clickable' }).trigger('click');
    let description = category.find({ ref: 'description' });
    expect(description.text()).to.contain('This performance will not feature strobe lighting.');
  });

  it('shows the correct description on click if no long description given', async () => {
    let category = relaxedCategoryDisplayComponents.at(2);
    await category.find({ ref: 'clickable' }).trigger('click');
    let description = category.find({ ref: 'description' });
    expect(description.text()).to.contain('No loud noises');
  });

  it('doesn\'t show no categories message when there are categories', async () => {
    let content = relaxedCategoriesDisplayComponent.find({ ref: 'no-categories' });
    expect(content.exists()).to.be.false;
  });

  it('shows a message when there are no categories', async () => {
    await relaxedCategoriesDisplayComponent.setProps({
      relaxedCategories: []
    });
    let content = relaxedCategoriesDisplayComponent.find({ ref: 'no-categories' });
    expect(content.exists()).to.be.true;
  });

});
