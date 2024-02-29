<!-- eslint-disable vue/no-mutating-props -->
<template>
  <UiCard title="Accessibility Details">
    <form-label :errors="errors" name="accessibilityInfo">
      Accessibility Requirements
      <template #control>
        <UiInputText
          v-model="booking.accessibilityInfo"
          name="Accessibility Requirements"
          type="accessibility"
          placeholder="e.g. Wheelchair seat required"
          :errors="errors"
          required
      /></template>
      <template #helper>
        If you choose to enter any accessibility requirements.
      </template>
    </form-label>
  </UiCard>
</template>

<script>
import Booking from '~~/classes/Booking';
import FormLabel from '../ui/FormLabel.vue';

export default {
  name: 'AccessibilityInput',
  components: {
    FormLabel
  },
  props: {
    booking: {
      required: true,
      type: Booking
    }
  }
};
</script>
