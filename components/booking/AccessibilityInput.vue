<!-- eslint-disable vue/no-mutating-props -->
<template>
  <UiCard title="Booking Accessibility">
    <form for="accessibility_input" class="flex items-center space-x-2">
      <UiInputToggle
        id="accessibility_input"
        v-model="accessibilityInput"
        @change="$emit('accessibility-toggle', accessibilityInput)"
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
        <span v-html="ACCESSIBILITY_INFO_HELPER_EMAIL" />
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
  emits: ['accessibility-toggle'],
  data() {
    return {
      accessibilityInput: !!this.booking.accessibilityInfo
    };
  },
  mounted() {
    this.$emit('accessibility-toggle', this.accessibilityInput);
  }
};
</script>
