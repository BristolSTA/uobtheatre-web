<template>
  <AdminPage title="Edit Permissions">
    <template #toolbar>
      <UiStaButton
        v-if="production?.assignedUsers?.length"
        id="savePermissions"
        class="bg-sta-green hover:bg-sta-green-dark transition-colors"
        icon="save"
        @click="savePermissions"
      >
        Save
      </UiStaButton>
    </template>
    <all-errors-display :errors="errors" />
    <permissions-assigner
      :assignable-permissions="production?.assignablePermissions ?? []"
      :assigned-users="production?.assignedUsers ?? []"
      @add="addUserPermissions"
      @remove="removeUserPermissions"
    />
  </AdminPage>
</template>

<script>
import Swal from 'sweetalert2';

import PermissionsAssigner from '@/components/admin/permissions/PermissionsAssigner.vue';
import { getValidationErrors, performMutation } from '~~/utils/api';
import { loadingSwal, successToast } from '~~/utils/alerts';
import AllErrorsDisplay from '@/components/ui/AllErrorsDisplay.vue';
import {
  AdminProductionPermissionsDocument,
  ProductionPermissionsMutationsDocument
} from '~~/graphql/codegen/operations';

export default defineNuxtComponent({
  components: {
    PermissionsAssigner,
    AllErrorsDisplay
  },
  async asyncData() {
    // Execute query
    const { data } = await useDefaultApolloClient().query({
      query: AdminProductionPermissionsDocument,
      variables: {
        slug: useRoute().params.productionSlug
      },
      fetchPolicy: 'no-cache'
    });

    const production = data.production;

    if (!production) {
      throw createSafeError({
        statusCode: 404,
        message: 'This production does not exist'
      });
    }
    if (production.assignedUsers === null) {
      throw createSafeError({
        statusCode: 401,
        message: 'You do not have permission to alter permissions'
      });
    }

    return {
      production
    };
  },
  data() {
    return {
      production: null,
      errors: null
    };
  },
  methods: {
    async savePermissions() {
      const changedUsers = this.production?.assignedUsers
        ? this.production.assignedUsers.filter((user) => user?.modified)
        : [];

      const mutations = changedUsers.map((assignedUser) => {
        if (!assignedUser?.user) return false;
        return this.setUserPermissions(
          assignedUser.user.email,
          assignedUser.assignedPermissions?.filter((perm) => perm !== null) ??
            []
        );
      });

      await Promise.all(mutations);

      if (!this.errors) {
        await this.refresh();
        successToast.fire({ title: 'Users updated succesfully' });
      }
    },
    async addUserPermissions(newUser) {
      loadingSwal.fire();
      if (
        !(await this.setUserPermissions(newUser.email, newUser.permissions))
      ) {
        return Swal.close();
      }
      await this.refresh();
      successToast.fire({ title: 'User has been added' });
    },
    async removeUserPermissions(assignedUser) {
      loadingSwal.fire();
      if (!(await this.setUserPermissions(assignedUser.user.email, []))) {
        return Swal.close();
      }
      await this.refresh();
      successToast.fire({ title: 'User has been removed' });
    },
    async setUserPermissions(email, permissions) {
      this.errors = null;
      if (!this.production.id) return false;
      try {
        await performMutation(
          this.$apollo,
          {
            mutation: ProductionPermissionsMutationsDocument,
            variables: {
              productionId: this.production.id,
              userEmail: email,
              permissions
            }
          },
          'productionPermissions'
        );
      } catch (e) {
        this.errors = getValidationErrors(e);
        return false;
      }
      return true;
    },
    async refresh() {
      const { data } = await this.$apollo.query({
        query: AdminProductionPermissionsDocument,
        variables: {
          slug: useRoute().params.productionSlug
        },
        fetchPolicy: 'no-cache'
      });
      this.production = data.production;

      if (!this.production) {
        throw createSafeError({
          statusCode: 404,
          message: 'This production does not exist'
        });
      }
      if (this.production.assignedUsers === null) {
        throw createSafeError({
          statusCode: 401,
          message: 'You do not have permission to alter permissions'
        });
      }
    }
  }
});
</script>
