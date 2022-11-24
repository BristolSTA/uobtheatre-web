<template>
  <div>
    <safe-table
      v-if="assignedUsers.length"
      table-class="border border-sta-gray-light border-collapse"
    >
      <thead>
        <table-row>
          <table-head-item :text-left="false"> User </table-head-item>
          <table-head-item
            v-for="(permission, index) in assignablePermissions"
            :key="index"
            :text-left="false"
          >
            <small>{{ permission.description }}</small>
          </table-head-item>
        </table-row>
      </thead>
      <tbody>
        <table-row
          v-for="(assignedUser, index) in assignedUsers"
          :key="index"
          class="text-center"
        >
          <table-row-item>
            {{ assignedUser.user.firstName }} {{ assignedUser.user.lastName }}
            <br />
            <UiStaButton
              :small="true"
              class="bg-sta-rouge hover:bg-sta-rouge-dark transition-colors mt-2"
              @click="removeUser(assignedUser)"
            >
              Remove
            </UiStaButton>
          </table-row-item>
          <table-row-item
            v-for="(permission, apIndex) in assignablePermissions"
            :key="apIndex"
            class="border border-sta-gray-light"
          >
            <boolean-input
              :checked="
                assignedUser.assignedPermissions.includes(permission.name)
              "
              :disabled="!permission.userCanAssign"
              @change="togglePermission(assignedUser, permission)"
            />
          </table-row-item>
        </table-row>
      </tbody>
    </safe-table>
    <div class="mt-4 p-2 bg-sta-gray-dark rounded">
      <form-label :required="true">
        User Email Address
        <template #control>
          <input v-model="newUser.email" type="email" class="text-black" />
        </template>
        <template #helper>
          This user must have an account on this site
        </template>
      </form-label>
      <safe-table class="my-4" table-class="border border-sta-gray-light">
        <thead>
          <table-row :striped="false" class="bg-sta-gray-light text-center">
            <table-head-item
              v-for="(permission, index) in userAssignablePermissions"
              :key="index"
              :text-left="false"
            >
              <small>{{ permission.description }}</small>
            </table-head-item>
          </table-row>
        </thead>
        <tbody>
          <table-row :striped="false" class="text-center">
            <table-row-item
              v-for="(assignablePermission, index) in userAssignablePermissions"
              :key="index"
              class="border border-sta-gray-light"
            >
              <input
                v-model="newUser.permissions"
                type="checkbox"
                :value="assignablePermission.name"
              />
            </table-row-item>
          </table-row>
        </tbody>
      </safe-table>
      <UiStaButton
        class="bg-sta-green hover:bg-sta-green-dark transition-colors"
        :disabled="!newUser.email"
        @click="addNewUser"
      >
        Add New
      </UiStaButton>
    </div>
  </div>
</template>

<script>
import SafeTable from '@/components/ui/Tables/SafeTable.vue';
import BooleanInput from '@/components/ui/Input/BooleanInput.vue';
import TableHeadItem from '@/components/ui/Tables/TableHeadItem.vue';
import TableRowItem from '@/components/ui/Tables/TableRowItem.vue';
import TableRow from '@/components/ui/Tables/TableRow.vue';
import FormLabel from '@/components/ui/FormLabel.vue';
export default defineNuxtComponent({
  components: {
    SafeTable,
    BooleanInput,
    TableHeadItem,
    TableRowItem,
    TableRow,
    FormLabel
  },
  props: {
    assignablePermissions: {
      type: Array,
      required: true
    },
    assignedUsers: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      newUser: {
        email: null,
        permissions: []
      }
    };
  },
  computed: {
    userAssignablePermissions() {
      return this.assignablePermissions.filter((ap) => ap.userCanAssign);
    }
  },
  methods: {
    togglePermission(user, permission) {
      user.modified = true;
      if (user.assignedPermissions.includes(permission.name)) {
        user.assignedPermissions = user.assignedPermissions.filter(
          (permissionName) => permissionName !== permission.name
        );
      } else {
        user.assignedPermissions.push(permission.name);
      }
    },
    addNewUser() {
      this.$emit('add', this.newUser);
    },
    removeUser(user) {
      this.$emit('remove', user);
    }
  }
});
</script>
