<template>
  <admin-page title="Configuration" class="container">
    <p>
      This page is intended for use by site administrators to configure a device
      for use as a box office machine. Please don't change settings here unless
      you have been instructed to.
    </p>
    <form-label>
      Location ID
      <template #control>
        <t-input v-model="locationId" />
      </template>
    </form-label>
    <button
      class="inline-block p-3 mt-4 transition-colors bg-sta-green hover:bg-sta-green-dark"
      @click="save"
    >
      Save
    </button>
  </admin-page>
</template>

<script>
import AdminPage from "@/components/admin/AdminPage.vue";
import FormLabel from "@/components/ui/FormLabel.vue";
import { successToast } from "@/utils";
export default {
  components: { FormLabel, AdminPage },
  middleware: ["authed", "can-boxoffice"],
  data() {
    return {
      locationId: this.$store.state["box-office"].locationId,
    };
  },
  methods: {
    save() {
      this.$store.dispatch("box-office/setDeviceLocation", this.locationId);

      successToast.fire({ title: "Saved" });
    },
  },
};
</script>
