<template>
  <sidebar class="flex-none" @close="$emit('close')">
    <sidebar-item icon="home" href="/administration" :is-root="true">
      Dashboard
    </sidebar-item>
    <!-- <sidebar-item icon="users" href="/administration/users">Users</sidebar-item>
    <sidebar-item icon="people-arrows" href="/administration/societies"
      >Societies</sidebar-item
    > -->
    <sidebar-item icon="theater-masks" href="/administration/productions">
      Productions
    </sidebar-item>
    <sidebar-item icon="ticket" href="/administration/tools/ticket-lookup">
      All Tickets
    </sidebar-item>
    <sidebar-item icon="money-bill" href="/administration/finance-reports">
      Finance Reports
    </sidebar-item>
  </sidebar>
</template>

<script>
import Sidebar from '../ui/Nav/Sidebar.vue';
import SidebarItem from '../ui/Nav/SidebarItem.vue';
export default {
  components: { Sidebar, SidebarItem },
  emits: ['close'],
  watch: {
    $route() {
      this.$emit('close');
    }
  }
};
</script>
