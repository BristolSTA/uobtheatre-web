import { expect } from 'vitest';
import { mount } from '#testSupport/helpers';
import { GenericApolloResponse } from '#testSupport/helpers/api';
import { flushPromises } from '@vue/test-utils';

import ProductionPermissionPage from '@/pages/administration/productions/[productionSlug]/permissions.vue';
import ProductionPermissions from '../../support/fixtures/ProductionPermissions';
import PermissionsAssigner from '@/components/admin/permissions/PermissionsAssigner.vue';
import AdminPage from '@/components/admin/AdminPage.vue';
import GenericMutationResponse from '#testSupport/fixtures/support/GenericMutationResponse';

describe('Production', function () {
  let productionPermissionsPageComponent,
    adminPageComponent,
    permissionsAssignerComponent,
    swalToastStub,
    setUserPermissionsStub,
    refreshStub;

  beforeEach(async () => {
    productionPermissionsPageComponent = await mount(ProductionPermissionPage, {
      shallow: false,
      apollo: {
        queryResponses: [
          GenericApolloResponse('production', ProductionPermissions())
        ],
        mutationResponses: [
          GenericApolloResponse(
            'productionPermissions',
            GenericMutationResponse()
          )
        ]
      },
      routeInfo: {
        params: {
          slug: 'legally-ginger'
        }
      }
    });
  });

  const findComponents = () => {
    adminPageComponent =
      productionPermissionsPageComponent.findComponent(AdminPage);
    permissionsAssignerComponent =
      productionPermissionsPageComponent.findComponent(PermissionsAssigner);
  };

  const stubMethods = () => {
    swalToastStub = vi.spyOn(successToast, 'fire');
    setUserPermissionsStub = vi.spyOn(
      productionPermissionsPageComponent.vm,
      'setUserPermissions'
    );
    refreshStub = vi
      .spyOn(productionPermissionsPageComponent.vm, 'refresh')
      .mockImplementation(() => {});
  };

  it('contains the correct components', () => {
    findComponents();

    expect(adminPageComponent.exists()).to.be.true;
    expect(permissionsAssignerComponent.exists()).to.be.true;

    expect(adminPageComponent.props('title')).to.eq('Edit Permissions');
  });

  // The permissionAssignerComponent contains teh correct props
  it('passes the correct props to the PermissionsAssigner component', () => {
    findComponents();

    expect(permissionsAssignerComponent.props('assignablePermissions')).to.eql(
      ProductionPermissions().assignablePermissions
    );
    expect(permissionsAssignerComponent.props('assignedUsers')).to.eql(
      ProductionPermissions().assignedUsers
    );
  });

  it('correctly displays existing permissions', async () => {
    findComponents();

    const permissionsSelect = permissionsAssignerComponent.find(
      '#existingUserPermissionTable table'
    );

    // Permissions and their expected value
    const permissions = [
      { name: 'add_production', value: false, assignable: false },
      { name: 'approve_production', value: false, assignable: true },
      { name: 'boxoffice', value: true, assignable: true },
      { name: 'change_production', value: true, assignable: true },
      { name: 'delete_production', value: false, assignable: false },
      { name: 'force_change_production', value: false, assignable: false },
      { name: 'sales', value: false, assignable: true },
      { name: 'view_bookings', value: false, assignable: true },
      { name: 'view_production', value: false, assignable: true }
    ];

    permissions.forEach((permission, index) => {
      const checkboxParent = permissionsSelect
        .findAll('div#permissionInput')
        .at(index);

      if (!permission.assignable) {
        // Expect it to be a font-awesome-icon-stub element
        expect(checkboxParent.find('font-awesome-icon-stub').exists()).to.be
          .true;
      } else {
        // Expect it to be a checkbox input
        expect(checkboxParent.find('input[type="checkbox"]').exists()).to.be
          .true;
        expect(
          checkboxParent.find('input[type="checkbox"]').element.checked
        ).toEqual(permission.value);
      }
    });
  });

  it('can add a user', async () => {
    findComponents();
    stubMethods();

    const emailInput = permissionsAssignerComponent.find('input#email');
    const addNewButton = permissionsAssignerComponent.find('button#addNewUser');
    const permissionsSelect = permissionsAssignerComponent.find(
      '#newUserPermissionTable table'
    );

    expect(addNewButton.attributes('disabled')).toBeDefined();

    // Email Input
    expect(emailInput.exists()).to.be.true;
    expect(emailInput.attributes('type')).toEqual('email');
    expect(emailInput.attributes.value).to.be.undefined;
    emailInput.setValue('someone@example.org');

    // Click the checkbox with value 'view_bookings' in the permissionsSelect table
    permissionsSelect
      .findAll('input[value="view_bookings"]')
      .at(0)
      .setChecked();

    // Submit the form
    await permissionsAssignerComponent.vm.$nextTick();
    expect(addNewButton.attributes('disabled')).toBeUndefined();
    await addNewButton.trigger('click');
    await flushPromises();

    // Check that the setUserPermissions method was called with the correct arguments
    expect(setUserPermissionsStub).toHaveBeenCalledOnce();
    expect(setUserPermissionsStub).toHaveBeenCalledWith('someone@example.org', [
      'view_bookings'
    ]);

    // Check the page then refreshed and showed a success toast
    expect(refreshStub).toHaveBeenCalledOnce();
    expect(swalToastStub).toHaveBeenCalledOnce();
  });

  it('can remove a user', async () => {
    findComponents();
    stubMethods();

    // Click the remove button
    permissionsAssignerComponent.find('#removeUser button').trigger('click');
    await flushPromises();

    // Check that the setUserPermissions method was called with the correct arguments
    expect(setUserPermissionsStub).toHaveBeenCalledWith('test@email.com', []);

    // Check the page then refreshed and showed a success toast
    expect(refreshStub).toHaveBeenCalledOnce();
    expect(swalToastStub).toHaveBeenCalledOnce();
  });

  it("can change a user's permissions", async () => {
    findComponents();
    stubMethods();

    const saveButton = productionPermissionsPageComponent.find(
      'button#savePermissions'
    );
    const permissionsSelect = permissionsAssignerComponent.find(
      '#existingUserPermissionTable table'
    );

    // Click the checkbox with value 'approve_production'
    permissionsSelect.findAll('input[type="checkbox"]').at(0).setChecked();

    // Unclick the checkbox with value 'boxoffice'
    permissionsSelect.findAll('input[type="checkbox"]').at(1).setChecked(false);

    // Click the save button
    await permissionsAssignerComponent.vm.$nextTick();
    await saveButton.trigger('click');
    await flushPromises();

    // Check that the setUserPermissions method was called with the correct arguments
    expect(setUserPermissionsStub).toHaveBeenCalledWith('test@email.com', [
      'change_production',
      'approve_production'
    ]);

    // Check the page then refreshed and showed a success toast
    expect(refreshStub).toHaveBeenCalledOnce();
    expect(swalToastStub).toHaveBeenCalledOnce();
  });
});
