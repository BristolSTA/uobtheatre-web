<!-- eslint-disable vue/no-mutating-props -->
<template>
  <UiCard title="Booking Accessibility">
    <form for="accessibility_input" class="flex items-center space-x-2">
      <input
        id="accessibility_input"
        v-model="accessibilityInput"
        type="checkbox"
        class="border-sta-grey w-5 h-5 border rounded-sm focus:outline-none"
      />
      <span class="text-white text-xs font-semibold"
        >I have additional accessibility needs</span
      >
    </form>
    <form-label
      v-if="accessibilityInput"
      :errors="errors"
      name="accessibilityInfo"
    >
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
        Any accessibility requirements you chose to share with us will be
        communicated by email to the production team. We cannot guarantee that
        your requirements can be met, though a member of the team will be in
        touch to discuss your needs if required. If you have any questions,
        please support@uobtheatre.com.
      </template>
    </form-label>
  </UiCard>
</template>

<script>
import Booking from '~~/classes/Booking';
import Errors from '~~/classes/Errors';
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
    },
    errors: {
      type: Errors,
      default: null
    }
  },
  data() {
    return {
      accessibilityInput: false
    };
  }
};
</script>
