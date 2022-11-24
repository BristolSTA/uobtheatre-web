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
        <t-input v-model="locationId" />
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

definePageMeta({ head: ['authed', 'can-boxoffice'] });

const locationId = ref<string | undefined>();

function save() {
  boxOfficeStore.setDeviceLocation(locationId.value);
  successToast.fire({ title: 'Saved' });
}
</script>
