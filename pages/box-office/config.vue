<template>
  <AdminPage title="Configuration" class="container">
    <p>
      This page is intended for use by site administrators to configure a device
      for use as a box office machine. Please don't change settings here unless
      you have been instructed to.
    </p>
    <form-label>
      Location ID
      <template #control>
        <UiInputText v-model="locationId" />
      </template>
    </form-label>
    <form-label>
      Lockdown Mode
      <template #control>
        <UiInputBooleanInput v-model="lockdownMode" />
      </template>
    </form-label>
    <button
      class="inline-block p-3 mt-4 transition-colors bg-sta-green hover:bg-sta-green-dark"
      @click="save"
    >
      Save
    </button>
  </AdminPage>
</template>

<script setup lang="ts">
import FormLabel from '@/components/ui/FormLabel.vue';
import { successToast } from '~~/utils/alerts';
import useBoxOfficeStore from '@/store/box-office';

const boxOfficeStore = useBoxOfficeStore();

definePageMeta({ middleware: ['authed', 'can-boxoffice'] });

const locationId = ref<string | undefined>(boxOfficeStore.locationId);
const lockdownMode = ref(boxOfficeStore.lockdownMode);

function save() {
  boxOfficeStore.$patch({
    locationId: locationId.value,
    lockdownMode: lockdownMode.value
  });
  boxOfficeStore.saveState();
  successToast.fire({ title: 'Saved' });
}
</script>
