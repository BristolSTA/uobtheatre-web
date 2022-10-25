<template>
  <admin-page title="Edit Permissions">
    <template #toolbar>
      <sta-button
        v-if="production.assignedUsers.length"
        class="bg-sta-green hover:bg-sta-green-dark transition-colors"
        icon="save"
        @click="savePermissions"
      >
        Save
      </sta-button>
    </template>
    <all-errors-display :errors="errors" />
    <permissions-assigner
      :assignable-permissions="production.assignablePermissions"
      :assigned-users="production.assignedUsers"
      @add="addUserPermissions"
      @remove="removeUserPermissions"
    />
  </admin-page>
</template>

<script>
import Swal from "sweetalert2";
import AdminPage from "@/components/admin/AdminPage.vue";
import PermissionsAssigner from "@/components/admin/permissions/PermissionsAssigner.vue";
import StaButton from "@/components/ui/StaButton.vue";
import {
  getValidationErrors,
  loadingSwal,
  performMutation,
  successToast,
} from "@/utils";
import AllErrorsDisplay from "@/components/ui/AllErrorsDisplay.vue";
export default {
  components: { AdminPage, PermissionsAssigner, StaButton, AllErrorsDisplay },
  async asyncData({ params, error, app }) {
    // Execute query
    const { data } = await app.apolloProvider.defaultClient.query({
      query: require("@/graphql/queries/admin/productions/AdminProductionPermissions.gql"),
      variables: {
        slug: params.productionSlug,
      },
      fetchPolicy: "no-cache",
    });

    const production = data.production;
    if (!production) {
      return error({
        statusCode: 404,
        message: "This production does not exist",
      });
    }
    if (production.assignedUsers === null) {
      return error({
        statusCode: 401,
        message: "You do not have permission to alter permissions",
      });
    }
    return {
      production,
    };
  },
  data() {
    return {
      production: null,
      errors: null,
    };
  },
  methods: {
    async savePermissions() {
      const changedUsers = this.production.assignedUsers.filter(
        (user) => user.modified
      );
      const mutations = changedUsers.map((assignedUser) => {
        return this.setUserPermissions(
          assignedUser.user.email,
          assignedUser.assignedPermissions
        );
      });

      await Promise.all(mutations);

      if (!this.errors) {
        successToast.fire({ title: "Users updated succesfully" });
        this.$nuxt.refresh();
      }
    },
    async addUserPermissions(newUser) {
      loadingSwal.fire();
      if (
        !(await this.setUserPermissions(newUser.email, newUser.permissions))
      ) {
        return Swal.close();
      }
      successToast.fire({ title: "User has been added" });
      this.$nuxt.refresh();
    },
    async removeUserPermissions(assignedUser) {
      loadingSwal.fire();
      if (!(await this.setUserPermissions(assignedUser.user.email, []))) {
        return Swal.close();
      }
      successToast.fire({ title: "User has been removed" });
      this.$nuxt.refresh();
    },
    async setUserPermissions(email, permissions) {
      this.errors = null;
      try {
        await performMutation(
          this.$apollo,
          {
            mutation: require("@/graphql/mutations/admin/production/ProductionPermissions.gql"),
            variables: {
              productionId: this.production.id,
              userEmail: email,
              permissions,
            },
          },
          "productionPermissions"
        );
        return true;
      } catch (e) {
        this.errors = getValidationErrors(e);
        return false;
      }
    },
  },
};
</script>
