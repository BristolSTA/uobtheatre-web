<template>
  <div class="space-y-2">
    <card title="Timings">
      <div class="space-y-4">
        <p>
          <strong>Important Note:</strong> All times should be according to UTC
          time (i.e. GMT)
        </p>
        <form-label name="doorsOpen" :errors="errors">
          Doors Open <required-star />
          <t-datepicker
            v-model="editingPerformance.doorsOpen"
            user-format="Y-m-d H:i"
            :timepicker="true"
            class="text-black"
          />
        </form-label>
        <form-label name="start" :errors="errors">
          Performance Starts <required-star />
          <t-datepicker
            v-model="editingPerformance.start"
            user-format="Y-m-d H:i"
            :timepicker="true"
            class="text-black"
          />
        </form-label>
        <form-label name="end" :errors="errors">
          Performance Ends <required-star />
          <t-datepicker
            v-model="editingPerformance.end"
            user-format="Y-m-d H:i"
            :timepicker="true"
            class="text-black"
          />
        </form-label>
      </div>
    </card>
    <card title="Other Details">
      <div class="space-y-4">
        <form-label name="disabled" :errors="errors">
          Disabled<br />
          <template #control
            ><div>
              <t-toggle v-model="editingPerformance.disabled" />

              <br /><small
                >Disabled performances will not show, and will not be available
                for booking</small
              >
            </div></template
          >
        </form-label>
        <form-label name="capacity" :errors="errors">
          Performance Capacity
          <t-input v-model="editingPerformance.capacity" type="number" />
        </form-label>
        <form-label name="description" :errors="errors">
          Description
          <t-textarea v-model="editingPerformance.description" />
        </form-label>
        <form-label name="extraInformation" :errors="errors">
          Extra Information
          <t-textarea v-model="editingPerformance.extraInformation" />
        </form-label>
      </div>
    </card>
  </div>
</template>

<script>
import Card from '../../ui/Card.vue'
import RequiredStar from '../../ui/Form/RequiredStar.vue'
import FormLabel from '../../ui/FormLabel.vue'

export default {
  components: {
    FormLabel,
    Card,
    RequiredStar,
  },
  props: {
    performance: {
      default: null,
      type: Object,
    },
  },
  data() {
    return {
      errors: null,
      editingPerformance: Object.assign({}, this.performance),
    }
  },
}
</script>
