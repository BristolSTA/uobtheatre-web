<template>
  <div>
    <VueDatepicker
      v-model="date"
      :start-time="{ hours: 0, minutes: 0, seconds: 0 }"
      time-picker-inline
      arrow-navigation
      text-input
      :timezone="{ timezone: 'Europe/London' }"
      :enable-time-picker="enableTimePicker"
      :format="format"
      :minutes-increment="minutesIncrement"
      :placeholder="placeholder"
      :required="required"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import VueDatepicker from '@vuepic/vue-datepicker';

export default defineComponent({
  name: 'UiInputDateTime',
  components: { VueDatepicker },
  props: {
    modelValue: {
      required: true,
      type: [String, Date]
    },
    enableTimePicker: {
      type: Boolean,
      default: true
    },
    format: {
      type: String,
      default: 'dd/MM/yyyy HH:mm'
    },
    minutesIncrement: {
      type: Number,
      default: 5
    },
    placeholder: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const date = ref(props.modelValue);

    watch(date, (newDate) => {
      try {
        emit('update:modelValue', newDate);
      } catch (error) {
        console.error('Invalid date format:', newDate);
      }
    });

    return { date };
  }
});
</script>
